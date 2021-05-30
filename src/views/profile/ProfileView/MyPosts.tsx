import React, { useEffect, useState } from "react";
import MyPostCard from "src/components/MyPostCard/MyPostCard";
import { Box, CircularProgress } from "@material-ui/core";
import useAuth from "src/hooks/useAuth";
import { useSnackbar } from "notistack";
import { firestore } from "src/firebase";

const MyPosts = () => {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUserPosts = () => {
    setLoading(true);

    const result: any[] = [];
    firestore
      .collection("posts")
      .where("username", "==", user?.name)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          result.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setPosts(result);
      })
      .catch(() => enqueueSnackbar("Can not fetch your posts at the moment.", { variant: "error" }))
      .finally(() => setLoading(false));
  };

  const handleDeletePost = (id: any) => {
    setLoading(true);
    firestore
      .collection("posts")
      .doc(id)
      .delete()
      .then(
        () => {
          setPosts(posts.filter((p: any) => p.id !== id));
          enqueueSnackbar("Post deleted successfuly.", { variant: "success" });
        },
        () => {
          enqueueSnackbar("Can not delete this post at the moment.", { variant: "error" });
        }
      )
      .catch(() => enqueueSnackbar("Can not delete this post at the moment.", { variant: "error" }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUserPosts();
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column">
      {posts.map((post, i) => (
        <MyPostCard post={post} handleDeletePost={handleDeletePost} key={i} />
      ))}
    </Box>
  );
};

export default MyPosts;
