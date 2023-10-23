import ROBOT from "../../../assets/images/robot.gif";

const WelcomeChat = () => {
  return (
    <div
      className="flex-column"
      style={{
        color: "white",
        backgroundColor: "#041234",
        width: "350px",
        height: "60vh",
      }}
    >
      <img src={ROBOT} alt="Hello!" style={{ width: "300px" }} />
      <p>Welcome to the chat room</p>
    </div>
  );
};

export default WelcomeChat;
