import React, { useEffect, useState } from "react";

const KEY = "2db51657-d7e8-43b1-afba-5dd9efb7d509";

async function loadScript() {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://js.live.net/v7.2/onedrive.js";
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

export default function OneDrive() {
  const handleCancel = () => console.log("CANCELLED");
  const [selectedFileName, setSelectedFileName] = useState(null); // State to store the selected file name

  const handleSuccess = (files) => {
    if (files.length > 0) {
      setSelectedFileName(files[0].name); // Update the selected file name
    } else {
      setSelectedFileName(null);
    }
    console.log("SUCCESS: ", files);
  };

  const handleError = (err) => {
    setSelectedFileName(null); // Clear the selected file name on error
    console.log("ERROR: ", err);
  };

  useEffect(() => {
    loadScript()
      .then(() => {
        initializeOneDrive();
      })
      .catch((error) => {
        console.error("Error loading OneDrive SDK:", error);
      });
  }, []);

  const initializeOneDrive = () => {
    if (window.OneDrive) {
      window.OneDrive.init({
        clientId: KEY,
        action: "share",
        multiSelect: true,
        openInNewWindow: true,
        advanced: {},
        success: function (files) {
          handleSuccess(files);
        },
        cancel: function () {
          handleCancel();
        },
      });
    }
  };

  const launchOneDrivePicker = function (
    oneDriveApplicationId,
    action,
    multiSelect,
    advancedOptions
  ) {
    return new Promise(function (resolve, reject) {
      if (window.OneDrive) {
        var odOptions = {
          clientId: oneDriveApplicationId,
          action: action || "download",
          multiSelect: multiSelect || true,
          openInNewWindow: true,
          advanced: advancedOptions || {},
          success: function (files) {
            handleSuccess(files);
          },
          cancel: function () {
            handleCancel();
          },
          error: function (e) {
            handleError(e);
          },
        };
        window.OneDrive.open(odOptions);
      } else {
        console.error("OneDrive SDK is not loaded. Cannot open the picker.");
        reject("OneDrive SDK is not loaded.");
      }
    });
  };

  return (
    <div className="App">
      <button onClick={() => launchOneDrivePicker(KEY, "share")}>
        Choose File
      </button>
      {selectedFileName && (
        <div>
          <p>{selectedFileName}</p>
        </div>
      )}
    </div>
  );
}
