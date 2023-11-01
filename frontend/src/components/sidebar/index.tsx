import React from "react";
import { useEffect, useState } from "react";
import { Center, Tooltip, UnstyledButton, Stack, rem } from "@mantine/core";
import { IconHome2, IconGauge, IconDeviceDesktopAnalytics, IconFingerprint, IconCalendarStats, IconUser, IconSettings, IconLogout, IconSwitchHorizontal } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { routes } from "@/config/routes";
import { getId } from "@/utils/getID";
import styled from 'styled-components';

const NavbarContainer = styled.nav`
  width: ${rem(80)};
  height: ${rem(750)};
  padding: var(--mantine-spacing-md);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
  icon: typeof IconHome2;
  label: string;
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <Link onClick={onClick} data-active={active || undefined}>
        <Icon style={{ width: rem(25), height: rem(25) }} stroke={1.5} />
      </Link>
    </Tooltip>
  );
}

const data = [
  { icon: IconHome2, label: "Home", url: "" },
  { icon: IconDeviceDesktopAnalytics, label: "Qualifications", url: "qualifications" },
  { icon: IconSettings, label: "Settings", url: "settings" },
];

interface Props{
  isAdmin: boolean
}

export function Sidebar(props: Props) {
  const { isAdmin } = props;
  const pathname = usePathname();
  const router = useRouter();
  const [active, setActive] = useState<number>(0);

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
  }
  );

  return (
    <NavbarContainer>
      <div>
        <Stack justify="center" gap={0}>
          {links}
        </Stack>
      </div>
    </NavbarContainer>
  );
}
