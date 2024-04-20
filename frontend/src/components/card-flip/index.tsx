import React, { useState, useEffect } from "react";
import styles from "./card-flip.module.scss";
import Image from "next/image";

interface CardFlipProps {
  frontImage: string;
  backImage: string;
  flipDelay: number;
}

const CardFlip: React.FC<CardFlipProps> = ({ frontImage, backImage, flipDelay }) => {
  const [flipped, setFlipped] = useState(false);
  const [flippedOnce, setFlippedOnce] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!flippedOnce) {
        setFlipped(true);
        setFlippedOnce(true);
      }
    }, flipDelay);

    return () => clearTimeout(timer);
  }, [flipDelay, flippedOnce]);

  const handleClick = () => {
    if (!flippedOnce) {
      setFlipped(true);
      setFlippedOnce(true);
    }
  };

  return (
    <div className={`${styles.card} ${flipped ? styles["is-flipped"] : ""}`} onClick={handleClick}>
      <div className={`${styles.card__face} ${styles["card__face--front"]}`}>
        <Image src={frontImage} alt="Front" fill={true} />
      </div>
      <div className={`${styles.card__face} ${styles["card__face--back"]}`}>
        <span>asdad</span>
      </div>
    </div>
  );
};

export default CardFlip;
