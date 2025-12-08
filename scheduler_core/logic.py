from ortools.sat.python import cp_model
import collections

def process_data(data):
    """
    1. Maps all String IDs to Integer Indices.
    2. Flattens requirements into a list of specific 'Event' objects.
    3. Pre-calculates availability matrices for O(1) lookups.
    """
    
    # --- HELPER: Map ID to Index ---
    def create_map(entity_list):
        return {item['id']: i for i, item in enumerate(entity_list)}

    rooms_map = create_map(data['resources']['rooms'])
    teachers_map = create_map(data['resources']['teachers'])
    groups_map = create_map(data['resources']['groups'])
    courses_map = create_map(data['resources']['courses'])

    # --- RAW DATA ACCESS ---
    rooms = data['resources']['rooms']
    teachers = data['resources']['teachers']
    groups = data['resources']['groups']

    # --- PRE-COMPUTE: Blocked Slots ---
    # blocked_slots[teacher_index] = set( (day, slot), (day, slot) )
    blocked_slots = {}
    for t_idx, t_obj in enumerate(teachers):
        blocked_set = set()
        for day, slot in t_obj.get('unavailable_slots', []):
            blocked_set.add((day, slot))
        blocked_slots[t_idx] = blocked_set

    # --- FLATTEN REQUIREMENTS ---
    events = []
    event_counter = 0
    
    for req in data['requirements']:
        group_idx = groups_map[req['group_id']]
        teacher_idx = teachers_map[req['teacher_id']]
        course_idx = courses_map[req['course_id']]
        duration = req.get('duration_slots', 1)
        requires_lab = req.get('requires_lab', False)
        
        # Check if this request is even theoretically possible
        # (e.g. Group Size 60 but biggest room is 50)
        group_size = groups[group_idx]['student_count']
        valid_rooms = [
            r for r in rooms 
            if r['capacity'] >= group_size 
            and (r['type'] == 'computer_lab' if requires_lab else r['type'] == 'lecture_hall')
        ]
        
        if not valid_rooms:
            print(f"CRITICAL WARNING: No room exists for Group {req['group_id']} ({group_size} students) "
                  f"requiring Lab={requires_lab}. This event will make the schedule impossible.")
        
        # Create an event for EACH session required per week
        for _ in range(req['sessions_per_week']):
            events.append({
                'id': event_counter,
                'group': group_idx,
                'teacher': teacher_idx,
                'course': course_idx,
                'duration': duration,
                'requires_lab': requires_lab,
                'group_size': group_size,
                'original_req': req
            })
            event_counter += 1
            
    return {
        'metadata': data['metadata'],
        'num_days': data['metadata']['days_per_week'],
        'num_slots': data['metadata']['slots_per_day'],
        'num_rooms': len(rooms),
        'rooms': rooms, 
        'events': events,
        'blocked_slots': blocked_slots,
        'mappings': {
            'rooms': {v: k for k, v in rooms_map.items()},
            'teachers': {v: k for k, v in teachers_map.items()},
            'groups': {v: k for k, v in groups_map.items()},
            'courses': {v: k for k, v in courses_map.items()}
        }
    }

