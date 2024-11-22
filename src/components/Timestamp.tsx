import { faClock } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import TimestampAge from "./TimestampAge";

type TimestampProps = {
  value: number;
  age?: boolean;
};

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const Timestamp: React.FC<TimestampProps> = ({ value, age }) => {
  const d = new Date(value * 1000);
  let hour = d.getUTCHours() % 12;
  if (hour === 0) {
    hour = 12;
  }
  const am = d.getUTCHours() < 12;

  const tsString = `${months[d.getUTCMonth()]}-${d
    .getUTCDate()
    .toLocaleString(undefined, {
      minimumIntegerDigits: 2,
    })}-${d.getUTCFullYear()} ${hour.toLocaleString(undefined, {
    minimumIntegerDigits: 2,
  })}:${d.getUTCMinutes().toLocaleString(undefined, {
    minimumIntegerDigits: 2,
  })}:${d.getUTCSeconds().toLocaleString(undefined, {
    minimumIntegerDigits: 2,
  })} ${am ? "AM" : "PM"} +UTC`;

  let snippet;
  if (age === undefined || age) {
    snippet = (
      <span>
        <TimestampAge timestamp={value} /> ({tsString})
      </span>
     );
  } else {
    snippet = <span>{tsString}</span>;
  }

  return (
    <div className="flex items-baseline space-x-1">
      <FontAwesomeIcon className="self-center" icon={faClock} size="sm" />
      {snippet}
    </div>
  );
};

export default React.memo(Timestamp);
