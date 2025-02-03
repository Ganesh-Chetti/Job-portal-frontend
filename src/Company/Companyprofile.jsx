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
  CircularProgress,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CompanyProfile = () => {
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      return;
    }

    const fetchCompanyData = async () => {
      try {
        const response = await axios.get(
          "https://job-portal-backend-black.vercel.app/company/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCompanyData(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError("Error fetching company data.");
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
          marginTop: "4rem",
          marginBottom: "4rem",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            overflow: "hidden",
            padding: { xs: 2, sm: 3 }, // Adjust padding for responsiveness
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
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, fontSize: { xs: "1.2rem", sm: "1.5rem" } }} // Adjust font size for smaller screens
              >
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

          {/* Loading state or Error */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          ) : (
            // Form content when data is loaded
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
                <Grid item xs={12} sm={6} md={12}> {/* Full width for large screens */}
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

                <Grid item xs={12} sm={6} md={12}> {/* Full width for large screens */}
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
          )}
        </Paper>
      </Container>
    </>
  );
};

export default CompanyProfile;
