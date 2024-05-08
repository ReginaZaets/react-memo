import React, { useContext, useEffect } from "react";
import styles from "./LeaderboardPage.module.css";
import { Button } from "../../components/Button/Button";
import { Link } from "react-router-dom";
import { GetLeader } from "../../Api";
import { EasyModeContext } from "../../utils/contextMode";

const LeaderboardPage = () => {
  const { leaders, setLeaders } = useContext(EasyModeContext);
  const formatDate = diffInSecconds => {
    const minutes = Math.floor(diffInSecconds / 60);
    const seconds = diffInSecconds % 60;
    return `${minutes}:${seconds.toString().padStart("2", "0")}`;
  };
  useEffect(() => {
    GetLeader()
      .then(response => {
        // на основе готового массива, мы сортируем список лидеров по убыванию времени
        const isNewLeaders = response.leaders.sort((a, b) => a.time - b.time);
        // Обновляем состояние нашего массива leaders с отсортированным списком лидеров
        setLeaders(isNewLeaders);
      })
      .catch(err => {
        console.log(err.message);
      });
  }, [setLeaders]);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.text}>Лидерборд</p>
        <Link to="/game/9">
          <Button>Начать игру</Button>
        </Link>
      </div>
      <div>
        <table className={styles.table}>
          <thead>
            <tr className={styles.leaderboard}>
              <th>Позиция</th>
              <th>Пользователь</th>
              <th>Время</th>
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {leaders.slice(0, 10).map((user, index) => {
              return (
                <tr className={styles.leaderboards} key={user.id}>
                  <th>#{index + 1}</th>
                  <th>{user.name}</th>
                  <th>{formatDate(user.time)}</th>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className={styles.linkButton}>
          <Link to="/">
            <Button>Перейти к играм</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default LeaderboardPage;
