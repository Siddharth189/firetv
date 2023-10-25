import Header from "../Header";
import Card from "./Card";
import "./styles.css";
import { AiOutlineDown } from "react-icons/ai";

const ContentDiv = ({ contentData }) => {
  return (
    <div>
      <div className="flex-row" style={{ marginTop: "80px" }}>
        <div className="card-container flex-row">
          {contentData?.map((item) => {
            return <Card {...item} />;
          })}
        </div>
      </div>
      <div className="flex-row">
        <button
          style={{
            background: "none",
            textDecoration: "none",
            color: "#041243",
            border: "none",
            cursor: "pointer",
          }}
        >
          <AiOutlineDown style={{ width: "30px", height: "30px" }} />
        </button>
      </div>
    </div>
  );
};

export default ContentDiv;
