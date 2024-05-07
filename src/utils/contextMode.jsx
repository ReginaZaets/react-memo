import { createContext, useState } from "react";

export const EasyModeContext = createContext();

export function EasyModeProvider({ children }) {
  const [easyMode, setEasyMode] = useState(false);
  // Стейт для упрощенного режима- 3 жизни
  const [isLives, setIsLives] = useState(3);
  // Стейт для уровня сложности игры
  const [level, setLevel] = useState(null);
  // Список лидеров
  const [leaders, setLeaders] = useState([]);

  const toggleMode = () => {
    if (easyMode === true) {
      setEasyMode(false);
    } else {
      setEasyMode(true);
    }
  };

  return (
    <EasyModeContext.Provider
      value={{ leaders, setLeaders, isLives, easyMode, toggleMode, setIsLives, level, setLevel }}
    >
      {children}
    </EasyModeContext.Provider>
  );
}
