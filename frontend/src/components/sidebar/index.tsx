import { useState } from "react";
import { Center, Tooltip, UnstyledButton, Stack, rem } from "@mantine/core";
import { IconHome2, IconGauge, IconDeviceDesktopAnalytics, IconFingerprint, IconCalendarStats, IconUser, IconSettings, IconLogout, IconSwitchHorizontal } from "@tabler/icons-react";
import classes from "./sidebar.module.css";
import { usePathname } from "next/navigation";
import { routes } from "@/config/routes";

interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton onClick={onClick} className={classes.link} data-active={active || undefined}>
        <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const mockdata = [
  { icon: IconHome2, label: "Home" },
  { icon: IconDeviceDesktopAnalytics, label: "Qualifications" },
  { icon: IconSettings, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [active, setActive] = useState(0);

  const links = mockdata.map((link, index) =>
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => setActive(index)} />
  );
  console.log(pathname, routes.challenge.url);
  if (!pathname.includes(routes.challenge.url)) {
    return;
  }
  
  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {links}
        </Stack>
      </div>
    </nav>
  );
}
