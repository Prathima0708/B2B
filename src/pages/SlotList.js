import { Box, Tab, Tabs } from "@mui/material";
import {
  Button,
  Card,
  CardBody,
  Select,
  Table,
  TableCell,
  TableContainer,
  TableHeader,
} from "@windmill/react-ui";
import { FiChevronLeft, FiChevronRight, FiPlus } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import hasPermission, { PAGE_STORE_ZONE_SLOT_LIST } from "../components/login/hasPermission";

import Loading from "../components/preloader/Loading";
import MainDrawer from "../components/drawer/MainDrawer";
import PageTitle from "../components/Typography/PageTitle";
import { SidebarContext } from "../context/SidebarContext";
import SlotDrawer from "../components/drawer/SlotDrawer";
import SlotTable from "../components/Store/SlotTable";
import apiService from "../utils/apiService";
import { notifyError } from "../utils/toast";

const SlotList = () => {
  const { toggleDrawer } = useContext(SidebarContext);
  const { id, zoneId } = useParams();
  const [storeZoneSlots, setStoreZoneSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [daySlots, setDaySlots] = useState([]);
  const [update, setUpdate] = useState(false);

  const dayOptions = [
    { id: 0, day: "Sunday" },
    { id: 1, day: "Monday" },
    { id: 2, day: "Tuesday" },
    { id: 3, day: "Wednesday" },
    { id: 4, day: "Thursday" },
    { id: 5, day: "Friday" },
    { id: 6, day: "Saturday" },
  ];
  const [day, setDay] = useState(dayOptions[0]);

  useEffect(async () => {
    await apiService
      .get(`b2b`, `/slots/get/${zoneId}`, { "x-store-id": id })
      .then((data) => {
        setStoreZoneSlots(data.data.dayWiseSlots);
        const filteredArray = [];
        data.data.dayWiseSlots
          .filter((slotObject) => slotObject.day === day.id)

          .forEach(({ daySlots }) => {
            filteredArray.push(daySlots);
          });

        setDaySlots(...filteredArray);
        setLoading(false);
      })
      .catch((err) => {
        notifyError(err.response.data.message);
        setLoading(false);
      });
  }, [day, update]);

  useEffect(() => {}, [storeZoneSlots, day]);
  useEffect(() => {
    const filteredArray = [];
    storeZoneSlots
      .filter((slotObject) => slotObject.day === day.id)
      .forEach(({ daySlots }) => {
        filteredArray.push(daySlots);
      });
    setDaySlots(...filteredArray);
  }, [day]);
  return (
    <>
      <PageTitle>Store Slots</PageTitle>
      {hasPermission(PAGE_STORE_ZONE_SLOT_LIST, "create") && (
        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
          <CardBody>
            <div className="w-full  md:flex-grow lg:flex-grow xl:flex-grow">
              <Button onClick={toggleDrawer} className="w-full rounded-md h-12">
                <span className="mr-3">
                  <FiPlus />
                </span>
                Add Slot
              </Button>
            </div>
            {/* </div> */}
          </CardBody>
        </Card>
      )}
      {loading ? (
        <Loading loading={loading} />
      ) : (
        <>
          <div className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-t-md flex flex-row flex-wrap justify-between">
            {dayOptions.map((opt) => (
              <div
                onClick={() => setDay(dayOptions[opt.id])}
                className={`h-12 m-2 rounded-md border-gray-400 border-2 w-32 flex justify-center items-center cursor-pointer hover:bg-cool-gray-400 hover:text-gray-700 ${
                  day.id === opt.id && `bg-cool-gray-200 text-gray-700`
                }`}
                key={opt.id}
              >
                <span>{opt.day}</span>
              </div>
            ))}
          </div>
          <TableContainer className="mb-8 rounded-b-lg">
            <Table>
              <TableHeader>
                <tr>
                  <TableCell>ID</TableCell>
                  <TableCell>Start Time</TableCell>
                  <TableCell>End TIme</TableCell>
                  <TableCell>Slot Margin</TableCell>
                  {hasPermission(PAGE_STORE_ZONE_SLOT_LIST, "toggleStatus") && <TableCell>Status</TableCell>}
                  {hasPermission(PAGE_STORE_ZONE_SLOT_LIST, "update") && <TableCell>Actions</TableCell>}
                </tr>
              </TableHeader>
              <SlotTable daySlots={daySlots} day={day} onUpdate={setUpdate} />
            </Table>
          </TableContainer>
        </>
      )}
    </>
  );
};

export default SlotList;
