import { BiSolidLike } from "react-icons/bi";
import { Link } from "react-router-dom";
const Card = ({ id, title, thumbnail, url, views, likes, cloudinaryID }) => {
  function formatCompactNumber(number) {
    const formatter = Intl.NumberFormat("en", { notation: "compact" });
    return formatter.format(number);
  }

  const sectionStyle = {
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${thumbnail})`,
  };

  return (
    <Link to={"/chatroom/" + cloudinaryID}>
      <div className="card" style={sectionStyle}>
        <div></div>
        <div>
          <h2>{title}</h2>
        </div>
        <div className="card-data">
          <div>
            <p>{formatCompactNumber(views)} views</p>
          </div>
          <div className="flex-row">
            <p>{formatCompactNumber(likes)}</p>{" "}
            <BiSolidLike
              style={{
                fontSize: "1.2em",
                marginLeft: "5px",
                marginBottom: "3px",
              }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;
