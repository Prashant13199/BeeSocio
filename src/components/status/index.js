import React, { useState, useEffect } from "react";
import { storage, database } from "../../firebase";
import "./style.css";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { makeid } from "../../services/makeid";
import Like from "../like";
import ReactLoading from "react-loading";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { timeDifference } from "../../services/timeDifference";
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';

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
  const [img, setImg] = useState("");
  const [currentUsername, setCurrentUsername] = useState("");
  const [username, setUsername] = useState("");
  const [postUsername, setPostUsername] = useState("");
  const [statusreply, setStatusreply] = useState(null);
  const [statusview, setStatusview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState([]);
  const [view, setView] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    addview();
  };
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  const currentuid = localStorage.getItem("uid");
  const theme = localStorage.getItem("theme");
  let like = false;

  useEffect(() => {
    database.ref(`/Users/${currentuid}/`).on("value", (snapshot) => {
      if (snapshot.val()) {
        setCurrentUsername(snapshot.val().username);
      }
    });
  }, [currentuid]);

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
      }
    });
  }, [uid]);

  const addview = () => {
    database.ref(`/Status/${id}/seen/${currentuid}`).set({
      id: currentuid,
      uid: currentuid,
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
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    database.ref(`/Status/${id}/seen`).on("value", (snapshot) => {
      snapshot.forEach((snap) => {
        if (snap.key === currentuid) {
          setView(true);
        }
      });
    });
  });
  for (let i = 0; i < likes.length; i++) {
    if (likes[i].uid === currentuid) {
      like = true;
    }
  }
  const handleStatusLike = () => {
    if (like === false) {
      var idl = makeid(10);
      database
        .ref(`/Status/${id}/likes/${id}${currentuid}`)
        .set({
          id: idl,
          uid: currentuid,
        })
        .then(() => {
          database.ref(`/Users/${uid}/activity/${id}${currentuid}`).set({
            id: id,
            text: `liked your status`,
            timestamp: Date.now(),
            uid: currentuid,
            postid: id,
            photoUrl: statusImg,
          });
          database.ref(`/Users/${uid}/notification/${id}${currentuid}`).set({
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
        .ref(`/Status/${id}/likes/${id}${currentuid}`)
        .remove()
        .then(() => {
          database.ref(`/Users/${uid}/activity/${id}${currentuid}`).remove()
          database.ref(`/Users/${uid}/notification/${id}${currentuid}`).remove()
          console.log("like removed");
          like = false;
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  useEffect(() => {
    database.ref(`/Users/${uid}`).on("value", (snapshot) => {
      setImg(snapshot.val().photo);
    });
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
        var names = [uid, currentuid];
        names.sort();
        let chatRoom = names.join("");
        database.ref(`Rooms/${chatRoom}`).set({
          name1: uid,
          name2: currentuid,
          timestamp: Date.now(),
        });
        let mmid = makeid(10);
        database.ref(`/RoomsMsg/${chatRoom}/messages/${mmid}`).set({
          message: statusreply,
          uid: currentuid,
          timestamp: Date.now(),
          statusreply: true,
          statusphoto: statusImg,
        });
        setStatusreply("");
        database.ref(`/Rooms/${chatRoom}`).update({
          timestamp: Date.now(),
        });
        database.ref(`/Users/${uid}/messages/${chatRoom}`).set({
          id: currentuid,
          text: `${currentUsername} replied to your status`,
        });
        Swal.fire({
          background:
            theme === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
          color: theme === "light" ? "black" : "white",
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
        theme === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
      color: theme === "light" ? "black" : "white",
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
            theme === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
          color: theme === "light" ? "black" : "white",
          title: "Deleted!",
          text: "Your status has been deleted.",
          icon: "success",
          timer: 800,
          showConfirmButton: false,
        });
      }
    });
  };
  return !loading ? (
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
              theme === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
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
                    src={img}
                    alt=""
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src =
                        "https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/512x512/plain/user.png";
                    }}
                    style={{ borderRadius: "50%", height: "35px", width: "35px", objectFit: "cover" }}
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
                      fontSize: "12px",
                    }}
                  >
                    {timeDifference(new Date(), new Date(timestamp))}
                  </div>
                </div>
              </div>
            </div>
            <div className="status__headerRight">
              {statusview.length !== 0 &&
                <IconButton onClick={handleShow2} style={{ display: currentuid === uid ? "block" : "none" }}>
                  <VisibilityIcon color="primary" />
                </IconButton>}
              <IconButton onClick={deletePost} style={{ display: currentuid === uid ? "block" : "none" }} >
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
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src =
                          "https://cdn.segmentnext.com/wp-content/themes/segmentnext/images/no-image-available.jpg";
                      }}
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
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src =
                        "https://cdn.segmentnext.com/wp-content/themes/segmentnext/images/no-image-available.jpg";
                    }}
                  />
                )}
              </div>
            )}
            <div className="status__username"
              style={{
                position: "absolute",
                right: 0,
                bottom: currentuid !== uid ? "50px" : 0,
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
          {currentuid !== uid && <div className="status__reply">
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
                  backgroundColor: theme === "light" ? "rgb(242, 241, 241)" : "rgb(24, 27, 30)",
                  color: theme === "light" ? "black" : "white",
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
              theme === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
          }}
        >
          <Modal.Title style={{ color: theme === "light" ? "black" : "white" }}>
            <b>{statusview.length}</b> Views&nbsp;&nbsp;<b>{likes.length !== 0 && likes.length}</b> {likes.length !== 0 && "Likes"}
          </Modal.Title>
          <IconButton onClick={handleClose2}>
            <CloseOutlinedIcon color="error" />
          </IconButton>

        </Modal.Header>
        <Modal.Body
          style={{
            backgroundColor:
              theme === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
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
      <div>
        <img
          src={img}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src =
              "https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/512x512/plain/user.png";
          }}
          alt=""
          className={view ? "status__img1" : "status__img"}
          onClick={handleShow}
        />
        <div style={{ color: theme === "light" ? "black" : "white", fontSize: "12px", textAlign: "center" }}>{username.length > 8 ? username.substring(0, 8).concat("..") : username}</div>
      </div>
    </>
  ) : (
    <div className="status__load">
      <ReactLoading
        type="spinningBubbles"
        color="#0892d0"
        height={"20px"}
        width={"20px"}
      />
    </div>
  );
}
