import React from "react";
import { Container, Typography, useTheme, useMediaQuery, makeStyles } from "@material-ui/core";
import Page from "src/components/Page";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: "100%",
    display: "flex",
    alignItems: "center",
  },
}));

const NotFoundView = () => {
  const classes = useStyles();
  const theme = useTheme();
  const mobileDevice = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Page className={classes.root} title="404 - Not found">
      <Container maxWidth="lg">
        <Typography align="center" variant={mobileDevice ? "h4" : "h1"} color="textPrimary">
          404 | Not Found
        </Typography>
      </Container>
    </Page>
  );
};

export default NotFoundView;
