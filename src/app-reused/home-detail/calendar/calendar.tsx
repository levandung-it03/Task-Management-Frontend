'use client'

import { useState } from "react";
import dayjs from "dayjs";
import "./calendar.scss";

export default function Calendar() {
  const today = dayjs();
  const [currentDate] = useState(today);

  const startOfMonth = currentDate.startOf("month");
  const startDay = startOfMonth.day();
  const daysInMonth = currentDate.daysInMonth();

  type Day = number | null;

  const days: Day[] = [];
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  return (
    <div className="calendar-container">
      <h2 className="calendar-header">
        {currentDate.format("MMMM YYYY")}
      </h2>
      <table className="calendar-table">
        <thead>
          <tr>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <th key={d}>{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: Math.ceil(days.length / 7) }).map((_, weekIndex) => (
            <tr key={weekIndex}>
              {days.slice(weekIndex * 7, weekIndex * 7 + 7).map((day, dayIndex) => (
                <td
                  key={dayIndex}
                  className={`day-cell ${day === today.date() && currentDate.isSame(today, "month")
                      ? "today"
                      : ""
                    }`}
                >
                  {day || ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}