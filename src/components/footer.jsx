
import { Box, Grid, Typography } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn, LocationOn, Email, Phone } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: "rgba(20, 19, 19, 0.89)",
        color: "#fff",
        py: 4,
        px: 2,
        mt:"70px",
    
        width: "100%",
      }}
    >
      <Grid
        container
        justifyContent="space-evenly"
        alignItems="flex-start"
        spacing={4}
      >
        {/* Company Details */}
        <Grid item xs={12} sm={4} md={3}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Company Details
          </Typography>
          <Typography>RealEstate Co.</Typography>
          <Typography>Building Dreams, One Home at a Time.</Typography>
          <Typography>www.realestate.com</Typography>
        </Grid>

        {/* Contact Info */}
        <Grid item xs={12} sm={4} md={3}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Contact Info
          </Typography>
          <Box display="flex" alignItems="center" mb={1}>
            <LocationOn sx={{ mr: 1 }} /> <Typography>123 RealEstate Ave, City, Country</Typography>
          </Box>
          <Box display="flex" alignItems="center" mb={1}>
            <Email sx={{ mr: 1 }} /> <Typography>contact@realestate.com</Typography>
          </Box>
          <Box display="flex" alignItems="center" mb={1}>
            <Phone sx={{ mr: 1 }} /> <Typography>+1 234-567-8900</Typography>
          </Box>
        </Grid>

        {/* Social Links */}
        <Grid item xs={12} sm={4} md={3}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Social Links
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "left", gap: 2 }}>
            {[ 
              { icon: <Facebook />, link: "https://facebook.com", color: "#1877F2" },
              { icon: <Twitter />, link: "https://twitter.com", color: "#1DA1F2" },
              { icon: <Instagram />, link: "https://instagram.com", color: "linear-gradient(45deg, #FF0099, #FF9933)" },
              { icon: <LinkedIn />, link: "https://linkedin.com", color: "#0077B5" },
            ].map((platform, index) => (
              <a
                key={index}
                href={platform.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <Box
                  sx={{
                    backgroundColor: platform.color.includes("gradient") ? undefined : platform.color,
                    background: platform.color.includes("gradient") ? platform.color : undefined,
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    color: "#fff",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "scale(1.2)",
                      boxShadow: "0 6px 15px rgba(0, 0, 0, 0.4)",
                    },
                  }}
                >
                  {platform.icon}
                </Box>
              </a>
            ))}
          </Box>
        </Grid>
      </Grid>

      <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
        © {new Date().getFullYear()} Real Estate Inc. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;