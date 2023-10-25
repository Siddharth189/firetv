import { useState } from "react";
import Header from "../Header";
import ContentDiv from "../DivHavingContentCards/ContentDiv";
import "./styles.css";

const Curated = () => {
  const [responseData, setResponseData] = useState([]);
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

  return (
    <div className="curated-page">
      <Header />
      <ContentDiv contentData={data} />
    </div>
  );
};

export default Curated;
