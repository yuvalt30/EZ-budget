import { Icon } from "@iconify/react";
import React from "react";
import "./Preloader.scss";

export default function Preloader() {
  return (
    <div className="preloader">
      <Icon icon="eos-icons:loading" />
    </div>
  );
}
