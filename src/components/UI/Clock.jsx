import React, { useState, useEffect } from "react";
import "../../styles/clock.css";

const Clock = () => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const getDestination = () => {
      const now = new Date();
      let targetDate = new Date(now.getFullYear(), now.getMonth(), 30, 0, 0, 0);

      if (now.getTime() > targetDate.getTime()) {
        targetDate.setMonth(targetDate.getMonth() + 1);
      }
      return targetDate.getTime();
    };

    const destination = getDestination();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const different = destination - now;

      if (different <= 0) {
        clearInterval(interval);
        setDays(0);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
        return;
      }

      const d = Math.floor(different / (1000 * 60 * 60 * 24));
      const h = Math.floor(
        (different % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const m = Math.floor((different % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((different % (1000 * 60)) / 1000);

      setDays(d);
      setHours(h);
      setMinutes(m);
      setSeconds(s);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="clock__wrapper d-flex align-items-center gap-3">
      <div className="clock__data d-flex align-items-center gap-3">
        <div className="text-center">
          <h1 className="text-white fs-3 mb-2">{days}</h1>
          <h5 className="text-white fs-6">Days</h5>
        </div>
        <span className="text-white fs-3">:</span>
      </div>

      <div className="clock__data d-flex align-items-center gap-3">
        <div className="text-center">
          <h1 className="text-white fs-3 mb-2">{hours}</h1>
          <h5 className="text-white fs-6">Hours</h5>
        </div>
        <span className="text-white fs-3">:</span>
      </div>

      <div className="clock__data d-flex align-items-center gap-3">
        <div className="text-center">
          <h1 className="text-white fs-3 mb-2">{minutes}</h1>
          <h5 className="text-white fs-6">Minutes</h5>
        </div>
        <span className="text-white fs-3">:</span>
      </div>

      <div className="clock__data d-flex align-items-center gap-3">
        <div className="text-center">
          <h1 className="text-white fs-3 mb-2">{seconds}</h1>
          <h5 className="text-white fs-6">Seconds</h5>
        </div>
      </div>
    </div>
  );
};

export default Clock;
