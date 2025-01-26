import React from "react";
import moment from "moment";

const TimeAgo = ({ date }) => {
  const formattedTime = moment(date).format("h:mm A");
  return (
    <span className="text-xs" title={date}>
      {formattedTime}
    </span>
  );
};

export default TimeAgo;
