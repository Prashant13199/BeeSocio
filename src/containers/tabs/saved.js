import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { database } from "../../firebase";
import UserPost from "../../components/user-posts";
import empty from "../../assets/empty.png";
import ReactLoading from "react-loading";

export default function SavedTab() {
    const theme = localStorage.getItem("theme");
    const currentuid = localStorage.getItem("uid");

    const [savedposts, setSavedPosts] = useState([]);
    const [lastKey, setLastKey] = useState("")
    const [totalSaved, setTotalSaved] = useState(0)
    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        database.ref(`Users/${currentuid}/saved`).orderByChild("timestamp").on("value", (snapshot) => {
            setTotalSaved(snapshot.numChildren())
        })
    }, [])

    useEffect(() => {
        database.ref(`Users/${currentuid}/saved`).orderByChild("timestamp").limitToLast(9).on("value", (snapshot) => {
            let saveList = [];
            let flag = true;
            let key = ""
            snapshot.forEach((snap) => {
                if (flag) {
                    flag = false
                    key = snap.val().timestamp
                }
                console.log(snap.val().timestamp)
                saveList.push({ id: snap.key, post: snap.val() });
            });
            setLastKey(key)
            saveList.reverse();
            setSavedPosts(saveList);
        });
    }, [currentuid]);

    const fetch = () => {
        setFetching(true)
        database.ref(`Users/${currentuid}/saved`).orderByChild("timestamp").endBefore(lastKey).limitToLast(9).on("value", (snapshot) => {
            let saveList = [];
            let flag = true;
            let key = ""
            snapshot.forEach((snap) => {
                if (flag) {
                    flag = false
                    key = snap.val().timestamp
                }
                saveList.push({ id: snap.key, post: snap.val() });
            });
            setTimeout(() => {
                setLastKey(key)
                saveList.reverse();
                setSavedPosts([...savedposts, ...saveList]);
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
            if (totalSaved > savedposts.length && hasReachedBottom) {
                fetch()
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [savedposts, totalSaved]);

    return (
        <>
            <Grid container
                spacing={
                    {
                        xs: 0.2,
                        md: 0.2
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
                    savedposts.length !== 0 && savedposts.map(({ id, post }) => {
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
                savedposts.length === 0 && <div style={
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
                    }>No Saved Posts</div>
                </div>
            }
            {(totalSaved > savedposts.length && fetching) && <center style={{ marginTop: "20px" }}>
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