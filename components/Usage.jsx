import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { parseISO, format } from "date-fns";
import { funnelSteps } from "../constants/funnelSteps";

const Usage = ({ events }) => {
  const [usageData, setUsageData] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("user visited home page");

  console.log(selectedEvent);

  useEffect(() => {
    const uniqueUsersByDate = {};

    // Filter the event data by selected event
    const filteredEventData = events.filter(({ event }) => event === selectedEvent);
    console.log(filteredEventData);

    // Group events by day and track distinct users
    filteredEventData.forEach(({ timestamp, event, distinct_id }) => {
      const date = format(parseISO(timestamp), "yyyy-MM-dd");

      if (!uniqueUsersByDate[date]) {
        uniqueUsersByDate[date] = new Set();
      }

      // Add distinct user to the set for that day
      uniqueUsersByDate[date].add(distinct_id);
    });

    // Convert the object to an array format for recharts
    const formattedData = Object.entries(uniqueUsersByDate).map(([date, usersSet]) => ({
      date,
      uniqueUsers: usersSet.size,
    }));

    setUsageData(formattedData); // Set the data for the chart
  }, [events, selectedEvent]);

  return (
    <div style={{ width: "100%", height: 400 }}>
    {/* Dropdown to select event */}
      <FormControl fullWidth>
        <InputLabel id="event-select-label">Select Event</InputLabel>
        <Select
          labelId="event-select-label"
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
        >
          {funnelSteps.map((step) => (
            <MenuItem key={step} value={step}>
              {step}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={usageData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="uniqueUsers" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Usage;
