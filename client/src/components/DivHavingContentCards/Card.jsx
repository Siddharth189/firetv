import { BiSolidLike } from "react-icons/bi";
import {useState, useEffect} from "react"
import { Link } from "react-router-dom";
const Card = ({ id, title, thumbnail, url, views, likes, cloudinaryID, popularity, vote_count }) => {
  const [image, setImage] = useState(thumbnail);

  useEffect(() => {
    if (!thumbnail) {
      // Make an API call to fetch the image
      fetch("http://localhost:6000/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movie_id: id }),
      })
        .then((response) => {
          if (response.ok) {
            return response.text();
          } else {
            throw new Error("API error");
          }
        })
        .then((data) => {
          console.log("Images Api Call: ", data);
          setImage(data);
        })
        .catch((error) => {
          console.error("Error fetching image:", error);
        });
    }
  }, [id, thumbnail]);

  
  
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
