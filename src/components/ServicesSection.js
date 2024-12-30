import React from 'react';
import './ServicesSection.css';

const ServicesSection = () => {
  return (
    <section id="services" className="services-section">
      <h2>Our Services</h2>
      <div className="service">
        <h3>Construction Management</h3>
        <p>Efficient management of your construction projects, ensuring quality and timeliness.</p>
      </div>
      <div className="service">
        <h3>Engineering Solutions</h3>
        <p>Providing expert engineering services to support infrastructure development.</p>
      </div>
      <div className="service">
        <h3>Consultancy</h3>
        <p>Professional consultancy services to optimize your infrastructure strategies.</p>
      </div>
    </section>
  );
};

export default ServicesSection;
