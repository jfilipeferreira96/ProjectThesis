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
   
    for (let i = 0; i <= 4; i++) {
      const response = await fetch(`https://robohash.org/${Math.round(Math.random() * 1000)}?set=set3`);
      const data = await response.arrayBuffer();
      const array = Array.from(new Uint8Array(data));
      const encodedData = btoa(array.map((byte) => String.fromCharCode(byte)).join(""));
      newAvatars.push(`data:image/png;base64,${encodedData}`);
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