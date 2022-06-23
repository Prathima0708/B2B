import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import React, { useState } from "react";

const LocationMarker = ({ shopLatLng, setShopLatLng }) => {
  const [position, setPosition] = useState(null);
  useMapEvents({
    click(e) {
      setShopLatLng(e.latlng);
      setPosition(e.latlng);
    },
  });
  return position === null ? 
  shopLatLng ? <Marker position={shopLatLng}>
    <Popup>You are here</Popup>
  </Marker> : null
   : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  );
};
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  map.flyTo(center, map.getZoom());
  return null;
};
const ReactLeafLetMap = ({ center, zoom, shopLatLng, setShopLatLng }) => {
  return (
    <div className="map">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: "30vh", width: "50wh" }}
      >
        <ChangeView center={center} zoom={zoom} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker shopLatLng={shopLatLng} setShopLatLng={setShopLatLng} />
      </MapContainer>
    </div>
  );
};

export default ReactLeafLetMap;
