import { BiSolidLike } from "react-icons/bi";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
const Card = ({
  MovieID,
  MovieName,
  url,
  views,
  likes,
  Popularity,
  VoteCount,
  PosterURL,
}) => {
  

  function formatCompactNumber(number) {
    const formatter = Intl.NumberFormat("en", { notation: "compact" });
    return formatter.format(number);
  }

  const sectionStyle = {
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${PosterURL})`,
  };

  return (
    <Link
      to={{
        pathname: "/chatroom/" + MovieID,
        search: MovieName,
        hash: MovieName,
        state: { MovieName: "hello" },
      }}
    >
      <div className="card" style={sectionStyle}>
        <div></div>
        <div>
          <h2>{MovieName}</h2>
        </div>
        <div className="card-data">
          <div>
            <p>{formatCompactNumber(views ? views : VoteCount * 4)} views</p>
          </div>
          <div className="flex-row">
            <p>{formatCompactNumber(likes ? likes : VoteCount)}</p>{" "}
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
