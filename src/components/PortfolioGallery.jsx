import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getAllPortfolioItems } from '../utils/portfolioStorage';

export default function PortfolioGallery() {
  const [portfolioProjects, setPortfolioProjects] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Загрузить портфолио из localStorage
  useEffect(() => {
    const items = getAllPortfolioItems();
    // Берем максимум 6 изображений для галереи
    setPortfolioProjects(items.slice(0, 6));
  }, []);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setSelectedImage(portfolioProjects[index]);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const goToPrevious = () => {
    if (portfolioProjects.length === 0) return;
    const newIndex = (currentIndex - 1 + portfolioProjects.length) % portfolioProjects.length;
    setCurrentIndex(newIndex);
    setSelectedImage(portfolioProjects[newIndex]);
  };

  const goToNext = () => {
    if (portfolioProjects.length === 0) return;
    const newIndex = (currentIndex + 1) % portfolioProjects.length;
    setCurrentIndex(newIndex);
    setSelectedImage(portfolioProjects[newIndex]);
  };

  // Если портфолио пусто
  if (portfolioProjects.length === 0) {
    return (
      <div className="my-4 bg-gray-900 rounded-xl p-5 border border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-600">
            <span className="text-xl">🎨</span>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Our Portfolio</h3>
            <p className="text-gray-400 text-xs">Loading portfolio...</p>
          </div>
        </div>
      </div>
    );
  }

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
                src={project.url}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x400?text=Portfolio+Image';
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex flex-col items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 text-xs font-medium transition-opacity duration-300 px-2 text-center">
                  {project.title}
                </span>
                <span className="text-gray-300 opacity-0 group-hover:opacity-100 text-xs transition-opacity duration-300 mt-1">
                  {project.category}
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
              src={selectedImage.url}
              alt={selectedImage.title}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x600?text=Portfolio+Image';
              }}
            />
            <div className="text-center mt-4 text-white">
              <h3 className="text-lg font-semibold mb-1">{selectedImage.title}</h3>
              <p className="text-sm text-gray-400 mb-2">{selectedImage.category}</p>
              <p className="text-xs text-gray-500">
                {currentIndex + 1} / {portfolioProjects.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

