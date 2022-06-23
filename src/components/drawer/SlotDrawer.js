import { Select } from "@windmill/react-ui";
import React, { useContext, useEffect, useState } from "react";
import {
  dayOptions,
  startTimeOption,
  stopTimeOption,
} from "../../utils/dayAndTimeUtils";
import { notifyError, notifySuccess } from "../../utils/toast";

import DrawerButton from "../form/DrawerButton";
import LabelArea from "../form/LabelArea";
import Scrollbars from "react-custom-scrollbars";
import { SidebarContext } from "../../context/SidebarContext";
import Title from "../form/Title";

import axios from "axios";
import { coreServiceBaseUrl } from "../../utils/backendUrls";
import { useParams } from "react-router-dom";

const SlotDrawer = ({
  slotDetails,
  onUpdate,
  selectedDay = dayOptions[0],
  id,
}) => {
  const { toggleDrawer, isDrawerOpen } = useContext(SidebarContext);
  const { id: storeId, zoneId } = useParams();

  const slotClosingOption = [
    0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240,
  ];

  const [slotStartTime, setSlotStartTime] = useState();
  const [slotEndTime, setSlotEndTime] = useState();
  const [slotMargin, setSlotMargin] = useState();
  const [slotStartTimeOption, setSlotStartTimeOption] =
    useState(startTimeOption);
  const [slotStopTimeOption, setSlotStopTimeOption] = useState(stopTimeOption);
  const [day, setDay] = useState(selectedDay);

  useEffect(() => {
    if (id) {
      setDay(slotDetails.day);
      const startTimeString = `${
        String(slotDetails.slot.startTime?.hr).length === 2
          ? slotDetails.slot.startTime?.hr
          : `0${slotDetails.slot.startTime?.hr}`
      }:${
        String(slotDetails.slot.startTime?.min).length === 2
          ? slotDetails.slot.startTime?.min
          : `0${slotDetails.slot.startTime?.min}`
      }`;
      const endTimeString = `${
        String(slotDetails.slot.endTime?.hr).length === 2
          ? slotDetails.slot.endTime?.hr
          : `0${slotDetails.slot.endTime?.hr}`
      }:${
        String(slotDetails.slot.endTime?.min).length === 2
          ? slotDetails.slot.endTime?.min
          : `0${slotDetails.slot.endTime?.min}`
      }`;
      const startTime = startTimeOption.find(
        (time) => time.time === startTimeString
      );
      const stopTime = stopTimeOption.find(
        (time) => time.time === endTimeString
      );
      setSlotStartTime(startTime?.id);
      setSlotEndTime(stopTime?.id);
      const margin = slotClosingOption.find(
        (opt) => opt === slotDetails.showSlotMarginMin
      );
      setSlotMargin(margin);
    } else {
      setSlotStartTime((prevData) => {
        if (prevData === undefined) return "";
        if (prevData === "") return undefined;
      });
      setSlotEndTime((prevData) => {
        if (prevData === undefined) return "";
        if (prevData === "") return undefined;
      });
      setSlotMargin((prevData) => {
        if (prevData === undefined) return "";
        if (prevData === "") return undefined;
      });
      setSlotStartTimeOption([...startTimeOption]);
      setSlotStopTimeOption([...stopTimeOption]);
      setDay(selectedDay);
    }
  }, [isDrawerOpen]);

  useEffect(() => {
    setSlotStartTimeOption(startTimeOption);
    setSlotStopTimeOption(stopTimeOption);

    if (slotStartTime !== undefined) {
      setSlotStopTimeOption(stopTimeOption.slice(Number(slotStartTime)));
    }
    if (slotEndTime !== undefined) {
      setSlotStartTimeOption(startTimeOption.slice(0, Number(slotEndTime) + 1));
    }
  }, [slotStartTime, slotEndTime]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const arr = [];
    for (let i = 0; i < Number(slotStartTime); i++) {
      arr[i] = 0;
    }
    for (let i = Number(slotStartTime); i < Number(slotEndTime) + 1; i++) {
      arr[i] = 1;
    }
    for (let i = Number(slotEndTime) + 1; i < 48; i++) {
      arr[i] = 0;
    }
    const slotString = arr.join("");
    if (id) {
      await axios
        .put(
          `${coreServiceBaseUrl}/slots/update/${slotDetails.slotId}`,
          {
            zone_id: Number(zoneId),
            day: day.id,
            slots: slotString,
            showSlotMarginMin: Number(slotMargin),
          },
          {
            params: {
              "x-store-id": storeId,
            },
          }
        )
        .then(() => {
          notifySuccess("Slot updated successfully");
          onUpdate((prevData) => !prevData);
          setSlotStartTime((prevData) => {
            if (prevData === undefined) return "";
            if (prevData === "") return undefined;
          });
          setSlotEndTime((prevData) => {
            if (prevData === undefined) return "";
            if (prevData === "") return undefined;
          });
          setSlotMargin((prevData) => {
            if (prevData === undefined) return "";
            if (prevData === "") return undefined;
          });
          setSlotStartTimeOption([...startTimeOption]);
          setSlotStopTimeOption([...stopTimeOption]);
          setDay(selectedDay);
          toggleDrawer();
        })
        .catch((err) => {
          notifyError(err.response.data);
          toggleDrawer();
        });
    } else {
      await axios
        .post(
          `${coreServiceBaseUrl}/slots/add`,
          {
            zone_id: Number(zoneId),
            daySlots: [
              {
                day: day.id,
                slotList: [
                  {
                    slotString,
                    showSlotMarginMin: Number(slotMargin),
                  },
                ],
              },
            ],
          },
          {
            params: {
              "x-store-id": storeId,
            },
          }
        )
        .then(() => {
          notifySuccess("Slot added successfully");
          onUpdate((prevData) => !prevData);
          setSlotStartTime((prevData) => {
            if (prevData === undefined) return "";
            if (prevData === "") return undefined;
          });
          setSlotEndTime((prevData) => {
            if (prevData === undefined) return "";
            if (prevData === "") return undefined;
          });
          setSlotMargin((prevData) => {
            if (prevData === undefined) return "";
            if (prevData === "") return undefined;
          });
          setSlotStartTimeOption([...startTimeOption]);
          setSlotStopTimeOption([...stopTimeOption]);
          setDay(selectedDay);
          toggleDrawer();
        })
        .catch((err) => {
          notifyError(err.response.data);
          toggleDrawer();
        });
    }
  };

  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {slotDetails ? (
          <Title
            title="Update Slot"
            description="Updated slot and necessary information here"
          />
        ) : (
          <Title
            title="Add Slot"
            description=" Add slot and necessary information here"
          />
        )}
      </div>
      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <form onSubmit={handleSubmit}>
          <div className="p-6 flex-grow scrollbar-hide w-full max-h-full pb-40">
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Select Day" />
              <div className="col-span-8 sm:col-span-4">
                <Select
                  onChange={(e) => setDay(dayOptions[e.target.value])}
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                  name="day"
                  value={day.id}
                >
                  {dayOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.day}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Select Slot Start Time" />
              <div className="col-span-8 sm:col-span-4">
                <Select
                  required
                  onChange={(e) => setSlotStartTime(e.target.value)}
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                  name="slotStartTime"
                  value={slotStartTime}
                >
                  <option value="" hidden>
                    Select slot start time
                  </option>
                  {slotStartTimeOption.map((time) => (
                    <option key={time.id} value={time.id}>
                      {time.time}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Select Slot End Time" />
              <div className="col-span-8 sm:col-span-4">
                <Select
                  required
                  onChange={(e) => setSlotEndTime(e.target.value)}
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                  name="slotEndTime"
                  value={slotEndTime}
                >
                  <option value="" hidden>
                    Select slot end time
                  </option>
                  {slotStopTimeOption.map((time) => (
                    <option key={time.id} value={time.id}>
                      {time.time}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Select Slot Margin" />
              <div className="col-span-8 sm:col-span-4">
                <Select
                  onChange={(e) => setSlotMargin(e.target.value)}
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                  name="slotMargin"
                  required
                  value={slotMargin}
                >
                  <option value="" hidden>
                    Select slot Margin time
                  </option>
                  {slotClosingOption.map((min, i) => (
                    <option key={i} value={min}>
                      {`${min} Minutes`}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
          <DrawerButton id={id} title="Slot" />
        </form>
      </Scrollbars>
    </>
  );
};

export default SlotDrawer;
