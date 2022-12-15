import React from "react";
import { Campaign } from "../upreach";
import css from "./statscontainer.module.css";

function Statistic(name: string, imageLink: string, value: string) {
  return (
    <div className={css.statistic}>
      <img src={imageLink}></img>
      <h1>{name}</h1>
      <h1>{value}</h1>
    </div>
  );
}

function StatsContainer({ sent, opens, replies, clicks }: any) {
  return (
    <div className={css.stats_container}>
      {Statistic("Sent", `/icons/icons8-${"airplane"}-48.png`, sent)}
      {Statistic("Opens", `/icons/icons8-${"flag-in-hole"}-48.png`, opens)}
      {Statistic(
        "Clicks",
        "/icons/icons8-natural-user-interface-2-50.png",
        clicks
      )}
      {Statistic("Replies", `/icons/icons8-${"bullseye"}-48.png`, replies)}
    </div>
  );
}

export default StatsContainer;
