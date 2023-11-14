import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import ButtonGroup from '@mui/material/ButtonGroup';
import '../createpost/CreatePost.css'
import useProfileViewModel from '../../api/ProfileViewModel'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function EditProfile(props) {
  
  const {updateProfile} = useProfileViewModel();
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [username, setUsername] = React.useState(props.username);
  const [githubUrl, setGithubUrl] = React.useState(props.github);
  const [image, setImage] = React.useState(props.image);

  React.useEffect(() => {
    setUsername(props.username);
    setGithubUrl(props.github);
    setImage(props.image);
  }, [props.username, props.github, props.image]);

  const handleSnackBarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackBar(false);
  };

  const editProfile = async () => {
    try {
      const data = {username, github: githubUrl, image: (image === '') ? props.image : image};
      await updateProfile(data);
      props.onClose()
      window.location.reload();
    }
    catch (e) {
      setOpenSnackBar(true);
    }
  }

  return (
    <div>
      <Modal
        open={props.open}
        onClose={()=>{
          props.onClose()}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style = {{overflowY: 'auto'}}
      >
        <Box className="create-post-box">
        <div className='create-post-container'>
          <Typography variant="h6" color="gray" textAlign="center">
                  Edit Profile
          </Typography>
          <Box className="userBox">
              <Avatar
                  src={image}
                  sx={{ width: 40, height: 40 }}
              />
              <Typography fontWeight={500} variant="span">
                {props.username}
              </Typography>
          </Box>
          <TextField
            sx={{ width: "100%" }}
            id="standard-multiline-static"
            placeholder="Enter your new username"
            variant="standard"
            value={username}
            onChange={(event)=>setUsername(event.target.value)}
          />
          <TextField
            sx={{ width: "100%" }}
            id="standard-multiline-static"
            placeholder="Enter your new github profile link"
            variant="standard"
            value={githubUrl}
            onChange={(event)=>setGithubUrl(event.target.value)}
          />
          <TextField
            sx={{ width: "100%" }}
            placeholder="Paste image link here"
            variant="standard"
            value={image}
            onChange={(event)=>setImage(event.target.value)}
            />
          <>
          <div className='photoUpload'>
            <div className='imageLink'>
            </div>
          </div>
          {image && (
            <Box p={2} style={{ display: 'flex', justifyContent: 'center' }}>
              <img
                src={image}
                alt="Invalid url"
                style={{ maxWidth: '80%', maxHeight:'50%', margin: '0 auto' }}
              />
            </Box>
          )}
          </>
        </div>
        <ButtonGroup
            fullWidth
            variant="contained"
            aria-label="outlined primary button group"
          >
            <Button onClick={editProfile}>Update Profile</Button>
          </ButtonGroup>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={openSnackBar}
          onClose={handleSnackBarClose}
          autoHideDuration={2000}
        >
          <Alert severity="error" sx={{ width: '100%' }}>
            username or url is invalid
          </Alert>
        </Snackbar>
        </Box>
      </Modal>
    </div>
  );
}
