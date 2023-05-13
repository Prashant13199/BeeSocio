import React, { useState, useEffect, useContext } from "react";
import { storage, database, auth } from "../../firebase";
import "./style.css";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { makeid } from "../../services/makeid";
import Like from "../like";
import loadingIcon from '../../assets/loading.gif'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { timeDifference } from "../../services/timeDifference";
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ColorModeContext } from "../../services/ThemeContext";

export default function SingleStatus({
  statusImg,
  uid,
  timestamp,
  id,
  handleClose1,
  photourl,
  postuid,
}) {

  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [currentUsername, setCurrentUsername] = useState("");
  const [username, setUsername] = useState("");
  const [photo, setPhoto] = useState("");
  const [postUsername, setPostUsername] = useState("");
  const [statusreply, setStatusreply] = useState(null);
  const [statusview, setStatusview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState([]);
  const [view, setView] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800 })
  }, [])

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    addview();
  };
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);
  const { mode } = useContext(ColorModeContext);
  let like = false;

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, [])

  useEffect(() => {
    database.ref(`/Users/${auth?.currentUser?.uid}/`).on("value", (snapshot) => {
      if (snapshot.val()) {
        setCurrentUsername(snapshot.val().username);
      }
    });
  }, []);

  useEffect(() => {
    database.ref(`/Users/${postuid}/`).on("value", (snapshot) => {
      if (snapshot.val()) {
        setPostUsername(snapshot.val().username);
      }
    });
  }, [postuid]);

  useEffect(() => {
    database.ref(`/Users/${uid}/`).on("value", (snapshot) => {
      if (snapshot.val()) {
        setUsername(snapshot.val().username);
        setPhoto(snapshot.val().photo)
      }
    });
  }, [uid]);

  const addview = () => {
    database.ref(`/Status/${id}/seen/${auth?.currentUser?.uid}`).set({
      id: auth?.currentUser?.uid,
      uid: auth?.currentUser?.uid,
    });
    setView(true);
  };
  useEffect(() => {
    database
      .ref(`/Status/${id}/likes`)
      .orderByChild("timestamp")
      .on("value", (snapshot) => {
        let likeList = [];
        snapshot.forEach((snap) => {
          likeList.push({
            id: snap.key,
            uid: snap.val().uid,
          });
        });
        likeList.reverse();
        setLikes(likeList);
      });
  }, [id]);

  useEffect(() => {
    database.ref(`/Status/${id}/seen`).on("value", (snapshot) => {
      snapshot.forEach((snap) => {
        if (snap.key === auth?.currentUser?.uid) {
          setView(true);
        }
      });
    });
  });
  for (let i = 0; i < likes.length; i++) {
    if (likes[i].uid === auth?.currentUser?.uid) {
      like = true;
    }
  }
  const handleStatusLike = () => {
    if (like === false) {
      var idl = makeid(10);
      database
        .ref(`/Status/${id}/likes/${id}${auth?.currentUser?.uid}`)
        .set({
          id: idl,
          uid: auth?.currentUser?.uid,
        })
        .then(() => {
          database.ref(`/Users/${uid}/activity/${id}${auth?.currentUser?.uid}`).set({
            id: id,
            text: `liked your status`,
            timestamp: Date.now(),
            uid: auth?.currentUser?.uid,
            postid: id,
            photoUrl: statusImg,
          });
          database.ref(`/Users/${uid}/notification/${id}${auth?.currentUser?.uid}`).set({
            id: id,
            text: `${currentUsername} liked your status`,
            timestamp: Date.now(),
          });
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      database
        .ref(`/Status/${id}/likes/${id}${auth?.currentUser?.uid}`)
        .remove()
        .then(() => {
          database.ref(`/Users/${uid}/activity/${id}${auth?.currentUser?.uid}`).remove()
          database.ref(`/Users/${uid}/notification/${id}${auth?.currentUser?.uid}`).remove()
          console.log("like removed");
          like = false;
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  useEffect(() => {
    database
      .ref(`/Status/${id}/seen`)
      .orderByChild("timestamp")
      .on("value", (snapshot) => {
        let sview = [];
        snapshot.forEach((snap) => {
          sview.push({
            id: snap.key,
            uid: snap.val().uid,
          });
        });
        sview.reverse();
        setStatusview(sview);
      });
  }, [id, uid]);

  const addmsgreply = () => {
    if (statusreply !== null) {
      if (statusreply.trim()) {
        var names = [uid, auth?.currentUser?.uid];
        names.sort();
        let chatRoom = names.join("");
        database.ref(`Rooms/${chatRoom}`).set({
          name1: uid,
          name2: auth?.currentUser?.uid,
          timestamp: Date.now(),
        });
        let mmid = makeid(10);
        database.ref(`/RoomsMsg/${chatRoom}/messages/${mmid}`).set({
          message: statusreply,
          uid: auth?.currentUser?.uid,
          timestamp: Date.now(),
          statusreply: true,
          statusphoto: statusImg,
        });
        setStatusreply("");
        database.ref(`/Rooms/${chatRoom}`).update({
          timestamp: Date.now(),
        });
        database.ref(`/Users/${uid}/messages/${chatRoom}`).set({
          id: auth?.currentUser?.uid,
          text: `${currentUsername} replied to your status`,
        });
        Swal.fire({
          background:
            mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
          color: mode === "light" ? "black" : "white",
          title: "Replied to status",
          icon: "success",
          timer: 800,
          showConfirmButton: false,
        });
      } else {
        setStatusreply("");
      }
    } else {
      setStatusreply("");
    }
  };
  const deletePost = () => {
    Swal.fire({
      background:
        mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
      color: mode === "light" ? "black" : "white",
      title: "Are you sure to delete?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleClose1();
        try {
          if (!postuid) {
            var imageRef = storage.refFromURL(statusImg);
            imageRef.delete()
              .then(() => {
                console.log("Deleted from storage");
              })
              .catch((e) => {
                console.log(e);
              });
          }
        } catch (e) {
          console.log(e);
        }

        database
          .ref(`/Status/${id}`)
          .remove()
          .then(() => {
            console.log("Deleted from database");
          })
          .catch((e) => {
            console.log(e);
          });
        Swal.fire({
          background:
            mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
          color: mode === "light" ? "black" : "white",
          title: "Deleted!",
          text: "Your status has been deleted.",
          icon: "success",
          timer: 800,
          showConfirmButton: false,
        });
      }
    });
  };
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        size="md"
        style={{
          padding: 0,
        }}
      >
        <Modal.Body
          style={{
            padding: 0,
            backgroundColor:
              mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
          }}
        >
          <div className="container">
            <div className="status__headerLeft">
              <div style={{ display: "flex" }}>
                <Link
                  to={username === currentUsername ? "/profile" : `/userprofile/${uid}`}
                  activeClassName="is-active"
                  exact={true}
                >
                  <img
                    src={photo}
                    alt=""

                    style={{ borderRadius: "10px", height: "35px", width: "35px", objectFit: "cover" }}
                  />
                </Link>
                <div style={{ marginLeft: "10px" }}>
                  <Link
                    style={{
                      textDecoration: "none",
                      color: "white",
                      fontWeight: "bold",
                    }}
                    to={username === currentUsername ? "/profile" : `/userprofile/${uid}`}
                    activeClassName="is-active"
                    exact={true}
                  >
                    {username}
                  </Link>
                  <div
                    style={{
                      color: "white",
                      fontSize: "10px",
                    }}
                  >
                    {timeDifference(new Date(), new Date(timestamp))}
                  </div>
                </div>
              </div>
            </div>
            <div className="status__headerRight">
              {statusview.length !== 0 &&
                <IconButton onClick={handleShow2} style={{ display: auth?.currentUser?.uid === uid ? "block" : "none" }}>
                  <VisibilityIcon color="primary" />
                </IconButton>}
              <IconButton onClick={deletePost} style={{ display: auth?.currentUser?.uid === uid ? "block" : "none" }} >
                <DeleteIcon color="primary" />
              </IconButton>
              <IconButton onClick={handleClose}>
                <CloseOutlinedIcon color="error" />
              </IconButton>
            </div>
            {postuid && (
              <Link to={`/singlefeed/${photourl}`} exact={true}>
                {statusImg && statusImg.includes(".mp4") && (
                  <video
                    className="status__photoUrl"
                    controls
                    preload="metadata"
                    webkit-playsinline="true"
                    playsinline="true"
                  >
                    <source src={`${statusImg}#t=0.2`} type="video/mp4" />
                  </video>
                )}
                {statusImg &&
                  !statusImg.includes(".mp4") && (
                    <img
                      className="status__photoUrl"
                      alt=""
                      src={statusImg}

                    />
                  )}
              </Link>
            )}
            {!postuid && (
              <div>
                {statusImg && statusImg.includes(".mp4") ? (
                  <video
                    className="status__photoUrl"
                    controls
                    preload="metadata"
                    webkit-playsinline="true"
                    playsinline="true"
                  >
                    <source src={`${statusImg}#t=0.2`} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    effect="blur"
                    className="status__photoUrl"
                    alt=""
                    src={statusImg}

                  />
                )}
              </div>
            )}
            <div className="status__username"
              style={{
                position: "absolute",
                right: 0,
                bottom: auth?.currentUser?.uid !== uid ? "50px" : 0,
                backgroundColor: "rgba(0, 0, 0, 0.3)"
              }}
            >
              <Link
                style={{
                  textDecoration: "none",
                  color: "white",
                  fontWeight: "550",
                  display: postuid ? "flex" : "none",
                  margin: "5px"
                }}
                to={`/userprofile/${postuid}`}
                activeClassName="is-active"
                exact={true}
              >
                {"@"}
                {postUsername}
              </Link>
            </div>
          </div>
          {auth?.currentUser?.uid !== uid && <div className="status__reply">
            <div style={{ display: "flex", alignItems: "center" }}>
              <div className="status__likeBtn" onClick={handleStatusLike}>
                {like ? <FavoriteIcon sx={{ color: "red" }} /> : <FavoriteBorderIcon color="primary" />}
              </div>
            </div>
            <div className="status__commentInput">
              <input
                className="status__commentInput__textarea"
                placeholder="Reply to status"
                value={statusreply}
                onChange={(e) => setStatusreply(e.target.value)}
                maxLength="500"
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addmsgreply();
                  }
                }}
                style={{
                  backgroundColor: mode === "light" ? "rgb(242, 241, 241)" : "rgb(24, 27, 30)",
                  color: mode === "light" ? "black" : "white",
                }}
              ></input>
            </div>
            <IconButton onClick={addmsgreply}>
              <SendOutlinedIcon color="primary" />
            </IconButton>
          </div>}
        </Modal.Body>
      </Modal>
      <Modal
        show={show2}
        onHide={handleClose2}
        centered
      >
        <Modal.Header
          style={{
            padding: "5px 10px",
            backgroundColor:
              mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
          }}
        >
          <Modal.Title style={{ color: mode === "light" ? "black" : "white" }}>
            <b>{statusview.length}</b> Views&nbsp;&nbsp;<b>{likes.length !== 0 && likes.length}</b> {likes.length !== 0 && "Likes"}
          </Modal.Title>
          <IconButton onClick={handleClose2}>
            <CloseOutlinedIcon color="error" />
          </IconButton>

        </Modal.Header>
        <Modal.Body
          style={{
            backgroundColor:
              mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
          }}
        >
          {statusview &&
            statusview.map(({ uid }) => {
              return (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Like uid={uid} key={uid} />
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {likes.map((like) => {
                      if (like.uid === uid) {
                        return <FavoriteIcon sx={{ color: "red", fontSize: "15px" }} />
                      }
                    })}
                  </div>
                </div>
              );
            })}
        </Modal.Body>
      </Modal>
      <div style={{ marginRight: '5px' }} data-aos="fade-down">
        {!loading ? <div style={{ position: 'relative' }}>
          <img
            src={statusImg}
            alt=""
            className={view ? "status__img1" : "status__img"}
            onClick={handleShow}
          />
          <img
            src={photo}

            alt=""
            style={{
              position: 'absolute', right: '5px', bottom: '5px', height: '20px', width: '20px', borderRadius: '5px'
            }}
            onClick={handleShow}
          />
        </div> : <div className="status__load">
          <img src={loadingIcon} height={'20px'} width={'20px'} />
        </div>}
      </div>
    </>
  )
}
