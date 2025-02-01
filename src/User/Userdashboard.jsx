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
          "https://my-elegant-backend-api.onrender.com/jobs/getJobsByCategory",
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
        <AppBar position="sticky" sx={{ background: "rgb(228, 45, 64)" }}>
          <Toolbar>
            <Typography
              variant="h4"
              sx={{ flexGrow: 1, fontFamily: "Times New Roman" }}
            >
              RealEstatePro
            </Typography>
            <Button
              color="inherit"
              onClick={() => navigate("/listed-applied")}
              sx={{ marginRight: { xs: 1, sm: 2, md: 3 } }}
            >
              Listed U Applied
            </Button>
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <AccountCircle fontSize="large" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={handleProfile}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
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
          <style>
            {`
            @keyframes colorChange {
              0% { color: rgb(71, 221, 255); }
              25% { color: rgb(237, 96, 80); }
              50% { color: rgb(241, 145, 71); }
              75% { color: rgb(125, 124, 123); }
              100% { color: rgb(212, 55, 230); }
            }
          `}
          </style>
          <Grid container spacing={4}>
            {categories.length === 0 ? (
              <Typography variant="h6" align="center">
                Loading categories...
              </Typography>
            ) : (
              categories.map((category, index) => {
                let icon;

                switch (category._id) {
                  case "Digital":
                    icon = "🌐"; // icon
                    break;
                  case "Operations":
                    icon = " 🏗️";
                    break;
                  case "HR":
                    icon = "👥";
                    break;
                  case "Marketing":
                    icon = "📈";
                    break;
                  case "Sales Team":
                    icon = " 💼";
                    break;
                  case "Manager":
                    icon = "🏢";
                    break;
                  case "Software Engineer":
                    icon = "💻";
                    break;
                  default:
                    icon = null;
                }

                return (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card
                      sx={{
                        backgroundColor: "#fca903",
                        transition: "transform 0.3s, box-shadow 0.3s",
                        "&:hover": {
                          transform: "scale(1.05)",
                          boxShadow: 6,
                          backgroundColor: "#fcd703",
                          color: "#000",
                          cursor: "pointer",
                        },
                      }}
                      onClick={() => handleCardClick(category._id)}
                    >
                      <CardContent>
                        <Typography
                          variant="body2"
                          color="#fff"
                          sx={{
                            fontSize: "3rem",
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          {icon}
                        </Typography>
                        <Typography
                          variant="h4"
                          gutterBottom
                          sx={{
                            fontFamily: "Times New Roman",
                            textAlign: "center",
                            color: "#fff",
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
                flexDirection: { xs: "column", sm: "row" }, // Column layout for small screens
                alignItems: "center", // Center align items for smaller screens
                gap: { xs: 2, sm: 4 }, // Add spacing between elements
              }}
            >
              <Box
                sx={{
                  textAlign: { xs: "center", sm: "left" }, // Center align text for smaller screens
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: "18px", sm: "21px" }, // Adjust font size for smaller screens
                    marginTop: { xs: "20px", sm: "50px" }, // Reduce top margin for smaller screens
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
                  textAlign: { xs: "center", sm: "right" }, // Center align image for smaller screens
                }}
              >
                <img
                  src={job1}
                  alt="Job Opportunities"
                  style={{
                    // Ensure the image scales within the container
                    height: "auto", // Maintain aspect ratio
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