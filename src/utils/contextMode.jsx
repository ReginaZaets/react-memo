import { createContext, useState } from "react";

export const EasyModeContext = createContext();

export function EasyModeProvider({ children }) {
  // Стейт для вкл/выкл достижеений
  const [useAchievementPaz, setUseAchievementPaz] = useState(false);
  const [useAchievementCir, setUseAchievementCir] = useState(false);
  const [easyMode, setEasyMode] = useState(false);
  // Стейт для упрощенного режима- 3 жизни
  const [isLives, setIsLives] = useState(3);
  // Стейт для уровня сложности игры
  const [level, setLevel] = useState(null);
  // Список лидеров
  const [leaders, setLeaders] = useState([]);
  // Стейт для использования прозрения
  const [useEyes, setUseEyes] = useState(false);
  // Стейт для использования алахаморы
  const [useCard, setUseCard] = useState(false);

  const toggleMode = () => {
    if (easyMode === true) {
      setEasyMode(false);
    } else {
      setEasyMode(true);
    }
  };

  return (
    <EasyModeContext.Provider
      value={{
        useCard,
        setUseCard,
        useEyes,
        setUseEyes,
        useAchievementPaz,
        setUseAchievementPaz,
        useAchievementCir,
        setUseAchievementCir,
        leaders,
        setLeaders,
        isLives,
        easyMode,
        toggleMode,
        setIsLives,
        level,
        setLevel,
      }}
    >
      {children}
    </EasyModeContext.Provider>
  );
}
