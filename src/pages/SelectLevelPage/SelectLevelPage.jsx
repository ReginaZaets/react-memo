import { Link } from "react-router-dom";
import styles from "./SelectLevelPage.module.css";
import { EasyModeContext } from "../../utils/contextMode";
import { useContext } from "react";

export function SelectLevelPage() {
  const { toggleMode } = useContext(EasyModeContext);
  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <h1 className={styles.title}>Выбери сложность</h1>
        <ul className={styles.levels}>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/3">
              1
            </Link>
          </li>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/6">
              2
            </Link>
          </li>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/9">
              3
            </Link>
          </li>
        </ul>
        <div className={styles.checkbox}>
          <h1 className={styles.title}>Упрощенный режим</h1>
          <input onChange={toggleMode} className={styles.input} type="checkbox" name="checkbox" />
        </div>
      </div>
    </div>
  );
}
