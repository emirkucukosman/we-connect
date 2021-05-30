import React, { useState } from "react";
import MyPostCardComments from "./MyPostCardComments";
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Collapse,
  makeStyles,
  Badge,
} from "@material-ui/core";
import {
  Favorite as FavoriteIcon,
  CommentOutlined as CommentIcon,
  DeleteForeverOutlined as DeleteIcon,
} from "@material-ui/icons";
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
  deleteButton: {
    color: "#ff0000",
    padding: 8,
  },
}));

type MyPostCardProps = {
  post: any;
  handleDeletePost: (id: string) => void;
};

const MyPostCard: React.FC<MyPostCardProps> = ({ post, handleDeletePost }) => {
  const classes = useStyles();
  const [showComments, setShowComments] = useState(true);

  return (
    <div className={classes.card}>
      <Box display="flex" alignItems="center" className={classes.cardHeader}>
        <Avatar alt="User" className={classes.avatar} src={post.userAvatar} />
        <Box display="flex" justifyContent="space-between" width="100%">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="flex-start"
          >
            <Typography>{post.username}</Typography>
            <Typography variant="caption" className={classes.dateText}>
              {dayjs(post.createdAt).format("DD/MM/YYYY - HH:mm")}
            </Typography>
          </Box>
          <IconButton className={classes.deleteButton} onClick={() => handleDeletePost(post.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
      <Box mt={1} className={classes.padding}>
        <Typography>{post.status}</Typography>
      </Box>
      <Box className={classes.padding}>
        <Badge badgeContent={post.likeCount} color="secondary" showZero>
          <FavoriteIcon htmlColor="#ff0000" />
        </Badge>
        <Badge
          badgeContent={post.comments.length}
          color="primary"
          showZero
          style={{ marginLeft: 22 }}
        >
          <IconButton
            onClick={() => setShowComments(!showComments)}
            style={{ padding: 0 }}
            color={showComments ? "primary" : "default"}
          >
            <CommentIcon />
          </IconButton>
        </Badge>
      </Box>
      <Collapse in={showComments} timeout="auto">
        {post.comments.map((comment: any, i: any) => (
          <MyPostCardComments comment={comment} key={i} />
        ))}
      </Collapse>
    </div>
  );
};

export default MyPostCard;
