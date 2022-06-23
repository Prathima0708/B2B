import { Badge } from "@windmill/react-ui";
import React, { useState, useEffect } from "react";

const Timer = (props) => {
  const { initialMinutes = 0, initialSeconds = 0 } = props;
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);
  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(myInterval);
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  return (
    <div>
      {minutes === 0 && seconds === 0 ? (
        <Badge
          type="success"
          className="text-gray-700 dark:text-gray-400 text-xs mt-2 ml-2 cursor-pointer"
          onClick={() => {
            setMinutes(0);
            setSeconds(30);
          }}
        >
          Resend OTP
        </Badge>
      ) : (
        <div className="flex">
          <p className="text-gray-700 dark:text-gray-400 text-xs mt-2 ml-2">
            Resend OTP in
          </p>
          <p className="text-gray-700 dark:text-gray-400 text-xs mt-2 ml-1">
            {minutes < 10 ? `0${minutes}` : minutes}:
            {seconds < 10 ? `0${seconds}` : seconds}
          </p>
        </div>
      )}
    </div>
  );
};

export default Timer;
