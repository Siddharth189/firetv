import React, { useState, useEffect, Fragment } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useSwipeable } from "react-swipeable";
import LeftSidebarComponent from "./components/LeftSidebarComponent";
import ChatComponent from "./components/ChatComponent";
import ChatRoomComponent from "./components/ChatRoomComponent";
import "./styles/App.scss";
import LandingComponent from "./components/LandingComponent";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./style.css";
import VideoBox from "./VideoBox";
import { useNavigate } from "react-router-dom";
import Enigma from "../enigma/Enigma";

// const socket = io.connect('http://localhost:3001');
const socket = io.connect("http://localhost:8080");

const ChatRoom = () => {
  const token = useSelector((store) => store.auth.token);
  const user = token ? JSON.parse(token).user : null;
  const userName1 = user ? user.name : null;
  const userId1 = user ? user._id : null;
  const userEmail = user ? user.email : null;
  console.log("user name => ", userName1);
  console.log("user id => ", userId1);

  // if (token === null) {
  //   return (
  //     <div>
  //       <h1>
  //         You are not logged in please login{" "}
  //         <Link to={"/auth"} style={{ color: "blue" }}>
  //           {" "}
  //           sign in
  //         </Link>
  //       </h1>
  //     </div>
  //   );
  // }
  const [userState, setUserState] = useState({
    userId: "",
    name: "",
    color: "",
  });
  // userState.name => set the name to the user name from the login data otherwise ask to login

  const [userList, setUserList] = useState([]);

  const [roomList, setRoomList] = useState([]);

  const [chatBoxList, setChatBoxList] = useState([]);

  const [isSidebarHidden, setIsSidebarHidden] = useState(false);

  // Ping Heroku server at fixed interval to stop it from sleeping
  useEffect(() => {
    setInterval(() => {
      pingServer();
    }, 600000);
  }, []);
  const pingServer = () => {
    const res = axios.get("/api");
    console.log(res);
  };

  // const handlers = useSwipeable({
  //   onSwipedLeft: () => setIsSidebarHidden(true),
  //   onSwipedRight: () => setIsSidebarHidden(false),
  //   preventDefaultTouchmoveEvent: true,
  //   trackMouse: true,
  // });

  useEffect(() => {
    console.log("***********************");
    console.log(chatBoxList);
    console.log("***********************");
  }, [chatBoxList]);

  let navigate = useNavigate();

  return (
    <div
      className="chat-room-page flex-row"
      style={{ backgroundColor: "#041234", flexWrap: "nowrap" }}
    >
      <div
        style={{
          width: "78vw",
          margin: "auto",
          borderRadius: "15px" /* Adjust the radius to your preference */,
          overflow: "hidden",
          boxShadow:
            "rgba(2, 68, 107, 0.80) 0px 15px 25px, rgba(2, 68, 107, 0.70) 0px 5px 10px",
        }}
      >
        <button className="back-btn" onClick={() => navigate(-1)}>
          {"Back"}
        </button>
        <Enigma />
        <div style={{ position: "sticky" }}>
          <VideoBox />
        </div>
      </div>
      <div className="main-content">
        {userState.name.length === 0 ? (
          <LandingComponent userState={userState} setUserState={setUserState} />
        ) : (
          <Fragment>
            <LeftSidebarComponent
              socket={socket}
              userList={userList}
              setUserList={setUserList}
              userState={userState}
              chatBoxList={chatBoxList}
              setChatBoxList={setChatBoxList}
              roomList={roomList}
              setRoomList={setRoomList}
              isSidebarHidden={isSidebarHidden}
              setIsSidebarHidden={setIsSidebarHidden}
            />

            {chatBoxList.map((item, index) => {
              if (item.type === "room") {
                let currentRoom = roomList.find(
                  (room) => room.roomId === item.id
                );
                return (
                  <ChatRoomComponent
                    key={index}
                    socket={socket}
                    userState={userState}
                    chatBoxItem={item}
                    currentRoom={currentRoom}
                    setRoomList={setRoomList}
                    setChatBoxList={setChatBoxList}
                    setIsSidebarHidden={setIsSidebarHidden}
                  />
                );
              } else {
                return (
                  <ChatComponent
                    key={index}
                    socket={socket}
                    userState={userState}
                    chatBoxItem={item}
                  />
                );
              }
            })}
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;
