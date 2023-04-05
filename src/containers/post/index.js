import React, { useState, useEffect } from "react";
import "./style.css";
import Comment from "../../components/comment";
import Like from "../../components/like";
import { storage, database } from "../../firebase";
import CommentInput from "../../components/comment-input";
import { Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { timeDifference } from "../../services/timeDifference";
import Users2 from "../../components/users";
import ListGroup from 'react-bootstrap/ListGroup';
import { makeid } from "../../services/makeid";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { IconButton } from "@mui/material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Group from "../../components/Group";
import $ from "jquery";
import { Waypoint } from 'react-waypoint';

export default function Post({ uid, id, photoURL, caption, timestamp, tagss, venue }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [show1, setShow1] = useState(false);
  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);
  const [show4, setShow4] = useState(false);
  const handleClose4 = () => setShow4(false);
  const handleShow4 = () => setShow4(true);
  const [show5, setShow5] = useState(false);
  const handleClose5 = () => setShow5(false);
  const handleShow5 = () => setShow5(true);
  const [users, setUsers] = useState([]);
  const [photo, setPhoto] = useState("");
  const [username, setUsername] = useState();
  const [bookmarkpost, setBookmarkpost] = useState(false);
  const [comments, setComments] = useState([]);
  const theme = localStorage.getItem("theme");
  const currentuid = localStorage.getItem("uid");
  const [currentUsername, setCurrentUsername] = useState("");
  const [currentPhoto, setCurrentPhoto] = useState("");
  const [showSuggested, setShowSuggested] = useState(false)
  const [groups, setGroups] = useState([])
  const [likes, setLikes] = useState([]);
  const [superUser, setSuperUser] = useState(false)
  let like = false;

  let handleEnterViewport = function () {
    document.getElementById('video').play()
  };
  let handleExitViewport = function () {
    document.getElementById('video').pause()
  };

  useEffect(() => {
    database.ref(`/Rooms`).on('value', snapshot => {
      let grp = []
      snapshot.forEach((snap) => {
        if (snap.val().group === true) {
          {
            snap.val().users && Object.entries(snap.val().users).map(([k, v]) => {
              if (v.id === currentuid) {
                grp.push(
                  snap.key
                )
              }
            })
          }
        }
      })
      setGroups(grp)
    })
  }, [])

  useEffect(() => {
    database.ref(`/Users/${currentuid}/saved/${id}/`).on("value", snapshot => {
      if (snapshot.val()) {
        setBookmarkpost(true)
      } else {
        setBookmarkpost(false)
      }
    })
  }, [currentuid, id])

  useEffect(() => {
    database.ref(`/Users/${currentuid}/following`).orderByChild("timestamp").on("value", (snapshot) => {
      let followList = [];
      snapshot.forEach((snap) => {
        followList.push(snap.val().uid);
      });
      if (followList.includes(uid) || currentuid === uid) {
        setShowSuggested(false)
      } else {
        setShowSuggested(true)
      }
    });
  }, [currentuid]);

  useEffect(() => {
    database
      .ref("/Users")
      .orderByChild("timestamp")
      .on("value", (snapshot) => {
        let userList = [];
        snapshot.forEach((snap) => {
          userList.push({
            id: snap.key,
            uid: snap.val().uid,
            photo: snap.val().photo,
            followers: snap.val().followers,
            name: snap.val().username,
          });
        });
        userList.reverse();
        setUsers(userList);
      });
  }, []);

  useEffect(() => {
    database
      .ref(`/Posts/${id}/comments`)
      .orderByChild("timestamp")
      .on("value", (snapshot) => {
        let commentList = [];
        snapshot.forEach((snap) => {
          commentList.push({
            id: snap.key,
            uid: snap.val().uid,
            text: snap.val().text,
            time: snap.val().timestamp,
          });
        });
        commentList.reverse();
        setComments(commentList);
      });
  }, [id]);

  useEffect(() => {
    database.ref(`/Users/${currentuid}/`).on("value", (snapshot) => {
      if (snapshot.val()) {
        setCurrentUsername(snapshot.val().username);
        setCurrentPhoto(snapshot.val().photo);
        setSuperUser(snapshot.val().superuser);
      }
    });
  }, [currentuid]);

  useEffect(() => {
    database.ref(`/Users/${uid}/`).on("value", (snapshot) => {
      if (snapshot.val()) {
        setUsername(snapshot.val().username);
        setPhoto(snapshot.val().photo);
      }
    });
  }, [uid]);

  const handlebookmark = () => {
    if (bookmarkpost) {
      database.ref(`/Users/${currentuid}/saved/${id}`).remove()
    } else {
      database.ref(`/Users/${currentuid}/saved/${id}`).set({
        id: id,
        photoUrl: photoURL,
        timestamp: Date.now(),
      }).then(() => {
        console.log("post saved")
      })
    }
  }

  useEffect(() => {
    database
      .ref(`/Posts/${id}/likes`)
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

  for (var i = 0; i < likes.length; i++) {
    if (likes[i].uid === currentuid) {
      like = true;
    }
  }

  const handleLike = () => {
    if (!like) {
      var idl = makeid(10);
      database
        .ref(`/Posts/${id}/likes/${id}${currentuid}`)
        .set({
          id: idl,
          uid: currentuid,
        })
        .then(() => {
          console.log("like added");
        })
        .catch((e) => {
          console.log(e);
        });
      if (uid !== currentuid) {
        database.ref(`/Users/${uid}/activity/${id}`).set({
          id: id,
          text:
            likes.length === 0
              ? `liked your post`
              : ` and ${likes.length} others liked your post`,
          timestamp: Date.now(),
          postid: id,
          uid: currentuid,
          photoUrl: photoURL,
        });
        database.ref(`/Users/${uid}/notification/${id}`).set({
          id: id,
          text:
            likes.length === 0
              ? `${currentUsername} liked your post`
              : `${currentUsername} and ${likes.length} others liked your post`,
          timestamp: Date.now(),
        });
      }
    } else {
      database
        .ref(`/Posts/${id}/likes/${id}${currentuid}`)
        .remove()
        .then(() => {
          console.log("like removed");
          like = false;
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const handleLikeOnly = () => {
    if (!like) {
      var idl = makeid(10);
      database
        .ref(`/Posts/${id}/likes/${id}${currentuid}`)
        .set({
          id: idl,
          uid: currentuid,
        })
        .then(() => {
          console.log("like added");
        })
        .catch((e) => {
          console.log(e);
        });
      if (uid !== currentuid) {
        database.ref(`/Users/${uid}/activity/${id}`).set({
          id: id,
          text:
            likes.length === 0
              ? `liked your post`
              : ` and ${likes.length} others liked your post`,
          timestamp: Date.now(),
          postid: id,
          uid: currentuid,
          photoUrl: photoURL,
        });
        database.ref(`/Users/${uid}/notification/${id}`).set({
          id: id,
          text:
            likes.length === 0
              ? `${currentUsername} liked your post`
              : `${currentUsername} and ${likes.length} others liked your post`,
          timestamp: Date.now(),
        });
      }
    }
  };

  const deletePost = async () => {
    handleClose5();
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
        try {
          var imageRef = storage.refFromURL(photoURL);

          imageRef
            .delete()
            .then(() => {
              console.log("Deleted");
            })
            .catch((e) => {
              console.log(e);
            });
        } catch (e) {
          console.log(e);
        }
        if (photoURL.includes('mp4')) {
          database
            .ref(`/Users/${currentuid}/Videos/${id}`)
            .remove()
            .then(() => {
              console.log("Deleted");
            })
            .catch((e) => {
              console.log(e);
            });
        } else {
          database
            .ref(`/Users/${currentuid}/Posts/${id}`)
            .remove()
            .then(() => {
              console.log("Deleted");
            })
            .catch((e) => {
              console.log(e);
            });
        }

        database
          .ref(`/Posts/${id}`)
          .remove()
          .then(() => {
            console.log("Deleted");
          })
          .catch((e) => {
            console.log(e);
          });
        Swal.fire({
          background:
            theme === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
          color: theme === "light" ? "black" : "white",
          title: "Deleted!",
          text: "Your post has been deleted.",
          icon: "success",
          timer: 800,
          showConfirmButton: false,
        });
      }
    });
  };

  const addStatus = () => {
    let statusid = makeid(10);
    database
      .ref(`/Status/${statusid}`)
      .set({
        timestamp: Date.now(),
        statusImg: photoURL,
        uid: currentuid,
        postUrl: id,
        postuid: uid,
      })
      .then(() => {
        Swal.fire({
          background:
            theme === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
          color: theme === "light" ? "black" : "white",
          title: "Added to status!",
          icon: "success",
          timer: 800,
          showConfirmButton: false,
        });
        handleClose2();
      });
  };

  const handleOnSelect = (item) => {
    Swal.fire({
      background:
        theme === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
      color: theme === "light" ? "black" : "white",
      title: "You are sending post to",
      text: `${item.name.toLowerCase()}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, send",
    }).then((result) => {
      if (result.isConfirmed) {
        var names = [item.uid, currentuid];
        names.sort();
        let chatRoom = names.join("");
        database.ref(`/Rooms/${chatRoom}`).set({
          name1: item.uid,
          name2: currentuid,
          timestamp: Date.now(),
        });
        let mid = makeid(10);
        database.ref(`/RoomsMsg/${chatRoom}/messages/${mid}`).set({
          post: photoURL,
          uid: currentuid,
          timestamp: Date.now(),
          postid: id,
          postuid: uid,
        });
        database.ref(`/Rooms/${chatRoom}`).update({ timestamp: Date.now() });
        database
          .ref(`/Users/${item.uid}/messages/${currentuid}`)
          .set({
            id: currentuid,
            text: `${currentUsername} sent you a post`,
          })
          .then(() => {
            Swal.fire({
              background:
                theme === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
              color: theme === "light" ? "black" : "white",
              title: "Sent!",
              text: `Post sent to ${item.name}`,
              icon: "success",
              timer: 800,
              showConfirmButton: false,
            });
          });
      }
    });
  };

  const formatResult = (item) => {
    return item;
  };

  const handleOnSearch = (string, results) => {
    console.log(string, results);
  };

  const handleClear = () => { };

  const copyToClipboard = () => {
    var $temp = $("<input>");
    $("body").append($temp);
    let element = `https://beesocio.netlify.app/singlefeed/${id}`
    $temp.val(element).select();
    document.execCommand("copy");
    $temp.remove();
    Swal.fire({
      background:
        theme === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
      color: theme === "light" ? "black" : "white",
      title: "Success!",
      text: "Copied to clipboard",
      icon: "success",
      timer: 800,
      showConfirmButton: false,
    });
    handleClose2();
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
            <b>{likes.length}</b> {likes.length>1 ? 'Likes':'Like'}
          </Modal.Title>
          <IconButton onClick={handleClose}>
            <CloseOutlinedIcon color="error" />
          </IconButton>
        </Modal.Header>
        <Modal.Body
          style={{
            height: '60vh',
            overflow: 'auto',
            backgroundColor:
              theme === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
          }}
        >
          {likes ? (
            likes.map((like) => <Like uid={like.uid} key={like.uid} />)
          ) : (
            <></>
          )}
        </Modal.Body>
      </Modal>
      <Modal
        show={show1}
        onHide={handleClose1}
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
            <b>{comments.length}</b> {comments.length > 1 ? 'Comments' : 'Comment'}
          </Modal.Title>
          <IconButton onClick={handleClose1}>
            <CloseOutlinedIcon color="error" />
          </IconButton>
        </Modal.Header>
        <Modal.Body
          style={{
            height: '60vh',
            backgroundColor:
              theme === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
          }}
        >
          <div style={{ height: "45vh", overflow: "auto" }}>
            {comments && (
              comments.map((comment) => (
                <Comment
                  uid={comment.uid}
                  caption={comment.text}
                  id={id}
                  idc={comment.id}
                  time={comment.time}
                  postusername={username}
                  key={comment.id}
                  postuid={uid}
                  photoURL={photoURL}
                />
              ))
            )}
          </div>

          <CommentInput
            id={id}
            comments={comments}
            uid={uid}
            photoURL={photoURL}
          />
        </Modal.Body>
      </Modal>
      <Modal
        show={show4}
        onHide={handleClose4}
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
            <b>{tagss && tagss.length}</b> Tags
          </Modal.Title>
          <IconButton onClick={handleClose4}>
            <CloseOutlinedIcon color="error" />
          </IconButton>
        </Modal.Header>
        <Modal.Body
          style={{
            height: '60vh',
            overflow: 'auto',
            backgroundColor:
              theme === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
          }}
        >
          {tagss ? tagss.map((tag) => <Like uid={tag} key={tag} />) : <></>}
        </Modal.Body>
      </Modal>
      <Modal
        show={show2}
        onHide={handleClose2}
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
            Share To
          </Modal.Title>
          <IconButton onClick={handleClose2}>
            <CloseOutlinedIcon color="error" />
          </IconButton>
        </Modal.Header>
        <Modal.Body
          style={{
            height: "60vh",
            overflowY: "auto",
            backgroundColor:
              theme === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
          }}
        >
          <ReactSearchAutocomplete
            items={users}
            onSearch={handleOnSearch}
            onSelect={handleOnSelect}
            onClear={handleClear}
            formatResult={formatResult}
            placeholder="Search user"
            styling={{
              backgroundColor: theme === "light" ? "white" : "black",
              placeholderColor: "gray",
              color: theme === "light" ? "black" : "white",
              hoverBackgroundColor:
                theme === "light" ? "lightblue" : "rgb(21, 64, 89)",
              height: "35px",
              borderRadius: "10px",
              border: "none",
            }}
          />
          <Button onClick={() => copyToClipboard()} size="sm" style={{ width: "100%", height: "30px", margin: "10px 0px" }} variant="primary">
            Copy Post URL
          </Button>
          <div style={{ margin: "10px 0px", display: "flex", justifyContent: "space-between" }}>
            <div>
              <img
                className="like__img"
                src={currentPhoto}
                alt=""
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null;
                  currentTarget.src =
                    "https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/512x512/plain/user.png";
                }}
              />
              <a
                className="users2__a"

                style={{ color: theme === "light" ? "black" : "white" }}
              >
                {currentUsername && currentUsername.length > 15 ? currentUsername.substring(0, 15).concat('...') : currentUsername}
              </a>
            </div>
            <div>
              <Button
                onClick={addStatus}
                style={{
                  borderRadius: "8px",
                  width: "110px",
                }}
                variant="primary"
                size="sm"
              >
                Add to status
              </Button>
            </div>
          </div>
          {groups && groups.map((group) => {
            return <Group id={group} key={group} postUrl={photoURL} postuid={uid} postid={id} />
          })}
          {users &&
            users.map((user) =>
              user.uid !== currentuid ? (
                <Users2
                  uid={user.uid}
                  key={user.uid}
                  postUrl={photoURL}
                  postuid={uid}
                  postid={id}
                />
              ) : (
                <></>
              )
            )}
        </Modal.Body>
      </Modal>
      <Modal
        size="sm"
        show={show5}
        onHide={handleClose5}
        centered
        scrollable
      >
        <Modal.Body
          style={{
            padding: 0,
          }}
        >
          <ListGroup>
            {(currentuid === uid || superUser) && (
              <ListGroup.Item
                variant="danger"
                action
                onClick={() => {
                  deletePost();
                }}
              >
                Delete
              </ListGroup.Item>
            )}
            {tagss && tagss.length !== 0 && (
              <ListGroup.Item
                variant="success"
                action
                onClick={() => {
                  handleClose5();
                  handleShow4();
                }}
              >
                tags
              </ListGroup.Item>
            )}
            <ListGroup.Item
              variant="warning"
              action
              onClick={() => {
                handleClose5();
              }}
            >
              Cancel
            </ListGroup.Item>
          </ListGroup>
        </Modal.Body>
      </Modal>
      <div className="post" style={{
        borderBottom: `1px solid ${theme==='light' ? 'rgb(242, 241, 241)' : 'rgb(24, 27, 30)'}`, paddingBottom: '10px'
      }}>
        <div className="post__header">
          <div className="post__headerLeft">
            <Link
              style={{
                textDecoration: "none",
                color: theme === "light" ? "black" : "white",
                fontWeight: "bold",
              }}
              to={uid !== currentuid ? `/userprofile/${uid}` : '/profile'}
              activeClassName="is-active"
              exact={true}
            >
              <img
                className="post__profilePic"
                alt=""
                src={photo}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null;
                  currentTarget.src =
                    "https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/512x512/plain/user.png";
                }}
              />
            </Link>
            <div style={{ marginLeft: "10px" }}>
              <Link
                style={{
                  textDecoration: "none",
                  color: theme === "light" ? "black" : "white",
                  fontWeight: "bold",
                }}
                to={uid !== currentuid ? `/userprofile/${uid}` : '/profile'}
                activeClassName="is-active"
                exact={true}
              >
                {username && username.length > 20 ? username.substring(0, 20).concat('...') : username}
              </Link>
              <div style={{display: 'flex'}}>
              <div
                style={{
                  color: "grey",
                  fontSize: "12px",
                }}
              >
                {timeDifference(new Date(), new Date(timestamp))}
              </div>
              <div
                style={{
                  color: "grey",
                  fontSize: "12px",
                  display: venue ? "block" : "none"
                }}
              >
              &nbsp;&#183; {venue}
              </div>
              </div>
            </div>
            <div style={{ display: showSuggested ? "block" : "none", color: theme === "light" ? "black" : "white", marginLeft: "20px" }}>&bull; suggested</div>
          </div>

          {(uid === currentuid || tagss || superUser) && (
            <div>
              <div className="post__delete" onClick={handleShow5}>
                <IconButton>
                  <MoreHorizIcon style={{ color: theme === 'light' ? 'black' : 'white' }} />
                </IconButton>
              </div>
            </div>
          )}
        </div>
        <div
          className="photoContainer"
          onDoubleClick={handleLikeOnly}
          style={{ textAlign: "center" }}
        >
          {photoURL && photoURL.includes(".mp4") ? (
            <Waypoint onEnter={handleEnterViewport} onLeave={handleExitViewport}>
              <video
                className="post__photoUrl"
                controls
                autoPlay
                muted
                id="video"
                preload="metadata"
                webkit-playsinline="true"
                playsinline="true"
              >
                <source src={`${photoURL}#t=0.2`} type="video/mp4" />
              </video>
            </Waypoint>
          ) : (
            <img
              className="post__photoUrl"
              alt=""
              src={photoURL}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src =
                  "https://cdn.segmentnext.com/wp-content/themes/segmentnext/images/no-image-available.jpg";
              }}
            />
          )}
        </div>
        <div className="post__likecomment">
          <div className="post_like">
            <div className="post__likeBtn" onClick={handleLike}>
              <IconButton>
                {like ? <FavoriteIcon sx={{ color: "red" }} /> : <FavoriteBorderIcon style={{ color: theme === 'light' ? 'black' : 'white' }} />}
              </IconButton>
            </div>
            <div className="post__showpost" onClick={handleShow1}>
              <IconButton>
                <InsertCommentIcon style={{ color: theme === 'light' ? 'black' : 'white' }} />
              </IconButton>
            </div>
            <div className="post__share" onClick={handleShow2}>
              <IconButton>
                <ShareOutlinedIcon style={{ color: theme === 'light' ? 'black' : 'white' }} />
              </IconButton>
            </div>

          </div>
          <div className="post_like">
            <div className="post__bookmark" onClick={handlebookmark} style={{ backgroundColor: "transparent" }}>
              <IconButton>
                {bookmarkpost ? <BookmarkIcon style={{ color: theme === 'light' ? 'black' : 'white' }} /> : <BookmarkBorderOutlinedIcon style={{ color: theme === 'light' ? 'black' : 'white' }} />}
              </IconButton>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", marginLeft: "10px" }}>
          <div style={{ fontSize: "medium", display: likes.length ? "block" : "none" }}>
            <a
              onClick={handleShow}
              style={{
                cursor: "pointer",
                color: theme === "light" ? "black" : "white",
              }}
            >
              <b>{likes.length}</b> {likes.length > 1 ? 'Likes' : 'Like'}
            </a>
          </div>
          <div style={{ fontSize: "medium", display: comments.length ? "block" : "none", marginLeft: likes.length ? "10px" : "0px" }}>
            <a
              onClick={handleShow1}
              style={{
                cursor: "pointer",
                color: theme === "light" ? "black" : "white",
              }}
            >
              <b>{comments.length}</b> {comments.length>1 ? 'Comments' : 'Comment'}
            </a>
          </div>
        </div>
        <div
          className="post__caption"
          style={{ color: theme === "light" ? "black" : "white", display: caption ? "block" : "none" }}
        >
          <Link
            style={{
              textDecoration: "none",
              color: theme === "light" ? "black" : "white",
              fontWeight: "bold",
            }}
            to={uid !== currentuid ? `/userprofile/${uid}` : '/profile'}
            activeClassName="is-active"
            exact={true}
          >
            {username && username.length > 20 ? username.substring(0, 20).concat('...') : username}
          </Link>&nbsp;
          {caption}
        </div>
      </div>
    </>
  );
}
