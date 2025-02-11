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
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import HireHubImage from "../assets/HireHub.webp";

const UserRegistrationForm = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    mobilenumber: "",
    skills: "",
    resume: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const newErrors = { ...errors };
    if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      newErrors.email = "Please enter a valid email.";
    } else if (name === "password" && value.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    } else if (name === "mobilenumber" && !/^[0-9]{10}$/.test(value)) {
      newErrors.mobilenumber = "Enter a valid 10-digit mobile number.";
    } else {
      newErrors[name] = "";
    }
    setErrors(newErrors);
  };

  // Handle resume file upload
  const handleResumeUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const validTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({ ...prev, resume: "Invalid format. Only PDF, DOC, or DOCX allowed." }));
        return;
      }
      setFormData((prev) => ({ ...prev, resume: file }));
      setErrors((prev) => ({ ...prev, resume: "" }));
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.resume) {
      setErrors((prev) => ({ ...prev, resume: "Resume upload is required." }));
      return;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    try {
      const response = await axios.post(
        "https://job-portal-backend-black.vercel.app/users/register",
        formDataToSend
      );

      if (response.status === 201) {
        setSnackbar({ open: true, message: "Registration successful!", severity: "success" });
        navigate("/Userlogin");
      }
    } catch (error) {
      const errorMessage =
        error.response?.status === 500
          ? "This email or mobile number is already registered."
          : error.response?.data?.message || "An error occurred. Please try again.";
      setSnackbar({ open: true, message: errorMessage, severity: "error" });
    }
  };

  return (
    <>
      <AppBar position="sticky" color="primary" sx={{ background: "linear-gradient(to right, #D4145A, #FBB03B)" }}>
  <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    {/* Left: Home Icon, Logo, and Title */}
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Avatar
              src={HireHubImage}
              sx={{
                border: "0px solid white",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                borderRadius: "30%",
                width: isSmallScreen ? 42 : 44,
                height: isSmallScreen ? 42 : 44,
                marginRight: isSmallScreen ? "8px" : "10px",
                transition: "0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.15)",
                },
              }}
              onClick={() => navigate("/")}
            />
      <Typography
        variant={isSmallScreen ? "h5" : "h4"}
        sx={{
          fontFamily: "'Times New Roman', serif",
          fontWeight: 600,
          fontSize: isSmallScreen ? "1.2rem" : "2rem",
          color: "white",
          letterSpacing: 1,
        }}
        onClick={() => navigate("/")}
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
          maxWidth: 500,
          margin: "50px auto",
          padding: 4,
          borderRadius: 3,
          backgroundColor: "#fff",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, mb: 2, textAlign: "center", animation: "colorChange 3s infinite" }}
        >
          SignUp
        </Typography>
        <style>
          {`
          @keyframes colorChange {
            0% {color: rgb(71, 221, 255)}
            50% {color:rgb(255, 151, 71);}
            75% {color:rgb(148, 141, 151);}
            100% {color:rgb(212, 55, 230);}
          }
        `}
        </style>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {[
              { name: "fullname", label: "Full Name" },
              { name: "email", label: "Email" },
              { name: "password", label: "Password" },
              { name: "mobilenumber", label: "Mobile Number" },
              { name: "skills", label: "Skills" },
            ].map(({ name, label }) => (
              <Grid key={name} item xs={12}>
                <TextField
                  fullWidth
                  required
                  label={label}
                  type={name === "password" && !showPassword ? "password" : "text"}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  error={!!errors[name]}
                  helperText={errors[name]}
                  InputProps={
                    name === "password"
                      ? {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={togglePasswordVisibility} edge="end">
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }
                      : null
                  }
                />
              </Grid>
            ))}

            <Grid item xs={12}>
              <Button variant="outlined" component="label" fullWidth color={formData.resume ? "success" : "primary"}>
                {formData.resume ? "Resume Uploaded" : "Upload Resume"}
                <input type="file" hidden accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
              </Button>
              {errors.resume && (
                <Typography color="error" variant="body2">
                  {errors.resume}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} textAlign="center">
              <Button type="submit" variant="contained" color="primary" size="large" style={{ backgroundColor: "rgb(228, 45, 64)" }}>
                SignUp
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UserRegistrationForm;
