import React from "react";
import ScaleLoader from "react-spinners/ScaleLoader";

const Loading = ({ loading, height = 25, color = "#34D399" }) => {
  return (
    <div className="text-lg text-center py-6">
      <ScaleLoader color={color} loading={loading} height={height} width={3} radius={3} margin={4} />
    </div>
  );
};

export default Loading;
