import React, { useState, useCallback, useEffect, useContext } from "react";
import "./style.css";
import { timeDifference } from "../../services/timeDifference";
import { Link } from "react-router-dom";
import { database } from "../../firebase";
import Swal from "sweetalert2";
import { useLongPress } from "use-long-press";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ColorModeContext } from "../../services/ThemeContext";

export default function ActivitySingle({ uid, text, timestamp, photoUrl, postid, id, comment, }) {
    const [photo, setPhoto] = useState("");
    const [username, setUsername] = useState("");
    const currentuid = localStorage.getItem("uid");
    const { mode } = useContext(ColorModeContext);

    useEffect(() => {
        AOS.init({ duration: 800 })
    }, [])

    useEffect(() => { database.ref(`/Users/${uid}`).on("value", (snapshot) => { if (snapshot.val()) { setPhoto(snapshot.val().photo); setUsername(snapshot.val().username); } }); }, [uid]);

    const callback = useCallback((e, id) => {
        e.preventDefault(); Swal.fire({ background: mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)", color: mode === "light" ? "black" : "white", title: "Are you sure to delete?", text: "You won't be able to revert this!", icon: "warning", showCancelButton: true, confirmButtonColor: "#3085d6", cancelButtonColor: "#d33", confirmButtonText: "Yes, delete it!", }).then((result) => {
            if (result.isConfirmed) {
                database.ref(`/Users/${currentuid}/activity/${id.context}`).remove().then(() => console.log("activity deleted")).catch((e) => console.log(e));
                Swal.fire({
                    background: mode === "light" ? "rgba(248,249,250,1)" : "rgba(33,37,41,1)",
                    color: mode === "light" ? "black" : "white",
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
            <div className={mode === "light" ? "activitysinglelight" : "activitysingledark"} {...bind(id)}>
                <div data-aos="fade-right" style={{ display: "flex" }}> <Link to={uid === currentuid ? '/profile' : `/userprofile/${uid}`}>
                    <img src={photo ? photo : `https://api.dicebear.com/6.x/thumbs/png?seed=Spooky`} className="activity__profilePic" alt="" />
                </Link>
                    <div style={{ marginLeft: "10px" }}>
                        <div className="activity__center">
                            <span>
                                <Link to={uid === currentuid ? '/profile' : `/userprofile/${uid}`} style={{ color: mode === "light" ? "black" : "white", fontWeight: "600", textDecoration: "none", }}>
                                    {username ? username.length > 20 ? username.substring(0, 20).concat('...') : username : 'Loading...'} </Link> </span><span style={{ color: mode === "light" ? "black" : "white", }}>
                                {text} {comment ? comment : ""} </span> </div>
                        <div className="activity__time"> {timeDifference(new Date(), new Date(timestamp))}
                        </div>
                    </div>
                </div>
                <img data-aos="fade-left" style={{ display: postid ? "block" : "none" }} effect="blur" className="activity__postPic" alt="" src={photoUrl ? photoUrl : `https://api.dicebear.com/6.x/thumbs/png?seed=Spooky`} />
            </div>
        </Link>);
}
