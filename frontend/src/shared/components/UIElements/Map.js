import React, { useRef, useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";

import "./Map.css";

const Map = (props) => {
  const mapRef = useRef();

  const { center, zoom } = props;
  // useEffect(() => {
  //   const map = new Map(mapRef.current, {
  //     center: props.center,
  //     zoom: props.zoom,
  //   });
  //   new Marker({ position: center, map: map });
  // }, [center, zoom]);
  const loader = new Loader({
    apiKey: "YOUR_API_KEY",
    version: "weekly",
  });
  let marker;
  let map;
  useEffect(() => {
    // loader
    //   .then(async () => {
    //     const { Map } = await google.maps.importLibrary("maps");
    //     map = new Map(document.getElementById("map"), {
    //       center: { lat: -34.397, lng: 150.644 },
    //       zoom: 8,
    //     });
    //   })
    //   .then(() => {
    //     marker = new AdvancedMarkerElement({
    //       map: map,
    //       position: position,
    //       title: "Uluru",
    //     });
    //   });
    const createMap = async () => {
      const { Map } = await window.google.maps.importLibrary("maps");
      const { AdvancedMarkerElement } = await window.google.maps.importLibrary(
        "marker"
      );

      // The map, centered at Uluru
      map = new Map(mapRef.current, {
        zoom: zoom,
        center: center,
        mapId: "DEMO_MAP_ID",
      });

      // The marker, positioned at Uluru
      const marker = new AdvancedMarkerElement({
        map: map,
        position: center,
      });
    };
    createMap();
  }, [center, zoom]);

  return (
    <div
      className={`map ${props.className}`}
      style={props.style}
      ref={mapRef}
    ></div>
  );
};

export default Map;
