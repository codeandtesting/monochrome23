import React, { useState } from 'react';
import { X } from 'lucide-react';

const portfolioProjects = [
  {
    id: 1,
    image: '/portfolio/1a.jpg',
    title: 'Project 1'
  },
  {
    id: 2,
    image: '/portfolio/2a.jpg',
    title: 'Project 2'
  },
  {
    id: 3,
    image: '/portfolio/3a.jpg',
    title: 'Project 3'
  },
  {
    id: 4,
    image: '/portfolio/4a.jpg',
    title: 'Project 4'
  },
  {
    id: 5,
    image: '/portfolio/5a.jpg',
    title: 'Project 5'
  }
];

export default function PortfolioGallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setSelectedImage(portfolioProjects[index]);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const goToPrevious = () => {
    const newIndex = (currentIndex - 1 + portfolioProjects.length) % portfolioProjects.length;
    setCurrentIndex(newIndex);
    setSelectedImage(portfolioProjects[newIndex]);
  };

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % portfolioProjects.length;
    setCurrentIndex(newIndex);
    setSelectedImage(portfolioProjects[newIndex]);
  };

  return (
    <>
      <div className="my-4 bg-gray-900 rounded-xl p-5 border border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-600">
            <span className="text-xl">🎨</span>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Our Portfolio</h3>
            <p className="text-gray-400 text-xs">Recent successful projects</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {portfolioProjects.map((project, index) => (
            <div
              key={project.id}
              className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
              onClick={() => openLightbox(index)}
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium transition-opacity duration-300">
                  View
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all z-10"
          >
            <X size={24} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-4 text-white p-3 hover:bg-white hover:bg-opacity-20 rounded-full transition-all z-10 text-2xl font-bold"
          >
            ‹
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 text-white p-3 hover:bg-white hover:bg-opacity-20 rounded-full transition-all z-10 text-2xl font-bold"
          >
            ›
          </button>

          <div className="max-w-4xl max-h-[90vh] px-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            <div className="text-center mt-4 text-white">
              <p className="text-sm">
                {currentIndex + 1} / {portfolioProjects.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

