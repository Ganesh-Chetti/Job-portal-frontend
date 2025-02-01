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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import axios from "axios";

const CompanyRegistrationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: "",
    companyEmail: "",
    companyEstablishedDate: "",
    companyRegistrationNumber: "",
    companyWebsiteLink: "",
    password: "",
    aboutCompany: "",
    location: "",
  });

  const [errors, setErrors] = useState({
    companyName: "",
    companyEmail: "",
    companyEstablishedDate: "",
    companyRegistrationNumber: "",
    companyWebsiteLink: "",
    password: "",
    aboutCompany: "",
    location: "",
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate fields
    switch (name) {
      case "companyEmail":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value) && value !== "") {
          setErrors((prev) => ({
            ...prev,
            companyEmail: "Please enter a valid email address.",
          }));
        } else {
          setErrors((prev) => ({ ...prev, companyEmail: "" }));
        }
        break;
      case "companyWebsiteLink":
        const urlRegex =
          /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^ ]*)?$/;
        if (!urlRegex.test(value) && value !== "") {
          setErrors((prev) => ({
            ...prev,
            companyWebsiteLink: "Please enter a valid URL.",
          }));
        } else {
          setErrors((prev) => ({ ...prev, companyWebsiteLink: "" }));
        }
        break;
      case "companyRegistrationNumber":
        const alphaNumericRegex = /^[a-zA-Z0-9]*$/;
        if (!alphaNumericRegex.test(value)) {
          setErrors((prev) => ({
            ...prev,
            companyRegistrationNumber:
              "Registration Number must only contain letters and numbers.",
          }));
        } else {
          setErrors((prev) => ({ ...prev, companyRegistrationNumber: "" }));
        }
        break;
      case "password":
        // Add password validation (e.g., minimum length, complexity)
        if (value.length < 6) {
          setErrors((prev) => ({
            ...prev,
            password: "Password must be at least 8 characters long.",
          }));
        } else {
          setErrors((prev) => ({ ...prev, password: "" }));
        }
        break;
      case "location":
      case "aboutCompany":
        if (value.trim() === "") {
          setErrors((prev) => ({ ...prev, [name]: "This field is required." }));
        } else {
          setErrors((prev) => ({ ...prev, [name]: "" }));
        }
        break;
      default:
        break;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for empty fields and validation errors
    if (
      Object.values(formData).some((value) => value === "") ||
      Object.values(errors).some((error) => error !== "")
    ) {
      setOpenSnackbar(true);
      setSnackbarSeverity("error");
      setSnackbarMessage("Please fill in all fields correctly.");
      return;
    }

    try {
      const response = await axios.post(
        "https://my-elegant-backend-api.onrender.com/company/register",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          mode: "no-cors",
        }
      );

      if (response.status === 201) {
        // Assuming 201 Created status code for successful registration
        setOpenSnackbar(true);
        setSnackbarSeverity("success");
        setSnackbarMessage("Registration Successful!");
        navigate("/Companylogin");
        setFormData({
          companyName: "",
          companyEmail: "",
          companyEstablishedDate: "",
          companyRegistrationNumber: "",
          companyWebsiteLink: "",
          password: "",
          aboutCompany: "",
          location: "",
        });
      } else {
        setOpenSnackbar(true);
        setSnackbarSeverity("error");
        setSnackbarMessage("Registration Failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);

      if ((error.response && error.response.status === 400) || 500) {
        setOpenSnackbar(true);
        setSnackbarSeverity("error");
        setSnackbarMessage(
          "Company with this email or Registration no already registered."
        );
      } else {
        setOpenSnackbar(true);
        setSnackbarSeverity("error");
        setSnackbarMessage(
          "An error occurred while registering. Please try again."
        );
      }
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <>
      <AppBar
        position="sticky"
        color="primary"
        style={{ backgroundColor: "rgb(228, 45, 64)" }}
      >
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <IconButton color="inherit" onClick={() => navigate("/")}>
              <HomeIcon fontSize="large" />
            </IconButton>
            <Typography
              variant="h4"
              sx={{
                marginRight: 1,
                flexGrow: 1,
                fontFamily: "Times New Roman",
              }}
            >
              RealEstatePro
            </Typography>
          </Box>
          <Button color="inherit" onClick={() => navigate("/Companylogin")}>
            Login
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate("/Companyregistration")}
          >
            SignUp
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          maxWidth: 600,
          margin: "50px auto",
          padding: 4,
          boxShadow: (theme) => theme.shadows[4],
          borderRadius: 3,
          backgroundColor: (theme) => theme.palette.background.paper,
          color: "#e6f7ff",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          sx={{
            color: (theme) => theme.palette.primary.main,
            marginBottom: 3,
            animation: "colorChange 3s infinite",
          }}
        >
          Company Registration
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
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                error={!!errors.companyName}
                helperText={errors.companyName}
                sx={{
                  "& .MuiInputBase-root": {
                    backgroundColor: (theme) =>
                      theme.palette.background.default,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                type="email"
                label="Company Email"
                name="companyEmail"
                value={formData.companyEmail}
                onChange={handleChange}
                error={!!errors.companyEmail}
                helperText={errors.companyEmail}
                sx={{
                  "& .MuiInputBase-root": {
                    backgroundColor: (theme) =>
                      theme.palette.background.default,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                type="date"
                label="Company Established Date"
                name="companyEstablishedDate"
                value={formData.companyEstablishedDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                sx={{
                  "& .MuiInputBase-root": {
                    backgroundColor: (theme) =>
                      theme.palette.background.default,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Company Registration Number"
                name="companyRegistrationNumber"
                value={formData.companyRegistrationNumber}
                onChange={handleChange}
                error={!!errors.companyRegistrationNumber}
                helperText={errors.companyRegistrationNumber}
                sx={{
                  "& .MuiInputBase-root": {
                    backgroundColor: (theme) =>
                      theme.palette.background.default,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Company Website Link"
                name="companyWebsiteLink"
                value={formData.companyWebsiteLink}
                onChange={handleChange}
                error={!!errors.companyWebsiteLink}
                helperText={errors.companyWebsiteLink}
                sx={{
                  "& .MuiInputBase-root": {
                    backgroundColor: (theme) =>
                      theme.palette.background.default,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                sx={{
                  "& .MuiInputBase-root": {
                    backgroundColor: (theme) =>
                      theme.palette.background.default,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="About Company"
                multiline
                rows={4}
                name="aboutCompany"
                value={formData.aboutCompany}
                onChange={handleChange}
                error={!!errors.aboutCompany}
                helperText={errors.aboutCompany}
                sx={{
                  "& .MuiInputBase-root": {
                    backgroundColor: (theme) =>
                      theme.palette.background.default,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                error={!!errors.location}
                helperText={errors.location}
                sx={{
                  "& .MuiInputBase-root": {
                    backgroundColor: (theme) =>
                      theme.palette.background.default,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                style={{ backgroundColor: "rgb(228, 45, 64)" }}
              >
                Register
              </Button>
            </Grid>

            <Grid item xs={12} textAlign="center">
              <Typography variant="body2" color="textSecondary">
                Already a user?{" "}
                <Button
                  style={{ color: "blue" }}
                  onClick={() => navigate("/Companylogin")}
                >
                  Login
                </Button>
              </Typography>
            </Grid>
          </Grid>
        </form>
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
      </Box>
    </>
  );
};

export default CompanyRegistrationPage;