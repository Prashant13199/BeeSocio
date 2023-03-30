import React, { useEffect, useState } from "react";
import { database } from "../../firebase";
import "./style.css";
import ReactLoading from "react-loading";
import ActiveUsersSingle from "../../components/ActiveUsersSingle";

export default function ActiveUsers() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentuid = localStorage.getItem('uid');

  useEffect(() => {
    database.ref(`/Users/${currentuid}/following`).on("value", (snapshot) => {
        let usersList = [];
        snapshot.forEach((snap) => {
            usersList.push({id: snap.val().uid, uid: snap.val().uid})
        });
        setUsers(usersList)
        setLoading(false);
    });
  },[]);

  return (
    <div className="activeusers">
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
          Active Users
        </p>
      </div>
      <div className="activeuserslist">
        {!loading ? (
          users ? (
            users.map((user) => (
              <ActiveUsersSingle uid={user.uid} key={user.id} />
            ))
          ) : (
            <></>
          )
        ) : (
          <center style={{ paddingTop: "60px" }}>
            <ReactLoading
              type="spinningBubbles"
              color="#0892d0"
              height={"20px"}
              width={"20px"}
            />
          </center>
        )}
      </div>
    </div>
  );
}
