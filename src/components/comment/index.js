import React, { useState, useEffect } from "react";
import "./style.css";
import { database } from "../../firebase";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Like from "../../components/like";
import { Link } from "react-router-dom";
import { timeDifference } from "../../services/timeDifference";
import { makeid } from "../../services/makeid";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { IconButton } from "@mui/material";
import CommentReply from "../comment-reply";
import CommentReplyShow from "../commentReply";

export default function Comment({
  uid,
  caption,
  id,
  idc,
  time,
  photoURL,
  postuid,
}) {

  const [showReply, setShowReply] = useState(false)
  const handleCloseReply = () => setShowReply(false);
  const handleShowReply = () => setShowReply(true);

  var commentArr = caption.split(" ")

  let like = false;

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [photo, setPhoto] = useState("");
  const [username, setUsername] = useState("");
  const [replyComment, setReplyComment] = useState([])
  const [clikes, setcLikes] = useState([]);
  const currentuid = localStorage.getItem("uid");
  const [currentUsername, setCurrentUsername] = useState("");
  const theme = localStorage.getItem("theme");
  const [superUser, setSuperUser] = useState(false)

  useEffect(() => {
    database.ref(`/Users/${currentuid}/`).on("value", (snapshot) => {
      if (snapshot.val()) {
        setCurrentUsername(snapshot.val().username);
        setSuperUser(snapshot.val().superuser);
      }
    });
  }, [currentuid]);

  useEffect(() => {
    database.ref(`/Users/${uid}`).on("value", (snapshot) => {
      setPhoto(snapshot.val().photo);
      setUsername(snapshot.val().username);
    });
  }, [uid]);

  useEffect(() => {
    database
      .ref(`/Posts/${id}/comments/${idc}/likes`)
      .on("value", (snapshot) => {
        let clikesList = [];
        snapshot.forEach((snap) => {
          clikesList.push({
            id: snap.key,
            uid: snap.val().uid,
          });
        });
        setcLikes(clikesList);
      });
  }, [id, idc]);

  useEffect(() => {
    database.ref(`/Posts/${id}/comments/${idc}/reply`).orderByChild("timestamp").on('value', snapshot => {
      let replydata = []
      snapshot.forEach((snap) => {
        replydata.push({
          id: snap.key,
          uid: snap.val().uid,
          text: snap.val().text,
          time: snap.val().timestamp
        })
      })
      replydata.reverse()
      setReplyComment(replydata)
    })
  }, [id, idc])

  const handleCommentDelete = () => {
    database
      .ref(`/Posts/${id}/comments/${idc}`)
      .remove()
      .then(() => {
        console.log("Comment Deleted");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  for (var i = 0; i < clikes.length; i++) {
    if (clikes[i].uid === currentuid) {
      like = true;
    }
  }
  const handlecLike = async () => {
    if (like === false) {
      var idl = makeid(10);
      database.ref(`/Posts/${id}/comments/${idc}/likes/${id}${currentuid}`).set({
        id: idl,
        uid: currentuid,
      })
        .then(() => {
          console.log("clike added");
        })
        .catch((e) => {
          console.log(e);
        });
      if (uid !== currentuid) {
        database.ref(`/Users/${uid}/activity/${idl}`).set({
          id: idl,
          text: `liked your comment`,
          timestamp: Date.now(),
          postid: id,
          uid: currentuid,
          photoUrl: photoURL,
        });
        database.ref(`/Users/${uid}/notification/${idl}`).set({
          text: `${currentUsername} liked your commented`,
        });
      }
    } else {
      database
        .ref(`/Posts/${id}/comments/${idc}/likes/${id}${currentuid}`)
        .remove()
        .then(() => {
          console.log("clike removed");
          like = false;
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        scrollable
      >
        <Modal.Header
          style={{
            padding: "5px 10px",
            backgroundColor:
              theme === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
          }}
        >
          <Modal.Title style={{ color: theme === "light" ? "black" : "white" }}>
            <b>{clikes.length}</b> {clikes.length > 1 ? 'Likes' : 'Like'}
          </Modal.Title>
          <IconButton onClick={handleClose}>
            <CloseOutlinedIcon color="error" />
          </IconButton>

        </Modal.Header>
        <Modal.Body
          style={{
            maxHeight: "400px",
            backgroundColor:
              theme === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
          }}
        >
          {clikes ? clikes.map((like) => <Like uid={like.uid} key={like.uid} />) : <></>}
        </Modal.Body>
      </Modal>

      <div className="comment">
        <div style={{ fontWeight: "500", marginRight: "6px" }}>
          <img
            className="comment__img"
            src={photo}
            alt=""
            onError={({ currentTarget }) => {
              currentTarget.onerror = null;
              currentTarget.src =
                "https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/512x512/plain/user.png";
            }}
          />
          <Link
            style={{
              textDecoration: "none",
              color: theme === "light" ? "black" : "white",
              fontWeight: "bold",
            }}
            to={uid === currentuid ? '/profile' : `/userprofile/${uid}`}
            activeClassName="is-active"
            exact={true}
          >
            {username && username.length > 20 ? username.substring(0, 20).concat('...') : username}
          </Link>
          {(currentuid === uid || currentuid === postuid || superUser) &&
            <span onClick={handleCommentDelete} className="comment__delete">
              Delete
            </span>
          }
        </div>
        <div className="comment_like">
          <div className="comment__likeBtn" onClick={handlecLike}>
            {like ? <FavoriteIcon sx={{ color: "red", fontSize: "15px" }} /> : <FavoriteBorderIcon sx={{ color: theme === "light" ? "black" : "white", fontSize: "15px" }} />}
          </div>
        </div>
      </div>
      <div
        style={{
          marginLeft: "25px",
          color: theme === "light" ? "black" : "white",
          wordWrap: "break-word",
          display: caption.length ? "block" : "none"
        }}
      >
        {commentArr.length !== 0 && commentArr.map((text) => {
          if (text !== null && text.includes("@")) {
            let id = ""
            let name = ""
            try {
              database.ref(`/Users/${text.match(/\((.*)\)/)[1]}`).on("value", (snapshot) => {
                id = snapshot.val().uid;
                name = snapshot.val().username;
              })
            }
            catch (e) {
              console.log(e)
            }
            return <span><Link
              style={{
                textDecoration: "none",
                color: "#1976d2",
              }}
              to={id === currentuid ? '/profile' : `/userprofile/${id}`}
              activeClassName="is-active"
              exact={true}
            >
              {name}
            </Link>&nbsp;</span>
          } else {
            return <span>{text}&nbsp;</span>
          }
        })}
      </div>
      <div className="pClike">
        <a onClick={clikes.length !== 0 && handleShow} >{clikes.length} {clikes.length > 1 ? 'Likes' : 'Like'}&nbsp;&nbsp;</a>
        {timeDifference(new Date(), new Date(time))}&nbsp;&nbsp;
        <a onClick={handleShowReply}>Reply</a>
      </div>
      {showReply && <div style={{ marginLeft: "20px" }}><CommentReply id={id} idc={idc} photoURL={photoURL} key={idc} uid={uid} handleCloseReply={handleCloseReply} /></div>}
      <div style={{ marginLeft: "20px", display: replyComment ? "block" : "none" }}>
        {replyComment && replyComment.map((data) => {
          return <CommentReplyShow
            uid={data.uid}
            caption={data.text}
            time={data.time}
            key={data.id}
            idc={idc}
            idr={data.id}
            postid={id}
            photoURL={photoURL}
            postuid={postuid}
          />
        })}
      </div>

    </>
  );
}
