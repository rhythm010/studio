import React from 'react';

const About = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-primary">About Us</h1>
      <p className="text-gray-700 mt-4">
        Learn more about our company and our mission to provide simple and effective web solutions.
      </p>
      <img
        src="https://picsum.photos/800/400"
        alt="Placeholder Image"
        className="mt-6 rounded-lg shadow-md"
      />
    </div>
  );
};

export default About;
