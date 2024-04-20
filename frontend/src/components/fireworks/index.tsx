import React, { useEffect } from "react";
import styles from "./fireworks.module.scss";

const Fireworks: React.FC = () => {

  return (
    <div className={styles.pyro}>
      {/* Conteúdo do seu componente */}
      <div className={styles.before}></div>
      <div className={styles.after}></div>
    </div>
  );
};

export default Fireworks;
