import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Box,
  TextField,
  CssBaseline,
  Paper,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CompanyProfile = () => {
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState({});

  const handleCloseClick = () => {
    navigate(-1);
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/Companylogin");
    }
    const fetchCompanyData = async () => {
      try {
        const response = await axios.get("https://my-elegant-backend-api.onrender.com/company/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompanyData(response.data);
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };

    fetchCompanyData();
  }, [navigate]);

  return (
    <>
      <CssBaseline />
      <Container
        maxWidth="lg"
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            overflow: "hidden",
            padding: 3,
          }}
        >
          {/* Navbar */}
          <AppBar
            position="static"
            sx={{
              backgroundColor: "#003366", // US blue color
              color: "white",
            }}
          >
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Profile
              </Typography>
              <IconButton
                edge="end"
                color="inherit"
                aria-label="close"
                onClick={handleCloseClick}
              >
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>

          {/* Form content */}
          <Box
            component="form"
            noValidate
            sx={{
              mt: 3,
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Company Name"
                  fullWidth
                  required
                  value={companyData.companyName || ""}
                  InputProps={{ readOnly: true }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Company Email"
                  type="email"
                  fullWidth
                  required
                  value={companyData.companyEmail || ""}
                  InputProps={{ readOnly: true }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Company Registration Number"
                  fullWidth
                  required
                  value={companyData.companyRegistrationNumber || ""}
                  InputProps={{ readOnly: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Company Established Date"
                  type="date"
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                  value={formatDate(companyData.companyEstablishedDate || "")}
                  InputProps={{ readOnly: true }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Company Website Link"
                  type="url"
                  fullWidth
                  required
                  value={companyData.companyWebsiteLink || ""}
                  InputProps={{ readOnly: true }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="About Company"
                  fullWidth
                  multiline
                  rows={4}
                  required
                  value={companyData.aboutCompany || ""}
                  InputProps={{ readOnly: true }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Location"
                  fullWidth
                  required
                  value={companyData.location || ""}
                  InputProps={{ readOnly: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default CompanyProfile;