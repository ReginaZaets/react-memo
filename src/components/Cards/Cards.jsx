import { shuffle } from "lodash";
import { useCallback, useContext, useEffect, useState } from "react";
import { generateDeck } from "../../utils/cards";
import styles from "./Cards.module.css";
import { EndGameModal } from "../../components/EndGameModal/EndGameModal";
import { Button } from "../../components/Button/Button";
import { Card } from "../../components/Card/Card";
import { EasyModeContext } from "../../utils/contextMode";
import { Link } from "react-router-dom";
import eyes from "./images/eyes.png";
import circle from "./images/circle.png";
import car from "./images/car.png";
import SuperPowerEyes from "../SuperPower/SuperPowerEyes";
import SuperPowerCards from "../SuperPower/SuperPowerCards";

// Игра закончилась
const STATUS_LOST = "STATUS_LOST";
const STATUS_WON = "STATUS_WON";
// Идет игра: карты закрыты, игрок может их открыть
const STATUS_IN_PROGRESS = "STATUS_IN_PROGRESS";
// Начало игры: игрок видит все карты в течении нескольких секунд
const STATUS_PREVIEW = "STATUS_PREVIEW";
// Игры ставится на паузу
const STATUS_PAUSE = "STATUS_PAUSE";

function getTimerValue(startDate, endDate) {
  if (!startDate && !endDate) {
    return {
      minutes: 0,
      seconds: 0,
    };
  }

  if (endDate === null) {
    endDate = new Date();
  }

  const diffInSecconds = Math.floor((endDate.getTime() - startDate.getTime()) / 1000);
  const minutes = Math.floor(diffInSecconds / 60);
  const seconds = diffInSecconds % 60;
  return {
    minutes,
    seconds,
  };
}

/**
 * Основной компонент игры, внутри него находится вся игровая механика и логика.
 * pairsCount - сколько пар будет в игре
 * previewSeconds - сколько секунд пользователь будет видеть все карты открытыми до начала игры
 */
