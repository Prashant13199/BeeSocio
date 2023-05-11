import React, { useEffect, useState, useContext } from "react";
import "./style.css";
import { database } from "../../firebase";
import Swal from "sweetalert2";
import { makeid } from "../../services/makeid";
import { Button } from "react-bootstrap";
import { ColorModeContext } from "../../services/ThemeContext";

export default function Forward({ id, messageData, handleClose2, handleClose9 }) {

    const currentuid = localStorage.getItem("uid");
    const [photo, setPhoto] = useState("");
    const [username, setUsername] = useState("");
    const [currentUsername, setCurrentUsername] = useState("");
    const [currentEmail, setCurrentEmail] = useState("");
    const { mode } = useContext(ColorModeContext);

    useEffect(() => {
        database.ref(`/Rooms/${id}`).on("value", (snapshot) => {
            setPhoto(snapshot.val().photo);
            setUsername(snapshot.val().groupName);
        });
    }, []);

    useEffect(() => {
        database.ref(`/Users/${currentuid}/`).on("value", (snapshot) => {
            if (snapshot.val()) {
                setCurrentUsername(snapshot.val().username);
                setCurrentEmail(snapshot.val().email);
            }
        });
    }, []);

    const sendPicMessage = async () => {
        Swal.fire({
            background:
                mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
            color: mode === "light" ? "black" : "white",
            title: "You are forwarding message to",
            text: `${username.toLowerCase()}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, send",
        }).then((result) => {
            if (result.isConfirmed) {
                database.ref(`/Rooms/${id}/seenusers`).remove().catch((e) => {
                    console.log(e)
                })
                let mid = makeid(10);
                database.ref(`/RoomsMsg/${id}/messages/${mid}`).set({
                    forwarded: true,
                    post: messageData.postUrl ? messageData.postUrl : "",
                    uid: currentuid,
                    email: currentEmail,
                    timestamp: Date.now(),
                    postuid: messageData.postuid ? messageData.postuid : "",
                    postid: messageData.postid ? messageData.postid : "",
                    photo: messageData.photo ? messageData.photo : "",
                    message: messageData.message ? messageData.message : "",
                    sticker: messageData.sticker ? messageData.sticker : "",
                    gif: messageData.gif ? messageData.gif : ""
                });
                database.ref(`/Rooms/${id}`).update({ timestamp: Date.now() });
                database.ref(`/Rooms/${id}/users`).on('value', snapshot => {
                    snapshot.forEach((snap) => {
                        if (snap.key !== currentuid) {
                            database.ref(`/Users/${snap.key}/messages/${id}`).set({
                                id: snap.key,
                                text: `${currentUsername} forwarded message in ${username} group`,
                            })
                                .then(() => {
                                    handleClose2()
                                    handleClose9()
                                    Swal.fire({
                                        background:
                                            mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
                                        color: mode === "light" ? "black" : "white",
                                        title: "Sent!",
                                        text: `Message forwarded to ${username}`,
                                        icon: "success",
                                        timer: 800,
                                        showConfirmButton: false,
                                    });
                                });
                        }
                    })
                })


            }
        });
    };

    return (
        <div style={{ margin: "10px 0px", display: "flex", justifyContent: "space-between" }}>
            <div>
                <img
                    className="like__img"
                    src={photo}
                    alt=""
                />
                <a
                    className="users2__a"

                    style={{ color: mode === "light" ? "black" : "white" }}
                >
                    {username && username.length > 15 ? username.substring(0, 15).concat('...') : username}
                </a>
            </div>
            <div>
                <Button
                    onClick={sendPicMessage}
                    style={{
                        borderRadius: "8px",
                        width: "70px",
                    }}
                    variant="primary"
                    size="sm"
                >
                    Send
                </Button>
            </div>
        </div>
    )
}
