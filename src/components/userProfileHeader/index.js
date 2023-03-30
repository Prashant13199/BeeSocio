import React, { useState, useEffect } from "react";
import "./style.css";
import { database } from "../../firebase";
import { Modal } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import UserP from "../users-profile";
import MessageIcon from '@mui/icons-material/Message';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { IconButton } from "@mui/material";
import { Button } from "react-bootstrap";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

export default function UserProfileHeader(props) {

    const [photo, setPhoto] = useState("");
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [show1, setShow1] = useState(false);
    const handleClose1 = () => setShow1(false);
    const handleShow1 = () => setShow1(true);
    const [show2, setShow2] = useState(false);
    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => setShow2(true);
    const [follow, setfollow] = useState([]);
    const [cfollowing, setcfollowing] = useState([]);
    let like = false;
    const currentuid = localStorage.getItem("uid");
    const [currentUsername, setCurrentUsername] = useState("");
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [website, setWebsite] = useState("");
    let history = useHistory();
    const theme = localStorage.getItem("theme");
    const [postCount, setPostCount] = useState(0);
    const [videoCount, setVideoCount] = useState(0);

    useEffect(() => {
        database.ref(`/Users/${currentuid}/`).on("value", (snapshot) => {
            if (snapshot.val()) {
                setCurrentUsername(snapshot.val().username);
            }
        });
    }, []);

    useEffect(() => {
        database.ref(`/Users/${props.uid
            }`).on("value", (snapshot) => {
                if (snapshot.val() !== null) {
                    handleClose()
                    handleClose1()
                    setPhoto(snapshot.val().photo);
                    setUsername(snapshot.val().username);
                    setBio(snapshot.val().bio);
                    setWebsite(snapshot.val().website);
                }
            });
        database.ref(`/Users/${props.uid
            }/followers`).on("value", (snapshot) => {
                let followList = [];
                snapshot.forEach((snap) => {
                    followList.push({ id: snap.key, uid: snap.val().uid });
                });
                setfollow(followList);
            });
        database.ref(`/Users/${props.uid
            }/following`).on("value", (snapshot) => {
                let cfollowingList = [];
                snapshot.forEach((snap) => {
                    cfollowingList.push({ id: snap.key, uid: snap.val().uid });
                });
                setcfollowing(cfollowingList);
            });
        database.ref(`/Users/${props.uid}/Posts`).on("value", (snapshot) => {
            setPostCount(snapshot.numChildren());
        });
        database.ref(`/Users/${props.uid}/Videos`).on("value", (snapshot) => {
            setVideoCount(snapshot.numChildren());
        });
    }, [props]);

    for (var i = 0; i < follow.length; i++) {
        if (follow[i].uid === currentuid) {
            like = true;
        }
    }

    const handlefollow = async () => {
        if (like === false) {
            database.ref(`/Users/${props.uid
                }/followers/${currentuid}`).set({ id: currentuid, uid: currentuid }).then(() => {
                    console.log("following");
                }).catch((e) => {
                    console.log(e);
                });
            database.ref(`/Users/${currentuid}/following/${props.uid
                }`).set({ id: props.uid, uid: props.uid }).then(() => {
                    console.log("following");
                }).catch((e) => {
                    console.log(e);
                });
            database.ref(`/Users/${props.uid
                }/notifications/${currentuid}`).set({ id: currentuid, text: `${currentUsername} started following you`, timestamp: Date.now(), uid: currentuid });
            database.ref(`/Users/${props.uid
                }/activity/${currentuid}`).set({ id: currentuid, uid: currentuid, text: `started following you`, timestamp: Date.now() });
            database.ref(`/Users/${props.uid
                }/notification/${currentuid}`).set({ text: `${currentUsername} started following you` });
        } else {
            Swal.fire({
                background: theme === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
                color: theme === "light" ? "black" : "white",
                title: `Are you sure to unfollow ${username}?`,
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, unfollow it!"
            }).then((result) => {
                if (result.isConfirmed) {
                    database.ref(`/Users/${props.uid
                        }/followers/${currentuid}`).remove().then(() => {
                            console.log("follow removed");
                            like = false;
                        }).catch((e) => {
                            console.log(e);
                        });
                    database.ref(`/Users/${currentuid}/following/${props.uid
                        }`).remove().then(() => {
                            console.log("follow removed");
                            like = false;
                        }).catch((e) => {
                            console.log(e);
                        });
                    database.ref(`/Users/${props.uid
                        }/activity/${currentuid}`).remove().then(() => {
                            console.log("activity removed");
                            like = false;
                        }).catch((e) => {
                            console.log(e);
                        });
                    database.ref(`/Users/${props.uid
                        }/notification/${currentuid}`).remove().then(() => {
                            console.log("activity removed");
                            like = false;
                        }).catch((e) => {
                            console.log(e);
                        });
                    Swal.fire({
                        background: theme === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
                        color: theme === "light" ? "black" : "white",
                        title: "Unfollowed!",
                        text: "Following removed.",
                        icon: "success",
                        timer: 800,
                        showConfirmButton: false
                    });
                }
            });
        }
    };
    const sendMessage = async () => {
        if (props.uid !== currentuid) {
            var names = [props.uid, currentuid];
            names.sort();
            let chatRoom = names.join("");
            database.ref(`Rooms/${chatRoom}`).set({ name1: props.uid, name2: currentuid, timestamp: Date.now() }).then(() => {
                history.push(`/message/rooms/${names.join("")
                    }`);
            }).catch((e) => {
                console.log(e);
            });
        }
    };
    return (
        <>
            <Modal show={show}
                onHide={handleClose}
                centered
                scrollable
            >
                <Modal.Header style={
                    {
                        padding: "5px 10px",
                        backgroundColor: theme === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)"
                    }
                }>
                    <Modal.Title style={
                        {
                            color: theme === "light" ? "black" : "white"
                        }
                    }>
                        <b>{
                            follow.length
                        }</b>
                        &nbsp;Followers
                    </Modal.Title>
                    <IconButton onClick={handleClose}>
                        <CloseOutlinedIcon style={
                            {
                                color: "red",
                                fontSize: "20px"
                            }
                        } />
                    </IconButton>
                </Modal.Header>
                <Modal.Body style={
                    {
                        height: "60vh",
                        overflow: "auto",
                        backgroundColor: theme === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)"
                    }
                }>
                    {
                        follow ? (follow.map((follow) => <UserP uid={
                            follow.uid
                        }
                            key={
                                follow.uid
                            } />)) : (
                            <></>
                        )
                    } </Modal.Body>
            </Modal>
            <Modal show={show1}
                onHide={handleClose1}
                centered
                scrollable
            >
                <Modal.Header style={
                    {
                        padding: "5px 10px",
                        backgroundColor: theme === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)"
                    }
                }>
                    <Modal.Title style={
                        {
                            color: theme === "light" ? "black" : "white"
                        }
                    }>
                        <b>{
                            cfollowing.length
                        }</b>
                        &nbsp;Following
                    </Modal.Title>
                    <IconButton onClick={handleClose1}>
                        <CloseOutlinedIcon style={
                            {
                                color: "red",
                                fontSize: "20px"
                            }
                        } />
                    </IconButton>
                </Modal.Header>
                <Modal.Body style={
                    {
                        height: "60vh",
                        overflow: "auto",
                        backgroundColor: theme === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)"
                    }
                }>
                    {
                        cfollowing ? (cfollowing.map((cfollowing) => (
                            <UserP uid={
                                cfollowing.uid
                            }
                                key={
                                    cfollowing.uid
                                } />
                        ))) : (
                            <></>
                        )
                    } </Modal.Body>
            </Modal>
            <Modal show={show2}
                onHide={handleClose2}
                centered
                scrollable>
                <Modal.Body style={{
                    padding: 0,
                    backgroundColor: theme === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)"
                }}>
                    <div style={{
                        position: "relative", padding: 0
                    }}>
                        <img src={photo} style={{
                            height: "60vh", objectFit: "cover", width: "100%"
                        }} />
                        <IconButton onClick={handleClose2} style={{
                            position: "absolute", right: 0, top: 0
                        }}>
                            <CloseOutlinedIcon color="error" />
                        </IconButton>
                    </div>
                </Modal.Body>
            </Modal>
            <div className="head">
                <img className="profile__img" alt=""
                    src={photo}
                    onClick={handleShow2}
                    onError={
                        ({ currentTarget }) => {
                            currentTarget.onerror = null;
                            currentTarget.src = "https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/512x512/plain/user.png";
                        }
                    } />
                <div>
                    <div className="info_name"
                        style={
                            {
                                color: theme === "light" ? "black" : "white"
                            }
                        }>
                        {username && username.length > 15 ? username.substring(0, 12).concat('...') : username} </div>
                    <div style={{ display: "flex", marginTop: "10px" }}>
                        <Button onClick={handlefollow}
                            variant={like ? "warning" : "primary"}
                            size="sm"
                            style={
                                { width: "110px", height: "30px" }
                            }>
                            {
                                like ? (
                                    <PersonRemoveIcon />) : (
                                    <PersonAddIcon />)
                            }
                            &nbsp;{
                                like ? "Unfollow" : "follow"
                            } </Button>

                        <Button onClick={
                            () => sendMessage()
                        }
                            variant="primary"
                            size="sm"
                            style={
                                { width: "110px", marginLeft: "5px", height: "30px" }
                            }>
                            <MessageIcon fontSize="small" />&nbsp;Message
                        </Button>
                    </div>
                </div>
            </div>
            <div style={{ margin: "15px 10px" }}>
                <div style={
                    {
                        color: theme === "light" ? "black" : "white",
                        display: bio ? "block" : "none"
                    }
                }>
                    {bio} </div>
                <a href={website}
                    style={
                        {
                            color: theme === "light" ? "black" : "white",
                            display: website ? "block" : "none"
                        }
                    }
                    target="_blank">
                    {website} </a>
            </div>
            <div style={
                {
                    display: "flex",
                    justifyContent: "space-between",
                    backgroundColor: theme === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
                    padding: "5px 20px",
                    margin: "0px 5px",
                    fontSize: "small"
                }
            }>

                <div style={
                    { textAlign: "center" }
                }>
                    <a style={
                        {
                            textDecoration: "none",
                            color: theme === "light" ? "black" : "white"
                        }
                    }>
                        <strong>{postCount}</strong>
                        <div style={
                            { fontSize: "15px" }
                        }>
                            Posts
                        </div>
                    </a>
                </div>
                <div style={
                    { textAlign: "center" }
                }>
                    <a style={
                        {
                            textDecoration: "none",
                            color: theme === "light" ? "black" : "white"
                        }
                    }>
                        <strong>{videoCount}</strong>
                        <div style={
                            { fontSize: "15px" }
                        }>
                            Videos
                        </div>
                    </a>
                </div>
                <div onClick={
                    follow.length > 0 ? handleShow : null
                } style={
                    { textAlign: "center", cursor: "pointer" }
                }>
                    <a
                        style={
                            {
                                textDecoration: "none",
                                color: theme === "light" ? "black" : "white",

                            }
                        }>
                        <strong>{
                            follow.length
                        }</strong>
                        <div style={
                            { fontSize: "15px" }
                        }>
                            Followers
                        </div>
                    </a>
                </div>
                <div onClick={
                    cfollowing.length > 0 ? handleShow1 : null
                } style={
                    { textAlign: "center", cursor: "pointer" }
                }>
                    <a style={
                        {
                            textDecoration: "none",
                            color: theme === "light" ? "black" : "white",

                        }
                    }
                    >
                        <strong>{
                            cfollowing.length
                        }</strong>
                        <div style={
                            { fontSize: "15px" }
                        }>
                            Following
                        </div>
                    </a>
                </div>
            </div>
        </>
    );
}
