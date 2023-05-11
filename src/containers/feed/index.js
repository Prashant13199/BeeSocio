import React, { useEffect, useState, useContext } from "react";
import { Post } from "..";
import { database } from "../../firebase";
import "./style.css";
import icon from "../../bee.png";
import loadingIcon from '../../assets/loading.gif'
import { ColorModeContext } from "../../services/ThemeContext";


export default function Feed() {
    const { mode } = useContext(ColorModeContext);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPosts, setTotalPosts] = useState(0)
    const [lastKey, setLastKey] = useState("")
    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        setLoading(true);
        database.ref("/Posts").orderByChild("timestamp").on("value", (snapshot) => {
            setTotalPosts(snapshot.numChildren())
        })
        database.ref("/Posts").orderByChild("timestamp").limitToLast(5).on("value", (snapshot) => {
            let postList = [];
            let flag = true
            let key = ""
            snapshot.forEach((snap) => {
                if (flag) {
                    flag = false
                    key = snap.val().timestamp
                }
                postList.push({ id: snap.key, post: snap.val() });
            });
            setLastKey(key)
            postList.reverse();
            setPosts(postList);
            setLoading(false);
        });
    }, []);

    const fetchMore = () => {
        setFetching(true)
        database.ref("/Posts").orderByChild("timestamp").endBefore(lastKey).limitToLast(5).on("value", (snapshot) => {
            let postList = [];
            let flag = true
            let key = ""
            snapshot.forEach((snap) => {
                if (flag) {
                    flag = false
                    key = snap.val().timestamp
                }
                postList.push({ id: snap.key, post: snap.val() });
            });
            setTimeout(() => {
                setLastKey(key)
                postList.reverse();
                setPosts([...posts, ...postList]);
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
            if (totalPosts > posts.length && hasReachedBottom) {
                fetchMore()
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [posts, totalPosts]);

    return !loading ? (
        <div className="feed" id="content">
            {
                posts.length !== 0 ? (posts.map(({ id, post }) => {
                    return (
                        <Post
                            key={id}
                            id={id}
                            uid={
                                post.uid
                            }
                            photoURL={
                                post.photoUrl
                            }
                            caption={
                                post.caption
                            }
                            timestamp={
                                post.timestamp
                            }
                            venue={
                                post.venue
                            }
                            tagss={
                                post.tagss
                            } />
                    );
                })) : (
                    <div style={
                        { marginTop: "40px" }
                    }>
                        <img src={icon}
                            height={"250px"}
                            width={"100%"}
                            alt=""
                            style={
                                { objectFit: "contain" }
                            } />
                        <center style={
                            {
                                marginTop: "20px",
                                color: mode === "light" ? "black" : "white"
                            }
                        }>
                            <h4>Please upload or follow to see posts</h4>
                        </center>
                    </div>
                )

            }
            {(totalPosts > posts.length && fetching) && <center style={{ marginTop: "20px" }}>
                <img src={loadingIcon} height={'20px'} width={'20px'} />
            </center>}
            {(totalPosts === posts.length) && <center style={{
                color: "gray", marginTop: "50px"
            }}>That's all</center>}
        </div>

    ) : (
        <div style={
            {
                marginTop: "200px",
                minWidth: "50px"
            }
        }>
            <center>
                <img src={loadingIcon} height={'30px'} width={'30px'} />
            </center>
        </div>
    );
}
