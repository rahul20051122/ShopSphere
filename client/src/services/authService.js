import API from "./api";

// Register user
export const registerUser = async (name, email, password) => {
  const response = await API.post("/auth/register", {
    name,
    email,
    password
  });
  return response.data;
};

// Login user
export const loginUser = async (email, password) => {
  const response = await API.post("/auth/login", {
    email,
    password
  });
  return response.data;
};

// Get profile
export const getUserProfile = async () => {
  const response = await API.get("/auth/profile");
  return response.data;
};
