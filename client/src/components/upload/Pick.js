import React, { useState } from "react";
import useDrivePicker from "react-google-drive-picker";
// import axios from "axios";
const Pick = () => {
  //   const sendFilesToBackend = () => {
  //     axios
  //       .post("http://localhost:3001/upload", selectedFiles) // Replace with your server's URL
  //       .then((response) => {
  //         console.log("Files sent to the backend:", response.data);
  //       })
  //       .catch((error) => {
  //         console.error("Error sending files to the backend:", error);
  //       });
  //   };

  const [openPicker, data, authResponse] = useDrivePicker();
  // const customViewsArray = [new google.picker.DocsView()]; // custom view
  const [file, setFile] = useState([]);
  const handleOpenPicker = () => {
    openPicker({
      clientId:
        "1031630573106-ftsfaeco4mb5l0oepv1d6qvlod02gif1.apps.googleusercontent.com",
      developerKey: "AIzaSyCSUw9z35xCFennTTRB92S5BWC_hvOoh9I",
      viewId: "DOCS",
      token:
        "ya29.a0AfB_byBY8KUmH3sHE43OoTBtZdW-bhFbHWOkgOiUfhu6Ecxv3qS3eMSjlwzr9IgoQJCqwqV2DWJSCvJtoKvnXwDWm0XyABzj8sRTrn-vUSkq81lRkP_wQXxGflXJKU6H4lFjqF-7cHsJ4lLw_b5ytJzkHoxbPCfE_ENdaCgYKAasSARASFQGOcNnC5tZu0WC4iaireAtNgYw7PA0171",
      // pass oauth token in case you already have one
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      // customViews: customViewsArray, // custom view
      callbackFunction: (data) => {
        if (data.action === "cancel") {
          console.log("User clicked cancel/close button");
        } else if (data.action === "picked") {
          setFile(data.docs[0]); // Assuming you want to display the first selected file
        }
      },
    });
  };

  return (
    <div>
      <button onClick={() => handleOpenPicker()}>Choose File</button>
      {file && (
        <div>
          <p>{file.name}</p>
        </div>
      )}
    </div>
  );
};

export default Pick;
