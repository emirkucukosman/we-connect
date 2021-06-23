import React, { useEffect, useState } from "react";
import Page from "src/components/Page";
import CreatePostCard from "src/components/CreatePostCard";
import PostCard from "src/components/PostCard/PostCard";
import useAuth from "src/hooks/useAuth";
import useIsMountedRef from "src/hooks/useIsMountedRef";
import { Box, CircularProgress, Container, makeStyles } from "@material-ui/core";
import { useSnackbar } from "notistack";
import { firestore } from "src/firebase";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
}));

const ListPostsView = () => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const { user, isAuthenticated } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleReaction = (id: string, reaction: "like" | "unlike") => {
    const index = posts.findIndex((p: any) => p.id === id);
    const likeCount =
      reaction === "like" ? posts[index].likeCount + 1 : posts[index].likeCount - 1;
    const likersUsernames =
      reaction === "like"
        ? [...posts[index].likersUsernames, user!.name]
        : posts[index].likersUsernames.filter((l: any) => l !== user!.name);
    setPosts([
      ...posts.slice(0, index),
      { ...posts[index], likeCount, likersUsernames },
      ...posts.slice(index + 1),
    ]);
  };

  const handleComment = (userComment: any) => {
    const index = posts.findIndex((p: any) => p.id === userComment.id);
    const postComments = posts[index].comments;
    postComments.push({
      comment: userComment.comment,
      commenterAvatar: userComment.commenterAvatar,
      commenterUsername: userComment.commenterUsername,
      createdAt: userComment.createdAt.seconds,
    });
    setPosts([
      ...posts.slice(0, index),
      {
        ...posts[index],
        comments: postComments,
      },
      ...posts.slice(index + 1),
    ]);
  };

  useEffect(() => {
    const unsubscribe = firestore.collection("posts").onSnapshot(
      (snapshot) => {
        if (isMountedRef.current) {
          setLoading(true);
        }

        const result: any[] = [];
        snapshot.forEach((doc) => {
          result.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        if (isMountedRef.current) {
          setPosts(result);
          setLoading(false);
        }
      },
      () => {
        enqueueSnackbar("Can not get posts at the moment", { variant: "error" });
      }
    );

    return () => unsubscribe();
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Page className={classes.root} title="Posts">
      <Container maxWidth="lg">
        {isAuthenticated ? <CreatePostCard /> : null}
        {posts.map((post, i) => (
          <PostCard
            key={i}
            id={post.id}
            username={post.username}
            userAvatar={post.userAvatar}
            status={post.status}
            likeCount={post.likeCount}
            likersUsernames={post.likersUsernames}
            comments={post.comments}
            createdAt={post.createdAt}
            emitReaction={handleReaction}
            emitComment={handleComment}
          />
        ))}
      </Container>
    </Page>
  );
};

export default ListPostsView;
