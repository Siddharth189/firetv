import React, { useState, useEffect } from "react";
import axios from "axios";

const VoiceRecorderComponent = () => {
  const [audio, setAudio] = useState(null);
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    // Record audio when the user clicks the record button
    const recordAudio = async () => {
      const recorder = new MediaRecorder();
      recorder.start();

      // Stop recording when the user releases the record button
      recorder.addEventListener("stop", () => {
        const audioBlob = recorder.getBlob();
        setAudio(audioBlob);
      });

      // Wait for the recording to finish
      await recorder.ready;
    };

    document
      .getElementById("record-button")
      .addEventListener("click", recordAudio);

    return () => {
      document
        .getElementById("record-button")
        .removeEventListener("click", recordAudio);
    };
  }, []);

  // Transcribe audio when the user clicks the transcribe button
  const transcribeAudio = async () => {
    const formData = new FormData();
    formData.append("audio_file", audio);

    const response = await axios.post(
      "http://localhost:5000/transcribe",
      formData
    );
    setTranscript(response.data.transcript);
  };

  return (
    <div>
      <button id="record-button">Record Audio</button>
      <button id="transcribe-button" onClick={transcribeAudio}>
        Transcribe Audio
      </button>
      <div>Transcript: {transcript}</div>
    </div>
  );
};

export default VoiceRecorderComponent;
