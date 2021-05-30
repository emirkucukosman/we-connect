import React from "react";
import { Link as RouterLink } from "react-router-dom";
import clsx from "clsx";
import { AppBar, Toolbar, Link, Box, makeStyles, Typography } from "@material-ui/core";
import Account from "./Account";

const useStyles = makeStyles((theme: any) => ({
  root: {
    zIndex: theme.zIndex.drawer + 100,
    boxShadow: "none",
    backgroundColor: theme.palette.primary.main,
  },
  brandLink: {
    color: "#fff",
    textDecoration: "none",
  },
  toolbar: {
    minHeight: 64,
  },
}));

type TopBarProps = {
  className?: string;
};

const TopBar: React.FC<TopBarProps> = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <AppBar className={clsx(classes.root, className)} {...rest}>
      <Toolbar className={classes.toolbar}>
        <Link className={classes.brandLink} component={RouterLink} to="/" underline="none">
          <Typography variant="h6">WeConnect</Typography>
        </Link>
        <Box ml={2} flexGrow={1} />
        <Box ml={2}>
          <Account />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
