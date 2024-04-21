import React, { PureComponent } from "react";
import ReactPlayer from "react-player";

class Video extends PureComponent {
  render() {
    return (
      <ReactPlayer
        width="100%"
        height="auto"
        pip
        controls
        config={{ file: { forceHLS: true } }}
       
      />
    );
  }
}

export default Video;
