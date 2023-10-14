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

//TODO: Figure out private posts

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
  const [image, setImage] = React.useState(null);
  const [imageLink, setImageLink] = React.useState('');
  const [selectedPostType, setSelectedPostType] = React.useState(null); // Initialize with a default value

  const handlePostTypeChange = (event) => {
    const value = event.target.value;
    setSelectedPostType(value);
    if (value === "Text") {
      setImage(null);
    }
  };

  const onImageChange =(event, type)=>{
    if (type === 'input' && event.target.files && event.target.files[0]){
        const img = event.target.files[0];
        setImage(URL.createObjectURL(img));
    } else {
        setImage(imageLink);
    }
  }

  const reset = () => {
    setImage(null);
    setSelectedPostType(null);
  }

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
                  src="https://images.pexels.com/photos/846741/pexels-photo-846741.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  sx={{ width: 30, height: 30 }}
              />
              <Typography fontWeight={500} variant="span">
                  Selena Gomez
              </Typography>
          </Box>
          <TextField
            sx={{ width: "100%" }}
            id="standard-multiline-static"
            placeholder="Enter the title of your post here"
            variant="standard"
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
            >
              <FormControlLabel value="Text" control={<Radio />} label="Text" />
              <FormControlLabel value="Image" control={<Radio />} label="Image" />
            </RadioGroup>
          </FormControl>
          {(selectedPostType === "Text" || !selectedPostType)&& 
              <TextField
              sx={{ width: "100%" }}
              id="standard-multiline-static"
              multiline
              rows={1}
              placeholder="What's on your mind?"
              variant="standard"
            />
          }
          {selectedPostType === "Image" &&
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
          }
          {image && (
            <Box p={2} style={{ display: 'flex', justifyContent: 'center' }}>
              <img
                src={image}
                alt="Selected"
                style={{ maxWidth: '60%', maxHeight:'30%', margin: '0 auto' }}
              />
            </Box>
          )}
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">Visibility</FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
              <FormControlLabel value="female" control={<Radio />} label="Public" />
              <FormControlLabel value="male" control={<Radio />} label="Friends Only" />
              {/* <FormControlLabel value="other" control={<Radio />} label="Private" /> */}
            </RadioGroup>
          </FormControl>
          <ButtonGroup
            fullWidth
            variant="contained"
            aria-label="outlined primary button group"
          >
            <Button>Post</Button>
          </ButtonGroup>
        </div>
        </Box>
      </Modal>
    </div>
  );
}
