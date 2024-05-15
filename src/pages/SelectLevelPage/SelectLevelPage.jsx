import { Link, useNavigate } from "react-router-dom";
import styles from "./SelectLevelPage.module.css";
import { EasyModeContext } from "../../utils/contextMode";
import { useContext } from "react";
import { Button } from "../../components/Button/Button";

export function SelectLevelPage() {
  const { toggleMode, level, setLevel } = useContext(EasyModeContext);
  const navigate = useNavigate();
  const handlePlay = () => {
    navigate(`/game/${level}`);
  };
  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <div className={styles.checkbox}>
          <label className={styles.labelCheck}>
            <input onChange={toggleMode} className={styles.input} type="checkbox" name="checkbox" />
            <span className={styles.checkboxCustom}></span>
          </label>
          <h1 className={styles.text}>Легкий режим(3 жизни)</h1>
        </div>
        <h1 className={styles.title}>Выбери сложность</h1>
        <ul className={styles.levels}>
          <li className={styles.level}>
            <label className={styles.levelLink} to={`/game/${level}`}>
              <input type="radio" value={3} onChange={e => setLevel(e.target.value)} className={styles.lableInput} />1
            </label>
          </li>
          <li className={styles.level}>
            <label className={styles.levelLink} to={`/game/${level}`}>
              <input type="radio" value={6} onChange={e => setLevel(e.target.value)} className={styles.lableInput} />2
            </label>
          </li>
          <li className={styles.level}>
            <label className={styles.levelLink} to={`/game/${level}`}>
              <input type="radio" value={9} onChange={e => setLevel(e.target.value)} className={styles.lableInput} />3
            </label>
          </li>
        </ul>
        <Button onClick={handlePlay}>Играть</Button>
        <Link to="/leaderboard">
          <p className={styles.text}>
            <u>Перейти к лидерборду</u>
          </p>
        </Link>
      </div>
    </div>
  );
}
