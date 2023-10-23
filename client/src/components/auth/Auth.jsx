import Register from "./Register";
import Login from "./Login";
import "./style.css";
import Header from "../Header";

const Auth = () => {
  return (
    <div className="auth-page">
      <Header />
      <div className="auth-box flex-row">
        <Login />
        <Register />
      </div>
    </div>
  );
};

export default Auth;
