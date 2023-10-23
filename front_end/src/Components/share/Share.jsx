import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import "./Share.css";
import { tempAuthors } from "../../Pages/tempAuthors";
import AuthorTile from "../friends/authorTile";
import { Typography } from "@mui/material";

export default function Share(props) {
  return (
    <div>
      <Modal
        open={props.open}
        onClose={() => {
          props.onClose();
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ overflowY: "auto" }}
      >
        <Box className="share-box">
          <Typography variant="h6" color="gray">
            Share this post with a freind:
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {tempAuthors.map((post, index) => {
              return (
                <AuthorTile
                  key={index}
                  username={post.name}
                  profilePic={post.profile}
                  status={post.status}
                />
              );
            })}
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
