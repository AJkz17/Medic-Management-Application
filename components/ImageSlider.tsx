'use client';

import { useState, useEffect } from "react";
import Image from "next/image";

// Referencing your local assets saved inside public/Img/
const images = [
  "/Img/medicWithCare.jpg",
  "/Img/MTI.jpg",
  "/Img/Surgeon.jpg",
];

export default function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  return (
    <div className="position-relative w-100" style={{ height: '320px', overflow: 'hidden' }}>
      {images.map((src, index) => (
        <div
          key={src}
          className="position-absolute w-100 h-100"
          style={{
            transition: "opacity 1s ease-in-out",
            opacity: currentIndex === index ? 1 : 0,
            zIndex: currentIndex === index ? 1 : 0,
          }}
        >
          <Image
            src={src}
            alt={`Medical Slide ${index + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: 'cover' }}
            priority={index === 0} // Loads the first slide immediately to prevent layout shifts
          />
        </div>
      ))}
      
      {/* Dot Indicators */}
      <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3" style={{ zIndex: 10 }}>
        {images.map((_, index) => (
          <span 
            key={index} 
            className={`mx-1 d-inline-block rounded-circle ${currentIndex === index ? 'bg-white shadow' : 'bg-secondary'}`} 
            style={{ width: '10px', height: '10px', cursor: 'pointer', opacity: currentIndex === index ? 1 : 0.6 }} 
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}