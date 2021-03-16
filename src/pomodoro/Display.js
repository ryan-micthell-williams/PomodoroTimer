import React from "react";
import { secondsToDuration, minutesToDuration } from "../utils/duration";
import useInterval from "../utils/useInterval";

export default function Display({ TimerData, isTimerRunning, setTimerData }) {
  let {
    focusSecs,
    counter,
    focusTime,
    displayName,
    breakTime,
    breakSecs,
    onFocus,
  } = TimerData;
  let paused = !isTimerRunning ? "block" : "none";
  let currentSession = onFocus
    ? {
        mins: focusTime,
        secs: focusSecs,
      }
    : { mins: breakTime, secs: breakSecs };

  useInterval(
    () => {
      setTimerData((currentData) => {
        if (
          currentData.displayName === "Focusing" &&
          currentData.counter >= currentData.focusSecs
        ) {
          currentData.counter = 0;
          currentData.displayName = "On Break";
          currentData.onFocus = !currentData.onFocus;
          new Audio("https://bigsoundbank.com/UPLOAD/mp3/1975.mp3").play();
        } else if (
          currentData.displayName === "On Break" &&
          currentData.counter >= currentData.breakSecs
        ) {
          currentData.counter = 0;
          currentData.displayName = "Focusing";
          currentData.onFocus = !currentData.onFocus;
          new Audio("https://bigsoundbank.com/UPLOAD/mp3/2267.mp3").play();
        }

        return { ...currentData, counter: currentData.counter + 1 };
      });
    },
    isTimerRunning ? 1000 : null
  );
  let bar = `${(counter / currentSession.secs) * 100}`;
  return (
    <div style={{ display: `${TimerData.display}` }}>
      {/* TODO: This area should show only when a focus or break session is running or pauses */}
      <div className="row mb-2">
        <div className="col">
          {/* TODO: Update message below to include current session (Focusing or On Break) and total duration */}
          <h2 data-testid="session-title">
            {displayName} for {minutesToDuration(currentSession.mins)} minutes
          </h2>
          {/* TODO: Update message below to include time remaining in the current session */}
          <p className="lead" data-testid="session-sub-title">
            {secondsToDuration(currentSession.secs - counter)} remaining
          </p>
        </div>
      </div>
      <div style={{ display: paused }}>
        <h3>Paused</h3>
      </div>
      <div className="row mb-2">
        <div className="col">
          <div className="progress" style={{ height: "20px" }}>
            <div
              className="progress-bar"
              role="progressbar"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={bar} // TODO: Increase aria-valuenow as elapsed time increases
              style={{ width: `${bar}%` }} // TODO: Increase width % as elapsed time increases
            />
          </div>
        </div>
      </div>
    </div>
  );
}