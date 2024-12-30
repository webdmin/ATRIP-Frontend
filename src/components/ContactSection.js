import React, { useState, useEffect } from 'react';
import './ContactSection.css';
import cyclepath01 from '../images/cyclepath-00.jpg'
import cyclepath02 from '../images/cyclepath-2.jpg'
import cyclepath03 from '../images/cyclepath-3.jpg'


const images = [
  {
    src: cyclepath01,
    alt: 'Cycle Path in UK 1',
    text: 'Cycle Path in UK - Explore the beauty of nature',
    link: 'https://www.sustrans.org.uk/find-a-route-on-the-national-cycle-network/?location=null&distance=null&routetype=null'
  },
  {
    src: cyclepath02,
    alt: 'Cycle Path in UK 2',
    text: 'Cycle Path in UK - Enjoy a peaceful ride',
    link: 'https://www.theguardian.com/travel/2019/aug/31/top-10-former-railway-cycle-tracks-uk'
  },
  {
    src: cyclepath03,
    alt: 'Cycle Path in UK 3',
    text: 'Cycle Path in UK - Adventure awaits',
    link: 'https://www.cyclinguk.org/guide/great-british-rides'
  }
];

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds
    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted', formData);
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-form">
        <h2>Contact Us</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
          />
          <button type="submit">Submit</button>
        </form>
      </div>

      <div className="image-gallery">
        <div className="image-container">
          <img
            src={images[currentImageIndex].src}
            alt={images[currentImageIndex].alt}
            className="slideshow-image"
          />
          <div className="image-text">
            <h3>{images[currentImageIndex].text}</h3>
            <a href={images[currentImageIndex].link} target="_blank" rel="noopener noreferrer" className="see-details-btn">
              See Details
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
