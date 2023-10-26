import { useEffect, useState } from "react";
import Header from "../Header";
import ContentDiv from "../DivHavingContentCards/ContentDiv";
import "./styles.css";
import { useSelector } from "react-redux";

const Curated = () => {
  const [responseData, setResponseData] = useState([]);
  const [error, setError] = useState(null);

  const data = [
    {
      id: 1,
      MovieName: "IND vs AUS",
      PosterURL:
        "https://cdn.siasat.com/wp-content/uploads/2022/09/2022_9img23_Sep_2022_PTI09_23_2022_000311B-scaled.jpg",
      url: "",
      likes: 123,
      views: 211212,
      cloudinaryID: "2d1y3h4jifkc",
    },
    {
      id: 2,
      MovieName: "Jawan",
      url: "",
      PosterURL:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwnlt2U3pD1ITusQbCa1LTDj5HjNTqCsvjGA&usqp=CAU",
      likes: 9300,
      views: 343447874,
      cloudinaryID: "he2y3h4jifkc",
    },
    {
      id: 3,
      MovieName: "Carrie",
      PosterURL:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoky-h1Vay3c3PuWBNffKqgneKRamAe8OPKQ&usqp=CAU",
      url: "",
      likes: 34000,
      views: 999679,
      cloudinaryID: "tday3h4jifkc",
    },
    {
      id: 4,
      MovieName: "Content ABC",
      PosterURL:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLuSfA6uG8JFrM5ISZwfL3DWIJDutPi5oq8g&usqp=CAU",
      url: "",
      likes: 123,
      views: 211212,
      cloudinaryID: "34ay3h4jifkc",
    },
    {
      id: 5,
      MovieName: "Content ABC",
      PosterURL:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLuSfA6uG8JFrM5ISZwfL3DWIJDutPi5oq8g&usqp=CAU",
      url: "",
      likes: 123,
      views: 211212,
      cloudinaryID: "absy3h4jifkc",
    },
    {
      id: 6,
      MovieName: "Content ABC",
      PosterURL:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLuSfA6uG8JFrM5ISZwfL3DWIJDutPi5oq8g&usqp=CAU",
      url: "",
      likes: 123,
      views: 211212,
      cloudinaryID: "456y3h4jifkc",
    },
  ];

  const history_array = ["Water", "The Dark Knight", "Paa"];
  let user_history = useSelector((store) => store.history.user_history);
  user_history = user_history.length === 0 ? history_array : user_history; 
  // console.log("History: ", history_array);
  async function getData() {
    try {
      const response = await fetch('http://localhost:5430/recommend', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_history }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("hello from Curated: ", data);
      setResponseData(data);
    } catch (error) {
      console.error("Error occurred during API call:", error);
      setError(error);
    }
  }
  useEffect(()=> {
    console.log("hello hi hello")
    getData();
  }, []);
  return (
    <div className="curated-page">
      <Header />
      <ContentDiv contentData={responseData} />
    </div>
  );
};

export default Curated;
