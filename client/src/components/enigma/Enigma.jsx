import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./style.css";
import SEND from ".././../assets/images/send-image.jpg";
import AVATAR from ".././../assets/images/avatar.png";
import ROBO from ".././../assets/images/robo-image.jpeg";
import ENIGMA from ".././../assets/images/robo.gif";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

const Enigma = () => {
  const [isEnigmaOpen, setIsEnigmaOpen] = useState(false);
  // ********************** Getting users Login Status *************************************//
  const token = useSelector((store) => store.auth.token);
  const user = token ? JSON.parse(token).user : null;
  const userName = user ? user.name : null;
  const userId = user ? user._id : null;
  const userEmail = user ? user.email : null;
  console.log("user name => ", userName);
  console.log("user id => ", userId);
  // ***************************** End End End  *******************************************//

  const [resp, setResp] = useState([
    { text: "Welcome! How can I assist you today?", isUser: false },
  ]);
  const [content_desc, setContent_desc] = useState("Jawan");
  const [query, setQuery] = useState("");

  const formatResponse = (response) => {
    const formattedResponse = response.replace(
      /\*\*(.*?)\*\*/g,
      "<strong>$1</strong>"
    );
    const finalFormattedResponse = formattedResponse.replace(/\n/g, "<br>");
    return finalFormattedResponse;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/bot_response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content_desc, query }),
      });
      const data = await response.json();
      const formattedData = formatResponse(data.response);
      setResp([
        ...resp,
        { text: query, isUser: true },
        { text: formattedData, isUser: false },
      ]);
      setQuery("");
    } catch (error) {
      console.error("Error fetching data from the server:", error);
    }
  };
  // console.log("Hello ", isEnigmaOpen);
  // if (isEnigmaOpen === false) {
  //   return (
  // <button
  //   onClick={() => setIsEnigmaOpen(true)}
  //   style={{
  //     borderRadius: "20px",
  //     backgroundColor: "none",
  //     border: "none",
  //     cursor: "pointer",
  //   }}
  // >
  //   <img
  //     src={ENIGMA}
  //     alt="ENGIMA"
  //     style={{
  //       width: "100px",
  //       height: "100px",
  //       borderRadius: "20px",
  //     }}
  //   />
  // </button>
  //   );
  // }
  return (
    <Popup
      trigger={
        <button
          onClick={() => setIsEnigmaOpen(true)}
          style={{
            borderRadius: "20px",
            backgroundColor: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <img
            src={ENIGMA}
            alt="ENGIMA"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "20px",
            }}
          />
        </button>
      }
      // position="bottom center"
      modal
      style={{ background: "none" }}
    >
      <div className="chat-box">
        <div className="chat-heading justify-between">
          <p>
            ~ENIGMA{" "}
            {/* <button
              onClick={() => setIsEnigmaOpen(false)}
              style={{
                border: "none",
                fontSize: "40px",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
              }}
            >
              x
            </button> */}
          </p>
        </div>

        <div className="chat-message" id="chat-log">
          {resp.map((message, index) => (
            <div
              key={index}
              className={message.isUser ? "user-message" : "bot-message"}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: `${message.isUser ? "row-reverse" : "row"}`,
                }}
              >
                <img
                  src={message.isUser ? AVATAR : ROBO}
                  alt="user"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    margin: "10px",
                  }}
                />
                <div>
                  <p style={{ color: `${message.isUser ? "red" : "green"}` }}>
                    {message.isUser
                      ? token === null
                        ? "user-message"
                        : userName
                      : "engima"}
                  </p>
                  <p dangerouslySetInnerHTML={{ __html: message.text }}></p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex-row">
          <div>
            <label
              className="image-input"
              style={{
                cursor: "pointer",
                fontSize: "3em",
                marginRight: "10px",
              }}
            >
              +
            </label>
            <input
              type="file"
              className="image-input"
              accept="image/*"
              style={{ display: "none" }}
            />
          </div>
          <input
            type="text"
            className="user-input"
            placeholder="Write here..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <img
            className="send-button"
            src={SEND}
            alt="send"
            onClick={handleSubmit}
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>
    </Popup>
  );
};

export default Enigma;
