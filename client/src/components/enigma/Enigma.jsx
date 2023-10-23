import { useState } from "react";

const Enigma = () => {
  const [resp, setResp] = useState("");
  const [content_desc, setContent_desc] = useState("Jawan");
  const [query, setQuery] = useState("");

  const formatResponse = (response) => {
    const formattedResponse = response.replace(
      /\*\*(.*?)\*\*/g,
      "<strong>$1</strong>"
    );

    // Replace new lines with <br> tags
    const finalFormattedResponse = formattedResponse.replace(/\n/g, "<br>");

    return finalFormattedResponse;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/bot_response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content_desc, query }),
      });
      const data = await response.json();
      const formattedData = formatResponse(data.response);
      setResp(formattedData);
    } catch (error) {
      console.error("Error fetching data from the server:", error);
    }
  };

  return (
    <div className="flex-column">
      <h1>Welcome to the ~Enigma</h1>
      <form onSubmit={handleSubmit} className="flex-column">
        <input type="text" name="content_name" value={content_desc} />
        <input
          type="text"
          name="query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <input type="submit" value="Submit" />
      </form>
      <div dangerouslySetInnerHTML={{ __html: resp }}></div>
    </div>
  );
};

export default Enigma;
