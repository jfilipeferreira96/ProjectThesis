"use client";
import { Title, Text, Button, Container, Group } from '@mantine/core';
import classes from './classes.module.css';
import Link from 'next/link';
import { routes } from '@/config/routes';
import { useSession } from '@/providers/SessionProvider';

export default function NotFound(){
  const { user } = useSession();
  console.log(user)
  return (
      <div className={classes.root}>
        <Container my={100}>
          <div className={classes.label}>404</div>
          <Title className={classes.title}>Nothing to see here</Title>
          <Text size="lg" ta="center" className={classes.description}>
            Unfortunately, this is only a 404 page. You may have mistyped the address, or the page has been moved to another URL.
          </Text>
          <Group justify="center">
            <Link href={user?._id ? routes.home.url : routes.landingpage.url}>
              <Button variant="white" size="md">
                Take me back to home page
              </Button>
            </Link>
          </Group>
        </Container>
      </div>
    );
}