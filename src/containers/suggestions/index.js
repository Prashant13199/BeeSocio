import React, { useEffect, useState } from "react";
import { database } from "../../firebase";
import "./style.css";
import SuggestionUSer from "../../components/suggestionuser";
import { Link } from "react-router-dom";
import loadingIcon from '../../assets/loading.gif'

export default function Suggestions() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = localStorage.getItem("theme");

  useEffect(() => {
    database
      .ref("/Users")
      .orderByChild("timestamp")
      .limitToLast(5)
      .on("value", (snapshot) => {
        let userList = [];
        snapshot.forEach((snap) => {
          if (snap.val().username) {
            userList.push({
              id: snap.key,
              uid: snap.val().uid,
            });
          }
        });
        userList.reverse();
        setUsers(userList);
        setLoading(false);
      });
  }, []);
  return (
    <div className="suggestions">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          height: "10px",
          padding: "5px 10px",
        }}
      >
        <p
          style={{
            fontWeight: "bold",
            color: "gray"
          }}
        >
          Suggestions For You
        </p>
        <Link className="viewall" to="/search" exact={true} style={{color: theme === "light" ? "black" : "white",textDecoration:"none"}}>
          view all
        </Link>
      </div>
      <div className="suggestionList">
        {!loading ? (
          users ? (
            users.map((user) => (
              <SuggestionUSer uid={user.uid} key={user.uid} />
            ))
          ) : (
            <></>
          )
        ) : (
          <center style={{ paddingTop: "20px" }}>
            <img src={loadingIcon} height={'20px'} width={'20px'} />
          </center>
        )}
      </div>
    </div>
  );
}
