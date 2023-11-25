import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import ImageIcon from '@mui/icons-material/Image';
import ButtonGroup from '@mui/material/ButtonGroup';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { styled } from '@mui/material/styles';
import './CreatePost.css'
import usePostsViewModel from '../../api/PostsViewModel'
import { StoreContext } from './../../store';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

//TODO: Figure out private posts

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function CreatePost(props) {
  const { state } = React.useContext(StoreContext);
  const [imageLink, setImageLink] = React.useState('');
  const [selectedPostType, setSelectedPostType] = React.useState("");
  const [title, setTitle] = React.useState(props.post && props.post.title ? props.post.title : null);
  //const [description, setDescription] = React.useState(''); // TODO: add description
  const [contentType, setContentType] = React.useState(props.post && props.post.contentType ? props.post.contentType : 'text/plain');
  const [content, setContent] = React.useState(props.post && props.post.content ? props.post.content : null);
  const [visibility, setVisibility] = React.useState(props.post && props.post.visibility ? props.post.visibility : (props.private) ? "private" : null);
  const [openSnackBar, setOpenSnackBar] = React.useState(false);

  const {createPost, editPost} = usePostsViewModel();

  const handleSnackBarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackBar(false);
  };

  const handlePostTypeChange = (event) => {
    const value = event.target.value;
    setSelectedPostType(value);
    setContent("");
    if (value === "text/plain") {
      setContentType('text/plain');
    } else if (value === "text/markdown"){
      setContentType('text/markdown');
    }
  };

  const onImageChange =(event, type)=>{
    if (type === 'input' && event.target.files && event.target.files[0]){
        const img = event.target.files[0];

        const reader = new FileReader();

        reader.onload = (e) => {
          const dataUrl = e.target.result;
          setContent(dataUrl);
        };
        reader.readAsDataURL(img);

        const fileType = img.type;

        if (fileType === 'image/png') {
          setContentType('image/png;base64');
        } else if (fileType === 'image/jpeg') {
          setContentType('image/jpeg;base64');
        }
        
    } else {
        console.log(imageLink)
        setContent(imageLink)
        console.log(content)
        setContentType('text/plain')
    }
  }

  const reset = () => {
    setSelectedPostType(null);
    setContent(null);
  }

  const onCreatePost = async () =>{
    try {
      if (props.action === "EDIT"){
        await editPost(title, 'description', contentType, content, visibility, props.post.id)
      } else {
        await createPost(title, 'description', contentType, content, visibility, props.recipient) // TODO: add description
      }
      reset()
      props.onClose()
      window.location.reload();
    } catch (error) {
      setOpenSnackBar(true);
      console.error('Incomplete Fields', error);
    }
  }
  
  React.useEffect(() => {
    if (props.post && props.post.contentType){
      if (props.post.contentType.startsWith("image")){
        setSelectedPostType('image')
      } else {
        setSelectedPostType(props.post.contentType)
      }
    }
  }, [props.post]);

  return (
    <div>
      <Modal
        open={props.open}
        onClose={()=>{
          reset()
          props.onClose()}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style = {{overflowY: 'auto'}}
      >
        <Box className="create-post-box">
        <div className='create-post-container'>
          <Typography variant="h6" color="gray" textAlign="center">
                  {props.action === "EDIT"? 'Edit Post' : 'Create Post'}
          </Typography>
          <Box className="userBox">
              <Avatar
                  src={state.user.profileImage}
                  sx={{ width: 40, height: 40 }}
              />
              <Typography fontWeight={500} variant="span">
                {state.user.username}
              </Typography>
          </Box>
          <TextField
            sx={{ width: "100%" }}
            id="standard-multiline-static"
            placeholder="Enter the title of your post here"
            variant="standard"
            value={title}
            onChange={(event)=>setTitle(event.target.value)}
          />
          <FormControl className='postType'>
            <Typography fontWeight={500} variant="span" style={{padding:'1rem'}}>
              Post Type: 
            </Typography>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              onChange={handlePostTypeChange}
              value={selectedPostType}
            >
              <FormControlLabel value="text/plain" control={<Radio />} label="Text" />
              <FormControlLabel value="text/markdown" control={<Radio />} label="Markdown" />
              <FormControlLabel value="image" control={<Radio />} label="Image" />
            </RadioGroup>
          </FormControl>
          {(selectedPostType === "text/plain" || !selectedPostType)&& 
              <TextField
              sx={{ width: "100%" }}
              id="standard-multiline-static"
              multiline
              rows={1}
              placeholder="What's on your mind?"
              variant="standard"
              value={content}
              onChange={(event)=>setContent(event.target.value)}
            />
          }
          {(selectedPostType === "text/markdown")&& 
              <TextField
              sx={{ width: "100%" }}
              id="standard-multiline-static"
              multiline
              rows={5}
              placeholder="Enter markdown here"
              variant="standard"
              value={content}
              onChange={(event)=>setContent(event.target.value)}
            />
          }
          {selectedPostType === "image" &&
          <>
          <div className='photoUpload'>
            <Button 
              component="label" 
              variant="contained" 
              startIcon={<ImageIcon />}>
              Upload Photo
            <VisuallyHiddenInput type="file" onChange = {(event)=>onImageChange(event,'input')}/>
            </Button>
            <Typography>or</Typography>
            <div className='imageLink'>
            <TextField
            sx={{ width: "70%" }}
            placeholder="Paste image link here"
            variant="standard"
            onChange={(event)=>setImageLink(event.target.value)}
            />
            <Button 
              component="label" 
              variant="contained" 
              style={{width:'30%', fontSize:'11px'}}
              onClick={(event)=>onImageChange(event,'link')}>
              submit
            </Button>
            </div>
          </div>
          {content && (
            <Box p={2} style={{ display: 'flex', justifyContent: 'center' }}>
              <img
                src={content}
                alt="Selected"
                style={{ maxWidth: '80%', maxHeight:'50%', margin: '0 auto' }}
              />
            </Box>
          )}
          </>    
          }
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">Visibility</FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              onChange={(event)=>setVisibility(event.target.value)}
              value={visibility}
            >
              {
                props.private ?
                <FormControlLabel value="private" control={<Radio />} label="Private" checked={true} /> :
                (<><FormControlLabel value="public" control={<Radio />} label="Public" />
                <FormControlLabel value="friends" control={<Radio />} label="Friends Only" /></>)
              }
            </RadioGroup>
          </FormControl>
          <ButtonGroup
            fullWidth
            variant="contained"
            aria-label="outlined primary button group"
          >
            <Button onClick={onCreatePost}>{props.action === "EDIT" ? "Update" : (props.private ? `Post to ${props.recipient.displayName}` : "Post")}</Button>
          </ButtonGroup>
        </div>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={openSnackBar}
          onClose={handleSnackBarClose}
          autoHideDuration={2000}
        >
          <Alert severity="error" sx={{ width: '100%' }}>
            Incomplete
          </Alert>
        </Snackbar>
        </Box>
      </Modal>
    </div>
  );
}
