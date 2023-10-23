import React, { useState } from "react";
import OneDrive from "./OneDrive";
import Pick from "./Pick";

const Fileupload = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setSelectedFile(null);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  return (
    <div>
      <h1>Select an Upload Option</h1>
      <select onChange={(e) => handleOptionSelect(e.target.value)}>
        <option value="">Select an option</option>
        <option value="google_drive">Google Drive</option>
        <option value="one_drive">OneDrive</option>
        <option value="computer">My Computer</option>
      </select>

      {selectedOption && (
        <div>
          <h2>{selectedOption}</h2>

          {selectedOption === "computer" ? (
            <div>
              <input type="file" onChange={handleFileSelect} />
            </div>
          ) : selectedOption === "google_drive" ? (
            <div>
              <Pick />
            </div>
          ) : selectedOption === "one_drive" ? (
            <div>
              <OneDrive />
            </div>
          ) : null}

          {selectedFile && (
            <div>
              <h3>Selected File or Folder:</h3>
              <p>{selectedFile.name}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Fileupload;
