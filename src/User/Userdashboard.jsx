import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Container,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/footer";
import logo from "../assets/user jobs.jpg";
import job1 from "../assets/user-job1.jpg";
import "./User.css";
import HireHubImage from "../assets/HireHub.webp";
import Avatar from "@mui/material/Avatar";

const Userdashboard = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/Userlogin");
          return;
        }
        const response = await axios.get(
          "https://job-portal-backend-black.vercel.app/jobs/getJobsByCategory",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCategories(response.data.data); // Set fetched categories
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [navigate]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAnchorEl(null);
    navigate("/Userlogin");
  };

  const handleProfile = () => {
    setAnchorEl(null);
    navigate("/Userprofile");
  };

  const handleCardClick = (categoryName) => {
    navigate(`/getJobsByCategory/${categoryName}`);
  };

  return (
    <>
      <Box>
      <AppBar position="sticky" sx={{ background: "linear-gradient(to right, #D4145A, #FBB03B)" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar src={HireHubImage} sx={{ width: 50, height: 50, marginRight: 2 }} />
            <Typography variant="h5" sx={{ fontFamily: "Times New Roman", fontWeight: 600 }}>
              HireHub
            </Typography>
          </Box>
          <Box>
            <Button
              color="inherit"
              onClick={() => navigate("/listed-applied")}
              sx={{
                marginRight: { xs: 1, sm: 2, md: 3 },
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            >
              Listed U Applied
            </Button>
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <AccountCircle fontSize="large" />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
              <MenuItem onClick={handleProfile}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
        <Box
          style={{
            display: "flex",
            justifyContent: "center", // Centers the content horizontally
            padding: "20px",
          }}
        >
          <Box
            className="header"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap", // Ensures responsiveness
              width: "100%",
              maxWidth: "1200px", // Limits the width of the container for larger screens
            }}
          >
            <Box
              className="header-left"
              style={{
                flex: "1",
                textAlign: "left",
                margin: "10px",
                fontSize: "55px", // Large font size
                fontWeight: "bold", // Optional: makes the text bold
                color: "#5504b3", // Text color (dark gray)
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)", // Adds a subtle shadow to text
                padding: "20px", // Optional: Adds padding inside the box
              }}
            >
              Find The Perfect Job That
              <br /> You Deserved
            </Box>

            <Box
              className="header-right"
              style={{
                flex: "0 1 auto",
                textAlign: "right",
                margin: "5px",
              }}
            >
              <img
                src={logo}
                alt="Logo"
                style={{
                  maxWidth: "100%",
                  height: "500px",
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Main Content */}
        <Container sx={{ my: 4, paddingX: { xs: 2, sm: 4, md: 6 } }}>
          <Typography
            variant="h4"
            gutterBottom
            textAlign="center"
            sx={{
              fontWeight:"bold",margin:{ xs: "1.5rem", sm: "2rem", md: "2.5rem" },
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
            }}
          >
            Explore By Category
          </Typography>
          <Grid
  container
  spacing={4}
  justifyContent="center" // Centers the grid
  sx={{ marginTop: 4 }} // Adds spacing from the top
>
  {categories.length === 0 ? (
    <Typography variant="h6" align="center" sx={{ width: "100%" }}>
      Loading categories...
    </Typography>
  ) : (
    categories.map((category, index) => {
      const categoryIcons = {
        Digital: "🌐",
        Operations: "🏗️",
        HR: "👥",
        Marketing: "📈",
        "Sales Team": "💼",
        Manager: "🏢",
        "Software Engineer": "💻",
      };

      return (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #ff7e5f, #feb47b)", // Beautiful gradient background
              borderRadius: "15px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)", // Soft shadow effect
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
                background: "linear-gradient(135deg, #ff758c, #ff7eb3)", // Hover color change
                cursor: "pointer",
              },
            }}
            onClick={() => handleCardClick(category._id)}
          >
            <CardContent sx={{ textAlign: "center", padding: "30px" }}>
              <Typography
                variant="h3"
                sx={{
                  fontSize: "4rem",
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent: "center",
                  color: "#fff", // White icon color
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)", // Adds text shadow for better visibility
                }}
              >
                {categoryIcons[category._id] || "🔹"}
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: "bold",
                  color: "#fff",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  textShadow: "1px 1px 3px rgba(0,0,0,0.2)", // Light shadow effect for text
                }}
              >
                {category._id}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      );
    })
  )}
</Grid>

          <Box>
            <Box>
              <Typography
                variant="h4"
                gutterBottom
                textAlign="center"
                sx={{
                  fontWeight:"bold", margin:{ xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                }}
              >
                We Help To Get The Best Job And Find A Talent
              </Typography>
              
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" }, 
                alignItems: "center", 
                gap: { xs: 2, sm: 4 }, 
              }}
            >
              <Box
                sx={{
                  textAlign: { xs: "center", sm: "left" }, 
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: "18px", sm: "21px" },
                    marginTop: { xs: "20px", sm: "50px" }, 
                  }}
                >
                  We help you unlock opportunities by connecting job seekers
                  with the best roles and employers with top-tier talent.
                  Whether youre starting your career or searching for
                  exceptional candidates, we bridge the gap, ensuring growth and
                  success for both. Let us be your partner in finding the
                  perfect match!
                </Typography>
              </Box>
              <Box
                sx={{
                  textAlign: { xs: "center", sm: "right" }, 
                }}
              >
                <img
                  src={job1}
                  alt="Job Opportunities"
                  style={{
                    
                    height: "auto", 
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default Userdashboard;