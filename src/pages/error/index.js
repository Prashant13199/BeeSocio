import React, { useContext } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import "./style.css";
import { ColorModeContext } from "../../services/ThemeContext";


export default function Error() {
  const { mode } = useContext(ColorModeContext);
  return (
    <>
      <Helmet>
        <title>Error</title>
      </Helmet>
      <div
        style={{
          background: mode === "light" ? "white" : "black",
          minHeight: "100vh",
        }}
      >
        <center>
          <section className="page_404">
            <div className="container">
              <div className="row">
                <div className="col-sm-12 ">
                  <div className="col-sm-10 col-sm-offset-1  text-center">
                    <div className="four_zero_four_bg">
                      <h1 className="text-center ">404</h1>
                    </div>

                    <div className="contant_box_404">
                      <h3
                        className="h2"
                        style={{ color: mode === "light" ? "black" : "white" }}
                      >
                        Look like you're lost
                      </h3>

                      <p
                        style={{ color: mode === "light" ? "black" : "white" }}
                      >
                        the page you are looking is not avaible!
                      </p>

                      <Link
                        to="/"
                        className="link_404"
                        style={{ textDecoration: "none" }}
                      >
                        Go to Home
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </center>
      </div>
    </>
  );
}
