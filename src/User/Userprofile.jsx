import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  TextField,
  FormControl,
  Avatar,
  Chip,
  Stack,
  Typography,
  Button,
  Toolbar,
  AppBar,
  CircularProgress,
  IconButton,
  InputAdornment,
  Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Userprofile = () => {
  const [avatar, setAvatar] = useState(null);
  const [skills, setSkills] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [resume, setResume] = useState(null);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token is missing. Please login again.");
        }
        const response = await axios.get(
          "https://my-elegant-backend-api.onrender.com/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data;
        setUserData(data);
        setSkills(data.skills || "");
        setAvatar(data.avatar || null);
        setResume(data.resume || null);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
        setSnackbar({
          open: true,
          message: "Failed to fetch user data. Please login again.",
          severity: "error",
        });
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    if (!userData.fullname || !userData.email || !userData.mobilenumber) {
      setSnackbar({
        open: true,
        message: "All fields are required.",
        severity: "error",
      });
      return;
    }

    if (userData.password && userData.password.length < 6) {
      setSnackbar({
        open: true,
        message: "Password must be at least 6 characters long.",
        severity: "error",
      });
      return;
    }

    if (userData.mobilenumber && !/^\d{10}$/.test(userData.mobilenumber)) {
      setSnackbar({
        open: true,
        message: "Mobile number must be 10 digits.",
        severity: "error",
      });
      return;
    }

    if (userData.email && !userData.email.includes("@")) {
      setSnackbar({
        open: true,
        message: "Please enter a valid email address.",
        severity: "error",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token is missing. Please login again.");
      }

      const updatedData = {
        ...userData,
        avatar,
        skills,
        resume,
      };

      await axios.put(
        "https://my-elegant-backend-api.onrender.com/users/profile",
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSnackbar({
        open: true,
        message: "Profile updated successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating user data:", error);
      setSnackbar({
        open: true,
        message: "Failed to update profile.",
        severity: "error",
      });
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
    }
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      const updatedSkills = skills
        ? `${skills},${skillInput.trim()}`
        : skillInput.trim();
      setSkills(updatedSkills);
      setSkillInput("");
    }
  };

  const handleDeleteSkill = (skillToDelete) => {
    const updatedSkills = skills
      .split(",")
      .filter((skill) => skill.trim() !== skillToDelete)
      .join(",");
    setSkills(updatedSkills);
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResume(file.name);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Box
        sx={{
          maxWidth: 600,
          width: "100%",
          border: "1px solid #ccc",
          borderRadius: 2,
          backgroundColor: "#fff",
          boxShadow: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AppBar
          position="static"
          color="primary"
          sx={{
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            backgroundColor: "#003366",
          }}
        >
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Profile
            </Typography>
            <Button color="inherit" onClick={() => navigate(-1)}>
              ✖
            </Button>
          </Toolbar>
        </AppBar>

        <Box
          sx={{ padding: 3, display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              id="avatar-upload"
              onChange={handleAvatarChange}
            />
            <label htmlFor="avatar-upload">
              <Avatar
                src={avatar}
                sx={{ width: 100, height: 100, cursor: "pointer", mb: 1 }}
                component="span"
              />
            </label>
          </Box>

          <TextField
            label="Full Name"
            variant="outlined"
            placeholder="What is your name?"
            fullWidth
            value={userData.fullname || ""}
            onChange={(e) =>
              setUserData({ ...userData, fullname: e.target.value })
            }
          />

          <TextField
            label="Email ID"
            variant="outlined"
            type="email"
            fullWidth
            value={userData.email || ""}
            InputProps={{
              readOnly: true,
            }}
          />

          <FormControl fullWidth>
            <TextField
              label="Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              placeholder="Type new password"
              fullWidth
              value={userData.password || ""}
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
              inputProps={{ autoComplete: "new-password", minLength: 6 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>

          <TextField
            label="Mobile Number"
            variant="outlined"
            fullWidth
            placeholder="Enter your mobile number"
            type="tel"
            inputProps={{ pattern: "[0-9]{10}" }}
            value={userData.mobilenumber || ""}
            onChange={(e) =>
              setUserData({ ...userData, mobilenumber: e.target.value })
            }
          />

          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Skills
            </Typography>
            <TextField
              variant="outlined"
              fullWidth
              placeholder="Enter your skills"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              InputProps={{
                startAdornment: (
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                    {skills.split(",").map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        onDelete={() => handleDeleteSkill(skill)}
                        color="primary"
                        sx={{ margin: "2px" }}
                      />
                    ))}
                  </Stack>
                ),
              }}
            />
          </Box>

          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Upload Resume
            </Typography>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              color={resume ? "success" : "primary"}
            >
              {resume ? `Uploaded: ${resume}` : "Upload Resume"}
              <input
                type="file"
                hidden
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
              />
            </Button>
          </Box>
        </Box>

        <AppBar
          position="static"
          color="primary"
          sx={{
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
            backgroundColor: "#003366",
          }}
        >
          <Box sx={{ padding: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                style={{ backgroundColor: "#0055A5" }}
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                color="white"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </AppBar>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        severity={snackbar.severity}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
    </Box>
  );
};

export default Userprofile;