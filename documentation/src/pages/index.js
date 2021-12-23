import React from "react";
import Layout from "@theme/Layout";
import Showcase from "../components/Showcase";
import AdditionalLinks from "../components/AdditionalLinks";
import SocialCallout from "../components/SocialCallout";
import { darkTheme } from "../theme";
import { ThemeProvider } from "@mui/material";

export default function Home() {
  return (
    <ThemeProvider theme={darkTheme}>
      <Layout>
        <Showcase/>
        <AdditionalLinks/>
        <SocialCallout/>
      </Layout>
    </ThemeProvider>
  );
}