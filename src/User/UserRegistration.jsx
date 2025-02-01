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
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserRegistrationForm = () => {
  const navigate = useNavigate();
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

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, resume: file }));
    setErrors((prev) => ({ ...prev, resume: file ? "" : "Resume upload is required." }));
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

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
        "https://my-elegant-backend-api.onrender.com/users/register",
        formDataToSend
      );

      if (response.status === 201) {
        setSnackbar({ open: true, message: "Registration successful!", severity: "success" });
        navigate('/Userlogin');
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
      <AppBar position="sticky" color="primary" style={{backgroundColor: "rgb(228, 45, 64)"}}>
        <Toolbar>
          <IconButton color="inherit" onClick={() => navigate("/")}>
            <HomeIcon />
          </IconButton>
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            RealEstatePro
          </Typography>
          <Button color="inherit" onClick={() => navigate("/Userlogin")}>
            Login
          </Button>
          <Button color="inherit" onClick={() => navigate("/UserRegistration")}>
            SignUp
          </Button>
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
          sx={{ fontWeight: 600, mb: 2, textAlign: "center" ,animation: "colorChange 3s infinite"}}
        >
          MyElegant SignUp
        </Typography>
        <style>
        {`
          @keyframes colorChange {
            0% {color: rgb(71, 221, 255)}
            50% {color:rgb(255, 151, 71); /* Change to a different color (e.g., Tomato) */}
            75% {color:rgb(148, 141, 151);
            100% {color:rgb(212, 55, 230);
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
                              <IconButton
                                onClick={togglePasswordVisibility}
                                edge="end"
                              >
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
              <Button
                variant="outlined"
                component="label"
                fullWidth
                color={formData.resume ? "success" : "primary"}
              >
                {formData.resume ? "Resume Uploaded" : "Upload Resume"}
                <input
                  type="file"
                  hidden
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                />
              </Button>
              {errors.resume && (
                <Typography color="error" variant="body2">
                  {errors.resume}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} textAlign="center">
              <Button type="submit" variant="contained" color="primary" size="large" style={{backgroundColor: "rgb(228, 45, 64)"}}>
                SignUp
              </Button>
            </Grid>

            <Grid item xs={12} textAlign="center">
              <Typography variant="body2">
                Already a user?{" "}
                <Button
                  style={{ color: "blue" }}
                  onClick={() => navigate("/Userlogin")}
                >
                  Login
                </Button>
              </Typography>
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
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UserRegistrationForm;