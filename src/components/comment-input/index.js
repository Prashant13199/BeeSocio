import React, { useState, useEffect } from "react";
import { database } from "../../firebase";
import "./style.css";
import { makeid } from "../../services/makeid";
import { MentionsInput, Mention } from 'react-mentions'
import { Button } from "react-bootstrap";

export default function CommentInput({ id, uid, photoURL }) {

  const currentuid = localStorage.getItem("uid");
  const theme = localStorage.getItem("theme")
  const [currentUsername, setCurrentUsername] = useState("");
  const [items, setItems] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    database.ref("/Users").on("value", (snapshot) => {
      let itemsList = [];
      snapshot.forEach((snap) => {
        if (snap.val().uid !== currentuid) {
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
    database.ref(`/Users/${currentuid}/`).on("value", (snapshot) => {
      if (snapshot.val()) {
        setCurrentUsername(snapshot.val().username);
      }
    });
  }, []);

  let mentionedUser = "";

  const addComment = () => {
    var idc = makeid(10);
    if (comment) {
      if (comment.trim()) {
        var commentArr = comment.split(" ")
        let newComment = ""
        for (let i in commentArr) {
          if (commentArr[i].includes("@")) {
            mentionedUser = commentArr[i].match(/\((.*)\)/)[1]
          } else {
            newComment = newComment + " " + commentArr[i]
          }
        }
        setComment("");
        database
          .ref(`/Posts/${id}/comments/${idc}`)
          .set({
            text: comment,
            uid: currentuid,
            id: idc,
            timestamp: Date.now(),
          })
          .then(() => {
            setComment("");
            if (uid !== currentuid) {
              let idcc = makeid(10);
              database.ref(`/Users/${uid}/activity/${idcc}`).set({
                id: idcc,
                text: `commented:`,
                timestamp: Date.now(),
                postid: id,
                comment: newComment,
                uid: currentuid,
                photoUrl: photoURL,
              });
              database.ref(`/Users/${uid}/notification/${idcc}`).set({
                text: `${currentUsername} commented on your post`,
              });
            }
            if (mentionedUser.length) {
              let idcc = makeid(10);
              database.ref(`/Users/${mentionedUser}/activity/${idcc}`).set({
                id: idcc,
                text: `mentioned you in comment:`,
                timestamp: Date.now(),
                postid: id,
                uid: currentuid,
                photoUrl: photoURL,
                comment: newComment,
              });
              database.ref(`/Users/${mentionedUser}/notification/${idcc}`).set({
                text: `${currentUsername} mentioned you in comment`,
              });
            }
          })
          .catch((e) => {
            console.log(e);
          });
        console.log("in add comment");
      } else {
        console.log("Nothing to upload");
        setComment("");
      }
    } else {
      console.log("Nothing to upload");
      setComment("");
    }
  };
  return (
    <div>
      <MentionsInput
        style={{
          '&multiLine': {
            input: {
              color: theme === "light" ? "black" : "white"
            },
          },

          '&singleLine': {
            input: {
              color: theme === "light" ? "black" : "white"
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
        }} value={comment} onChange={(e) => setComment(e.target.value)} className="commentInput" placeholder="Add a comment...">
        <Mention
          trigger="@"
          data={items}
        />
      </MentionsInput>
      <div>
        <Button onClick={addComment}
          variant="primary"
          size="sm"
          disabled={comment.length > 0 ? false : true}
          style={{ width: "100%", height: "30px" }}>
          Add Comment
        </Button>
      </div>
    </div>
  );
}
