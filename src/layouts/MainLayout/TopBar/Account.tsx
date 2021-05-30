import React, { useRef, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";
import {
  Avatar,
  Box,
  ButtonBase,
  Hidden,
  Menu,
  MenuItem,
  Typography,
  Link,
  makeStyles,
  Button,
} from "@material-ui/core";
import useAuth from "src/hooks/useAuth";

const useStyles = makeStyles((theme) => ({
  avatar: {
    height: 32,
    width: 32,
    marginRight: theme.spacing(1),
  },
  popover: {
    width: 200,
  },
  orLabel: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  button: {
    textTransform: "none",
  },
}));

const Account = () => {
  const classes = useStyles();
  const history = useHistory();
  const ref = useRef(null);
  const { user, isAuthenticated, logout } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [isOpen, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      handleClose();
      await logout();
      history.push("/");
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Can not log out at the moment", {
        variant: "error",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <Box display="flex" alignItems="center">
        <Link component={RouterLink} to="/account/sign-up" underline="none">
          <Button variant="contained" className={classes.button}>
            Sign Up
          </Button>
        </Link>
        <Typography className={classes.orLabel}>or</Typography>
        <Link component={RouterLink} to="/account/sign-in">
          <Button variant="outlined" className={classes.button}>
            Sign In
          </Button>
        </Link>
      </Box>
    );
  }

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        component={ButtonBase}
        onClick={handleOpen}
        {...{ ref: ref }}
      >
        <Avatar alt="User" className={classes.avatar} src={user?.avatar} />
        <Hidden smDown>
          <Typography variant="body1" color="inherit">
            {user?.name}
          </Typography>
        </Hidden>
      </Box>
      <Menu
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        keepMounted
        PaperProps={{ className: classes.popover }}
        getContentAnchorEl={null}
        anchorEl={ref.current}
        open={isOpen}
      >
        <MenuItem onClick={handleClose} component={RouterLink} to="/profile">
          Profile
        </MenuItem>
        <MenuItem onClick={handleLogout}>Log Out</MenuItem>
      </Menu>
    </>
  );
};

export default Account;
