import { Grid, GridCol, Image, Container, Title, Button, Group, Text, List, ThemeIcon, rem, Flex } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import classes from "./hero.module.css";
import Link from "next/link";
import { routes } from "@/config/routes";

export function Hero() {
  return (
    <div className={classes.background}>
      <div className={classes.inner}>
        <Grid justify="center">
          <Grid.Col span={{ md: 6, sm: 12, xs: 12, lg: 6 }}>
            <div className={classes.content}>
              <h1 className={classes.title}>
                Level Up {""}
                <Text component="span" variant="gradient" gradient={{ from: "blue", to: "cyan" }} inherit>
                  Learning Experience
                </Text>{" "}
                with Engaging Challenges
              </h1>
              <Text c="dimmed" mt="md">
                {"Enhance your students' educational journey by crafting interactive quizzes and offering special prizes. Foster friendly competition among peers to inspire excellence in higher education."}
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
                  <b>Competition</b> {"- Compete with your peers and see who's the top performer."}
                </List.Item>
                <List.Item>
                  <b>Motivation</b> {"- Stay engaged and motivated to excel in your higher education journey."}
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
          </Grid.Col>
          <Grid.Col span={{ md: 6, sm: 12, xs: 12, lg: 4 }}>
            <Flex align={"center"}>
              <Image src="/hero5.png" alt="Wait" style={{ marginLeft: "auto", marginRight: "auto", width: "110%" }} />
            </Flex> 
          </Grid.Col>
        </Grid>
      </div>
    </div>
  );
}
