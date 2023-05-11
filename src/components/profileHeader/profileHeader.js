import React, { useState, useEffect, useContext } from "react";
import "./style.css";
import { database, storage } from "../../firebase";
import { Modal } from "react-bootstrap";
import Follow from "../follow";
import Follower from "../follower";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";
import { auth } from "../../firebase";
import { Button } from "react-bootstrap";
import Compressor from "compressorjs";
import ListGroup from "react-bootstrap/ListGroup";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import SettingsIcon from '@mui/icons-material/Settings';
import { IconButton } from "@mui/material";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ColorModeContext } from "../../services/ThemeContext";

export default function ProfileHeader() {

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [show1, setShow1] = useState(false);
    const handleClose1 = () => setShow1(false);
    const handleShow1 = () => setShow1(true);
    const [show2, setShow2] = useState(false);
    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => setShow2(true);
    const [show3, setShow3] = useState(false);
    const handleClose3 = () => setShow3(false);
    const handleShow3 = () => setShow3(true);
    const [show4, setShow4] = useState(false);
    const handleClose4 = () => setShow4(false);
    const handleShow4 = () => setShow4(true);
    const [follow, setfollow] = useState([]);
    const [cfollowing, setcfollowing] = useState([]);
    const currentuid = localStorage.getItem("uid");
    const [currentusername, setCurrentUsername] = useState("");
    const [currentPhoto, setCurrentPhoto] = useState("");
    const [currentBio, setCurrentBio] = useState("");
    const [currentWebsite, setCurrentWebsite] = useState("");
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [compressedFile, setCompressedFile] = useState(null);
    const [link, setLink] = useState("");
    const { mode } = useContext(ColorModeContext);
    const [postCount, setPostCount] = useState(0);
    const [videoCount, setVideoCount] = useState(0);
    const avatarArray = ['Willow', 'Spooky', 'Bubba', 'Lily', 'Whiskers', 'Pepper', 'Tiger', 'Zoey', 'Dusty', 'Simba']

    let fileName = "";
    let history = useHistory();
    console.log(progress)

    useEffect(() => {
        AOS.init({ duration: 800 })
    }, [])

    useEffect(() => {
        database.ref(`/Users/${currentuid}/`).on("value", (snapshot) => {
            if (snapshot.val()) {
                setCurrentUsername(snapshot.val().username);
                setCurrentPhoto(snapshot.val().photo);
                setCurrentBio(snapshot.val().bio);
                setCurrentWebsite(snapshot.val().website);
            }
        });

        database.ref(`/Users/${currentuid}/followers`).on("value", (snapshot) => {
            let followList = [];
            snapshot.forEach((snap) => {
                followList.push({ id: snap.key, uid: snap.val().uid });
            })

            setfollow(followList)
        })
        database.ref(`/Users/${currentuid}/Posts`).on("value", (snapshot) => {
            setPostCount(snapshot.numChildren());
        });
        database.ref(`/Users/${currentuid}/Videos`).on("value", (snapshot) => {
            setVideoCount(snapshot.numChildren());
        });
        database.ref(`/Users/${currentuid}/following`).on("value", (snapshot) => {
            let followingList = [];
            snapshot.forEach((snap) => {
                followingList.push({ id: snap.key, uid: snap.val().uid });
            });
            setcfollowing(followingList);
        });
    }, []);

    const addBio = () => {
        Swal.fire({
            background: mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
            color: mode === "light" ? "black" : "white",
            title: currentBio ? "Edit Bio" : "Add Bio",
            input: "text",
            inputAttributes: {
                autocapitalize: "off",
                placeHolder: currentBio ? currentBio : ""
            },
            inputValue: currentBio ? currentBio : "",
            showCancelButton: true,
            showLoaderOnConfirm: true
        }).then((result) => {
            if (result.isConfirmed) {
                database.ref(`/Users/${currentuid}`).update({ bio: result.value }).then(() => {
                    Swal.fire({
                        background: mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
                        color: mode === "light" ? "black" : "white",
                        title: " Success",
                        timer: 800,
                        icon: "success",
                        text: `Bio updated`,
                        showConfirmButton: false
                    });
                }).catch((e) => {
                    Swal.fire({
                        background: mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
                        color: mode === "light" ? "black" : "white",
                        title: "Error",
                        timer: 1500,
                        icon: "error",
                        text: e,
                        showConfirmButton: false
                    });
                });
            }
        });
    };
    const addWebsite = () => {
        Swal.fire({
            background: mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
            color: mode === "light" ? "black" : "white",
            title: currentWebsite ? "Edit Website" : "Add Website",
            input: "text",
            inputAttributes: {
                autocapitalize: "off",
                placeHolder: currentWebsite ? currentWebsite : ""
            },
            inputValue: currentWebsite ? currentWebsite : "",
            showCancelButton: true,
            showLoaderOnConfirm: true
        }).then((result) => {
            if (result.isConfirmed) {
                database.ref(`/Users/${currentuid}`).update({ website: result.value }).then(() => {
                    Swal.fire({
                        background: mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
                        color: mode === "light" ? "black" : "white",
                        title: " Success",
                        timer: 800,
                        icon: "success",
                        text: `Website updated`,
                        showConfirmButton: false
                    });
                }).catch((e) => {
                    Swal.fire({
                        background: mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
                        color: mode === "light" ? "black" : "white",
                        title: "Error",
                        timer: 1500,
                        icon: "error",
                        text: e,
                        showConfirmButton: false
                    });
                });
            }
        });
    };
    const changeUsername = () => {
        Swal.fire({
            background: mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
            color: mode === "light" ? "black" : "white",
            title: "Change Username",
            input: "text",
            inputAttributes: {
                autocapitalize: "off",
                placeHolder: currentusername ? currentusername : ""
            },
            inputValue: currentusername,
            showCancelButton: true,
            showLoaderOnConfirm: true
        }).then((result) => {
            let flag = false;
            if (result.isConfirmed) {
                database.ref("/Users").on("value", (snapshot) => {
                    snapshot.forEach((snap) => {
                        if (snap.val().username === result.value.replaceAll(" ", "")) {
                            flag = true;
                        }
                    });
                });
                if (!flag) {
                    flag = false;
                    database.ref(`/Users/${currentuid}`).update({ username: result.value.replaceAll(" ", "") }).then(() => {
                        Swal.fire({
                            background: mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
                            color: mode === "light" ? "black" : "white",
                            title: "Username Changed",
                            timer: 800,
                            icon: "success",
                            text: `Username Changed to ${result.value.replaceAll(" ", "")}`,
                            showConfirmButton: false
                        });
                    }).catch((e) => {
                        Swal.fire({
                            background: mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
                            color: mode === "light" ? "black" : "white",
                            title: "Error",
                            timer: 1500,
                            icon: "error",
                            text: e,
                            showConfirmButton: false
                        });
                    });
                } else {
                    flag = false;
                    Swal.fire({
                        background: mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
                        color: mode === "light" ? "black" : "white",
                        title: "Error",
                        icon: "error",
                        text: `Username Exists!!`,
                        showConfirmButton: true
                    });
                }
            }
        });
    };
    const removePhoto = () => {
        Swal.fire({
            background: mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
            color: mode === "light" ? "black" : "white",
            title: "Are you sure to delete?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    var imageRef = storage.refFromURL(currentPhoto);
                    imageRef.delete().then(() => {
                        console.log("removed from storage");
                    }).catch((e) => {
                        console.log(e);
                    });
                } catch (e) {
                    console.log(e);
                }
                database.ref(`/Users/${currentuid}`).update({ photo: `https://api.dicebear.com/6.x/thumbs/png?seed=${avatarArray[Math.ceil(Math.random() * 10)]}` }).then(() => {
                    Swal.fire({
                        background: mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
                        color: mode === "light" ? "black" : "white",
                        title: "Success",
                        timer: 800,
                        icon: "success",
                        text: "user photo removed.",
                        showConfirmButton: false
                    });
                });
            }
        });
    };
    const handleLogout = () => {
        Swal.fire({
            background: mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
            title: "Are you sure to logout?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes! log me out",
            color: mode === "light" ? "black" : "white"
        }).then((result) => {
            if (result.isConfirmed) {
                history.push('/')
                database.ref(`/Users/${currentuid}`).update({ status: false, lastseen: Date.now() }).then(() => {
                    console.log("Status changed to offline")
                }).then(() => {
                    localStorage.clear();
                    auth.signOut().then(() => {
                        console.log("LoggedOut");
                        window.location.reload();
                    }).catch((e) => {
                        console.log(e);
                    });
                })
            }
        });
    };
    const handleLink = () => {
        if (link) {
            var selectedImageSrc = link;
            var imagePreview = document.getElementById("image-preview");
            imagePreview.src = selectedImageSrc;
            imagePreview.style.display = "block";
            setImage(link);
        }
    };
    const handleChange = (e) => {
        if (e.target.files[0] && (e.target.files[0].name.toLowerCase().includes(".jpg") || e.target.files[0].name.toLowerCase().includes(".png") || e.target.files[0].name.toLowerCase().includes(".jpeg") || e.target.files[0].name.toLowerCase().includes(".gif"))) {
            setImage(e.target.files[0]);
            var selectedImageSrc = URL.createObjectURL(e.target.files[0]);
            var imagePreview = document.getElementById("image-preview");
            imagePreview.src = selectedImageSrc;
            imagePreview.style.display = "block";
            const image = e.target.files[0];
            if (image.name.toLowerCase().includes(".jpg") || image.name.toLowerCase().includes(".png") || image.name.toLowerCase().includes(".jpeg")) {
                new Compressor(image, {
                    quality: 0.4,
                    success: (compressedResult) => {
                        setCompressedFile(compressedResult);
                    }
                });
            } else {
                setCompressedFile(image);
            }
        } else {
            Swal.fire({
                background: mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
                color: mode === "light" ? "black" : "white",
                title: "Error!",
                text: "File not supported",
                icon: "warning",
                timer: 2000,
                showConfirmButton: false
            });
        }
    };

    const handleUpload = () => {
        if (image && !link) {
            var imageName = currentuid;
            if (image.name.toLowerCase().includes(".jpg") || image.name.toLowerCase().includes(".png") || image.name.toLowerCase().includes(".jpeg")) {
                fileName = `${imageName}.jpg`;
            } else if (image.name.toLowerCase().includes(".gif")) {
                fileName = `${imageName}.gif`;
            }
            const uploadTask = storage.ref(`userphoto/${fileName}`).put(compressedFile);
            uploadTask.on("state_changed", (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgress(progress);
                document.getElementById("uploadBtn").disabled = true;
                document.getElementById("uploadBtn").innerHTML = `Uploading ${progress}`;
            }, (error) => {
                console.log(error);
            }, () => {
                storage.ref("userphoto").child(`${fileName}`).getDownloadURL().then((imageUrl) => {
                    database.ref(`/Users/${currentuid}`).update({ photo: imageUrl });
                    Swal.fire({
                        background: mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
                        color: mode === "light" ? "black" : "white",
                        title: "Success!",
                        text: "User Photo Changed",
                        icon: "success",
                        timer: 800,
                        showConfirmButton: false
                    });
                }).catch((e) => {
                    console.log(e);
                    Swal.fire({
                        background: mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
                        color: mode === "light" ? "black" : "white",
                        title: "Error!",
                        text: e,
                        icon: "error",
                        timer: 800,
                        showConfirmButton: false
                    });
                });
                setProgress(0);
                setImage(null);
                handleClose2();
                document.getElementById("image-preview").style.display = "none";
                document.getElementById("fileInputProfile").value = "";
            });
        } else if (link) {
            database.ref(`/Users/${currentuid}`).update({ photo: link }).then(() => {
                setImage(null);
                handleClose2();
                setLink("");
                document.getElementById("image-preview").style.display = "none";
                Swal.fire({
                    background: mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
                    color: mode === "light" ? "black" : "white",
                    title: "Success!",
                    text: "User Photo Changed",
                    icon: "success",
                    timer: 800,
                    showConfirmButton: false
                });
            }).catch((e) => {
                console.log(e);
                Swal.fire({
                    background: mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
                    color: mode === "light" ? "black" : "white",
                    title: "Error!",
                    text: e,
                    icon: "error",
                    timer: 800,
                    showConfirmButton: false
                });
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
                        backgroundColor: mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)"
                    }
                }>
                    <Modal.Title style={
                        {
                            color: mode === "light" ? "black" : "white"
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
                        backgroundColor: mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)"
                    }
                }>
                    {
                        follow ? (follow.map((follow) => (
                            <Follower uid={
                                follow.uid
                            }
                                key={
                                    follow.uid
                                } />
                        ))) : (
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
                        backgroundColor: mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)"
                    }
                }>
                    <Modal.Title style={
                        {
                            color: mode === "light" ? "black" : "white"
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
                        backgroundColor: mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)"
                    }
                }>
                    {
                        cfollowing ? (cfollowing.map((cfollowing) => (
                            <Follow uid={
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
                scrollable
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
                        Upload Picture
                    </Modal.Title>
                    <IconButton onClick={
                        () => {
                            setLink("");
                            setImage(null);
                            setCompressedFile(null);
                            handleClose2()
                            document.getElementById("image-preview").style.display = "none";
                        }
                    }>
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
                        backgroundColor: mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)"
                    }
                }>
                    <div className="createPost">
                        <div className="createPost__loggedIn">
                            <div className="createPost__imagePreview">
                                <img id="image-preview" alt="If not visible, try different link"
                                    style={{
                                        color: mode === "light" ? "black" : "white",
                                        height: "250px",
                                        width: "100%",
                                        marginBottom: "20px",
                                        borderRadius: "8px",
                                        objectFit: "contain",
                                    }} />
                            </div>
                            {
                                !image && (
                                    <>
                                        <center>
                                            <div className="createPost__imageUpload">
                                                <label htmlFor="fileInputProfile"
                                                    style={
                                                        { cursor: "pointer" }
                                                    }>
                                                    <AddAPhotoIcon
                                                        style={
                                                            { fontSize: "60px", color: mode === 'light' ? 'black' : 'white' }
                                                        } />
                                                </label>
                                                <input type="file" id="fileInputProfile" accept="image/*"
                                                    onChange={handleChange}></input>
                                            </div>
                                            <br />
                                            <div style={
                                                {
                                                    color: mode === "light" ? "black" : "white"
                                                }
                                            }>or</div>
                                            <br />
                                            <div className="commentInput">
                                                <input className="commentInput__textarea" placeholder="Paste image link here"
                                                    value={link}
                                                    style={
                                                        {
                                                            backgroundColor: mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
                                                            color: mode === "light" ? "#1F1B24" : "white"
                                                        }
                                                    }
                                                    onKeyPress={
                                                        (event) => {
                                                            if (event.key === "Enter") {
                                                                event.preventDefault();
                                                                handleLink();
                                                            }
                                                        }
                                                    }
                                                    onChange={
                                                        (e) => setLink(e.target.value)
                                                    }
                                                    maxLength="500"></input>
                                                <div style={
                                                    {
                                                        opacity: link ? 1 : 0.6,
                                                        cursor: link ? "pointer" : "default"
                                                    }
                                                }
                                                    className="commentInput__btn"
                                                    onClick={handleLink}>
                                                    <Button style={
                                                        {
                                                            disabled: link ? false : true,
                                                            opacity: link ? 1 : 0.5
                                                        }
                                                    }
                                                        variant="secondary"
                                                        size="sm">
                                                        OK
                                                    </Button>
                                                </div>
                                            </div>
                                        </center>
                                    </>
                                )
                            }
                            {
                                image && (
                                    <>
                                        <div className="d-grid gap-2"
                                            style={
                                                { marginTop: "10px" }
                                            }>
                                            <Button variant="primary" size="md" id="uploadBtn"
                                                onClick={handleUpload}
                                                style={
                                                    {
                                                        color: image || link ? "white" : "gray",
                                                        cursor: image || link ? "pointer" : "default"
                                                    }
                                                }>
                                                Upload
                                            </Button>
                                        </div>

                                    </>
                                )
                            } </div>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal size="sm"
                show={show3}
                onHide={handleClose3}
                centered
                scrollable
            >
                <Modal.Body style={
                    { padding: 0 }
                }>
                    <ListGroup>
                        <ListGroup.Item action
                            variant="secondary"
                            onClick={
                                () => {
                                    handleLogout();
                                }
                            }>
                            Logout
                        </ListGroup.Item>
                        <ListGroup.Item action
                            variant="success"
                            onClick={
                                () => {
                                    handleClose3();
                                    handleShow2();
                                }
                            }>
                            Change Picture
                        </ListGroup.Item>
                        <ListGroup.Item action
                            variant="danger"
                            onClick={
                                () => {
                                    handleClose3();
                                    removePhoto();
                                }
                            }>
                            Remove Picture
                        </ListGroup.Item>
                        <ListGroup.Item action
                            variant="info"
                            onClick={
                                () => {
                                    handleClose3();
                                    changeUsername();
                                }
                            }>
                            Change Username
                        </ListGroup.Item>
                        <ListGroup.Item action
                            variant="secondary"
                            onClick={
                                () => {
                                    handleClose3();
                                    addBio();
                                }
                            }>
                            {
                                currentBio ? "Edit Bio" : "Add Bio"
                            } </ListGroup.Item>
                        <ListGroup.Item action
                            variant="primary"
                            onClick={
                                () => {
                                    handleClose3();
                                    addWebsite();
                                }
                            }>
                            {
                                currentWebsite ? "Edit Website" : "Add Website"
                            } </ListGroup.Item>
                        <ListGroup.Item action
                            variant="warning"
                            onClick={
                                () => {
                                    handleClose3();
                                }
                            }>
                            Cancel
                        </ListGroup.Item>
                    </ListGroup>
                </Modal.Body>
            </Modal>
            <Modal show={show4}
                onHide={handleClose4}
                centered
                scrollable>
                <Modal.Body style={{
                    padding: 0,
                    backgroundColor: mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)"
                }}>
                    <div style={{
                        position: "relative", padding: 0
                    }}>
                        <img src={currentPhoto} style={{
                            height: "60vh", objectFit: "cover", width: "100%"
                        }} />
                        <IconButton onClick={handleClose4} style={{
                            position: "absolute", right: 0, top: 0
                        }}>
                            <CloseOutlinedIcon color="error" />
                        </IconButton>
                    </div>
                </Modal.Body>
            </Modal>

            <div className="head">
                <img data-aos="fade-down" className="profile__img"
                    style={
                        { cursor: "pointer" }
                    }
                    alt=""
                    src={currentPhoto ? currentPhoto : `https://api.dicebear.com/6.x/thumbs/png?seed=Spooky`}
                    onClick={handleShow4}
                />
                <div>
                    <div className="info_name"
                        data-aos="fade-left"
                        style={
                            {
                                color: mode === "light" ? "black" : "white"
                            }
                        }>
                        {currentusername ? currentusername.length > 15 ? currentusername.substring(0, 12).concat('...') : currentusername : 'Loading...'}
                    </div>

                    <div style={{ display: "flex", marginTop: "10px" }}>
                        <Button onClick={handleShow3}
                            variant="primary"
                            size="sm"
                            style={
                                { width: "100%", marginLeft: "5px", height: "30px" }
                            }>
                            <SettingsIcon fontSize="small" />&nbsp;Settings
                        </Button>
                    </div>
                </div>
            </div>
            <div style={{ margin: "15px 10px" }}>
                <div className="bio"
                    style={
                        {
                            color: mode === "light" ? "black" : "white",
                            display: currentBio ? "block" : "none"
                        }
                    }>
                    {currentBio} </div>
                <a href={currentWebsite}
                    className="web"
                    style={
                        {
                            color: mode === "light" ? "black" : "white",
                            display: currentWebsite ? "block" : "none"
                        }
                    }
                    target="_blank">
                    {currentWebsite} </a>
            </div>
            <div style={
                {
                    display: "flex",
                    justifyContent: "space-between",
                    backgroundColor: mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
                    padding: "5px 20px",
                    margin: "0px 5px",
                    fontSize: "small",
                    borderRadius: '10px',
                }
            }>

                <div style={
                    { textAlign: "center" }
                }>
                    <a style={
                        {
                            textDecoration: "none",
                            color: mode === "light" ? "black" : "white"
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
                            color: mode === "light" ? "black" : "white"
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
                                color: mode === "light" ? "black" : "white",

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
                            color: mode === "light" ? "black" : "white",

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
