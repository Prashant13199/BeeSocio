import React, { useState, useEffect, useContext } from "react";
import "./style.css";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import SinglePost from "../../containers/single-post";
import { Grid } from "@mui/material";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ColorModeContext } from "../../services/ThemeContext";

export default function UserPost({
    uid,
    id,
    photoURL,
    caption,
    timestamp,
    tagss,
    venue
}) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const { mode } = useContext(ColorModeContext);
    useEffect(() => {
        AOS.init({ duration: 800 })
    }, [])
    return (
        <>
            <Modal show={show}
                onHide={handleClose}
                centered
                scrollable
                size="lg"
            >
                <Modal.Body style={{ padding: 0, backgroundColor: mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)" }}>
                    <SinglePost key={id}
                        id={id}
                        handleModal={handleClose}
                        uid={uid}
                        photoURL={photoURL}
                        caption={caption}
                        timestamp={timestamp}
                        venue={venue}
                        tagss={tagss} />
                </Modal.Body>
            </Modal>
            <Grid onClick={handleShow} data-aos="fade-up"
                item
                xs={2}
                sm={4}
                md={4}
                key={id}>
                {
                    photoURL.includes(".mp4") ? (
                        <video className="userPost__video" controls={false} preload="metadata">
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
