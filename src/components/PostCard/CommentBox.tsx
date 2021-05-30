import React, { useState } from "react";
import { Box, Avatar, makeStyles, IconButton, TextField } from "@material-ui/core";
import { SendOutlined as SendIcon } from "@material-ui/icons";
import { useSnackbar } from "notistack";
import firebase, { firestore } from "src/firebase";
import useAuth from "src/hooks/useAuth";

const useStyles = makeStyles((theme) => ({
  commentsBox: {
    padding: theme.spacing(2),
    background: theme.palette.grey[300],
    color: "#000",
  },
  avatar: {
    cursor: "pointer",
    width: 48,
    height: 48,
    marginRight: 12,
  },
}));

type CommentBoxProps = {
  id: string;
  handleComment: (commentObject: any) => void;
};

const CommentBox: React.FC<CommentBoxProps> = ({ id, handleComment }) => {
  const classes = useStyles();
  const [comment, setComment] = useState("");
  const { user, isAuthenticated } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const handleCommentSendClick = () => {
    if (!isAuthenticated || !user)
      return enqueueSnackbar("Please log in to comment on a post.", { variant: "error" });

    if (!comment) return;

    const commentObject = {
      comment,
      commenterAvatar: user!.avatar || "",
      commenterUsername: user!.name,
      createdAt: Date.now(),
    };

    firestore
      .collection("posts")
      .doc(id)
      .update({
        comments: firebase.firestore.FieldValue.arrayUnion(commentObject),
      })
      .then(() => {
        handleComment({ id, ...commentObject });
        setComment("");
      })
      .catch(() => {
        enqueueSnackbar("Can not comment on this post at the moment.", { variant: "error" });
      });
  };

  return (
    <Box display="flex" className={classes.commentsBox}>
      <Avatar alt="User" className={classes.avatar} src={user?.avatar} />
      <TextField
        label="Comment"
        variant="standard"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        fullWidth
        style={{ marginRight: 16 }}
      />
      <IconButton color="primary" onClick={handleCommentSendClick}>
        <SendIcon />
      </IconButton>
    </Box>
  );
};

export default CommentBox;
