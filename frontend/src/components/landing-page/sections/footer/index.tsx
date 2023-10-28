import React from "react";
import { Container, Group, Anchor, Text, ActionIcon, rem, Image, Title, Flex } from "@mantine/core";
import { IconBrandGithub } from "@tabler/icons-react";
import classes from "./footer.module.css";

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
          <Image src={"./20521.png"} alt="Logo" radius="md" h={45} w="auto" />
          <Title size="h2" ml={10}>
            Score
          </Title>
        </Flex>
        <Text size="sm" color="dimmed">
          © 2023 Score Project
        </Text>
        {/* <Group className={classes.links}>{items}</Group> */}
        <Group gap="xs" justify="flex-end" wrap="nowrap">
          <ActionIcon size="lg" variant="default" radius="xl">
            <IconBrandGithub style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Container>
    </div>
  );
};

export default Footer;
