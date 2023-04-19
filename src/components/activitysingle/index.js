import React, { useState, useCallback, useEffect } from "react";
import "./style.css";
import { timeDifference } from "../../services/timeDifference";
import { Link } from "react-router-dom";
import { database } from "../../firebase";
import Swal from "sweetalert2";
import { useLongPress } from "use-long-press";

export default function ActivitySingle({ uid, text, timestamp, photoUrl, postid, id, comment, }) {
    const [photo, setPhoto] = useState("");
    const [username, setUsername] = useState("");
    const currentuid = localStorage.getItem("uid");
    const theme = localStorage.getItem("theme");

    useEffect(() => { database.ref(`/Users/${uid}`).on("value", (snapshot) => { if (snapshot.val()) { setPhoto(snapshot.val().photo); setUsername(snapshot.val().username); } }); }, [uid]);

    const callback = useCallback((e, id) => {
        e.preventDefault(); Swal.fire({ background: theme === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)", color: theme === "light" ? "black" : "white", title: "Are you sure to delete?", text: "You won't be able to revert this!", icon: "warning", showCancelButton: true, confirmButtonColor: "#3085d6", cancelButtonColor: "#d33", confirmButtonText: "Yes, delete it!", }).then((result) => {
            if (result.isConfirmed) {
                database.ref(`/Users/${currentuid}/activity/${id.context}`).remove().then(() => console.log("activity deleted")).catch((e) => console.log(e));
                Swal.fire({
                    background: theme === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
                    color: theme === "light" ? "black" : "white",
                    title: "Deleted!",
                    text: "Your activity has been deleted.",
                    icon: "success", timer: 800,
                    showConfirmButton: false,
                });
            }
        });
    }, [id]);

    const bind = useLongPress(callback, { filterEvents: (event) => true, threshold: 400, captureEvent: true, cancelOnMovement: true, detect: "both", });

    return (
        <Link to={postid ? `/singlefeed/${postid}` : `/userprofile/${uid}`} style={{ textDecoration: "none" }} className="noselect">
            <div className={theme === "light" ? "activitysinglelight" : "activitysingledark"} {...bind(id)}>
                <div style={{ display: "flex" }}> <Link to={uid === currentuid ? '/profile' : `/userprofile/${uid}`}>
                    <img src={photo} className="activity__profilePic" alt="" />
                </Link>
                    <div style={{ marginLeft: "10px" }}>
                        <div className="activity__center">
                            <span>
                                <Link to={uid === currentuid ? '/profile' : `/userprofile/${uid}`} style={{ color: theme === "light" ? "black" : "white", fontWeight: "600", textDecoration: "none", }}>
                                    {username && username.length > 20 ? username.substring(0, 20).concat('...') : username} </Link> </span><span style={{ color: theme === "light" ? "black" : "white", }}>
                                {text} {comment ? comment : ""} </span> </div>
                        <div className="activity__time"> {timeDifference(new Date(), new Date(timestamp))}
                        </div>
                    </div>
                </div>
                <img style={{ display: postid ? "block" : "none" }} effect="blur" className="activity__postPic" alt="" src={photoUrl} />
            </div>
        </Link>);
}
