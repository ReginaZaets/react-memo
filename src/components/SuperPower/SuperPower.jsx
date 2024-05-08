import React, { useState } from "react";
import eyes from "./images/eyes.png";
import circle from "./images/circle.png";
import cards from "./images/cards.png";
import { Button } from "../Button/Button";
import styles from "./SuperPower.module.css";

const SuperPower = () => {
  // Стейт для открытия/закрытия подсказки на глаз
  const [isOpenEyes, setIsOpenEyes] = useState(false);
  const handleClickImages = () => {
    setIsOpenEyes(prevState => !prevState);
  };
  return (
    <>
      <img src={eyes} alt="eyes" onClick={handleClickImages} />
      {isOpenEyes && (
        <div className={styles.modal}>
          <h2>Прозрение</h2>
          <p>На 5 секунд показываются все карты. Таймер длительности игры на это время останавливается.</p>
          <Button>Использовать</Button>
        </div>
      )}
      <div className={styles.imageOverlay}>
        <img src={circle} alt="circle" onClick={handleClickImages} />
        <img src={cards} alt="cards" className={styles.overlayImage} onClick={handleClickImages} />
      </div>
    </>
  );
};

export default SuperPower;
