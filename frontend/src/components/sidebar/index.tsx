import React from "react";
import { useEffect, useState } from "react";
import { Center, Tooltip, UnstyledButton, Stack, rem, Flex } from "@mantine/core";
import { usePathname, useRouter } from "next/navigation";
import { routes } from "@/config/routes";
import { getId } from "@/utils/getID";
import styled from 'styled-components';
import { useMediaQuery } from "@mantine/hooks";
import classes from "./sidebar.module.css";
import SVG from 'next/image';

const NavbarContainer = styled.nav`
  width: ${rem(80)};
  height: ${rem(750)};
  padding: var(--mantine-spacing-md);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background:var(--mantine-color-body);
  z-index: 99;
`;

const LayedDownNavbar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0px;
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 10px;
  border-top: calc(0.0625rem * var(--mantine-scale)) solid var(--_app-shell-border-color);
  background:var(--mantine-color-body);
  z-index: 99;
`;

const Link = styled(UnstyledButton)`
  width: ${rem(50)};
  height: ${rem(50)};
  border-radius: var(--mantine-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: light-dark(var(--mantine-color-gray-7), var(--mantine-color-dark-0));

  &:hover {
    background-color: light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-5));
  }

  &[data-active] {
    &,
    &:hover {
      background-color: var(--mantine-color-blue-light);
      color: var(--mantine-color-blue-light-color);
    }
  }
`;

interface NavbarLinkProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({ icon, label, active, onClick }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <div onClick={onClick} data-active={active || undefined} className={active ? classes.linkSelected : classes.link}>
        {icon}
      </div>
    </Tooltip>
  );
}

const data = [
  {
    icon: <SVG
      src="/svgs/home.svg"
      alt="My SVG"
      width={42}
      height={42} />, label: "Home", url: "" },
  {
    icon: <SVG
      src="/svgs/leaderboard.svg"
      alt="My SVG"
      width={42}
      height={42}
    />, label: "Qualifications", url: "qualifications" },
  {
    icon: <SVG
      src="/svgs/laptop-settings-12589.svg"
      alt="My SVG"
      width={42}
      height={42}
    />, label: "Settings", url: "settings" }, 
  /* { icon: IconDeviceDesktopAnalytics, label: "Qualifications", url: "qualifications" }, */
];

interface Props{
  isAdmin: boolean
}

export function Sidebar(props: Props) {
  const { isAdmin } = props;
  const pathname = usePathname();
  const router = useRouter();
  const [active, setActive] = useState<number>(0);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const activeIndex = data.findIndex((item) => {
      if (item.url)
      {
        return pathname.includes(item.url);
      }
      return false;
    });

    if (activeIndex !== -1){
      setActive(activeIndex);
    }
  }, [pathname]);

  const handleNavClick = (index: number) => {
    setActive(index);
    router.push(`${routes.challenge.url}/${getId(pathname)}/${data[index].url}`);
  };

  const links = data.map((link, index) => {
    if (isAdmin === false && link.url === 'settings') {
      return;
    }
    return (
      <NavbarLink {...link} key={link.label} active={index === active} onClick={() => handleNavClick(index)} />
    );
  });

  return (
    <>
      {!isMobile && (
        <NavbarContainer>
          <div>
            <Stack justify="center" gap={15}>
              {links}
            </Stack>
          </div>
        </NavbarContainer>
      )}

      {isMobile && (
        <LayedDownNavbar>
          <Flex gap="md" justify="center" align="center" direction="row">
            {links}
          </Flex>
        </LayedDownNavbar>
      )}
    </>
  );
}
