import { Card, Input } from "@windmill/react-ui";
import React, { useEffect, useState } from "react";

import Loading from "../preloader/Loading";
import PageTitle from "../Typography/PageTitle";
import ZoneItem from "./ZoneItem";
import apiService from "../../utils/apiService";

const MapStoreToZone = ({ storeId }) => {
  const [allZone, setAllZones] = useState([]);
  const [storeZones, setSoreZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [filteredZones, setFilteredZones] = useState([]);

  useEffect(() => {
    setFilterText((prevData) => prevData);
    setLoading(true);
    apiService.get("b2b", "/location/getAllZones?activeStatus=true", null).then((data) => {
      setAllZones(data.data.zones);
      if (filterText.length === 0) setFilteredZones(data.data.zones);
      else
        setFilteredZones(
          data.data.zones.filter((az) => az.name.toLowerCase().includes(filterText.toLowerCase()))
        );
    });
    apiService
      .get("b2b", `/location/getZonesByStoreId`, {
        "x-store-id": storeId,
      })
      .then((data) => {
        return data;
      })
      .then((data) => setSoreZones(data.data.zones));
    setLoading(false);
    if (filterText.length === 0) return setFilteredZones(allZone);
    setFilteredZones(allZone.filter((az) => az.name.toLowerCase().includes(filterText.toLowerCase())));
  }, [update]);
  useEffect(() => {
    setFilterText((prevData) => prevData);
    if (filterText.length === 0) return setFilteredZones(allZone);
    setFilteredZones(allZone.filter((az) => az.name.toLowerCase().includes(filterText.toLowerCase())));
  }, [filterText]);

  return (
    <div className="mb-10">
      <PageTitle>Map Store To Zone</PageTitle>
      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 p-4 w-full  border-gray-600 border-2 mb-5">
        <p className="text-gray-700 dark:text-gray-300 m-1">Mapped Zones</p>
        {loading ? (
          <Loading loading={loading} />
        ) : (
          <div className="flex flex-row flex-wrap">
            {allZone.map((zone) => {
              const [isMapped = false] = storeZones.filter((sz) => sz.zone_id === zone.zone_id);
              return (
                <ZoneItem
                  key={zone.zone_id}
                  zone_id={zone.zone_id}
                  storeId={storeId}
                  name={zone.name}
                  mapped={isMapped}
                  update={setUpdate}
                  display={isMapped}
                />
              );
            })}
          </div>
        )}
      </Card>
      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 p-4 w-full  border-gray-600 border-2">
        <p className="text-gray-700 dark:text-gray-300 m-1">Zones</p>
        <div className="grid gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
          <div className="col-span-8 sm:col-span-4">
            <Input
              className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
              label="Search Zone"
              name="filterText"
              type="text"
              placeholder="Search Zone"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
        </div>
        {loading ? (
          <Loading loading={loading} />
        ) : (
          <div className="flex flex-row flex-wrap">
            {filteredZones.map((zone) => {
              const [isMapped = false] = storeZones.filter((sz) => sz.zone_id === zone.zone_id);
              if (isMapped) return null;
              return (
                <ZoneItem
                  key={zone.zone_id}
                  zone_id={zone.zone_id}
                  storeId={storeId}
                  name={zone.name}
                  mapped={isMapped}
                  update={setUpdate}
                />
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};

export default MapStoreToZone;
