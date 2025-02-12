import { Box, Divider, Typography } from "@mui/material";
import React from "react";
import { useRouter } from 'next/router';

const PageHeader = ({ routeName, boldText = false, color = "#1f2c47" }) => {

  const router = useRouter();
  const currentRouteName = routeName || router.pathname.split('/').pop();
  const routeParts = currentRouteName.split(" ");

  return (
    <Box sx={{ position: "relative" }}>
      {routeParts.length === 1 ? (
        <Divider sx={{ borderColor: color }}>
          <Typography
            variant="h2"
            sx={{ color: "#1f2c47", textAlign: "center", fontWeight: boldText ? 'bold' : 'normal' }}
          >
            {routeParts[0]}
          </Typography>
        </Divider>
      ) : (
        <>
          <Typography
            variant="h2"
            sx={{ color: "#1f2c47", textAlign: "center", fontWeight: boldText ? 'bold' : 'normal' }}
          >
            {routeParts[0]}
          </Typography>
          <Divider sx={{ borderColor: color }}>
            <Typography variant="subtitle1" sx={{ color: "#1f2c47", fontWeight: boldText ? 'bold' : 'normal' }}>
              {routeParts.slice(1).join(" ")}
            </Typography>
          </Divider>
        </>
      )}
    </Box>
  );
};

export default PageHeader;