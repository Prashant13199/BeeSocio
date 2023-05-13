import React, { useEffect, useState, useContext } from "react";
import "./style.css";
import { database, auth } from "../../firebase";
import { Helmet } from "react-helmet";
import ActivitySingle from "../../components/activitysingle";
import { ColorModeContext } from "../../services/ThemeContext";
import loadingIcon from '../../assets/loading.gif'
import { date } from "../../services/date";

export default function Activity() {

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const { mode } = useContext(ColorModeContext);
  const [totalActivity, setTotalActivity] = useState(0)
  const [lastKey, setLastKey] = useState("")
  const [fetching, setFetching] = useState(false)
  const [dates, setDates] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    database
      .ref(`/Users/${auth?.currentUser?.uid}/activity`)
      .on("value", (snapshot) => {
        setTotalActivity(snapshot.numChildren())
      })
  }, [])
  useEffect(() => {
    database
      .ref(`/Users/${auth?.currentUser?.uid}/activity`)
      .orderByChild("timestamp").limitToLast(10)
      .on("value", (snapshot) => {
        let flag = true
        let key = ""
        let mySet = new Set()
        let datas = []

        snapshot.forEach((snap) => {
          mySet.add(date(snap.val().timestamp))
          if (flag) {
            flag = false
            key = snap.val().timestamp
          }
        });

        setLastKey(key)
        let dateList = Array.from(mySet);

        snapshot.forEach((snap) => {
          if (snap.val()) {
            for (let date1 in dateList) {
              if (date(snap.val().timestamp) === dateList[date1]) {
                let activity = []
                activity.push({
                  id: snap.key,
                  data: snap.val(),
                })
                datas.push({
                  id: dateList[date1],
                  activity: activity
                })
              }
            }
          }
        });
        dateList.reverse()
        setDates(dateList)
        datas.reverse()
        setData(datas);
        setLoading(false);
      });
  }, []);

  const fetchMore = () => {
    setFetching(true)
    database
      .ref(`/Users/${auth?.currentUser?.uid}/activity`)
      .orderByChild("timestamp").endBefore(lastKey).limitToLast(10)
      .on("value", (snapshot) => {
        let mySet = new Set()
        let newDatas = []
        let flag = true
        let key = ""

        snapshot.forEach((snap) => {
          mySet.add(date(snap.val().timestamp))
          if (flag) {
            flag = false
            key = snap.val().timestamp
          }
        });

        let newDateList = Array.from(mySet);
        setLastKey(key)

        snapshot.forEach((snap) => {
          if (snap.val()) {
            for (let date1 in newDateList) {
              if (date(snap.val().timestamp) === newDateList[date1]) {
                let activity = []
                activity.push({
                  id: snap.key,
                  data: snap.val(),
                })
                newDatas.push({
                  id: newDateList[date1],
                  activity: activity
                })
              }
            }
          }
        });
        setTimeout(() => {
          newDateList.reverse()
          setDates(Array.from(new Set([...dates, ...newDateList])))
          newDatas.reverse();
          setData([...data, ...newDatas])
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
      if (totalActivity > data.length && hasReachedBottom) {
        fetchMore()
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [data, totalActivity]);

  return (
    <div
      style={{
        backgroundColor: mode === "light" ? "white" : "black",
        minHeight: "100vh",
      }}
    >
      <Helmet>
        <title>Activity</title>
      </Helmet>
      <div className="activityPage">
        {!loading ? (
          data.length !== 0 ? (
            <div
              className={mode === "light" ? "activitylight" : "activitydark"}
            >
              {dates && dates.map((date) => {
                return <div key={date}>
                  <div style={{ color: mode === "light" ? "black" : "white", padding: "15px", fontWeight: "800" }}>{date}</div>
                  {data && data.map(({ id, activity }) => {
                    return date === id && activity && activity.map(({ id, data }) => {
                      return (
                        <ActivitySingle
                          id={id}
                          uid={data.uid}
                          photoUrl={data.photoUrl}
                          timestamp={data.timestamp}
                          text={data.text}
                          key={id}
                          postid={data.postid}
                          comment={data.comment}
                        />
                      );
                    })
                  })}
                </div>
              })}
            </div>) : (
            <div
              className={mode === "light" ? "activitylight" : "activitydark"}
            >
              {data.length === 0 && !loading && (
                <center>
                  <div
                    style={{
                      marginTop: "40px",
                      fontSize: "20px",
                      fontWeight: "bold",
                      height: "10vh",
                      alignItems: "center",
                      justifyContent: "center",
                      display: "flex",
                      color: mode === "light" ? "black" : "white",
                    }}
                  >
                    No Activity
                  </div>
                </center>
              )}
            </div>
          )
        ) : (
          <div style={{ paddingTop: "200px", minHeight: "100vh" }}>
            <center>
              <img alt="" src={loadingIcon} height={'30px'} width={'30px'} />
            </center>
          </div>
        )}
        {(totalActivity > data.length && fetching) && <center style={{ marginTop: "20px" }}>
          <img alt="" src={loadingIcon} height={'20px'} width={'20px'} />
        </center>}
      </div>
    </div>
  );
}
