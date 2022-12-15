import React from "react";
import css from "./container.module.css";

function DashboardContainer({ children }: any) {
  return <div className={css.dashboard_container}>{children}</div>;
}

export default DashboardContainer;
