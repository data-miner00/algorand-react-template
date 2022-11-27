import React from "react";

function Loading(): JSX.Element {
  return (
    <div className="absolute inset-0 bg-gray-400 bg-opacity-60">
      <span>Awaiting transaction to be approved...</span>
    </div>
  );
}

export default Loading;
