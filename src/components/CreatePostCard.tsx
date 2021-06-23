import React, { FormEvent, useState } from "react";
import {
  Card,
  Box,
  Avatar,
  makeStyles,
  Typography,
  TextField,
  Button,
  // CircularProgress,
} from "@material-ui/core";
import useAuth from "src/hooks/useAuth";
import useIsMountedRef from "src/hooks/useIsMountedRef";
import { useSnackbar } from "notistack";
import { firestore } from "src/firebase";

const useStyles = makeStyles((theme) => ({
  cardHeader: {
    padding: theme.spacing(2),
    background: theme.palette.primary.main,
    color: "#fff",
  },
  padding: {
    padding: theme.spacing(2),
  },
  avatar: {
    cursor: "pointer",
    width: 48,
    height: 48,
    marginRight: 12,
  },
  button: {
    textTransform: "none",
  },
}));

const CreatePostCard: React.FC = () => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [status, setStatus] = useState("");
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleCreatePostSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user)
      return enqueueSnackbar("Please log in to share a post.", { variant: "error" });

    if (!status)
      return enqueueSnackbar("Please enter a status for your post.", { variant: "error" });

    setLoading(true);

    const createdPost = {
      username: user!.name,
      userAvatar: user.avatar || "",
      status,
      likeCount: 0,
      likersUsernames: [],
      comments: [],
      createdAt: Date.now(),
    };

    firestore
      .collection("posts")
      .doc()
      .set(createdPost)
      .catch(() =>
        enqueueSnackbar("Can not share your post at the moment.", { variant: "error" })
      )
      .finally(() => {
        if (isMountedRef.current) {
          setLoading(false);
        }
      });
  };

  return (
    <form onSubmit={handleCreatePostSubmit}>
      <Card>
        <Box display="flex" alignItems="center" className={classes.cardHeader}>
          <Avatar alt="User" className={classes.avatar} src={user?.avatar} />
          <Typography>{user!.name}</Typography>
        </Box>
        <Box mt={1} className={classes.padding}>
          <TextField
            margin="normal"
            label="What's on your mind ?"
            variant="outlined"
            rows={5}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            multiline
            fullWidth
          />
          <Box mt={1} display="flex" justifyContent="flex-end">
            <Button
              color="primary"
              variant="contained"
              type="submit"
              className={classes.button}
              disabled={loading}
            >
              Post
            </Button>
          </Box>
        </Box>
      </Card>
    </form>
  );
};

export default CreatePostCard;
