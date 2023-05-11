import React, { useContext } from "react";
import "./style.css";
import { Helmet } from "react-helmet";
import Chat from "../../components/chat";
import Sidebar from "../../components/sidebar";
import { Route, Switch } from "react-router-dom";
import icon from '../../bee.png'
import { ColorModeContext } from "../../services/ThemeContext";

export default function Message() {

    const { mode } = useContext(ColorModeContext);
    return (
        <>
            <Helmet>
                <title>Message</title>
            </Helmet>
            <div className="app" style={{ backgroundColor: mode === "light" ? "white" : "black" }}>
                <div className={mode === "light" ? "app__body__light" : "app__body__dark"}>
                    <Switch>
                        <Route path="/message" exact={true}>
                            <Sidebar />
                            <div className="chatmain" style={{
                                backgroundColor: mode === "light" ? "rgb(242, 241, 241)" : "rgb(24, 27, 30)"
                            }}>
                                <img src={icon} alt=""
                                    style={{ objectFit: "contain", height: "350px", width: "350px", margin: 0, padding: 0 }}
                                />
                                <div style={{ color: mode === "light" ? "black" : "white", margin: 0, padding: 0, fontSize: "40px", fontWeight: "700" }}>BeeSocio Messenger</div>
                            </div>
                        </Route>
                        <Route path="/message/rooms/:roomId" exact={true}>
                            <div className="chatmain1"><Sidebar /></div>
                            <Chat />
                        </Route>
                    </Switch>
                </div>
            </div>
        </>
    );
}
