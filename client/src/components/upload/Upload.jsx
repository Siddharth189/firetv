import { useRef, useState } from "react";
import Header from "../Header";
import "./style.css";
import OneDrive from "./OneDrive";
import Pick from "./Pick";
import UPLOAD from "../../assets/images/upload3.gif";

const Upload = () => {
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

  const fileInputRef = useRef(null);
  return (
    <div className="upload-page">
      <Header />

      <div className="picker-box">
        <div
          className="flex-row"
          style={{
            width: "700px",
            backgroundColor: "#d9d9d9",
            borderRadius: "40px",
          }}
        >
          <div>
            <img src={UPLOAD} alt="U P L O A D" />
          </div>
          <div>
            <select onChange={(e) => handleOptionSelect(e.target.value)}>
              <option value="">Select an option</option>
              <option value="computer">My Computer</option>
              <option value="google_drive">Google Drive</option>
              <option value="one_drive">OneDrive</option>
            </select>

            {selectedOption && (
              <div>
                {selectedOption === "computer" ? (
                  <div>
                    <button
                      type="file"
                      onClick={() => {
                        fileInputRef.current.click();
                      }}
                    >
                      Choose File
                    </button>

                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      accept="video/*"
                      onChange={handleFileSelect}
                    />
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
                    <p style={{ marginLeft: "30px", fontSize: "1.2em" }}>
                      {selectedFile.name}
                    </p>{" "}
                    <button style={{ width: "100px", marginLeft: "130px" }}>
                      Upload
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
