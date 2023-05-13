import React, { useState, useEffect, useContext } from "react";
import { database, auth } from "../../firebase";
import "./style.css";
import { makeid } from "../../services/makeid";
import { MentionsInput, Mention } from 'react-mentions'
import { Button } from "react-bootstrap";
import { ColorModeContext } from "../../services/ThemeContext";

export default function CommentReply({ id, uid, photoURL, idc, handleCloseReply }) {

  const [currentUsername, setCurrentUsername] = useState("");
  const { mode } = useContext(ColorModeContext);
  const [commentReply, setCommentReply] = useState("");
  const [items, setItems] = useState("");

  useEffect(() => {
    database.ref("/Users").on("value", (snapshot) => {
      let itemsList = [];
      snapshot.forEach((snap) => {
        if (snap.val().uid !== auth?.currentUser?.uid) {
          itemsList.push({
            id: snap.val().uid,
            display: snap.val().username,
          });
        }
      });
      setItems(itemsList);
    });
  }, []);

  useEffect(() => {
    database.ref(`/Users/${auth?.currentUser?.uid}/`).on("value", (snapshot) => {
      if (snapshot.val()) {
        setCurrentUsername(snapshot.val().username);
      }
    });
  }, []);

  let mentionedUser = "";

  const addComment = () => {
    let replyid = makeid(10);
    if (commentReply) {
      if (commentReply.trim()) {
        var commentArr = commentReply.split(" ")
        let newComment = ""
        for (let i in commentArr) {
          if (commentArr[i].includes("@")) {
            mentionedUser = commentArr[i].match(/\((.*)\)/)[1]
          } else {
            newComment = newComment + " " + commentArr[i]
          }
        }
        setCommentReply("");
        database
          .ref(`/Posts/${id}/comments/${idc}/reply/${replyid}`)
          .set({
            text: commentReply,
            uid: auth?.currentUser?.uid,
            id: idc,
            timestamp: Date.now(),
          })
          .then(() => {

            if (uid !== auth?.currentUser?.uid) {
              let idcc = makeid(10);
              database.ref(`/Users/${uid}/activity/${idcc}`).set({
                id: idcc,
                text: `replied to your comment:`,
                timestamp: Date.now(),
                postid: id,
                comment: newComment,
                uid: auth?.currentUser?.uid,
                photoUrl: photoURL,
              });
              database.ref(`/Users/${uid}/notification/${idcc}`).set({
                text: `${currentUsername} replied to your comment`,
              });
            }
            if (mentionedUser.length) {
              let idcc = makeid(10);
              database.ref(`/Users/${mentionedUser}/activity/${idcc}`).set({
                id: idcc,
                text: `mentioned you in comment:`,
                timestamp: Date.now(),
                postid: id,
                comment: newComment,
                uid: auth?.currentUser?.uid,
                photoUrl: photoURL,
              });
              database.ref(`/Users/${mentionedUser}/notification/${idcc}`).set({
                text: `${currentUsername} mentioned you in comment`,
              });
            }
            setCommentReply("");
            handleCloseReply()
          })
          .catch((e) => {
            console.log(e);
          });
        console.log("in add comment");
      } else {
        console.log("Nothing to upload");
        setCommentReply("");
        handleCloseReply()
      }
    } else {
      console.log("Nothing to upload");
      setCommentReply("");
      handleCloseReply()
    }
  };
  return (
    <div style={{ margin: "10px 0px" }}>
      <MentionsInput
        autoFocus={true}
        style={{
          '&multiLine': {
            input: {
              color: mode === "light" ? "black" : "white"
            },
          },

          '&singleLine': {
            input: {
              color: mode === "light" ? "black" : "white"
            },
          },

          suggestions: {
            list: {
              backgroundColor: 'white',
              border: '1px solid rgba(0,0,0,0.15)',
              fontSize: 16,
            },
            item: {
              padding: '3px 10px',
              borderBottom: '1px solid rgba(0,0,0,0.15)',
              '&focused': {
                backgroundColor: 'rgb(175, 218, 243)',
              },
            },
          },
        }}
        singleLine={true}
        onKeyPress={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            addComment();
          }
        }} value={commentReply} onChange={(e) => setCommentReply(e.target.value)} className="commentInput" placeholder="Reply to comment...">
        <Mention
          trigger="@"
          data={items}
        />
      </MentionsInput>
      <div>
        <Button onClick={addComment}
          variant="primary"
          size="sm"
          disabled={commentReply.length > 0 ? false : true}
          style={
            { width: "40%", height: "25px", fontSize: "12px" }
          }>
          Add Comment
        </Button>
        <Button onClick={() => {
          handleCloseReply()
          setCommentReply("")
        }}
          variant="primary"
          size="sm"
          style={
            { width: "40%", height: "25px", fontSize: "12px", marginLeft: "10px" }
          }>
          Cancel
        </Button>
      </div>
    </div>
  );
}
