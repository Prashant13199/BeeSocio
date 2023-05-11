import React, { useEffect, useState, useContext } from "react";
import "./style.css";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import SinglePost from "../../containers/single-post";
import { database } from "../../firebase";
import DeleteIcon from '@mui/icons-material/Delete';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { IconButton } from "@mui/material";
import { Grid } from "@mui/material";
import { ColorModeContext } from "../../services/ThemeContext";

export default function SavedPost({ id, photoURL }) {

    const currentuid = localStorage.getItem("uid");
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [posts, setPosts] = useState([]);
    const { mode } = useContext(ColorModeContext);
    useEffect(() => {
        database.ref(`/Posts/${id}`).on("value", (snapshot) => {
            let postList = [];
            if (snapshot.val() !== null) {
                postList.push({ id: snapshot.key, post: snapshot.val() });
            } else {
                postList.push({ post: null });
            }
            setPosts(postList);
        });
    }, [])

    const removeSaved = () => {
        database.ref(`/Users/${currentuid}/saved/${id}`).remove()
    }

    return (
        <>
            <Modal show={show}
                onHide={handleClose}
                centered
                scrollable
                size="lg"
            >
                <Modal.Header style={
                    {
                        padding: "5px 10px",
                        backgroundColor: mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)"
                    }
                }>
                    <Modal.Title style={
                        {
                            color: mode === "light" ? "black" : "white"
                        }
                    }>
                        Post
                    </Modal.Title>
                    <IconButton onClick={handleClose}>
                        <CloseOutlinedIcon color="error" />
                    </IconButton>

                </Modal.Header>
                <Modal.Body style={
                    {
                        backgroundColor: mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)"
                    }
                }>
                    {
                        posts && posts.length !== 0 && (posts.map(({ id, post }) => {
                            return post !== null ? (
                                <SinglePost key={id}
                                    id={id}
                                    profileUrl={
                                        post.profileUrl
                                    }
                                    uid={
                                        post.uid
                                    }
                                    photoURL={
                                        post.photoUrl
                                    }
                                    caption={
                                        post.caption
                                    }
                                    venue={post.venue}
                                    timestamp={
                                        post.timestamp
                                    }
                                    tagss={
                                        post.tagss
                                    } />
                            ) : <div style={
                                {
                                    display: "grid",
                                    placeItems: "center"
                                }
                            }>
                                <IconButton onClick={removeSaved}>
                                    <DeleteIcon style={
                                        {
                                            color: mode === "light" ? "black" : "white"
                                        }
                                    } />
                                </IconButton>
                                <br />
                                <p style={
                                    {
                                        color: mode === "light" ? "black" : "white"
                                    }
                                }>Post Not Found</p>
                            </div>
                        }))
                    } </Modal.Body>
            </Modal>
            <Grid onClick={handleShow}
                item
                xs={2}
                sm={4}
                md={4}
                key={id}>
                {
                    photoURL.includes(".mp4") ? (
                        <video className="userPost__img" controls preload="metadata">
                            <source src={
                                `${photoURL}#t=0.2`
                            }
                                type="video/mp4" />
                        </video>
                    ) : (
                        <img className="userPost__img"
                            src={photoURL}
                            alt=""
                        />
                    )
                } </Grid>
        </>
    );
}
