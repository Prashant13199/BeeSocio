import React, { useEffect, useState } from "react";
import "./style.css";
import { Helmet } from "react-helmet";
import { database } from "../../firebase";
import ReactLoading from "react-loading";
import SearchUser from "../../components/searchuser";

export default function Search() {

  const theme = localStorage.getItem("theme");

  const [users, setUsers] = useState("");
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0)
  const [lastKey, setLastKey] = useState("")
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    database
      .ref("Users")
      .orderByChild("timestamp")
      .on("value", (snapshot) => {
        setTotalUsers(snapshot.numChildren())
      })
  }, [])

  useEffect(() => {
    database
      .ref("Users")
      .orderByChild("createdAccountOn").limitToLast(10)
      .on("value", (snapshot) => {
        let userList = [];
        let key = ""
        let flag = true
        snapshot.forEach((snap) => {
          if (snap.val().username) {
            userList.push({
              id: snap.key,
              uid: snap.val().uid,
              name: snap.val().username,
            });
            if (flag) {
              flag = false
              key = snap.val().createdAccountOn
            }
          }
        });
        setLastKey(key)
        userList.reverse();
        setUsers(userList);
        setLoading(false);
      });
  }, []);

  const fetchMore = () => {
    setFetching(true)
    database
      .ref("Users").orderByChild("createdAccountOn").endBefore(lastKey).limitToLast(10)
      .on("value", (snapshot) => {
        let userList = [];
        let key = ""
        let flag = true
        snapshot.forEach((snap) => {
          if (snap.val().username) {
            userList.push({
              id: snap.key,
              uid: snap.val().uid,
              name: snap.val().username,
            });
            if (flag) {
              flag = false
              key = snap.val().createdAccountOn
            }
          }
        });
        setTimeout(() => {
          setLastKey(key)
          userList.reverse();
          setUsers([...users, ...userList]);
          setFetching(false)
        }, 800);

      });
  }

  useEffect(() => {
    const handleScroll = () => {
      const offsetHeight = document.documentElement.offsetHeight;
      const innerHeight = window.innerHeight;
      const scrollTop = document.documentElement.scrollTop;
      const hasReachedBottom = offsetHeight - (innerHeight + scrollTop) <= 10;
      if (totalUsers > users.length && hasReachedBottom) {
        fetchMore()
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [users, totalUsers]);

  return (
    <>
      <Helmet>
        <title>Search</title>
      </Helmet>
      <div
        style={{
          backgroundColor: theme === "light" ? "white" : "black",
          minHeight: "100vh",
        }}
      >
        {!loading ? (
          <>
            <div className="searchPage">
              <div
                className={
                  theme === "light" ? "searchUserlight" : "searchUserdark"
                }
              >
                {users ? (
                  users.map((user) => (
                    <SearchUser uid={user.uid} key={user.uid} />
                  ))
                ) : (
                  <></>
                )}
              </div>
              {(totalUsers > users.length && fetching) && <center style={{ marginTop: "20px" }}>
                <ReactLoading
                  type="spinningBubbles"
                  color="#0892d0"
                  height={"20px"}
                  width={"20px"}
                />
              </center>}
            </div>

          </>
        ) : (
          <div style={{ paddingTop: "150px", minHeight: "100vh" }}>
            <center>
              <ReactLoading
                type="spinningBubbles"
                color="#0892d0"
                height={"30px"}
                width={"30px"}
              />
            </center>
          </div>
        )}
      </div>
    </>
  );
}
