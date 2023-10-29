import React from "react";
import { Container, Group, Anchor, Text, ActionIcon, rem, Flex } from "@mantine/core";
import { IconBrandGithub } from "@tabler/icons-react";
import classes from "./footer.module.css";
import Link from "next/link";
import Image from "next/image"; 

const links = [
  { label: "Docs", link: "/docs/" },
  { label: "GitHub", link: "https://github.com/helix-medical" },
];

const Footer = () => {
  const items = links.map((link) => (
    <Anchor<"a"> color="dimmed" key={link.label} href={link.link} size="sm">
      {link.label}
    </Anchor>
  ));

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <Flex align={"center"}>
          <Image src="/20521.png" alt="Logo" width={85} height={45} />
        </Flex>
        <Text size="sm" color="dimmed">
          © 2023 Score Project
        </Text>
        {/* <Group className={classes.links}>{items}</Group> */}
        <Group gap="xs" justify="flex-end" wrap="nowrap">
          <Link href={"https://github.com/jfilipeferreira96/ProjectThesis"} target="_blank">
            <ActionIcon size="lg" variant="default" radius="xl">
              <IconBrandGithub style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
            </ActionIcon>
          </Link>
        </Group>
      </Container>
    </div>
  );
};

export default Footer;
