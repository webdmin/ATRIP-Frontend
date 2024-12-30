import React from 'react';
import './BlogSection.css';

const BlogSection = () => {
  const blogPosts = [
    {
      title: 'Innovative Infrastructure Solutions for the Future',
      description:
        'Explore how we are paving the way for the future of infrastructure with cutting-edge technology and sustainable practices.',
      link: 'https://www.sustrans.org.uk/find-a-route-on-the-national-cycle-network/?location=null&distance=null&routetype=null', // Replace with actual article URL
      image: 'https://image.chitra.live/api/v1/wps/01a96fc/4fb2c188-a2b1-43cc-be15-7527a9e4bd52/4/iStock-1422864010-679x419.jpg', // Replace with actual image URL
    },
    {
      title: 'Transforming Urban Development with Smart Cities',
      description:
        'Discover how smart city technologies are transforming urban living, making cities more efficient and livable.',
      link: 'https://www.theguardian.com/travel/2019/aug/31/top-10-former-railway-cycle-tracks-uk', // Replace with actual article URL
      image: 'https://assets.publishing.service.gov.uk/media/627e6da68fa8f53f9a15c1f9/s960_active-travel-960.jpg', // Replace with actual image URL
    },
    {
      title: 'The Role of Sustainability in Modern Infrastructure',
      description:
        'Learn about the importance of sustainable infrastructure solutions and how they are shaping the world we live in.',
      link: 'https://www.cyclinguk.org/guide/great-british-rides', // Replace with actual article URL
      image: 'https://www.chrisboardman.com/_/images/5023.jpg', // Replace with actual image URL
    },
  ];

  return (
    <section id="blog" className="blog-section">
      <h2>Blog & Insights</h2>
      <div className="blog-posts">
        {blogPosts.map((post, index) => (
          <div className="blog-post" key={index}>
            <div className="blog-post-image">
              <img src={post.image} alt={post.title} />
            </div>
            <div className="blog-post-content">
              <h3>{post.title}</h3>
              <p>{post.description}</p>
              <a href={post.link} className="read-more" target="_blank" rel="noopener noreferrer">
                Read More
              </a>
            </div>
          </div>
        ))}
      </div>
      <a href="https://en.wikipedia.org/wiki/List_of_cycle_routes_in_England" target="_blank" rel="noopener noreferrer" className="cta-button">
        View All Insights
      </a>
    </section>
  );
};

export default BlogSection;
