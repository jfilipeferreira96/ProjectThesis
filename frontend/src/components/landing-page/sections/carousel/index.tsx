import { Container, Title, Accordion, Image, Grid } from "@mantine/core";
import classes from "./carousel.module.css";
import { Carousel } from "@mantine/carousel";
import "@mantine/carousel/styles.css";

export function CarouselSection() {
  return (
    <div className={classes.background}>
      <>
        <Grid justify="center">
          <Grid.Col span={{ md: 10, sm: 10, xs: 10, lg: 10 }}>
            <Carousel slideSize="100%" align="start" slideGap="md" controlSize={5} loop withControls={false} withIndicators>
              <Carousel.Slide>
                <Image src={"./slider/slide1.png"} className={classes.image} alt="Slide 1" />
              </Carousel.Slide>
              <Carousel.Slide>
                <Image src={"./slider/slide2.png"} className={classes.image} alt="Slide 2" />
              </Carousel.Slide>
              <Carousel.Slide>
                <Image src={"./slider/slide3.png"} className={classes.image} alt="Slide 3" />
              </Carousel.Slide>
              <Carousel.Slide>
                <Image src={"./slider/slide4.png"} className={classes.image} alt="Slide 4" />
              </Carousel.Slide>
              <Carousel.Slide>
                <Image src={"./slider/slide5.png"} className={classes.image} alt="Slide 5" />
              </Carousel.Slide>
            </Carousel>
          </Grid.Col>
        </Grid>
      </>
    </div>
  );
}
