import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import MapForChoicePoints from "../MapForChoicePoints/MapForChoicePoints";

const RouteTA = () => {
  const { mapGeo, key } = useSelector((state) => state.mapSlice);

  return (
    <div>
      <MapForChoicePoints />
    </div>
  );
};

export default RouteTA;
