import "../../../node_modules/video-react/dist/video-react.css";
import React, { useEffect, useRef } from "react";
import {
  Player,
  ControlBar,
  PlaybackRateMenuButton,
  ClosedCaptionButton,
} from "video-react";

const VideoBox = () => {
  const playerRef = useRef(null);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.playbackRate = 2;
    }
  }, []);

  return (
    <Player
      videoId="video-1"
      autoPlay
      ref={playerRef}
      playsInline
      poster="https://video-react.js.org/assets/poster.png"
    >
      <source
        src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
        type="video/mp4"
      />
      <source
        src="//d2zihajmogu5jn.cloudfront.net/elephantsdream/ed_hd.ogg"
        type="video/ogg"
      />

      <track
        kind="captions"
        src="/assets/elephantsdream/captions.en.vtt"
        srcLang="en"
        label="English"
        default
      />
      <track
        kind="captions"
        src="/assets/elephantsdream/captions.sv.vtt"
        srcLang="sv"
        label="Swedish"
      />
      <ControlBar>
        <PlaybackRateMenuButton rates={[5, 2, 1, 0.5, 0.1]} />
        <ClosedCaptionButton order={2} />
      </ControlBar>
    </Player>
  );
};

export default VideoBox;
