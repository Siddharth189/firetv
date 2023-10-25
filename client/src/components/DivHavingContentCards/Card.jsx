import { BiSolidLike } from "react-icons/bi";
import { Link } from "react-router-dom";
const Card = ({ id, title, thumbnail, url, views, likes, cloudinaryID, popularity, vote_count }) => {
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
    <Link to={{
      pathname: "/chatroom/" + id,
      search: title,
      hash: title,
      state: { title: "hello" }
    }}>
      <div className="card" style={sectionStyle}>
        <div></div>
        <div>
          <h2>{title}</h2>
        </div>
        <div className="card-data">
          <div>
            <p>{formatCompactNumber(views ? views : vote_count * 4)} views</p>
          </div>
          <div className="flex-row">
            <p>{formatCompactNumber(likes ? likes : vote_count)}</p>{" "}
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
