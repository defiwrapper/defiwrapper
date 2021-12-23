import React from "react";
import Link from "@docusaurus/Link";
import useThemeContext from '@theme/hooks/useThemeContext';
import { makeStyles } from "@mui/styles";
import { Box, Typography, useTheme } from "@mui/material";
import GitHubIcon from '@mui/icons-material/GitHub';

const useStyles = makeStyles(() => ({
  root: {
    "&:hover": {
      textDecoration: "none",
    },
  },
}));

const developerLinks = [
  {
    title: "coingecko/readme",
    description: "Readme for Coingecko Polywrapper",
    link: "https://github.com/defiwrapper/defiwrapper/blob/main/packages/coingecko/README.md"
  },
  {
    title: "defi-sdk/readme",
    description: "Readme for Defi SDK",
    link: "https://github.com/defiwrapper/defiwrapper/blob/main/packages/defi-sdk/README.md"
  },
  {
    title: "polywrap/readme",
    description: "Defiwrapper is built on Polywrap",
    link: "https://github.com/polywrap/monorepo#readme"
  },
];


export default function DeveloperLinks() {
  const theme = useTheme();
  const classes = useStyles(theme);
  const {isDarkTheme} = useThemeContext();

  return (<>
    {developerLinks.map((card, index) => {
      return (
        <Box key={card.title} marginTop={index === 0 ? 4 : 2}>
          <Link href={card.link} className={classes.root}>
            <Box
              sx={{
                background: "rgba(255,255,255,0.05)",
                border: `1px solid rgba(${isDarkTheme ? "255,255,255" : "0,0,0"},0.1)`,
                borderRadius: theme.spacing(4),
                boxShadow: "0 8px 16px rgba(0,0,0,0.02), 0 16px 32px rgba(0,0,0,0.1)",
                display: "block",
                overflow: "hidden",
                padding: theme.spacing(4),
                transform: "translateY(0)",
                transition: "all 0.25s ease-in-out",
                backdropFilter: "blur(16px)",
                "&:hover": {
                  border: "1px solid rgba(255,255,255,0.25)",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.05), 0 16px 64px rgba(0,0,0,0.2)",
                  transform: "translateY(-1%)",
                  "& .card-link": {
                    textDecoration: "underline",
                  },
                },
              }}
            >
              <Box display="flex" alignItems="center">
                <Box mr={2} width={24} height={24}>
                  <Typography color={"var(--ifm-heading-color)"}>
                    <GitHubIcon />
                  </Typography>
                </Box>
                <Typography variant="h5" component="h3" fontWeight="800">
                  {card.title}
                </Typography>
              </Box>
              <Box mt={1}>
                <Typography variant="body1" color={"var(--ifm-heading-color)"}>
                  {card.description}
                </Typography>
              </Box>
            </Box>
          </Link>
        </Box>
      )
    })}
  </>);
} 