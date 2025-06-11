import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import imagen1 from "/assets/image1.png";
import imagen2 from "/assets/image2.png";
import imagen4 from "/assets/image4.png";

const BannerCarousel = () => {
  return (
    <div
      className="banner-carousel-container"
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        position: "relative",
      }}
    >
      <Carousel
        autoPlay
        infiniteLoop
        swipeable
        emulateTouch
        showThumbs={false}
        dynamicHeight={false}
        interval={2000}
        showArrows={false}
        showIndicators={false}
        showStatus={false}
      >
        <div>
          <img
            src={imagen1}
            alt="Banner 1"
            style={{ width: "100%", height: "auto" }}
          />
        </div>
        <div>
          <img
            src={imagen2}
            alt="Banner 2"
            style={{ width: "100%", height: "auto" }}
          />
        </div>
        <div>
          <img
            src={imagen4}
            alt="Banner 3"
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      </Carousel>
      {/* Overlay to darken the carousel */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          zIndex: 1,
        }}
      />
      {/* Centered text */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "white",
          fontSize: "2rem",
          fontWeight: "600",
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        Deportivos
      </div>
    </div>
  );
};

export default BannerCarousel;
