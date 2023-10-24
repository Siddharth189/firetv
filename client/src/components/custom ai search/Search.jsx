import { useState } from "react";
import { GrSearch } from "react-icons/gr";
import "./style.css";
import VoiceRecorderComponent from "./VoiceRecorderComponent";

const Search = () => {
  const [searchText, setSearchText] = useState("");
  const [responseData, setResponseData] = useState([]);
  const [error, setError] = useState(null);

  const handleMicClick = async () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchText(transcript);
    };

    recognition.start();
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/search-msg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchText }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setResponseData(data);
    } catch (error) {
      console.error("Error occurred during API call:", error);
      setError(error);
    }
  };

  return (
    <div className="flex-row">
      <form className="flex-row" onSubmit={handleFormSubmit}>
        <VoiceRecorderComponent onSpeechResult={setSearchText} />

        <input
          name="search"
          type="text"
          className="custom-search"
          placeholder="AI powered custom search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button
          className="search-btn"
          type="submit"
          style={{ marginLeft: "-60px" }}
        >
          <GrSearch />
        </button>
      </form>
      <div className="response-container">
        {error && <div>Error: {error.message}</div>}
        {/* 
        {responseData?.map((item, index) => (
          <div key={index} className="response-item">
            <p>{JSON.stringify(item)}</p>
          </div>
        )} 
        */}
        {console.log(responseData)}
      </div>
    </div>
  );
};

export default Search;
