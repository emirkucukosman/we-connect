import React from "react";
import { Box, Avatar, makeStyles, Typography } from "@material-ui/core";
import dayjs from "dayjs";

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

type PostCommentsProps = {
  comment: any;
};

const PostComment: React.FC<PostCommentsProps> = ({ comment }) => {
  const classes = useStyles();

  return (
    <Box display="flex" className={classes.commentsBox}>
      <Avatar alt="User" className={classes.avatar} src={comment.commenterAvatar} />
      <Box display="flex" flexDirection="column" width="100%">
        <Typography variant="caption" style={{ color: "gray" }}>
          {comment.commenterUsername}
        </Typography>
        <Typography variant="body1">{comment.comment}</Typography>
        <Box display="flex" justifyContent="flex-end" width="100%" mt={1}>
          <Typography variant="caption" style={{ color: "gray" }}>
            {dayjs(comment.createdAt).format("DD/MM/YYYY - HH:mm")}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default PostComment;
