

// storing all backend calls

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

//  AUTH 
export const registerUser = (userData) => API.post("/auth/register", userData);
export const loginUser = (userData) => API.post("/auth/login", userData);

//  USER 
export const getCurrentUser = (token) =>
  API.get("/users/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const uploadIntroVideo = (formData, token) =>
  API.post("/users/upload-intro", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

export const uploadAvatar = (formData, token) =>
  API.post("/users/upload-avatar", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

//  CASTINGS 
export const getAllCastings = (search = "") =>
  API.get(`/castings?search=${encodeURIComponent(search)}`);

export const getCastingById = (id) => API.get(`/castings/${id}`);

export const createCasting = (castingData, token) =>
  API.post("/castings/create", castingData, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteCasting = (castingId, token) =>
  API.delete(`/castings/${castingId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateCasting = (castingId, data, token) =>
  API.patch(`/castings/${castingId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getMyCastings = (token) =>
  API.get("/castings/my-castings", {
    headers: { Authorization: `Bearer ${token}` },
  });

//  APPLICATIONS 
export const applyForCasting = (data, token) =>
  API.post("/applications/apply", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getMyApplications = (token) =>
  API.get("/applications/my-applications", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateMyApplication = (applicationId, data, token) =>
  API.patch(`/applications/${applicationId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getApplicationsForCasting = (castingId, token) =>
  API.get(`/applications/casting/${castingId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateApplicationStatus = (id, status, token) =>
  API.patch(
    `/applications/${id}/status`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const uploadPortfolio = (formData, token) =>
  API.post("/applications/upload-portfolio", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });


export const getIncomingApplications = (token) =>
  API.get("/applications/incoming-applications", {
    headers: { Authorization: `Bearer ${token}` },
  });

// PROFILES 
export const getTalentProfile = (talentId, token) =>
  API.get(`/users/talent/${talentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getDirectorProfile = (directorId, token) =>
  API.get(`/users/director/${directorId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

//  ACCOUNT
export const updateProfile = (data, token) =>
  API.patch("/auth/update-profile", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteMyAccount = (token) =>
  API.delete("/users/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteMyApplication = (applicationId, token) =>
  API.delete(`/applications/${applicationId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export default API;




