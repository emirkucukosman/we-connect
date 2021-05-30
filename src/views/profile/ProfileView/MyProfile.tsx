import React, { useState, FormEvent, ChangeEvent } from "react";
import {
  Avatar,
  Box,
  TextField,
  makeStyles,
  Button,
  IconButton,
  CircularProgress,
} from "@material-ui/core";
import { CloudUploadOutlined as CloudUploadOutlinedIcon } from "@material-ui/icons";
import useAuth from "src/hooks/useAuth";
import { useSnackbar } from "notistack";
import firebase from "src/firebase";

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: 64,
    height: 64,
    cursor: "pointer",
  },
  input: {
    display: "none",
  },
  uploadButton: {
    padding: 4,
    marginTop: 8,
  },
}));

const MyProfile = () => {
  const classes = useStyles();
  const { user, updateProfile } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [displayName, setDisplayName] = useState(user!.name);
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | undefined>();
  const [filename, setFilename] = useState("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files)
      return enqueueSnackbar("Please pick a valid image file.", { variant: "error" });

    const file = e.target.files![0];
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

    if (!allowedTypes.includes(file.type))
      return enqueueSnackbar("Please pick a valid image file.", { variant: "error" });

    setAvatarFile(file);
    setFilename(file.name);
  };

  const updateUser = (avatarURL?: string) => {
    firebase
      .auth()
      .currentUser!.updateProfile({
        displayName,
        photoURL: avatarURL,
      })
      .then(() => {
        updateProfile(displayName);
        enqueueSnackbar("Profile updated successfuly.", { variant: "success" });
      })
      .catch(() => {
        enqueueSnackbar("Can not update your profile at the moment.", { variant: "error" });
      })
      .finally(() => setLoading(false));
  };

  const handleUpdateSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!displayName) return enqueueSnackbar("Please enter a display name.", { variant: "error" });

    setLoading(true);

    if (!avatarFile) return updateUser();

    if (avatarFile) {
      firebase
        .storage()
        .ref(`${user!.name}`)
        .put(avatarFile)
        .then(
          async (snapshot) => {
            const downloadURL = await snapshot.ref.getDownloadURL();
            if (!downloadURL) return Promise.reject();
            updateUser(downloadURL);
          },
          () => enqueueSnackbar("Can not upload your avatar at the moment.", { variant: "error" })
        )
        .catch(() =>
          enqueueSnackbar("Can not upload your avatar at the moment.", { variant: "error" })
        )
        .finally(() => setLoading(false));
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
    <Box display="flex" flexDirection="column" justifyContent="center">
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" mb={3}>
        <Avatar alt="User" className={classes.avatar} src={user?.avatar} />
        <div style={{ marginTop: 8 }}>{filename}</div>
        <input
          accept="image/*"
          className={classes.input}
          id="icon-button-file"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="icon-button-file">
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="span"
            className={classes.uploadButton}
          >
            <CloudUploadOutlinedIcon />
          </IconButton>
        </label>
      </Box>
      <form onSubmit={handleUpdateSubmit}>
        <TextField
          margin="normal"
          label="Display Name"
          variant="outlined"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          fullWidth
        />
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button color="primary" variant="contained" type="submit">
            Update
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default MyProfile;
