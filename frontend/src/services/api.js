import axios from "../lib/axios";

// --- Batches ---
export const fetchBatches = async () => {
  const response = await axios.get("/admin/batch");
  return response.data;
};

export const addBatch = async (batchData) => {
  const response = await axios.post("/admin/batch", batchData);
  return response.data;
};

export const updateBatch = async ({ id, ...data }) => {
  const response = await axios.put(`/admin/batch/${id}`, data);
  return response.data;
};

export const deleteBatch = async (id) => {
  const response = await axios.delete(`/admin/batch/${id}`);
  return response.data;
};

// --- Classrooms ---
export const fetchClassrooms = async () => {
  const response = await axios.get("/admin/classroom");
  return response.data;
};

export const addClassroom = async (data) => {
  const response = await axios.post("/admin/classroom", data);
  return response.data;
};

export const updateClassroom = async ({ id, ...data }) => {
  const response = await axios.put(`/admin/classroom/${id}`, data);
  return response.data;
};

export const deleteClassroom = async (id) => {
  const response = await axios.delete(`/admin/classroom/${id}`);
  return response.data;
};

// --- Subjects ---
export const fetchSubjects = async () => {
  const response = await axios.get("/admin/subject");
  return response.data;
};

export const addSubject = async (data) => {
  const response = await axios.post("/admin/subject", data);
  return response.data;
};

export const updateSubject = async ({ id, ...data }) => {
  const response = await axios.put(`/admin/subject/${id}`, data);
  return response.data;
};

export const deleteSubject = async (id) => {
  const response = await axios.delete(`/admin/subject/${id}`);
  return response.data;
};

// --- Faculty ---
export const fetchFaculty = async () => {
  const response = await axios.get("/admin/faculty");
  return response.data;
};

export const addFaculty = async (data) => {
  const response = await axios.post("/admin/faculty", data);
  return response.data;
};

export const updateFaculty = async ({ id, ...data }) => {
  const response = await axios.put(`/admin/faculty/${id}`, data);
  return response.data;
};

export const deleteFaculty = async (id) => {
  const response = await axios.delete(`/admin/faculty/${id}`);
  return response.data;
};

// --- Students ---
export const fetchStudents = async () => {
  const response = await axios.get("/admin/student");
  return response.data;
};

export const addStudent = async (data) => {
  const response = await axios.post("/admin/student", data);
  return response.data;
};

export const updateStudent = async ({ id, ...data }) => {
  const response = await axios.put(`/admin/student/${id}`, data);
  return response.data;
};

// --- Dashboard ---
export const fetchDashboardStats = async () => {
  const response = await axios.get("/dashboard/admin/data");
  return response.data;
};

export const deleteStudent = async (id) => {
  const response = await axios.delete(`/admin/student/${id}`);
  return response.data;
};

// --- Timetable ---
export const generateTimetable = async () => {
  const response = await axios.post("/timetable/generate");
  return response.data;
};

export const fetchTimetable = async () => {
  const response = await axios.get("/timetable/all");
  return response.data;
};

// --- Student ---
export const fetchStudentDashboard = async () => {
  const response = await axios.get("/dashboard/student/data");
  return response.data;
};

export const fetchStudentTimetable = async () => {
  const response = await axios.get("/timetable/student");
  return response.data;
};

// --- Faculty ---
export const fetchFacultyDashboard = async () => {
  const response = await axios.get("/dashboard/faculty/data");
  return response.data;
};

export const fetchFacultyTimetable = async () => {
  const response = await axios.get("/timetable/teacher");
  return response.data;
};
