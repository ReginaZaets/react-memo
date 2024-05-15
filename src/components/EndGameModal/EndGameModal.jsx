import styles from "./EndGameModal.module.css";

import { Button } from "../Button/Button";

import deadImageUrl from "./images/dead.png";
import celebrationImageUrl from "./images/celebration.png";
import { useContext, useEffect, useState } from "react";
import { EasyModeContext } from "../../utils/contextMode";
import { AddLeader, GetLeader } from "../../Api";
import { Link } from "react-router-dom";

export function EndGameModal({ isWon, gameDurationSeconds, gameDurationMinutes, onClick }) {
  // Новый лидер по времени
  const [newLeader, setNewLeader] = useState(false);
  // Текущее имя игрока(время отдельно)
  const [user, setUser] = useState("");
  const time = gameDurationSeconds + gameDurationMinutes * 60;
  //уровень сложности + список лидеров из апи
  const { setLeaders, level, easyMode, useEyes, useCard } = useContext(EasyModeContext);
  // if (!user || user !== "") {
  //   setUser("Пользователь");
  // }
  useEffect(() => {
    if (+level === 9 && isWon) {
      GetLeader()
        .then(response => {
          // на основе готового массива, мы сортируем список лидеров по убыванию времени
          const isNewLeaders = response.leaders.sort((a, b) => a.time - b.time);
          // проверяем есть ли новый лидер в первых 7 позициях(index < 7) с временем меньше текущего времени лидеров (time < leader.time)
          const isLeaders = isNewLeaders.some((leader, index) => {
            if (index < 10 && time < leader.time) {
              return true;
            }
            return false;
          });
          // Обновляем состояние нашего массива leaders с отсортированным списком лидеров
          setLeaders(isNewLeaders);
          // Обновляем состояние newLeader с результатом проверки на новых лидеров
          setNewLeader(isLeaders);
        })
        .catch(err => {
          console.log(err.message);
        });
    }
  }, [newLeader, time, setLeaders, level, isWon]);
  // Функция на кнопку добавить в лидерборд
  const handleClick = async e => {
    e.preventDefault();
    const achievements = [];
    if (!easyMode) {
      achievements.push(1);
    }
    if (!useEyes && !useCard) {
      achievements.push(2);
    }
    await AddLeader({ name: user, time, achievements })
      .then(response => {
        setLeaders(response.leaders);
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  const title = isWon ? (newLeader ? "Вы попали на Лидерборд!" : "Вы победили!") : "Вы проиграли!";

  const imgSrc = isWon ? celebrationImageUrl : deadImageUrl;

  const imgAlt = isWon ? "celebration emodji" : "dead emodji";

  return newLeader ? (
    <>
      <div className={styles.modals}>
        <img className={styles.image} src={imgSrc} alt={imgAlt} />
        <h2 className={styles.titles}>{title}</h2>
        <input
          placeholder="Пользователь"
          className={styles.input}
          type="text"
          name="user"
          value={user}
          onChange={e => setUser(e.target.value)}
        />
        <Button onClick={handleClick}>Добавить</Button>
        <p className={styles.description}>Затраченное время:</p>
        <div className={styles.time}>
          {gameDurationMinutes !== undefined ? gameDurationMinutes.toString().padStart("2", "0") : "00"}.
          {gameDurationSeconds !== undefined ? gameDurationSeconds.toString().padStart("2", "0") : "00"}
        </div>
        <Button onClick={onClick}>Начать сначала</Button>
        <Link to="/leaderboard">
          <p className={styles.text}>
            <u>Перейти к лидерборду</u>
          </p>
        </Link>
      </div>
    </>
  ) : (
    <>
      <div className={styles.modal}>
        <img className={styles.image} src={imgSrc} alt={imgAlt} />
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>Затраченное время:</p>
        <div className={styles.time}>
          {gameDurationMinutes !== undefined ? gameDurationMinutes.toString().padStart("2", "0") : "00"}.
          {gameDurationSeconds !== undefined ? gameDurationSeconds.toString().padStart("2", "0") : "00"}
        </div>
        <Button onClick={onClick}>Начать сначала</Button>
        <Link to="/">
          <Button>Перейти к играм</Button>
        </Link>
      </div>
    </>
  );
}
