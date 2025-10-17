import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Box, Container, Typography } from "@mui/material";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Container sx={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
      <Box textAlign="center">
        <Typography variant="h1">404</Typography>
        <Typography variant="body1">
          {"Oh nooooo! A boo boo in our demo :'( Page not found"}
        </Typography>
        <a href="/" className="text-blue-500 underline hover:text-blue-700">
          Return to Home
        </a>
      </Box>
    </Container>
  );
};

export default NotFound;
