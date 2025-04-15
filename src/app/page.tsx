import React from 'react';

const Home = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-primary">Welcome to PagePilot!</h1>
      <p className="text-gray-700 mt-4">
        This is the home page of our PWA 3. Feel free to navigate to the About and Contact pages.
      </p>
      <img
        src="https://picsum.photos/800/400"
        alt="Placeholder Image"
        className="mt-6 rounded-lg shadow-md"
      />
    </div>
  );
};

export default Home;
