import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Container,
  Typography,
  Grid,
  Snackbar,
  Alert,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Addtojob = () => {
  const navigate = useNavigate();

  const [jobDetails, setJobDetails] = useState({
    category: "",
    title: "",
    description: "",
    qualification: [],
    skills: [], 
    employementType: "",
    location: "",
    salary: "",
    experience: "",
    position: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    if (type === "checkbox") {
      setJobDetails((prev) => ({
        ...prev,
        [name]: checked
          ? [...prev[name], value]
          : prev[name].filter((item) => item !== value),
      }));
    } else {
      setJobDetails((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAdd = async () => {
    const {
      title,
      description,
      skills,
      qualification,
      salary,
      location,
      employementType,
      category,
      experience,
      position,
    } = jobDetails;

    if (
      !category ||
      !title ||
      !description ||
      !skills.length ||
      !employementType ||
      !location ||
      !salary ||
      !experience ||
      !position ||
      !qualification.length
    ) {
      setSnackbar({
        open: true,
        message: "Please fill in all fields.",
        severity: "warning",
      });
      return;
    }

    if (isNaN(salary) || isNaN(position) || isNaN(experience)) {
      setSnackbar({
        open: true,
        message: "Salary, Position, and Experience must be numbers.",
        severity: "error",
      });
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setSnackbar({
          open: true,
          message: "You must be logged in to add a job.",
          severity: "error",
        });
        return;
      }
      const response = await axios.post(
        "https://my-elegant-backend-api.onrender.com/jobs/createJob",
        jobDetails,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        setSnackbar({
          open: true,
          message: "Job added successfully!",
          severity: "success",
        });
        setJobDetails({
          category: "",
          title: "",
          description: "",
          qualification: [],
          skills: [],
          employementType: "",
          location: "",
          salary: "",
          experience: "",
          position: "",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Failed to add the job. Please try again.",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error adding the job:", error);
      setSnackbar({
        open: true,
        message: "An error occurred while adding the job.",
        severity: "error",
      });
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Box
        sx={{
          background:
            "linear-gradient(to bottom right, rgb(101, 146, 166), rgb(231, 233, 237))",
          padding: 4,
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 3,
            textAlign: "center",
            fontWeight: "bold",
            color: "black",
          }}
        >
          Add New Job
        </Typography>

        <Grid container spacing={3}>
          {/* Category */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              select
              label="Category"
              name="category"
              value={jobDetails.category}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              sx={{ bgcolor: "#f4f6f8", borderRadius: 1 }}
            >
              {[
                "Digital",
                "Operations",
                "HR",
                "Marketing",
                "Sales Team",
                "Manager",
                "Software Engineer",
              ].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Job Title */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Job Title"
              name="title"
              value={jobDetails.title}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              sx={{ bgcolor: "#f4f6f8", borderRadius: 1 }}
            />
          </Grid>

          {/* Employment Type */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              select
              label="Employment Type"
              name="employementType"
              value={jobDetails.employementType}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              sx={{ bgcolor: "#f4f6f8", borderRadius: 1 }}
            >
              {["Full-Time", "Internship"].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Location */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Location"
              name="location"
              value={jobDetails.location}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              sx={{ bgcolor: "#f4f6f8", borderRadius: 1 }}
            />
          </Grid>

             {/* Salary */}
             <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Salary"
              name="salary"
              type="number"
              value={jobDetails.salary}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              sx={{ bgcolor: "#f4f6f8", borderRadius: 1 }}
            />
          </Grid>

           {/* Experience */}
           <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Experience"
              name="experience"
              type="number"
              value={jobDetails.experience}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              sx={{ bgcolor: "#f4f6f8", borderRadius: 1 }}
            />
          </Grid>


           {/* Key Skills */}
           <Grid item xs={12} sm={6} md={4}>
            <Typography>Key Skills</Typography>
            <FormControlLabel
              control={
                <Checkbox
                  name="skills"
                  value="Sales"
                  checked={jobDetails.skills.includes("Sales")}
                  onChange={handleChange}
                />
              }
              label="Sales"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="skills"
                  value="Marketing"
                  checked={jobDetails.skills.includes("Marketing")}
                  onChange={handleChange}
                />
              }
              label="Marketing"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="skills"
                  value="Project Management"
                  checked={jobDetails.skills.includes("Project Management")}
                  onChange={handleChange}
                />
              }
              label="Project Management"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="skills"
                  value="UI/UX Design"
                  checked={jobDetails.skills.includes("UI/UX Design")}
                  onChange={handleChange}
                />
              }
              label="UI/UX Design"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="skills"
                  value="communication"
                  checked={jobDetails.skills.includes("communication")}
                  onChange={handleChange}
                />
              }
              label="communication"
            />
          </Grid>

        
          {/* Qualification */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography>Qualification</Typography>
            <FormControlLabel
              control={
                <Checkbox
                  name="qualification"
                  value="Degree"
                  checked={jobDetails.qualification.includes("Degree")}
                  onChange={handleChange}
                />
              }
              label="Degree"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="qualification"
                  value="B.Tech"
                  checked={jobDetails.qualification.includes("B.Tech")}
                  onChange={handleChange}
                />
              }
              label="B.Tech"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="qualification"
                  value="Masters Degree"
                  checked={jobDetails.qualification.includes("Masters Degree")}
                  onChange={handleChange}
                />
              }
              label="Masters Degree"
            />
          </Grid>
          
           {/* Position */}
           <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Position"
              name="position"
              type="number"
              value={jobDetails.position}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              sx={{ bgcolor: "#f4f6f8", borderRadius: 1 }}
            />
          </Grid>
          {/* Job Description */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Job Description"
              name="description"
              value={jobDetails.description}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              multiline
              // rows={6}
              sx={{ bgcolor: "#f4f6f8", borderRadius: 1 }}
            />
          </Grid>

         
          {/* Buttons */}
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button variant="contained" color="primary" onClick={handleAdd}>
              Add Job
            </Button>
            <Button variant="outlined" color="error" onClick={handleCancel}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Snackbar for success/error messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Addtojob;