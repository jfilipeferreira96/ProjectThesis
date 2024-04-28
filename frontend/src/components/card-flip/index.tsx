import React, { useState, useEffect } from "react";
import styles from "./card-flip.module.scss";
import Image from "next/image";
import { User } from "@/providers/SessionProvider";
import { Avatar, Center, Flex, Group, Stack, Title } from "@mantine/core";

interface CardFlipProps {
  frontImage: string;
  backImage: string;
  flipDelay: number;
  winner?: User;
}

const CardFlip: React.FC<CardFlipProps> = ({ frontImage, backImage, flipDelay, winner }) => {
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
        <Image src={backImage} alt="Back" fill={true} />
      </div>
      <div className={`${styles.card__face} ${styles["card__face--back"]}`}>
        <Image src={frontImage} alt="Front" fill={true} className={styles.opacity} />
        <div className={styles.relative}>
          <Center>
            <Avatar src={winner ? winner.avatar : null} alt="it's me" mt={20} radius="lg" size="xl" style={{ background: "var(--avatar-bg, hsl(0deg 0% 0% / 15%))" }} />
          </Center>
          <Stack align="stretch" justify="center" gap="md">
            <Title order={3} ta="center" mt={10} mb={10}>
              {winner ? winner.fullname : "--"}
            </Title>
            <Title order={5} ta="center" mt={10} mb={10}>
              {winner ? winner.email : "--"}
            </Title>

            <Title order={4} ta="center" mt={10} mb={10}>
              {winner ? "Score: " + winner.score : "Score: --"}
            </Title>
          </Stack>
        </div>
      </div>
    </div>
  );
};

export default CardFlip;
