import React, { useEffect, useState } from "react";
import { database } from "../../firebase";
import "./style.css";
import ActiveUsersSingle from "../../components/ActiveUsersSingle";
import loadingIcon from '../../assets/loading.gif'
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function ActiveUsers() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentuid = localStorage.getItem('uid');

  useEffect(() => {
    AOS.init({ duration: 800 })
  }, [])

  useEffect(() => {
    database.ref(`/Users/${currentuid}/following`).on("value", (snapshot) => {
      let usersList = [];
      snapshot.forEach((snap) => {
        usersList.push({ id: snap.val().uid, uid: snap.val().uid })
      });
      setUsers(usersList)
      setLoading(false);
    });
  }, []);

  return (
    <div className="activeusers" data-aos="fade-left">
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
          <center style={{ paddingTop: "20px" }}>
            <img src={loadingIcon} height={'20px'} width={'20px'} />
          </center>
        )}
      </div>
    </div>
  );
}
