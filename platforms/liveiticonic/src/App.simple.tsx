import React from "react";
import { BrowserRouter } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-rose-900 to-purple-900 text-white p-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          ✨ Live It Iconic - Statement Pieces
        </h1>
        <p className="text-center text-rose-200 mb-8">
          Platform is loading... If you see this, React is working!
        </p>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Collections</h2>
            <p className="text-rose-200">Browse our pieces</p>
          </div>
          <div className="bg-white/10 backdrop-blur p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">New Arrivals</h2>
            <p className="text-rose-200">Latest additions</p>
          </div>
          <div className="bg-white/10 backdrop-blur p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">About</h2>
            <p className="text-rose-200">Our story</p>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
