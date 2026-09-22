import { createSlice } from "@reduxjs/toolkit";

const getSavedToken = () => {
  try {
    return localStorage.getItem("token") || null;
  } catch (e) {
    return null;
  }
};

const getSavedUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

const getSavedIsAdmin = () => {
  try {
    return localStorage.getItem("isAdmin") === "true";
  } catch (e) {
    return false;
  }
};

const initialState = {
  token: getSavedToken(),
  user: getSavedUser(),
  isAdmin: getSavedIsAdmin(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      if (typeof action.payload === "string") {
        state.token = action.payload;
        try {
          localStorage.setItem("token", action.payload);
        } catch (e) {
          console.error("Failed to save token to localStorage", e);
        }
      } else if (action.payload && typeof action.payload === "object") {
        state.token = action.payload.token || null;
        state.user = action.payload.user || null;
        state.isAdmin = !!action.payload.isAdmin;
        try {
          if (action.payload.token) {
            localStorage.setItem("token", action.payload.token);
          }
          if (action.payload.user) {
            localStorage.setItem("user", JSON.stringify(action.payload.user));
          }
          localStorage.setItem("isAdmin", String(!!action.payload.isAdmin));
        } catch (e) {
          console.error("Failed to save auth to localStorage", e);
        }
      }
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.isAdmin = false;
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("isAdmin");
      } catch (e) {
        console.error("Failed to clear localStorage on logout", e);
      }
    },
    setUser(state, action) {
      state.user = action.payload;
      try {
        if (action.payload) {
          localStorage.setItem("user", JSON.stringify(action.payload));
        } else {
          localStorage.removeItem("user");
        }
      } catch (e) {
        console.error("Failed to save user to localStorage", e);
      }
    },
  },
});

export const { login, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
