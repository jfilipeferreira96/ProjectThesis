import { Image, Container, Title, Button, Group, Text, List, ThemeIcon, rem } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import image from "./image.svg";
import classes from "./hero.module.css";
import Link from "next/link";
import { routes } from "@/config/routes";

export function Hero() {
  return (
    <Container size="md">
      <div className={classes.inner}>
        <div className={classes.content}>
          <h1 className={classes.title}>
            Level Up {""}
            <Text component="span" variant="gradient" gradient={{ from: "blue", to: "cyan" }} inherit>
              Learning Experience
            </Text>{" "}
            with Engaging Challenges
          </h1>
          <Text c="dimmed" mt="md">
            Enhance your students educational journey by crafting interactive quizzes and offering special prizes. Foster friendly competition among peers to inspire excellence in higher education.
          </Text>

          <List
            mt={30}
            spacing="sm"
            size="sm"
            icon={
              <ThemeIcon size={20} radius="xl">
                <IconCheck style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
              </ThemeIcon>
            }
          >
            <List.Item>
              <b>Competition</b> – Compete with your peers and see who's the top performer.
            </List.Item>
            <List.Item>
              <b>Motivation</b> – Stay engaged and motivated to excel in your higher education journey.
            </List.Item>
          </List>

          <Group mt={30}>
            <Link href={routes.signin.url}>
              <Button radius="xl" size="md" className={classes.control}>
                Get started
              </Button>
            </Link>
            <Link href={"https://github.com/jfilipeferreira96/ProjectThesis"} target="_blank">
              <Button variant="default" radius="xl" size="md" className={classes.control}>
                Source code
              </Button>
            </Link>
          </Group>
        </div>
        {/* <Image src={"./happy1.png"} className={classes.image} alt="Image Hero" /> */}
      </div>
    </Container>
  );
}
