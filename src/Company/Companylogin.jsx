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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import HireHubImage from "../assets/HireHub.webp";

const CompanyloginPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Check if screen width is small
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
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate Email
    if (name === "companyEmail") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value) && value !== "") {
        setErrors((prev) => ({
          ...prev,
          companyEmail: "Please enter a valid email ID.",
        }));
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
      const response = await axios.post(
        "https://job-portal-backend-black.vercel.app/company/login",
        loginData
      );

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
      } else {
        setOpenSnackbar(true);
        setSnackbarSeverity("error");
        setSnackbarMessage(
          response.data.message || "Invalid email or password."
        );
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

  const handleGuestLogin = () => {
    localStorage.setItem("authToken", "guest-token");
    setSnackbar({ open: true, message: "Welcome, Guest!", severity: "success" });
    navigate("/Companydashboard");
  };

  return (
    <>
      <AppBar
        position="sticky"
        sx={{ background: "linear-gradient(to right, #D4145A, #FBB03B)" }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
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

          {/* Right Side: Login and SignUp Buttons */}
          <Box
            sx={{
              display: "flex",
              flexDirection: isSmallScreen ? "column" : "row", // Stacking vertically on small screen
              alignItems: "center",
              marginTop: isSmallScreen ? 2 : 0, // Add some space between buttons on small screens
            }}
          >
            <Button
              color="inherit"
              onClick={() => navigate("/Companylogin")}
              sx={{
                fontSize: isSmallScreen ? "0.8rem" : "1rem",
                marginBottom: isSmallScreen ? 1 : 0, // Add margin between buttons when stacked
                marginRight: isSmallScreen ? 0 : 2, // Adjust margin on larger screens
              }}
            >
              Login
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate("/Companyregistration")}
              sx={{
                fontSize: isSmallScreen ? "0.8rem" : "1rem",
                backgroundColor: "rgb(228, 45, 64)",
                "&:hover": {
                  backgroundColor: "rgb(200, 40, 50)",
                },
              }}
            >
              SignUp
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          maxWidth: isSmallScreen ? "90%" : 400,
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
          sx={{
            fontWeight: 600,
            marginBottom: 2,
            textAlign: "center",
            animation: "colorChange 3s infinite",
            fontSize: isSmallScreen ? "1.2rem" : "1.5rem",
          }}
        >
          Login
        </Typography>
        <style>
          {`
          @keyframes colorChange {
            0% {color: rgb(71, 221, 255)}
            50% {color:rgb(255, 151, 71);}
            100% {color:rgb(212, 55, 230);}
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
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
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
                style={{ backgroundColor: "rgb(228, 45, 64)" }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Login"
                )}
              </Button>
            </Grid>

            <Grid item xs={12} sx={{ textAlign: "center", marginTop: 0 }}>
              <Typography variant="body2">
                New user?{" "}
                <Button
                  style={{ color: "blue" }}
                  onClick={() => navigate("/Companyregistration")}
                  sx={{ textTransform: "none", padding: 0 }}
                >
                  Signup
                </Button>
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center", marginTop: 2 }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleGuestLogin}
                sx={{ width: "100%" }}
              >
                Continue as Guest
              </Button>
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
