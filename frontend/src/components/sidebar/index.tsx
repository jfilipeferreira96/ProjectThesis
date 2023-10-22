import { useEffect, useState } from "react";
import { Center, Tooltip, UnstyledButton, Stack, rem } from "@mantine/core";
import { IconHome2, IconGauge, IconDeviceDesktopAnalytics, IconFingerprint, IconCalendarStats, IconUser, IconSettings, IconLogout, IconSwitchHorizontal } from "@tabler/icons-react";
import classes from "./sidebar.module.css";
import { usePathname, useRouter } from "next/navigation";
import { routes } from "@/config/routes";
import { getId } from "@/utils/getID";

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
        <Icon style={{ width: rem(25), height: rem(25) }} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const data = [
  { icon: IconHome2, label: "Home", url: "" },
  { icon: IconDeviceDesktopAnalytics, label: "Qualifications", url: "qualifications" },
  { icon: IconSettings, label: "Settings", url: "settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [active, setActive] = useState<number>(0);

  useEffect(() => {
    const activeIndex = data.findIndex((item) => {
      if (item.url) {
        return pathname.includes(item.url); 
      }
      return false; 
    });
    
    if (activeIndex !== -1) {
      setActive(activeIndex);
    }
  }, [pathname]);

  const handleNavClick = (index: number) => {
    setActive(index);
    router.push(`${routes.challenge.url}/${getId(pathname)}/${data[index].url}`);
  };

  const links = data.map((link, index) => <NavbarLink {...link} key={link.label} active={index === active} onClick={() => handleNavClick(index)} />);

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
