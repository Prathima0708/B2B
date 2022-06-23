import React, { useState } from "react";

import Broadcast from "./Pages/Broadcast";
import Email from "./Pages/Email";
import PageTitle from "../../components/Typography/PageTitle";
import PushNotification from "./Pages/PushNotification";
import SMS from "./Pages/SMS";

const Notification = () => {
  const notificationOptions = [
    { id: 0, type: "Broadcast" },
    { id: 1, type: "Email" },
    { id: 2, type: "SMS" },
    { id: 3, type: "Push Notification" },
  ];
  const [selectedNotification, setSelectedNotification] = useState(notificationOptions[0]);
  const renderNotificationUI = () => {
    switch (selectedNotification.id) {
      case 0:
        return <Broadcast />;
      case 1:
        return <Email />;
      case 2:
        return <SMS />;
      case 3:
        return <PushNotification />;
      default:
        return <Broadcast />;
    }
  };
  return (
    <div>
      <PageTitle>Notification</PageTitle>
      <div className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-t-md flex flex-row flex-wrap justify-between mb-2">
        {notificationOptions.map((opt) => (
          <div
            onClick={() => setSelectedNotification(notificationOptions[opt.id])}
            className={`h-12 m-2 rounded-md border-gray-400 border-2 w-32 flex justify-center items-center cursor-pointer hover:bg-cool-gray-400 hover:text-gray-700 ${
              selectedNotification.id === opt.id && `bg-cool-gray-200 text-gray-700`
            }`}
            key={opt.id}
          >
            <span>{opt.type}</span>
          </div>
        ))}
      </div>
      {renderNotificationUI()}
    </div>
  );
};

export default Notification;
