import Link from "@docusaurus/Link";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import OndemandVideoOutlinedIcon from "@mui/icons-material/OndemandVideoOutlined";
import { Box, Typography, useTheme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import useThemeContext from "@theme/hooks/useThemeContext";
import React from "react";

const useStyles = makeStyles(() => ({
  root: {
    "&:hover": {
      textDecoration: "none",
    },
  },
}));

const resourceLinks = [
  {
    title: "Code of Conduct",
    link:
      "https://github.com/defiwrapper/defiwrapper/blob/main/documentation/docs/code-of-conduct.md",
    icon: <DescriptionOutlinedIcon />,
  },
  {
    title: "How to Contribute",
    link: "https://github.com/defiwrapper/defiwrapper/blob/main/documentation/docs/contributing.md",
    icon: <DescriptionOutlinedIcon />,
  },
];

export default function ResourceLinks() {
  const theme = useTheme();
  const classes = useStyles(theme);
  const { isDarkTheme } = useThemeContext();

  return (
    <>
      {resourceLinks.map((card, index) => {
        return (
          <Box key={card.title} marginTop={index === 0 ? 4 : 2}>
            <Link href={card.link} className={classes.root}>
              <Box
                sx={{
                  alignItems: "center",
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid rgba(${isDarkTheme ? "255,255,255" : "0,0,0"},0.1)`,
                  borderRadius: theme.spacing(4),
                  boxShadow: "0 8px 16px rgba(0,0,0,0.02), 0 16px 32px rgba(0,0,0,0.1)",
                  display: "flex",
                  overflow: "hidden",
                  py: theme.spacing(3),
                  px: theme.spacing(4),
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
                <Box mr={2} width={24} height={24}>
                  <Typography color={"var(--ifm-heading-color)"}>{card.icon}</Typography>
                </Box>
                <Typography variant="h6" component="h3" fontWeight="800">
                  {card.title}
                </Typography>
              </Box>
            </Link>
          </Box>
        );
      })}
    </>
  );
}
