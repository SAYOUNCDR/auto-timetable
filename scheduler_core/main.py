from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
import logic

app = FastAPI(title="AI Timetable Core")

# Define the expected Input Format
class ScheduleRequest(BaseModel):
    metadata: Dict[str, Any]
    resources: Dict[str, Any]
    requirements: List[Dict[str, Any]]

@app.post("/generate")
def generate_timetable_endpoint(payload: ScheduleRequest):
    """
    Takes JSON data -> Returns JSON Schedule
    """
    try:
        # 1. Convert Pydantic object to Python Dict
        data_dict = payload.model_dump()
        
        # 2. Pre-process (ID Mapping)
        print("Processing Data...")
        model_data = logic.process_data(data_dict)
        
        # 3. Solve
        print(f"Solving for {len(model_data['events'])} events...")
        result = logic.solve_timetable(model_data)
        
        if result is None:
            raise HTTPException(status_code=400, detail="No solution found (Constraints too tight)")
            
        return {"status": "success", "schedule": result}

    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)