export function Cards({ pairsCount = 3, previewSeconds = 5 }) {
  // Вызываем легкий режим
  const { easyMode, isLives, setIsLives, setUseEyes, useEyes, useCard, setUseCard } = useContext(EasyModeContext);

  // В cards лежит игровое поле - массив карт и их состояние открыта\закрыта
  const [cards, setCards] = useState([]);
  // Текущий статус игры
  const [status, setStatus] = useState(STATUS_PREVIEW);

  // Дата начала игры
  const [gameStartDate, setGameStartDate] = useState(null);
  // Дата конца игры
  const [gameEndDate, setGameEndDate] = useState(null);

  // Стейт для таймера, высчитывается в setInteval на основе gameStartDate и gameEndDate
  const [timer, setTimer] = useState({
    seconds: 0,
    minutes: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenCards, setIsModalOpenCards] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };
  const openModalCards = () => {
    setIsModalOpenCards(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const closeModalCards = () => {
    setIsModalOpenCards(false);
  };
  // Стейт для открытия только двух карт
  const [isBlockedOpen, seIsBlockedOpen] = useState(false);
  // Функция для уменьшения количества жизней
  const DecreaseLives = () => {
    if (isLives > 0) {
      setIsLives(prevLives => prevLives - 1);
    }
  };

  // Функция для обновления количества жизней в новой игре
  const ResetLives = useCallback(() => {
    setIsLives(3);
  }, [setIsLives]);

  function finishGame(status = STATUS_LOST) {
    setGameEndDate(new Date());
    setStatus(status);
  }
  // Используем useCallback для создания функции startGame, чтобы она не менялась при каждом рендере(ругается линтер)
  const startGame = useCallback(() => {
    const startDate = new Date();
    setGameEndDate(null);
    setGameStartDate(startDate);
    setTimer(getTimerValue(startDate, null));
    setStatus(STATUS_IN_PROGRESS);
    ResetLives();
    setUseEyes(false);
    setUseCard(false);
  }, [setUseCard, ResetLives, setUseEyes]);
  function resetGame() {
    setGameStartDate(null);
    setGameEndDate(null);
    setTimer(getTimerValue(null, null));
    setStatus(STATUS_PREVIEW);
    setUseEyes(false);
    setUseCard(false);
  }
  /**
   * Обработка основного действия в игре - открытие карты.
   * После открытия карты игра может пепереходит в следующие состояния
   * - "Игрок выиграл", если на поле открыты все карты
   * - "Игрок проиграл", если на поле есть две открытые карты без пары
   * - "Игра продолжается", если не случилось первых двух условий
   */
  const openCard = clickedCard => {
    // Проверяем, если карт не две, то ничего не делаем
    if (isBlockedOpen) {
      return;
    }
    // Если карта уже открыта, то ничего не делаем
    if (clickedCard.open) {
      return;
    }
    // Игровое поле после открытия кликнутой карты
    const nextCards = cards.map(card => {
      if (card.id !== clickedCard.id) {
        return card;
      }

      return {
        ...card,
        open: true,
      };
    });

    setCards(nextCards);

    const isPlayerWon = nextCards.every(card => card.open);

    // Победа - все карты на поле открыты
    if (isPlayerWon) {
      if (easyMode === true) {
        // Уменьшаем количество жизней
        DecreaseLives();
        // Проверяем, если игрок потерял все жизни
        if (isLives < 1) {
          finishGame(STATUS_LOST);
          alert("Вы проиграли все жизни! Игра окончена.");
          resetGame();
        } else {
          finishGame(STATUS_WON);
        }
        return;
      }
      finishGame(STATUS_WON);
    }

    // Открытые карты на игровом поле
    const openCards = nextCards.filter(card => card.open);

    // Ищем открытые карты, у которых нет пары среди других открытых
    const openCardsWithoutPair = openCards.filter(card => {
      const sameCards = openCards.filter(openCard => card.suit === openCard.suit && card.rank === openCard.rank);
      // Если есть пара, оставляем карты открытыми?
      if (sameCards.length < 2) {
        return true;
      }

      return false;
    });

    const playerLost = openCardsWithoutPair.length >= 2;

    // Проверяем, если игрок проиграл (например, если на поле есть две открытые карты без пары)
    if (playerLost) {
      if (easyMode === true) {
        // Этот код закрывает две последние не правильно подобранные карты, если они подходят, то они остаются открытыми
        // Проверяем, есть ли среди открытых карт те, кто не имеет пару
        if (openCardsWithoutPair.length > 0) {
          // Если открыты 2 карты, мы меняем состояние карт на закрытые
          seIsBlockedOpen(true);
          // Создаем массив, который содержит две последние открытые карты
          const lastTwoCard = openCardsWithoutPair.slice(-2).map(card => card.id);
          // Создаем массив, который проверяет карточки по айди
          const updatedCard = nextCards.map(card => {
            // Проверяем есть ли текущий айди карты в массиве lastTwoCard
            if (lastTwoCard.includes(card.id)) {
              return { ...card, open: true };
            }
            return card;
          });
          // Обновляем состояние карт
          setCards(updatedCard);
          // Показываем карты на пару секунд, а затем закрываем их
          setTimeout(() => {
            const updatedCards = nextCards.map(card => {
              if (lastTwoCard.includes(card.id)) {
                return { ...card, open: false }; // Закрываем неправильные карты
              }
              return card;
            });
            // Обратно меняет состояние блокировки карт, чтобы можно было нажать на карты
            seIsBlockedOpen(false);
            setCards(updatedCards);
          }, 1000); // Показываем карты на 1 секунду
        }
        // Уменьшаем количество жизней
        DecreaseLives();
        // Проверяем, если игрок потерял все жизни
        if (isLives <= 1) {
          finishGame(STATUS_LOST);
        }
      } else {
        finishGame(STATUS_LOST);
      }
      return;
    }

    // ... игра продолжается
  };

  const isGameEnded = status === STATUS_LOST || status === STATUS_WON;

  // Игровой цикл
  useEffect(() => {
    // В статусах кроме превью доп логики не требуется
    if (status !== STATUS_PREVIEW) {
      return;
    }

    // В статусе превью мы
    if (pairsCount > 36) {
      alert("Столько пар сделать невозможно");
      return;
    }

    setCards(() => {
      return shuffle(generateDeck(pairsCount, 10));
    });

    const timerId = setTimeout(() => {
      startGame();
    }, previewSeconds * 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [status, pairsCount, previewSeconds, startGame]);

  //Обновляем значение таймера в интервале
  useEffect(() => {
    if (status !== STATUS_PAUSE) {
      if (status === STATUS_LOST) return;
      if (status === STATUS_WON) return;
      const intervalId = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer) {
            const seconds = prevTimer.seconds === 59 ? 0 : prevTimer.seconds + 1;
            const minutes = prevTimer.seconds === 59 ? prevTimer.minutes + 1 : prevTimer.minutes;
            return { seconds, minutes };
          }
          return prevTimer;
        });
      }, 1000);
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [status, gameStartDate, gameEndDate]);

  const habdleAchievementEyesClick = () => {
    setStatus(STATUS_PAUSE);
    setUseEyes(true);
    setIsModalOpen(false);
    // Сохраняем состояние открытых ранее игроком карт
    const userOpenCards = cards.filter(card => card.open);
    // Открываем остальные карты
    const openCardsAll = cards.map(card => ({ ...card, open: true }));
    setCards(openCardsAll);

    setTimeout(() => {
      // Восстанавливаем состояние открытых карт игроком
      const closedUserCards = cards.map(card => {
        if (userOpenCards.some(openCard => openCard.id === card.id)) {
          return { ...card, open: true }; // Карты, открытые игроком, остаются открытыми
        } else {
          return { ...card, open: false }; // Остальные карты закрываются
        }
      });

      setCards(closedUserCards);
      // Обратно меняет состояние блокировки карт, чтобы можно было нажать на карты
      seIsBlockedOpen(false);

      setStatus(STATUS_IN_PROGRESS);
    }, 5000); // Показываем карты на 5 секунд
  };

  const habdleAchievementCardClick = () => {
    // создаем массив и фильтруем только те карты, которые не были открыты
    const notOpenedCards = cards.filter(card => !card.open);
    // выбираем случайную карту из массива, случайное число(0,1) умножается на длину массива и округляется
    const randomCard = notOpenedCards[Math.floor(Math.random() * notOpenedCards.length)];
    // создается новый массив, содержит те карты, что совпадают с масть и рангом выбранной случайной карты
    const randomPair = notOpenedCards.filter(
      sameCards => randomCard.suit === sameCards.suit && randomCard.rank === sameCards.rank,
    );
    //открывем эти две карты
    randomPair[1].open = true;
    randomPair[0].open = true;
    // больше нельзя использовать алахамору
    // setUseCard(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.timer}>
          {status === STATUS_PREVIEW ? (
            <div>
              <p className={styles.previewText}>Запоминайте пары!</p>
              <p className={styles.previewDescription}>Игра начнется через {previewSeconds} секунд</p>
            </div>
          ) : (
            <>
              <div className={styles.timerValue}>
                <div className={styles.timerDescription}>min</div>
                <div>{timer.minutes !== undefined ? timer.minutes.toString().padStart("2", "0") : "00"}</div>
              </div>
              .
              <div className={styles.timerValue}>
                <div className={styles.timerDescription}>sec</div>
                <div>{timer.seconds !== undefined ? timer.seconds.toString().padStart("2", "0") : "00"}</div>
              </div>
            </>
          )}
        </div>
        {status === STATUS_IN_PROGRESS ? (
          <>
            {easyMode === true ? (
              <div>
                <p className={styles.easyMode}>
                  Осталось: <span>{isLives} жизни</span>
                </p>
              </div>
            ) : null}
            <div className={styles.superPowerWraper}>
              <img
                src={eyes}
                alt="eyes"
                onMouseEnter={openModal}
                onMouseLeave={closeModal}
                onClick={() => {
                  if (!useEyes) {
                    habdleAchievementEyesClick();
                    setUseEyes(true);
                  }
                }}
              />
              {isModalOpen && <SuperPowerEyes onClose={closeModal} />}
            </div>
            <div className={styles.imageOverlay}>
              <img src={circle} onMouseEnter={openModalCards} onMouseLeave={closeModalCards} alt="circle" />
              <img
                src={car}
                onMouseEnter={openModalCards}
                onMouseLeave={closeModalCards}
                alt="cards"
                className={styles.overlayImage}
                onClick={() => {
                  if (!useCard) {
                    habdleAchievementCardClick();
                    setUseCard(true);
                  }
                }}
              />
              {isModalOpenCards && <SuperPowerCards onClose={closeModal} />}
            </div>
            <Button onClick={resetGame}>Начать заново</Button>{" "}
          </>
        ) : null}
      </div>

      <div className={styles.cards}>
        {cards.map(card => (
          <Card
            key={card.id}
            onClick={() => openCard(card)}
            open={status !== STATUS_IN_PROGRESS ? true : card.open}
            suit={card.suit}
            rank={card.rank}
          />
        ))}
      </div>

      {isGameEnded ? (
        <div className={styles.modalContainer}>
          <EndGameModal
            isWon={status === STATUS_WON}
            gameDurationSeconds={timer.seconds}
            gameDurationMinutes={timer.minutes}
            onClick={resetGame}
          />
        </div>
      ) : null}
      {status === STATUS_IN_PROGRESS ? (
        <div className={styles.linkButton}>
          <Link to="/">
            <Button>Перейти к играм</Button>
          </Link>
        </div>
      ) : null}
    </div>
  );
}
