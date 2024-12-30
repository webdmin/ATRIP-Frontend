import './HeroSection.css';

const HeroSection = () => {
  const googleDriveVideoLink = "https://drive.google.com/file/d/16scnB_aqugSSl_VlPVckeYM-OmQq92wk/preview";

  return (
    <section id="home" className="hero-section">
      <div className="hero-content">
        <div className="hero-text">
          <h1>Building the Future of Active Travel</h1>
          <p>We design and implement cutting-edge infrastructure solutions aimed at lowering pollution levels while promoting sustainable and active modes of travel, such as walking and cycling, across the country.</p>
          <a href="#services" className="cta-button">Our Services</a>
        </div>
        <div className="hero-video">
          <div className="video-container">
            <iframe
              title="Google Drive Video"
              width="250%"
              height="500%"
              src={googleDriveVideoLink}
              className="video-iframe"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
