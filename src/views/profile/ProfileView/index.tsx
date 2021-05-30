import React, { useState } from "react";
import Page from "src/components/Page";
import { Box, Card, Container, makeStyles, Tab, Tabs, AppBar, Typography } from "@material-ui/core";
import MyProfile from "./MyProfile";
import MyPosts from "./MyPosts";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  card: {
    padding: theme.spacing(4),
  },
}));

const ProfileView = () => {
  const classes = useStyles();
  const [tab, setTab] = useState(0);

  const handleTabChange = (e: any, newTab: number) => {
    setTab(newTab);
  };

  return (
    <Page className={classes.root} title="Profile">
      <Container maxWidth="md">
        <Typography variant="h3">Profile</Typography>
        <AppBar position="static" style={{ marginTop: 12 }}>
          <Tabs value={tab} onChange={handleTabChange}>
            <Tab label="My Profile" />
            <Tab label="My Posts" />
          </Tabs>
        </AppBar>
        <Box mt={2}>
          <Card className={classes.card}>
            {tab === 0 && <MyProfile />}
            {tab === 1 && <MyPosts />}
          </Card>
        </Box>
      </Container>
    </Page>
  );
};

export default ProfileView;
