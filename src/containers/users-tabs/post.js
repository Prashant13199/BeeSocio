import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { database } from "../../firebase";
import UserPost from "../../components/user-posts";
import empty from "../../assets/empty.png";
import ReactLoading from "react-loading";

export default function PostTabUser({ props }) {
    const theme = localStorage.getItem("theme");

    const [posts, setPosts] = useState([]);
    const [lastKey, setLastKey] = useState("")
    const [totalPosts, setTotalPosts] = useState(0)
    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        database.ref(`Users/${props.uid}/Posts`).orderByChild("timestamp").on("value", (snapshot) => {
            setTotalPosts(snapshot.numChildren())
        })
    }, [])

    useEffect(() => {
        database.ref(`Users/${props.uid}/Posts`).orderByChild("timestamp").limitToLast(9).on("value", (snapshot) => {
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
    }, [props]);

    const fetch = () => {
        setFetching(true)
        database.ref(`Users/${props.uid}/Posts`).orderByChild("timestamp").endBefore(lastKey).limitToLast(9).on("value", (snapshot) => {
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
            <Grid container
                spacing={
                    {
                        xs: 0.5,
                        md: 0.5
                    }
                }
                columns={
                    {
                        xs: 6,
                        sm: 12,
                        md: 12
                    }
                }>
                {
                    posts.length !== 0 && posts.map(({ id, post }) => {
                        return (

                            <UserPost key={id}
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
                            color: theme === "light" ? "black" : "white"
                        }
                    }>No Posts</div>
                </div>
            }
            {(totalPosts > posts.length && fetching) && <center style={{ marginTop: "20px" }}>
                <ReactLoading
                    type="spinningBubbles"
                    color="#0892d0"
                    height={"20px"}
                    width={"20px"}
                />
            </center>}
        </>
    );
}