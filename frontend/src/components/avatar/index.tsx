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
  const [loading, setLoading] = useState(true);

  const fetchAvatars = async () => {
    setLoading(true); 

    const newAvatars = [];
    for (let i = 0; i <= 4; i++) {
      const response = await fetch(`https://api.multiavatar.com/4645646/${Math.round(Math.random() * 1000)}`);
      const data = await response.text();
      const encodedData = btoa(unescape(encodeURIComponent(data)));
      newAvatars.push(encodedData);
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
          <div key={avatar} className={`${classes.avatar} ${avatar === selectedAvatar ? classes.selected : ""}`}>
            <Avatar size={"lg"} src={`data:image/svg+xml;base64,${avatar}`} alt="avatar" onClick={() => setClickedAvatar(index)} />
          </div>
        ))
      )}
    </div>
  );
};

export default SetAvatar;
