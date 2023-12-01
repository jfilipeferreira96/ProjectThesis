import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Avatar } from "@mantine/core";
import classes from "./avatar.module.scss";
import { Loader } from "@mantine/core";

type Props = {
  setSelectedAvatar: Dispatch<SetStateAction<string | null>>;
  selectedAvatar: string | null;
};

const SetAvatar = ({ selectedAvatar, setSelectedAvatar }: Props) => {
  const [avatars, setAvatars] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAvatars = async () => {
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

    setAvatars(newAvatars);
    setLoading(false);
  };

  const setClickedAvatar = (id: number) => {
    setSelectedAvatar(avatars[id]);
  };

  useEffect(() => {
    fetchAvatars();
  }, []);

  return (
    <div className={classes.avatars}>
      {loading ? (
        <Loader color="blue" />
      ) : (
        avatars.map((avatar, index) => (
          <div key={index} className={`${classes.avatar} ${avatar === selectedAvatar ? classes.selected : ""}`}>
            <Avatar size={"lg"} src={`${avatar}`} alt="avatar" onClick={() => setClickedAvatar(index)} />
          </div>
        ))
      )}
    </div>
  );
};

export default React.memo(SetAvatar);
