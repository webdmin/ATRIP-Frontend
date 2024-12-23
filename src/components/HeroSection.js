import './HeroSection.css';

const HeroSection = () => {
  // Link to our Google Drive video 
  const googleDriveVideoLink = "https://drive.google.com/file/d/16scnB_aqugSSl_VlPVckeYM-OmQq92wk/preview";

  return (
    <section id="home" className="hero-section">
      <div className="hero-content">
        <div className="hero-text">
          <h1>Building the Future of Active Travel</h1>
          <p>We provide innovative infrastructure solutions to reduce the pollution rate and to provide Active travel all over the country.</p>
          <a href="#services" className="cta-button">Our Services</a>
        </div>
        <div className="hero-video">
          
            <div className="video-container">
              <iframe
                title="Google Drive Video"
                width="200%"
                height="400%"
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
