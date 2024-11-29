import React, { useEffect, useRef } from "react";
import { ReactMediaRecorder } from "react-media-recorder";

const VideoPreview = ({ stream } ) =>  {
    { stream: MediaStream || null }
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (!stream) {
    return <p>No video stream available</p>;
  }

  return <video useRef={videoRef} width={500} height={500} autoPlay muted />;
};

const Record = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Video Recorder</h1>
      <ReactMediaRecorder
        video
        render={({ status, startRecording, stopRecording, mediaBlobUrl, previewStream }) => (
          <div>
            <div className="mb-4">
              <button
                onClick={startRecording}
                className="px-4 py-2 bg-green-500 text-white rounded mr-2"
              >
                Start Recording
              </button>
              <button
                onClick={stopRecording}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Stop Recording
              </button>
            </div>
            <div className="mb-4">
              <p>Status: {status}</p>
              <VideoPreview stream={previewStream} />
            </div>
            {mediaBlobUrl && (
              <div>
                <h3 className="text-lg font-semibold">Recorded Video:</h3>
                <video src={mediaBlobUrl} controls width={500} height={500} />
                <a
                  href={mediaBlobUrl}
                  download="recorded-video.mp4"
                  className="block mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Download Video
                </a>
              </div>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default Record;
