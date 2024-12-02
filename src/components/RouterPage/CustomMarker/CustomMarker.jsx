/////// hooks
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

/////// components
import { Marker } from "@react-google-maps/api";

////// icons
import iconMap from "../../../assets/images/map.png";

///// style
import "./style.scss";

///// helpers
import { myAlert } from "../../../helpers/MyAlert";

///// fns

const CustomMarker = (props) => {
  const { position, index, setCenter, setZoom, item, mapRef } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const refIcon = useRef(null);

  const clickPoint = async () => {
    if (mapRef.current) {
      mapRef.current.setZoom(14);
      setCenter(position);
    }

    if (!!position?.agent_guid) {
    }
  };

  return (
    <div onClick={clickPoint} className="nurdin">
      <Marker
        ref={refIcon}
        position={position}
        icon={{
          url: iconMap,
          scaledSize: new window.google.maps.Size(19, 30),
        }}
        onClick={clickPoint}
        label={{
          text: `${index + 1}. ${item?.agent}`,
          className: `textMaps `,
          fontWeight: "600",
          fontSize: "10px",
          clickable: true,
          cursor: "pointer",
          color: "#222",
        }}
      />
    </div>
  );
};

export default CustomMarker;
