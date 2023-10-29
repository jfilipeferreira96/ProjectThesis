import { Title, Text, Card, SimpleGrid, Container, rem, useMantineTheme } from "@mantine/core";
import { IconChartPie, IconSchool, IconUsers, IconDeviceMobile, IconSettings, IconZoomQuestion } from "@tabler/icons-react";
import classes from "./featurescards.module.css";

const mockdata = [
  {
    title: "Diverse Question Formats",
    description: "From multiple choice to essay-style questions, we've got it all.",
    icon: IconZoomQuestion,
  },
  {
    title: "Track Your Progress",
    description: "Monitor your progress and see how you stack up against your peers.",
    icon: IconChartPie,
  },
  {
    title: "Mobile-Friendly",
    description: "Access quizzes on your preferred device, whether it's a laptop, tablet, or smartphone.",
    icon: IconDeviceMobile,
  },
  {
    title: "Customizable Challenges",
    description: "Tailor the game to your preferences, focusing on specific subjects or topics.",
    icon: IconSettings,
  },
  {
    title: "Compete with Peers",
    description: "Challenge friends or classmates to friendly competitions and see who comes out on top.",
    icon: IconUsers,
  },
  {
    title: "Fun and Educational",
    description: " Enjoy a fun, gamified approach to learning that transforms your study sessions into an exciting adventure.",
    icon: IconSchool,
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
    <div className={classes.background}>
      <div>
        <svg className={classes.SvgWavesUp} preserveAspectRatio="none" viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg">
          <path d="M321.39 56.44c58-10.79 114.16-30.13 172-41.86 82.39-16.72 168.19-17.73 250.45-.39C823.78 31 906.67 72 985.66 92.83c70.05 18.48 146.53 26.09 214.34 3V0H0v27.35a600.21 600.21 0 00321.39 29.09z"></path>
        </svg>
      </div>
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
      <div>
        <svg className={classes.SvgWavesDown} preserveAspectRatio="none" viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg">
          <path d="M321.39 56.44c58-10.79 114.16-30.13 172-41.86 82.39-16.72 168.19-17.73 250.45-.39C823.78 31 906.67 72 985.66 92.83c70.05 18.48 146.53 26.09 214.34 3V0H0v27.35a600.21 600.21 0 00321.39 29.09z"></path>
        </svg>
      </div>
    </div>
  );
}
