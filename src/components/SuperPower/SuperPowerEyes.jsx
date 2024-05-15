import React from "react";
import styles from "./SuperPower.module.css";

const SuperPowerEyes = () => {
  return (
    <div className={styles.modal}>
      <h2>Прозрение</h2>
      <p>На 5 секунд показываются все карты. Таймер длительности игры на это время останавливается.</p>
    </div>
  );
};

export default SuperPowerEyes;
