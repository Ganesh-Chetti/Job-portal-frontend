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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import HireHubImage from "../assets/HireHub.webp";

const UserLoginPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"))
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
      const response = await axios.post("https://job-portal-backend-black.vercel.app/users/login", loginData);

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
      <AppBar position="sticky" color="primary" sx={{ background: "linear-gradient(to right, #D4145A, #FBB03B)" }}>
  <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    {/* Left: Home Icon, Logo, and Title */}
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <IconButton color="inherit" onClick={() => navigate("/")}>
        <HomeIcon fontSize={isSmallScreen ? "medium" : "large"} />
      </IconButton>
      <Avatar
        src={HireHubImage}
        sx={{
          border: "2px solid white",
          width: isSmallScreen ? 40 : 60,
          height: isSmallScreen ? 40 : 60,
          marginRight: 2,
        }}
      />
      <Typography
        variant={isSmallScreen ? "h6" : "h4"}
        sx={{
          fontFamily: "'Times New Roman', serif",
          fontWeight: 700,
          color: "white",
          letterSpacing: 1,
        }}
      >
        HireHub
      </Typography>
    </Box>

    {/* Right: Login & Signup Buttons */}
    <Box
      sx={{
        display: "flex",
        flexDirection: isSmallScreen ? "column" : "row", // Stack vertically on mobile
        alignItems: "center",
        gap: isSmallScreen ? 1 : 2, // Add spacing when stacked
      }}
    >
      <Button
        color="inherit"
        onClick={() => navigate("/Userlogin")}
        sx={{
          fontSize: isSmallScreen ? "0.8rem" : "1rem",
          width: isSmallScreen ? "100%" : "auto", // Full width on mobile
        }}
      >
        Login
      </Button>
      <Button
        color="inherit"
        onClick={() => navigate("/UserRegistration")}
        sx={{
          fontSize: isSmallScreen ? "0.8rem" : "1rem",
          backgroundColor: "rgb(228, 45, 64)",
          "&:hover": {
            backgroundColor: "rgb(200, 40, 50)",
          },
          width: isSmallScreen ? "100%" : "auto", // Full width on mobile
        }}
      >
        SignUp
      </Button>
    </Box>
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