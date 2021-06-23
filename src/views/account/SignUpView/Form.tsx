import React, { FormEvent, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useSnackbar } from "notistack";
import {
  Box,
  Button,
  makeStyles,
  TextField,
  Typography,
  Link,
  CircularProgress,
} from "@material-ui/core";
import useAuth from "src/hooks/useAuth";
import useIsMountedRef from "src/hooks/useIsMountedRef";

const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: theme.spacing(2),
    textTransform: "none",
    width: "max-content",
    [theme.breakpoints.down("xs")]: {
      display: "block",
      width: "100%",
    },
  },
  signInLink: {
    [theme.breakpoints.down("xs")]: {
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      width: "100%",
    },
  },
}));

const Form = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const { createUserWithEmailAndPassword } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const handleSignUpSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createUserWithEmailAndPassword(email, password);
    } catch (error) {
      enqueueSnackbar(error.message || "Unknown error occured", { variant: "error" });
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <form onSubmit={handleSignUpSubmit}>
      <TextField
        margin="normal"
        label="E-mail"
        type="email"
        name="we-connect-email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        required
      />
      <TextField
        margin="normal"
        label="Password"
        type="password"
        name="we-connect-password"
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        required
      />
      <Box display="flex" flexDirection="column" alignItems="flex-end">
        <Button color="primary" variant="contained" className={classes.button} type="submit">
          Sign Up
        </Button>
        <Box mt={2} className={classes.signInLink}>
          <Typography variant="caption">
            Already have an account ?{" "}
            <Link component={RouterLink} to="/account/sign-in">
              Sign In here
            </Link>
          </Typography>
        </Box>
      </Box>
    </form>
  );
};

export default Form;
