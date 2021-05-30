import React from "react";
import Page from "src/components/Page";
import { Box, Card, CardContent, Container, makeStyles } from "@material-ui/core";
import Header from "./Header";
import Form from "./Form";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    marginTop: theme.spacing(3),
  },
}));

const SignInView = () => {
  const classes = useStyles();

  return (
    <Page className={classes.root} title="Sign In">
      <Container maxWidth="md">
        <Header />
        <Box mt={2}>
          <Card>
            <CardContent style={{ paddingBottom: 16 }}>
              <Form />
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Page>
  );
};

export default SignInView;
