import React, { useContext, useEffect } from "react";
import styles from "./LeaderboardPage.module.css";
import { Button } from "../../components/Button/Button";
import { Link } from "react-router-dom";
import { GetLeader } from "../../Api";
import { EasyModeContext } from "../../utils/contextMode";
import { imageAchActive, imageAchPassive, imageModeActive, imageModePassive } from "../../utils/achievementsImages";

const LeaderboardPage = () => {
  const { leaders, setLeaders, useEyes, easyMode, useCard } = useContext(EasyModeContext);
  const formatDate = diffInSecconds => {
    const minutes = Math.floor(diffInSecconds / 60);
    const seconds = diffInSecconds % 60;
    return `${minutes}:${seconds.toString().padStart("2", "0")}`;
  };
  useEffect(() => {
    GetLeader()
      .then(response => {
        // на основе готового массива, мы сортируем список лидеров по убыванию времени
        const newLeaders = response.leaders.sort((a, b) => a.time - b.time);
        // Обновляем состояние нашего массива leaders с отсортированным списком лидеров
        setLeaders(newLeaders);
      })
      .catch(err => {
        console.log(err.message);
      });
  }, [setLeaders]);
  const achievementsTwo = !useEyes && !useCard;
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.text}>Лидерборд</p>
        <Link to="/game/9">
          <Button>Начать игру</Button>
        </Link>
      </div>
      <div>
        <div className={styles.table}>
          <div>
            <div className={styles.leaderboard}>
              <p>Позиция</p>
              <p>Пользователь</p>
              <p>Достижения</p>
              <p>Время</p>
            </div>
          </div>
          <div className={styles.tbody}>
            {leaders.slice(0, 10).map((user, index) => {
              const hasHardModeAchievement = user.achievements.includes(1);
              const hasPowerAchievement = user.achievements.includes(2);
              return (
                <div className={styles.leaderboards} key={user.id}>
                  <div className={styles.line}>#{index + 1}</div>
                  <div className={styles.nameAch}>
                    <div className={styles.line}>{user.name}</div>
                    <div>
                      {hasHardModeAchievement && !easyMode ? (
                        <div className={styles.hasModes}>
                          <img className={styles.imageHasModes} src={imageModeActive} alt={`achievement`} />
                          <div className={styles.hasMode}>
                            <p>
                              Игра пройдена <br /> в сложном режиме
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className={styles.hasModes}>
                          <img className={styles.imageHasModes} src={imageModePassive} alt={`achievement`} />
                          <div className={styles.hasMode}>
                            <p>
                              Игра пройдена <br /> в легком режиме
                            </p>
                          </div>
                        </div>
                      )}
                      {hasPowerAchievement && achievementsTwo ? (
                        <div className={styles.hasModes}>
                          <img className={styles.imageHasModes} src={imageAchActive} alt={`achievement`} />
                          <div className={styles.hasMode}>
                            <p>
                              Игра пройдена <br />
                              без супер сил
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className={styles.hasModes}>
                          <img className={styles.imageHasModes} src={imageAchPassive} alt={`achievement`} />
                          <div className={styles.hasMode}>
                            <p>
                              Игра пройдена <br />с супер силами
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={styles.line}>{formatDate(user.time)}</div>
                </div>
              );
            })}
          </div>
        </div>
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
