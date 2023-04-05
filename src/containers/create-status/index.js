import React, { useState } from "react";
import "./style.css";
import { storage, database } from "../../firebase";
import Compressor from "compressorjs";
import Swal from "sweetalert2";
import { makeid } from "../../services/makeid";
import { Button } from "react-bootstrap";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

export default function CreateStatus({ handleClose }) {
  const [compressedFile, setCompressedFile] = useState(null);
  let fileName = "";
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const currentuid = localStorage.getItem("uid");
  const [link, setLink] = useState("");

  const theme = localStorage.getItem("theme");
  const handleChange = (e) => {
    if (
      e.target.files[0] &&
      (e.target.files[0].name.toLowerCase().includes(".jpg") ||
        e.target.files[0].name.toLowerCase().includes(".png") ||
        e.target.files[0].name.toLowerCase().includes(".jpeg") ||
        e.target.files[0].name.toLowerCase().includes(".ico") ||
        e.target.files[0].name.toLowerCase().includes(".mp4") ||
        e.target.files[0].name.toLowerCase().includes(".mov") ||
        e.target.files[0].name.toLowerCase().includes(".avi") ||
        e.target.files[0].name.toLowerCase().includes(".mkv") ||
        e.target.files[0].name.toLowerCase().includes(".webm"))
    ) {
      setImage(e.target.files[0]);
      var selectedImageSrc = URL.createObjectURL(e.target.files[0]);
      var imagePreview = document.getElementById("image-preview");
      imagePreview.src = selectedImageSrc;
      imagePreview.style.display = "block";
      const image = e.target.files[0];
      if (
        image.name.toLowerCase().includes(".jpg") ||
        image.name.toLowerCase().includes(".png") ||
        image.name.toLowerCase().includes(".jpeg") ||
        image.name.toLowerCase().includes(".ico")
      ) {
        new Compressor(image, {
          quality: 0.4,
          success: (compressedResult) => {
            setCompressedFile(compressedResult);
          },
        });
      } else {
        setCompressedFile(image);
      }
    } else {
      Swal.fire({
        background: theme === "light" ? "white" : "#1F1B24",
        color: theme === "light" ? "black" : "white",
        title: "Error!",
        text: "File not supported",
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };
  const handleLink = () => {
    if (link) {
      var selectedImageSrc = link;
      var imagePreview = document.getElementById("image-preview");
      imagePreview.src = selectedImageSrc;
      imagePreview.style.display = "block";
      setImage(link);
    }
  };
  const handleUpload = () => {
    if (image && !link) {
      var imageName = makeid(10);
      if (
        image.name.toLowerCase().includes(".jpg") ||
        image.name.toLowerCase().includes(".png") ||
        image.name.toLowerCase().includes(".jpeg")
      ) {
        fileName = `${imageName}.jpg`;
      } else if (image.name.includes(".gif")) {
        fileName = `${imageName}.gif`;
      } else if (image.name.toLowerCase().includes(".ico")) {
        fileName = `${imageName}.ico`;
      } else if (
        image.name.toLowerCase().includes(".mp4") ||
        image.name.toLowerCase().includes(".mov") ||
        image.name.toLowerCase().includes(".avi") ||
        image.name.toLowerCase().includes(".mkv") ||
        image.name.toLowerCase().includes(".webm")
      ) {
        fileName = `${imageName}.mp4`;
      }
      const uploadTask = storage.ref(`images/${fileName}`).put(compressedFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
          document.getElementById("uploadBtn").disabled = true;
          document.getElementById(
            "uploadBtn"
          ).innerHTML = `Uploading ${progress}`;
        },
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref("images")
            .child(`${fileName}`)
            .getDownloadURL()
            .then((imageUrl) => {
              let statusid = makeid(10);
              database.ref(`/Status/${statusid}`).set({
                timestamp: Date.now(),
                statusImg: imageUrl,
                uid: currentuid,
              });
              setProgress(0);
              setImage(null);
              handleClose();
              document.getElementById("image-preview").style.display = "none";
              document.getElementById("fileInput").value = "";
              Swal.fire({
                background: theme === "light" ? "white" : "#1F1B24",
                color: theme === "light" ? "black" : "white",
                title: "Added to status!",
                text: "Your status has been added.",
                icon: "success",
                timer: 800,
                showConfirmButton: false,
              });
            });
        }
      );
    } else if (link) {
      let statusid = makeid(10);
      database
        .ref(`/Status/${statusid}`)
        .set({
          timestamp: Date.now(),
          statusImg: link,
          uid: currentuid,
        })
        .then(() => {
          setImage(null);
          setLink("");
          handleClose();
          document.getElementById("image-preview").style.display = "none";
          Swal.fire({
            background: theme === "light" ? "white" : "#1F1B24",
            color: theme === "light" ? "black" : "white",
            title: "Added to status!",
            text: "Your status has been added.",
            icon: "success",
            timer: 800,
            showConfirmButton: false,
          });
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };
  return (
    <div className="createPost">
      <div className="createPost__loggedIn">
        <div className="createPost__imagePreview">
          <img
            id="image-preview"
            alt="If not visible, try different link"
            style={{
              color: theme === "light" ? "black" : "white",
              height: "50vh",
              width: "100%",
              marginBottom: "20px",
              borderRadius: "10px",
              objectFit: "cover",
            }}
          />
        </div>
        <div className="createPost__loggedInBottom">
          {!image && (
            <center>
              <div
                className="createPost__imageUpload"
                style={{ textAlign: "center" }}
              >

                <label htmlFor="fileInput" style={{ cursor: "pointer" }}>
                  <AddAPhotoIcon style={{ fontSize: "60px", color: theme === 'light' ? 'black' : 'white' }} />
                </label>

                <input
                  type="file"
                  id="fileInput"
                  accept="image/*,video/*"
                  onChange={handleChange}
                ></input>
              </div>
              <br />
              <div style={{ color: theme === "light" ? "black" : "white" }}>or</div>
              <br />
              <div className="commentInput">
                <input
                  className="commentInput__textarea"
                  placeholder="Paste image link here"
                  value={link}
                  style={{
                    backgroundColor:
                      theme === "light"
                        ? "rgba(248,249,250,1)"
                        : "rgba(33,37,41,1)",
                    color: theme === "light" ? "#1F1B24" : "white",
                  }}
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleLink();
                    }
                  }}
                  onChange={(e) => setLink(e.target.value)}
                  maxLength="500"
                ></input>
                <div
                  style={{
                    opacity: link ? 1 : 0.6,
                    cursor: link ? "pointer" : "default",
                  }}
                  className="commentInput__btn"
                  onClick={handleLink}
                >
                  <Button
                    style={{
                      disabled: link ? false : true,
                      opacity: link ? 1 : 0.5,
                    }}
                    variant="secondary"
                    size="sm"
                  >
                    OK
                  </Button>
                </div>
              </div>
            </center>
          )}
          {image && (
            <div className="d-grid gap-2" style={{ marginTop: "20px" }}>
              <Button
                variant="primary"
                size="md"
                id="uploadBtn"
                onClick={handleUpload}
                style={{
                  color: image || link ? "white" : "gray",
                  cursor: image || link ? "pointer" : "default",
                }}
              >
                Upload
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
