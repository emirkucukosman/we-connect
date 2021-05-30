import React, { useState } from "react";
import CommentBox from "./CommentBox";
import ReactionBox from "./ReactionBox";
import PostComment from "./PostComment";
import { Card, Box, Avatar, makeStyles, Typography, Collapse } from "@material-ui/core";
import dayjs from "dayjs";

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(4),
  },
  cardHeader: {
    padding: theme.spacing(2),
    background: theme.palette.grey[300],
    color: "#000",
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
  dateText: {
    color: "grey",
  },
}));

type PostCardProps = {
  id: string;
  username: string;
  userAvatar: string;
  createdAt: any;
  status: string;
  likeCount: number;
  likersUsernames: string[];
  comments: any[];
  emitReaction: (id: string, reaction: "like" | "unlike") => void;
  emitComment: (commentObject: any) => void;
};

const PostCard: React.FC<PostCardProps> = ({
  id,
  username,
  userAvatar,
  status,
  likeCount,
  likersUsernames,
  comments,
  createdAt,
  emitReaction,
  emitComment,
}) => {
  const classes = useStyles();
  const [showComments, setShowComments] = useState(true);

  return (
    <Card className={classes.card}>
      <Box display="flex" alignItems="center" className={classes.cardHeader}>
        <Avatar alt="User" className={classes.avatar} src={userAvatar} />
        <Box display="flex" flexDirection="column" justifyContent="flex-start">
          <Typography>{username}</Typography>
          <Typography variant="caption" className={classes.dateText}>
            {dayjs(createdAt).format("DD/MM/YYYY - HH:mm")}
          </Typography>
        </Box>
      </Box>
      <Box mt={1} className={classes.padding}>
        <Typography>{status}</Typography>
      </Box>
      <ReactionBox
        id={id}
        likeCount={likeCount}
        commentCount={comments.length}
        likersUsernames={likersUsernames}
        showComments={showComments}
        handleReaction={emitReaction}
        handleCommentReaction={() => setShowComments(!showComments)}
      />
      <CommentBox id={id} handleComment={emitComment} />
      <Collapse in={showComments} timeout="auto">
        {comments.map((comment, i) => (
          <PostComment key={i} comment={comment} />
        ))}
      </Collapse>
    </Card>
  );
};

export default PostCard;
