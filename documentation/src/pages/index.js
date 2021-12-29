import { ThemeProvider } from "@mui/material";
import Layout from "@theme/Layout";
import React from "react";

import AdditionalLinks from "../components/AdditionalLinks";
import Showcase from "../components/Showcase";
import SocialCallout from "../components/SocialCallout";
import { darkTheme } from "../theme";

export default function Home() {
  return (
    <ThemeProvider theme={darkTheme}>
      <Layout>
        <Showcase />
        <AdditionalLinks />
        <SocialCallout />
      </Layout>
    </ThemeProvider>
  );
}
