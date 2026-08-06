import api from "./axios";

export const getCourses = () =>
    api.get("/courses");

export const createCourse = (data: any) =>
    api.post("/courses", data);

export const getCourse = (id: string) =>
    api.get(`/courses/${id}`);

export const uploadDocument = (
    id: string,
    formData: FormData
) =>
    api.post(`/courses/${id}/upload`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });