import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Avatar, Button, Loader, Center, Box, Group, Flex } from "@mantine/core";
import classes from "./avatar.module.scss";

type Props = {
  setSelectedAvatar: Dispatch<SetStateAction<string | null>>;
  selectedAvatar: string | null;
  initialAvatar?: string;
};

const SetAvatar = ({ selectedAvatar, setSelectedAvatar, initialAvatar }: Props) => {
  const [avatars, setAvatars] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAvatars = async (ignoreInitialAvatar = false) => {
    setLoading(true);
    const newAvatars = [];
    const usedIndexes = new Set<number>();

    while (newAvatars.length < 4) {
      const randomIndex = Math.floor(Math.random() * 51);
      if (!usedIndexes.has(randomIndex)) {
        const avatarUrl = `/avatars/avatar_${randomIndex}.png`;
        newAvatars.push(avatarUrl);
        usedIndexes.add(randomIndex);
      }
    }

    if (initialAvatar && !ignoreInitialAvatar) {
      newAvatars.unshift(initialAvatar);
    }

    setAvatars(newAvatars);
    setLoading(false);
  };

  const setClickedAvatar = (avatar: string) => {
    setSelectedAvatar(avatar);
    if (avatar === initialAvatar) {
      fetchAvatars(true); // Ignore initialAvatar on next fetch
    }
  };

  useEffect(() => {
    fetchAvatars();
  }, [initialAvatar]);

  return (
    <div className={classes.avatarsContainer}>
      {loading ? (
        <Loader color="blue" />
      ) : (
        <>
          <div className={classes.avatars}>
            {avatars.map((avatar, index) => (
              <div
                key={index}
                className={`${classes.avatar} ${avatar === selectedAvatar ? classes.selected : ""}`}
              >
                <Avatar
                  size={"lg"}
                  src={`${avatar}`}
                  alt="avatar"
                  onClick={() => setClickedAvatar(avatar)}
                />
              </div>
            ))}
          </div>
          <div style={{display:"grid", justifyContent:"center"}}>
            <Button variant="light" mt="sm" onClick={() => fetchAvatars()} >
              Refresh Avatars
            </Button>
            </div>
        </>
      )}
    </div>
  );
};

export default React.memo(SetAvatar);
