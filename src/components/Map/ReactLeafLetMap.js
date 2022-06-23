import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import React, { useEffect, useState } from "react";

const LocationMarker = ({ shopLatLng, setShopLatLng }) => {
  const [position, setPosition] = useState(null);
  useEffect(() => {
    if (shopLatLng) setPosition(shopLatLng);
  }, [shopLatLng]);
  useMapEvents({
    click(e) {
      setShopLatLng(e.latlng);
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  );
};
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
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
