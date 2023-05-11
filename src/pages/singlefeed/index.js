import React, { useEffect, useState, useContext } from "react";
import { database } from "../../firebase";
import Post from "../../containers/post";
import { Helmet } from "react-helmet";
import "./style.css";
import loadingIcon from '../../assets/loading.gif'
import { ColorModeContext } from "../../services/ThemeContext";

export default function SingleFeed(props) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { mode } = useContext(ColorModeContext);

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
  }, []);
  useEffect(() => {
    database
      .ref(`Posts/${props.match.params.postid}/`)
      .on("value", (snapshot) => {
        let postList = [];
        if (snapshot.val() !== null) {
          postList.push({
            id: snapshot.key,
            post: snapshot.val(),
          });
        }

        setPosts(postList);
        setLoading(false);
      });
  }, [props.match.params.postid]);

  return (
    <>
      <Helmet>
        <title>Post</title>
      </Helmet>
      <div
        className="singlefeed"
        style={{ backgroundColor: mode === "light" ? "white" : "black" }}
      >
        {!loading ? (
          posts.length !== 0 ? (
            posts.map(({ id, post }) => {
              return (
                <Post
                  key={id}
                  id={id}
                  profileUrl={post.profileUrl}
                  uid={post.uid}
                  photoURL={post.photoUrl}
                  caption={post.caption}
                  timestamp={post.timestamp}
                  tagss={post.tagss}
                  venue={post.venue}
                />
              );
            })
          ) : (
            <div
              style={{
                marginTop: "200px",
                fontSize: "20px",
                color: mode === "light" ? "black" : "white",
              }}
            >
              Post Deleted
            </div>
          )
        ) : (
          <div style={{ marginTop: "150px", minHeight: "90vh" }}>
            <center>
              <img alt="" src={loadingIcon} height={'30px'} width={'30px'} />
            </center>
          </div>
        )}
      </div>
    </>
  );
}