def solve_timetable(data):
    model = cp_model.CpModel()
    
    events = data['events']
    rooms = data['rooms']
    blocked_slots = data['blocked_slots']
    
    num_days = data['num_days']
    num_slots = data['num_slots']
    num_rooms = data['num_rooms']
    
    # --- DATA STRUCTURES FOR CONSTRAINTS ---
    # Instead of searching variables later, we accumulate them here.
    # Key: (resource_id, day, slot) -> Value: List of BoolVars occupying this slot
    room_usage = collections.defaultdict(list)
    teacher_usage = collections.defaultdict(list)
    group_usage = collections.defaultdict(list)
    
    # Key: (event_id, room_idx, day, start_slot) -> Value: BoolVar
    shifts = {}

    print(f"Initializing Variables for {len(events)} events...")

    # --- 1. VARIABLE CREATION LOOP ---
    for event in events:
        duration = event['duration']
        req_capacity = event['group_size']
        requires_lab = event['requires_lab']
        t_id = event['teacher']
        g_id = event['group']
        e_id = event['id']
        
        # Valid variables counter for this specific event
        valid_slots_count = 0 

        for r_idx, room in enumerate(rooms):
            
            # --- PRUNING 1: Capacity ---
            if room['capacity'] < req_capacity:
                continue 
            
            # --- PRUNING 2: Room Type ---
            if requires_lab and room['type'] != 'computer_lab':
                continue
            if not requires_lab and room['type'] == 'computer_lab':
                continue # Don't put theory in labs (optional, but good for efficiency)

            # --- TIME SLOT LOOP ---
            for d in range(num_days):
                # Ensure multi-hour class fits in the day (cannot start at last slot if duration > 1)
                for s in range(num_slots - duration + 1):
                    
                    # --- PRUNING 3: Teacher Unavailable ---
                    # Check if teacher is blocked during ANY part of this class duration
                    is_blocked = False
                    for block in range(duration):
                        if (d, s + block) in blocked_slots[t_id]:
                            is_blocked = True
                            break
                    if is_blocked:
                        continue

                    # --- CREATE VARIABLE ---
                    # This combination is VALID. Create the switch.
                    var_name = f"e{e_id}_r{r_idx}_d{d}_s{s}"
                    var = model.NewBoolVar(var_name)
                    shifts[(e_id, r_idx, d, s)] = var
                    valid_slots_count += 1
                    
                    # --- ACCUMULATE USAGE (The "Anti-Conflict" Layer) ---
                    # We mark this resource as "busy" for ALL slots this event covers
                    for block in range(duration):
                        active_slot = s + block
                        
                        # 1. Room is busy at (d, active_slot)
                        room_usage[(r_idx, d, active_slot)].append(var)
                        
                        # 2. Teacher is busy at (d, active_slot)
                        teacher_usage[(t_id, d, active_slot)].append(var)
                        
                        # 3. Student Group is busy at (d, active_slot)
                        group_usage[(g_id, d, active_slot)].append(var)

        if valid_slots_count == 0:
            print(f"❌ IMPOSSIBLE EVENT: Event {e_id} (Group {g_id}, Teacher {t_id}) has 0 valid slots available!")
            print("   Check: Room Capacity vs Group Size, or Teacher Unavailability blocks.")
            return None

    print("Variables created. Applying constraints...")

    # --- 2. APPLY HARD CONSTRAINTS ---

    # C1. Event Completeness (Each event happens exactly once)
    for event in events:
        # Gather all variables created for this event
        event_vars = []
        for key, var in shifts.items():
            if key[0] == event['id']: # key is (event_id, room, day, slot)
                event_vars.append(var)
        
        model.Add(sum(event_vars) == 1)

    # C2. Room Conflicts (At most 1 event per room per slot)
    for key, vars_list in room_usage.items():
        model.Add(sum(vars_list) <= 1)

    # C3. Teacher Conflicts (At most 1 event per teacher per slot)
    for key, vars_list in teacher_usage.items():
        model.Add(sum(vars_list) <= 1)

    # C4. Group Conflicts (At most 1 event per group per slot)
    for key, vars_list in group_usage.items():
        model.Add(sum(vars_list) <= 1)

    # --- 3. OPTIMIZATION (Soft Constraints) ---
    # Prefer earlier slots? (Optional - keeps schedule compact)
    # cost_terms = []
    # for (e, r, d, s), var in shifts.items():
    #     cost_terms.append(var * s) # Multiply by slot index (later slots = higher cost)
    # model.Minimize(sum(cost_terms))

    # --- 4. SOLVE ---
    solver = cp_model.CpSolver()
    # 60 seconds max time. 
    # For hard problems, 10s might return UNKNOWN, 60s is safer.
    solver.parameters.max_time_in_seconds = 60.0 
    
    print("Solving...")
    status = solver.Solve(model)

    if status in (cp_model.OPTIMAL, cp_model.FEASIBLE):
        print(f"✅ Solution Found: {solver.StatusName(status)}")
        
        schedule = []
        for (e_id, r_idx, d, s), var in shifts.items():
            if solver.Value(var) == 1:
                # Find the original event data
                event = next(e for e in events if e['id'] == e_id)
                duration = event['duration']
                
                # Retrieve readable names
                r_name = data['mappings']['rooms'][r_idx]
                t_name = data['mappings']['teachers'][event['teacher']]
                c_name = data['mappings']['courses'][event['course']]
                g_name = data['mappings']['groups'][event['group']]
                
                # Output entries for EVERY slot occupied
                for block in range(duration):
                    schedule.append({
                        "day": d,
                        "slot": s + block,
                        "room_id": r_name,
                        "teacher_id": t_name,
                        "course_id": c_name,
                        "group_id": g_name,
                        "is_start": (block == 0),
                        "duration": duration
                    })
        
        # Sort for clean JSON (Day -> Slot -> Group)
        schedule.sort(key=lambda x: (x['day'], x['slot'], x['group_id']))
        return schedule
    
    else:
        print("❌ No Solution Found.")
        print("The constraints are mathematically impossible to satisfy together.")
        return None