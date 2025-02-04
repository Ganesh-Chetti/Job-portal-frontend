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
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
// import { Menu as MenuIcon, AccountCircle } from "@mui/icons-material";
import { Menu as MenuIcon, AccountCircle } from "@mui/icons-material";
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
  const [mobileOpen, setMobileOpen] = useState(false);
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
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <>
      <Box>
        <AppBar
          position="sticky"
          sx={{
            background: "linear-gradient(to right, #D4145A, #FBB03B)",
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Logo & Title */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                src={HireHubImage}
                sx={{
                  border: "0px solid white",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  borderRadius: "30%",
                  width: { xs: 42, sm: 44 },
                  height: { xs: 42, sm: 44 },
                  marginRight: { xs: "8px", sm: "10px" },
                  transition: "0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.15)",
                  },
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Times New Roman",
                  fontWeight: 600,
                  fontSize: { xs: "1.2rem", sm: "2rem" },
                }}
              >
                HireHub
              </Typography>
            </Box>

            {/* Desktop Navigation (Hidden on Mobile) */}
            <Box
              sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center" }}
            >
              <Button
                color="inherit"
                onClick={() => navigate("/listed-applied")}
                sx={{
                  marginRight: 2,
                  fontSize: "1rem",
                  transition: "0.3s",
                  "&:hover": { color: "#ffeb3b" },
                }}
              >
                Listed U Applied
              </Button>
              <IconButton color="inherit" onClick={handleMenuOpen}>
                <AccountCircle fontSize="large" />
              </IconButton>
            </Box>

            {/* Mobile Menu Button (Shown on Mobile) */}
            <IconButton
              sx={{ display: { xs: "flex", sm: "none" } }}
              color="inherit"
              onClick={() => setMobileOpen(true)}
            >
              <MenuIcon fontSize="large" />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Mobile Drawer (Right Side) */}
        <Drawer
          anchor="right"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
        >
          <Box sx={{ width: 250, padding: "20px" }}>
            <List>
              <ListItem button onClick={() => navigate("/listed-applied")}>
                <ListItemText primary="Listed U Applied" />
              </ListItem>
              <ListItem button onClick={handleProfile}>
                <ListItemText primary="Profile" />
              </ListItem>
              <ListItem button onClick={handleLogout}>
                <ListItemText primary="Logout" />
              </ListItem>
            </List>
          </Box>
        </Drawer>

        {/* Account Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleProfile}>Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
        <Box
          style={{
            display: "flex",
            justifyContent: "center", // Centers the content horizontally
            padding: "20px",
          }}
        >
          <Box
            className="header-container"
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" }, // Column on mobile, row on desktop
              alignItems: "center",
              justifyContent: "space-between",
              padding: { xs: "10px", md: "40px" }, // Adjust padding based on screen size
              textAlign: { xs: "center", md: "left" },
            }}
          >
            {/* Left Section - Heading */}
            <Box
              className="header-left"
              sx={{
                flex: 1,
                margin: { xs: "10px 0", md: "10px" },
                fontSize: { xs: "32px", sm: "42px", md: "55px" }, // Responsive font size
                fontWeight: "bold",
                color: "#5504b3",
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
                padding: { xs: "10px", md: "20px" },
                maxWidth: { xs: "100%", md: "50%" }, // Restrict width on larger screens
              }}
            >
              Find The Perfect Job That
              <br /> You Deserve
            </Box>

            {/* Right Section - Image */}
            <Box
              className="header-right"
              sx={{
                flex: "0 1 auto",
                textAlign: { xs: "center", md: "right" },
                margin: { xs: "10px 0", md: "5px" },
              }}
            >
              <img
                src={logo}
                alt="Logo"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  maxHeight: "500px",
                  objectFit: "contain",
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
              fontWeight: "bold",
              margin: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
            }}
          >
            Explore The Jobs Based On By Category
          </Typography>
          <Grid
            container
            spacing={4}
            justifyContent="center" 
          >
            {categories.length === 0 ? (
              <Typography
                variant="h6"
                align="center"
                sx={{ width: "100%", fontSize: "1.5rem", color: "#333" }}
              >
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
                        background: "#6f7885", // Beautiful gradient background
                        borderRadius: "15px",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.2)", // Soft shadow effect
                        transition: "transform 0.3s, box-shadow 0.3s",
                        "&:hover": {
                          transform: "scale(1.05)",
                          boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
                          background: "#343d4d", // Hover color change
                          cursor: "pointer",
                        },
                      }}
                      onClick={() => handleCardClick(category._id)}
                    >
                      <CardContent
                        sx={{ textAlign: "center", padding: "30px" }}
                      >
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
                  fontWeight: "bold",
                  margin: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
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
