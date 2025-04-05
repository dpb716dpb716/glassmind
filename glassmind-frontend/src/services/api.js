// src/services/api.js
const API_BASE_URL = "http://54.226.127.151:8000";

// GET: Root endpoint to fetch welcome message
export const getWelcomeMessage = async () => {
  try {
    const response = await fetch(API_BASE_URL + "/");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching welcome message:", error);
    return null;
  }
};

// POST: Upload data endpoint
export const uploadData = async (data) => {
  try {
    const response = await fetch(API_BASE_URL + "/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Error uploading data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error uploading data:", error);
    return null;
  }
};

// GET: Profiles endpoint to fetch user profiles
export const getProfiles = async () => {
  try {
    const response = await fetch(API_BASE_URL + "/profiles");
    if (!response.ok) {
      throw new Error("Error fetching profiles");
    }
    const data = await response.json();
    console.log("Fetched profiles:", data);
    return data;
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return null;
  }
};