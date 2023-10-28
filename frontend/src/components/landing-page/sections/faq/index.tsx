import { Container, Title, Accordion } from "@mantine/core";
import classes from "./faq.module.css";

const placeholder =
  "It can’t help but hear a pin drop from over half a mile away, so it lives deep in the mountains where there aren’t many people or Pokémon.It was born from sludge on the ocean floor. In a sterile environment, the germs within its body can’t multiply, and it dies.It has no eyeballs, so it can’t see. It checks its surroundings via the ultrasonic waves it emits from its mouth.";

export function FaqSimple() {
  return (
    <div className={classes.background}>
      <Container size="sm" className={classes.wrapper}>
        <Title ta="center" className={classes.title}>
          Frequently Asked Questions
        </Title>

        <Accordion variant="separated">
          <Accordion.Item className={classes.item} value="reset-password">
            <Accordion.Control>Who Can Participate?</Accordion.Control>
            <Accordion.Panel>Our platform is designed for university students from all courses.</Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item className={classes.item} value="another-account">
            <Accordion.Control>Can I compete with friends or classmates?</Accordion.Control>
            <Accordion.Panel>Absolutely! You can challenge your friends or classmates and see who can earn the most points.</Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item className={classes.item} value="newsletter">
            <Accordion.Control>How are points and achievements tracked on the platform?</Accordion.Control>
            <Accordion.Panel>Points and achievements are automatically tracked and updated on your profile as you complete challenges.</Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item className={classes.item} value="credit-card">
            <Accordion.Control>How often are new challenges added to the platform?</Accordion.Control>
            <Accordion.Panel>It depends on your challenge admin, please ask him to update the platform with fresh challenges to keep the learning experience dynamic and engaging.</Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item className={classes.item} value="payment">
            <Accordion.Control>Is the Higher Education Challenge Hub accessible on mobile devices?</Accordion.Control>
            <Accordion.Panel>Yes, our platform is fully responsive and can be accessed on both desktop and mobile devices for your convenience.</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Container>
    </div>
  );
}
