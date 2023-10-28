import { Badge, Group, Title, Text, Card, SimpleGrid, Container, rem, useMantineTheme } from "@mantine/core";
import { IconGauge, IconUser, IconCookie, IconChartPie, IconBook, IconRocket } from "@tabler/icons-react";
import classes from "./featurescards.module.css";

const mockdata = [
  {
    title: "Diverse Question Formats",
    description: "From multiple choice to essay-style questions, we've got it all.",
    icon: IconGauge,
  },
  {
    title: "Track Your Progress",
    description: "Monitor your progress and see how you stack up against your peers.",
    icon: IconUser,
  },
  {
    title: "Mobile-Friendly",
    description: "Access quizzes on your preferred device, whether it's a laptop, tablet, or smartphone.",
    icon: IconCookie,
  },
  {
    title: "Customizable Challenges",
    description: "Tailor the game to your preferences, focusing on specific subjects or topics.",
    icon: IconChartPie,
  },
  {
    title: "Compete with Peers",
    description: "Challenge friends or classmates to friendly competitions and see who comes out on top.",
    icon: IconBook,
  },
  {
    title: "Fun and Educational",
    description: " Enjoy a fun, gamified approach to learning that transforms your study sessions into an exciting adventure.",
    icon: IconRocket,
  },
];


export function FeaturesCards() {
  const theme = useMantineTheme();
  const features = mockdata.map((feature) => (
    <Card key={feature.title} shadow="md" radius="md" className={classes.card} padding="xl">
      <feature.icon style={{ width: rem(50), height: rem(50) }} stroke={2} color={theme.colors.blue[6]} />
      <Text fz="lg" fw={500} className={classes.cardTitle} mt="md">
        {feature.title}
      </Text>
      <Text fz="sm" c="dimmed" mt="sm">
        {feature.description}
      </Text>
    </Card>
  ));

  return (
    <Container size="lg" py="xl">
      <Title order={2} className={classes.title} ta="center" mt="sm">
        Interactive Challenges and Amazing Questions for Higher Education Students
      </Title>

      <Text c="dimmed" className={classes.description} ta="center" mt="md">
        Compete with your friends or classmates and see who can earn the most points.
      </Text>

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" mt={50}>
        {features}
      </SimpleGrid>
    </Container>
  );
}
