import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  InputAdornment,
  IconButton,
  AppBar,
  Toolbar,
  Snackbar,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import axios from "axios";

const UserLoginPage = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setErrors((prev) => ({ ...prev, email: "Please enter a valid email." }));
    } else if (name === "password" && value.length < 6) {
      setErrors((prev) => ({ ...prev, password: "Password must be at least 6 characters." }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://my-elegant-backend-api.onrender.com/users/login", loginData);

      if (response.data) {
        const { user, token } = response.data;

        localStorage.setItem("token", token);

        setSnackbar({ open: true, message: `Welcome, ${user.fullname}!`, severity: "success" });
        navigate("/Userdashboard");
      } else {
        setSnackbar({ open: true, message: "Unexpected server response.", severity: "warning" });
      }
    } catch (error) {
      const errorMessage = error.response?.status === 401
        ? "Invalid email or password."
        : "An error occurred while logging in. Please try again.";
      setSnackbar({ open: true, message: errorMessage, severity: "error" });
    }
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  return (
    <>
      <AppBar position="sticky" color="primary" style={{backgroundColor: "rgb(228, 45, 64)"}}>
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <IconButton color="inherit" onClick={() => navigate("/")}>
              <HomeIcon fontSize="large" />
            </IconButton>
            <Typography variant="h4" sx={{ marginRight: 1 ,flexGrow: 1,fontFamily:"Times New Roman", }}>
              RealEstatePro
            </Typography>
          </Box>
          <Button color="inherit" onClick={() => navigate("/Userlogin")}>Login</Button>
          <Button color="inherit" onClick={() => navigate("/UserRegistration")}>SignUp</Button>
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
        <Typography variant="h5" sx={{ fontWeight: 600, marginBottom: 2, textAlign: "center" ,animation: "colorChange 3s infinite"}}>
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                type="email"
                label="Email ID"
                placeholder="Enter your email"
                name="email"
                value={loginData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                type={showPassword ? "text" : "password"}
                label="Password"
                placeholder="Enter your password"
                name="password"
                value={loginData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Button type="submit" variant="contained" color="primary"  sx={{backgroundColor: "rgb(228, 45, 64)"}} size="large">
                Login
              </Button>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center", marginTop: 0 }}>
              <Typography variant="body2">
                New user?{" "}
                <Button
                  style={{ color: "blue" }}
                  onClick={() => navigate("/UserRegistration")}
                  sx={{ textTransform: "none", padding: 0 }}
                >
                  Sign up
                </Button>
              </Typography>
            </Grid>
          </Grid>
        </form>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UserLoginPage;