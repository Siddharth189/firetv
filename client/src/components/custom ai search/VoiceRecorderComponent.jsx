import React, { useState } from "react";
import { useSpeechRecognition } from "react-speech-kit";

function VoiceRecorderComponent({ onSpeechResult }) {
  const [value, setValue] = useState("");
  const { listen, listening, stop } = useSpeechRecognition({
    onResult: (result) => {
      setValue(result);
      onSpeechResult(result); // Pass the result to the parent component
    },
  });

  const handleMicClick = () => {
    if (listening) {
      stop();
    } else {
      listen();
    }
  };

  return (
    <div style={{ marginRight: "-40px", zIndex: "1" }}>
      <button onClick={handleMicClick} style={{ cursor: "pointer", fontSize: "1.5rem", background: "transparent", border: "none" , borderRadius: "50%" }}>
        {listening ? "🔴" : "🎤"} {/* Show different icon while listening */}
      </button>
    </div>
  );
}

export default VoiceRecorderComponent;