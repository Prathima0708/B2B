import { FiMinus, FiPlus } from "react-icons/fi";
import React, { useState } from "react";
import hasPermission, {
  PAGE_STORE_UPDATE,
  PAGE_STORE_ZONE_SLOT_LIST,
} from "../login/hasPermission";

import CircularProgress from "@mui/material/CircularProgress";
import { Link } from "react-router-dom";

import axios from "axios";
import { coreServiceBaseUrl } from "../../utils/backendUrls";
import { notifyError } from "../../utils/toast";

const ZoneItem = ({ name, mapped, zone_id, storeId, update, display }) => {
  const [loading, setLoading] = useState(false);
  const handleAddStoreToZone = async () => {
    setLoading(true);
    await axios
      .post(
        `${coreServiceBaseUrl}/location/addZoneStore`,
        { zone_id },
        {
          params: { "x-store-id": storeId },
        }
      )
      .then(() => {
        update((prevData) => !prevData);
        setLoading(false);
      })
      .catch((err) => {
        notifyError(err.response.data.errorMessage);
        setLoading(false);
      });
  };

  const handleRemoveStoreFromZone = async () => {
    setLoading(true);
    await axios
      .delete(
        `${coreServiceBaseUrl}/location/deleteZoneStore/${mapped.zone_id}`,
        {
          params: { "x-store-id": storeId },
        }
      )
      .then(() => {
        update((prevData) => {
          return !prevData;
        });
        setLoading(false);
      })
      .catch((err) => {
        notifyError(err.response.data.errorMessage);
        setLoading(false);
      });
  };

  return (
    <div
      className="h-10 flex-shrink bg-gray-300 m-2 p-2 rounded-md"
      style={{ display: display === false ? "none" : "block" }}
    >
      <div className="flex flex-row">
        {mapped ? (
          <>
            {hasPermission(PAGE_STORE_ZONE_SLOT_LIST) ? (
              <Link to={`/store/${storeId}/zone/${zone_id}/slots`}>
                <p className=" text-cool-gray-800 mx-1">{name}</p>
              </Link>
            ) : (
              <p className=" cursor-default text-cool-gray-800 mx-1">{name}</p>
            )}
            {hasPermission(PAGE_STORE_UPDATE, "deleteZone") && (
              <>
                {!loading ? (
                  <span
                    onClick={handleRemoveStoreFromZone}
                    className="self-center ml-2 cursor-pointer rounded-full p-1 text-l text-red-600 hover:bg-red-300"
                  >
                    <FiMinus />
                  </span>
                ) : (
                  <span className="self-center ml-2 cursor-pointer ">
                    <CircularProgress size={10} />
                  </span>
                )}
              </>
            )}
          </>
        ) : (
          <>
            <p className="cursor-default text-cool-gray-800 mx-1">{name}</p>
            {hasPermission(PAGE_STORE_UPDATE, "addZone") && (
              <>
                {!loading ? (
                  <span
                    onClick={handleAddStoreToZone}
                    className="self-center ml-2 cursor-pointer rounded-full p-1 text-l text-green-600 hover:bg-green-300"
                  >
                    <FiPlus />
                  </span>
                ) : (
                  <span className="self-center ml-2 cursor-pointer ">
                    <CircularProgress size={10} />
                  </span>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ZoneItem;
