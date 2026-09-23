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
      const difference = destination - now;

      if (difference <= 0) {
        clearInterval(interval);
        setDays(0);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
        return;
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);

      setDays(d);
      setHours(h);
      setMinutes(m);
      setSeconds(s);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatNum = (num) => String(num).padStart(2, "0");

  return (
    <div className="clock__wrapper">
      <div className="clock__item">
        <div className="clock__tile">
          <span className="clock__number">{formatNum(days)}</span>
        </div>
        <span className="clock__label">Ngày</span>
      </div>

      <span className="clock__divider">:</span>

      <div className="clock__item">
        <div className="clock__tile">
          <span className="clock__number">{formatNum(hours)}</span>
        </div>
        <span className="clock__label">Giờ</span>
      </div>

      <span className="clock__divider">:</span>

      <div className="clock__item">
        <div className="clock__tile">
          <span className="clock__number">{formatNum(minutes)}</span>
        </div>
        <span className="clock__label">Phút</span>
      </div>

      <span className="clock__divider">:</span>

      <div className="clock__item">
        <div className="clock__tile">
          <span className="clock__number">{formatNum(seconds)}</span>
        </div>
        <span className="clock__label">Giây</span>
      </div>
    </div>
  );
};

export default Clock;
