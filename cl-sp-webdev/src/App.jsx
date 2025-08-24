import { useEffect } from "react";
import "./App.css";
import { useState } from "react";

import dayjs from "dayjs";
import moonPhases from "./data.json";
import { IconChevronRight } from "@tabler/icons-react";
import { IconChevronLeft } from "@tabler/icons-react";
import { memo } from "react";

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const MoonImage = memo(function MoonImage({ phase }) {
  return <img className="moon-pic" src={moonPhases[phase].image} alt={phase} />;
});

function App() {
  const [phase, setPhase] = useState(null);
  const [loading, setLoading] = useState(true);

  const [date, setDate] = useState(dayjs());

  useEffect(() => {
    async function getMoonPhase() {
      try {
        setLoading(true);
        const response = await fetch(
          `https://aa.usno.navy.mil/api/moon/phases/date?date=${date.format("YYYY-MM-DD")}&nump=1`,
        );
        const json = await response.json();
        if (json.error) {
          console.error("API error:", json.error);
        } else if (json.phasedata && json.phasedata.length > 0) {
          const data = json.phasedata[0];
          if (data.phase != phase) setPhase(data.phase);
        } else {
          console.error("No phase data found");
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    getMoonPhase();
  }, [date]);

  return (
    <>
      {!phase ? (
        <div className="main-body">
          <MoonImage key={phase} phase="New Moon" />
          {loading && (
            <div className="loader">
              <div></div>
              <div></div>
              <div></div>
            </div>
          )}
        </div>
      ) : (
        <div className="main-body">
          <MoonImage key={phase} phase={phase} />
          {loading && (
            <div className="loader">
              <div></div>
              <div></div>
              <div></div>
            </div>
          )}

          <div className="main-text">
            <h1>{phase}</h1>
            <p>{moonPhases[phase].description}</p>
          </div>

          <div className="nav-info">
            <IconChevronLeft
              onClick={() => setDate(date.subtract(1, "day"))}
              size={72}
            />
            <div className="date-info">
              <h3>{days[date.day()]}</h3>
              <p>{date.format("YYYY-MM-DD")}</p>
            </div>
            <IconChevronRight
              onClick={() => setDate(date.add(1, "day"))}
              size={72}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default App;
