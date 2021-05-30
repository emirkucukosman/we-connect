import React from "react";
import { Box, Badge, IconButton, makeStyles } from "@material-ui/core";
import {
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  CommentOutlined as CommentIcon,
} from "@material-ui/icons";
import firebase, { firestore } from "src/firebase";
import useAuth from "src/hooks/useAuth";
import { useSnackbar } from "notistack";

const useStyles = makeStyles((theme) => ({
  padding: {
    padding: theme.spacing(2),
  },
  reactButton: {
    color: "#ff0000",
    "&:hover": {
      cursor: "pointer",
    },
  },
}));

type ReactionBoxProps = {
  id: string;
  likersUsernames: any[];
  likeCount: number;
  commentCount: number;
  showComments: boolean;
  handleReaction: (id: string, reaction: "like" | "unlike") => void;
  handleCommentReaction: () => void;
};

const ReactionBox: React.FC<ReactionBoxProps> = ({
  id,
  likeCount,
  commentCount,
  likersUsernames,
  showComments,
  handleReaction,
  handleCommentReaction,
}) => {
  const classes = useStyles();
  const { user, isAuthenticated } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const handlePostCardReaction = (reaction: "like" | "unlike") => {
    if (!isAuthenticated || !user)
      return enqueueSnackbar("Please sign in to like a post.", { variant: "error" });

    if (reaction === "like") {
      handleReaction(id, "like");

      return firestore
        .collection("posts")
        .doc(id)
        .update({
          likeCount: firebase.firestore.FieldValue.increment(1),
          likersUsernames: firebase.firestore.FieldValue.arrayUnion(user!.name),
        })
        .catch(() => {
          handleReaction(id, "unlike");
          enqueueSnackbar("Can not like this post at the moment", { variant: "error" });
        });
    }

    handleReaction(id, "unlike");

    return firestore
      .collection("posts")
      .doc(id)
      .update({
        likeCount: firebase.firestore.FieldValue.increment(-1),
        likersUsernames: firebase.firestore.FieldValue.arrayRemove(user!.name),
      })
      .catch(() => {
        handleReaction(id, "like");
        enqueueSnackbar("Can not unlike this post at the moment", { variant: "error" });
      });
  };

  const ReactButton = likersUsernames.includes(user?.name || "") ? (
    <IconButton onClick={() => handlePostCardReaction("unlike")} style={{ padding: 0 }}>
      <FavoriteIcon className={classes.reactButton} />
    </IconButton>
  ) : (
    <IconButton onClick={() => handlePostCardReaction("like")} style={{ padding: 0 }}>
      <FavoriteBorderIcon className={classes.reactButton} />
    </IconButton>
  );

  return (
    <Box className={classes.padding}>
      <Badge badgeContent={likeCount} color="secondary" showZero>
        {ReactButton}
      </Badge>
      <Badge badgeContent={commentCount} color="primary" showZero style={{ marginLeft: 22 }}>
        <IconButton
          onClick={handleCommentReaction}
          style={{ padding: 0 }}
          color={showComments ? "primary" : "default"}
        >
          <CommentIcon />
        </IconButton>
      </Badge>
    </Box>
  );
};

export default ReactionBox;
