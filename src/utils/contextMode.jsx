import { createContext, useState } from "react";

export const EasyModeContext = createContext();

export function EasyModeProvider({ children }) {
  const [easyMode, setEasyMode] = useState(false);
  // Стейт для упрощенного режима- 3 жизни
  const [isLives, setIsLives] = useState(3);

  const toggleMode = () => {
    if (easyMode === true) {
      setEasyMode(false);
    } else {
      setEasyMode(true);
    }
  };

  return (
    <EasyModeContext.Provider value={{ isLives, easyMode, toggleMode, setIsLives }}>
      {children}
    </EasyModeContext.Provider>
  );
}
