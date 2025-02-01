import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  AppBar,
  Toolbar,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";

const CompanyloginPage = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    companyEmail: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    companyEmail: "",
    password: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate Email
    if (name === "companyEmail") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value) && value !== "") {
        setErrors((prev) => ({ ...prev, companyEmail: "Please enter a valid email ID." }));
      } else {
        setErrors((prev) => ({ ...prev, companyEmail: "" }));
      }
    }

    // Validate Password
    if (name === "password") {
      if (value.length < 6 && value !== "") {
        setErrors((prev) => ({
          ...prev,
          password: "Password must be at least 6 characters.",
        }));
      } else {
        setErrors((prev) => ({ ...prev, password: "" }));
      }
    }

    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (errors.companyEmail || errors.password) {
      setOpenSnackbar(true);
      setSnackbarSeverity("error");
      setSnackbarMessage("Please fix the errors before logging in.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("https://my-elegant-backend-api.onrender.com/company/login", loginData);
  
      // Check status and handle token
      if (response.status === 200) {
        const { message, token } = response.data;
  
        setOpenSnackbar(true);
        setSnackbarSeverity("success");
        setSnackbarMessage(message);
  
        // Store the token
        localStorage.setItem("authToken", token);
  
        // Navigate to dashboard
        navigate("/Companydashboard");
      }  else {
        // Handle cases where the response doesn't indicate success
        setOpenSnackbar(true);
        setSnackbarSeverity("error");
        setSnackbarMessage(response.data.message || "Invalid email or password.");
    } 
    } catch (error) {
      const errorMessage =
        error.response?.status === 401 || error.response?.status === 500
          ? "Invalid email or password."
          : "An error occurred while logging in. Please try again.";
      console.error("Error during login:", error.message);
      setOpenSnackbar(true);
      setSnackbarSeverity("error");
      setSnackbarMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <AppBar position="sticky" style={{backgroundColor: "rgb(228, 45, 64)"}}>
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <IconButton color="inherit" onClick={() => navigate("/")}>
              <HomeIcon fontSize="large" />
            </IconButton>
            <Typography variant="h4" sx={{ flexGrow: 1,fontFamily:"Times New Roman",marginRight: 1  } }>
              RealEstatePro
            </Typography>
          </Box>
          <Button color="inherit"  onClick={() => navigate("/Companylogin")} >
            Login
          </Button>
          <Button color="inherit" onClick={() => navigate("/Companyregistration")}>
            SignUp
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          maxWidth: 400,
          margin: "50px auto",
          padding: 4,
          border: "1px solid #ddd",
          borderRadius: 3,
          backgroundColor: "#fff",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, marginBottom: 2, textAlign: "center" ,animation: "colorChange 3s infinite",}}
        >
          Login
        </Typography>
        <style>
        {`
          @keyframes colorChange {
            0% {color: rgb(71, 221, 255)}
            50% {color:rgb(255, 151, 71); /* Change to a different color (e.g., Tomato) */}
            100% {color:rgb(212, 55, 230);
          }
        `}
      </style>
        <form onSubmit={handleLogin}>
          <Grid container spacing={3}>
            {/* Email */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                type="email"
                label="Email ID"
                placeholder="Enter your email"
                name="companyEmail"
                value={loginData.companyEmail}
                onChange={handleChange}
                error={!!errors.companyEmail}
                helperText={errors.companyEmail}
              />
            </Grid>
            {/* Password */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={loginData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  ),
                }}
              />
            </Grid>
            {/* Login Button */}
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={isLoading}
                style={{backgroundColor: "rgb(228, 45, 64)"}}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : "Login"}
              </Button>
            </Grid>

            <Grid item xs={12} sx={{ textAlign: "center", marginTop: 0 }}>
              <Typography variant="body2">
                New user?{" "}
                <Button
                  style={{ color: "blue" }}
                  onClick={() => navigate("/Companyregistration")}
                  sx={{ textTransform: "full-size-kana", padding: 0 }}
                >
                  Signup
                </Button>
              </Typography>
            </Grid>
          </Grid>
        </form>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CompanyloginPage;