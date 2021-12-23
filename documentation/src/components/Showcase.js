import React from "react";
import SearchBar from "../theme/SearchBar";
import { makeStyles } from "@mui/styles";
import { Box, Container, Grid, Typography, useTheme } from "@mui/material";
import CardLink from "./CardLink";
import BackgroundPolywrap from "../../static/img/defiwrapper-hero-blurred.png"
import useThemeContext from '@theme/hooks/useThemeContext';

const useStyles = makeStyles(() => ({
  root: {
    "&:hover": {
      textDecoration: "none",
    },
  },
}));

const showcaseCards = [
  {
    title: "What is the Defiwrapper?",
    description: "Defiwrapper overview and FAQ",
    cta: "Learn more",
    link: "/what-is-defiwrapper"
  },
  {
    title: "Project Updates",
    description: "The latest updates from the Defiwrapper",
    cta: "See project updates",
    link: "/project-updates"
  },
  {
    title: "Feedback & Contributions",
    description: "Want to get involved?",
    cta: "Contribute to Defiwrapper",
    link: "/feedback-and-contribution"
  },
];

export default function Showcase() {
  const theme = useTheme();

  return (
    <Box mt={12} marginBottom={6} position="relative" zIndex={0}>
      <Box
        sx={{
          position: "absolute",
          left: "-15vw",
          maxWidth: theme.breakpoints.values.xl,
          opacity: 0.4,
          overflow: "hidden",
          top: "-30vh",
          zIndex: -1,
          "& img": {
            width: "120vw",
          },
        }}
      >
        <img src={BackgroundPolywrap} />
      </Box>
      <Container maxWidth="lg">
        <Typography variant="h2" component="h1" align="center">
          <span style={{color: "#8E7CE8"}}>Defi</span> - Finally all in one place
        </Typography>
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Typography variant="body1" align="center">
            Defiwrapper is a collection of different DeFi related polywrappers(prev web3api) like defi-sdk, coingecko, etc. With Defiwrapper, we want to create a cross-chain multi-platform suite of DeFi related polywrappers.
          </Typography>
        </Container>
        <Grid container spacing={4} mt={4}>
          {showcaseCards.map((card) => {
            return (
              <Grid item xs={12} md={4} key={card.title}>
                <CardLink link={card.link} shine>
                  <Typography variant="h5" component="h3" fontWeight="800">
                    {card.title}
                  </Typography>
                  <Box mt={1} color={"var(--ifm-heading-color)"}>
                    <Typography variant="body1">
                      {card.description}
                    </Typography>
                  </Box>
                  <Box mt={1}>
                    <Typography variant="body1" fontWeight="800" className="card-link">
                      {card.cta} &#8250;
                    </Typography>
                  </Box>
                </CardLink>
              </Grid>
            )
          })}
        </Grid>
      </Container>
    </Box>
  );
} 