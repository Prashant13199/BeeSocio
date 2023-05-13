import React, { useEffect, useState, useContext } from "react";
import { database, storage, auth } from "../../firebase";
import "./style.css";
import SingleStatus from "../../components/status";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import CreateStatus from "../create-status";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { IconButton } from "@material-ui/core";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { ColorModeContext } from "../../services/ThemeContext";

export default function Status() {

  const [status1, setStatus1] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [currentPhoto, setCurrentPhoto] = useState("")
  const [following, setfollowing] = useState([]);
  const { mode } = useContext(ColorModeContext);

  useEffect(() => {
    database.ref(`/Users/${auth?.currentUser?.uid}/`).on("value", (snapshot) => {
      if (snapshot.val()) {
        setCurrentPhoto(snapshot.val().photo);
      }
    });
  }, []);

  useEffect(() => {
    database
      .ref("/Status")
      .orderByChild("timestamp")
      .on("value", (snapshot) => {
        let statusList = [];
        snapshot.forEach((snap) => {
          if (snap.val() !== null) {
            var msPerMinute = 60 * 1000;
            var msPerHour = msPerMinute * 60;
            var msPerDay = msPerHour * 24;
            var msPerMonth = msPerDay * 30;
            var elapsed = Date.now() - snap.val().timestamp;
            if (elapsed < msPerMinute) {
            } else if (elapsed < msPerHour) {
            } else if (elapsed < msPerDay) {
            } else if (elapsed < msPerMonth) {
              if (!snap.val().postuid) {
                var imageRef = storage.refFromURL(snap.val().statusImg);
                imageRef
                  .delete()
                  .then(() => {
                    console.log("Deleted");
                  })
                  .catch((e) => {
                    console.log(e);
                  });
              }
              database.ref(`/Status/${snap.key}`).remove();
            }
            statusList.push({
              id: snap.key,
              statusImg: snap.val().statusImg,
              uid: snap.val().uid,
              timestamp: snap.val().timestamp,
              photourl: snap.val().postUrl,
              postuid: snap.val().postuid,
            });
          }
        });
        statusList.reverse();
        setStatus1(statusList);
      });
  }, []);
  useEffect(() => {
    database
      .ref(`/Users/${auth?.currentUser?.uid}/following`)
      .orderByChild("timestamp")
      .on("value", (snapshot) => {
        let followList = [];
        snapshot.forEach((snap) => {
          followList.push({
            id: snap.key,
            uid: snap.val().uid,
          });
        });
        setfollowing(followList);
      });
  }, []);

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
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
            Create Status
          </Modal.Title>
          <IconButton onClick={handleClose}>
            <CloseOutlinedIcon color="error" />
          </IconButton>
        </Modal.Header>
        <Modal.Body
          style={{
            backgroundColor:
              mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
          }}
        >
          <CreateStatus handleClose={handleClose} />
        </Modal.Body>
      </Modal>
      <div className="status">
        <div onClick={handleShow} className="addStatus__btn">
          <div style={{ position: "relative" }}>
            <img
              src={currentPhoto ? currentPhoto : "https://api.dicebear.com/6.x/thumbs/png?seed=Bubba"}

              alt=""
              className={"statusadd__img"}
            />
            <AddCircleIcon className="statusaddicon" color="primary" style={{
              backgroundColor:
                mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
              borderRadius: "50%", fontSize: "20px"
            }} />
          </div>
        </div>


        {status1.map((stat) => {
          if (following.length === 0) {
            return (
              stat.uid === auth?.currentUser?.uid && (
                <SingleStatus
                  statusImg={stat.statusImg}
                  uid={stat.uid}
                  timestamp={stat.timestamp}
                  id={stat.id}
                  handleClose1={handleClose}
                  key={stat.id}
                  photourl={stat.photourl}
                  postuid={stat.postuid}
                />
              )
            );
          } else {
            for (let i = 0; i < following.length; i++) {
              if ((stat.uid === following[i].uid) | (stat.uid === auth?.currentUser?.uid)) {
                return (
                  <SingleStatus
                    statusImg={stat.statusImg}
                    uid={stat.uid}
                    timestamp={stat.timestamp}
                    id={stat.id}
                    handleClose1={handleClose}
                    key={stat.id}
                    photourl={stat.photourl}
                    postuid={stat.postuid}
                  />
                );
              }
            }
          }
        })}
        &nbsp;
      </div>

    </>
  );
}
