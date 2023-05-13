import { Grid } from "@mui/material";
import { useEffect, useState, useContext } from "react";
import { database, auth } from "../../firebase";
import empty from "../../assets/empty.png";
import Post from "../post";
import loadingIcon from '../../assets/loading.gif'
import { ColorModeContext } from "../../services/ThemeContext";

export default function FeedTab() {

    const { mode } = useContext(ColorModeContext);
    const [posts, setPosts] = useState([]);
    const [lastKey, setLastKey] = useState("")
    const [totalPosts, setTotalPosts] = useState(0)
    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        database.ref(`Users/${auth?.currentUser?.uid}/Posts`).orderByChild("timestamp").on("value", (snapshot) => {
            setTotalPosts(snapshot.numChildren())
        })
    }, [])

    useEffect(() => {
        database.ref(`Users/${auth?.currentUser?.uid}/Posts`).orderByChild("timestamp").limitToLast(5).on("value", (snapshot) => {
            let postList = [];
            let flag = true;
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
        });
    }, []);

    const fetch = () => {
        setFetching(true)
        database.ref(`Users/${auth?.currentUser?.uid}/Posts`).orderByChild("timestamp").endBefore(lastKey).limitToLast(5).on("value", (snapshot) => {
            let postList = [];
            let flag = true;
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
                fetch()
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [posts, totalPosts]);

    return (
        <>
            <Grid container direction="row" justifyContent="center" alignItems="center">
                {
                    posts.length !== 0 && posts.map(({ id, post }) => {
                        return (
                            <Post key={id}
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
                                tagss={
                                    post.tagss
                                }
                                venue={post.venue}
                                timestamp={
                                    post.timestamp
                                } />
                        );
                    })
                } </Grid>
            {
                posts.length === 0 && <div style={
                    {
                        display: "grid",
                        placeItems: "center",
                        marginTop: "40px"
                    }
                }><img src={empty} alt=""
                    height={"90px"} /><div style={
                        {
                            color: mode === "light" ? "black" : "white"
                        }
                    }>No Posts</div>
                </div>
            }
            {(totalPosts > posts.length && fetching) && <center style={{ marginTop: "20px" }}>
                <img src={loadingIcon} height={'20px'} width={'20px'} />
            </center>}
        </>
    );
}