import React, { useState, useEffect } from 'react';

interface ImageData {
  url: string;
  link: string;
}

const PromotionImageSlider2 = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch('/data/dataImagePromotionSlice2.json')
      .then((response) => response.json())
      .then((data: ImageData[]) => {
        setImages(data);
      })
      .catch((error) => {
        console.error('Error fetching image data:', error);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [images]);

  return (
    <div>
      <div className="flex flex-row items-center justify-between border-b-8 border-red-700">
        <p className="text-x; md:text-3xl font-bold mb-1 pl-2">สินค้าโปรโมชั่น</p>
        <a href="#" className="text-gray-500 text-lg text-right mb-2 pr-10">
          ดูเพิ่มเติม...
        </a>
      </div>

      <div className="mt-2 relative max-w-full h-auto overflow-hidden bg-gray-200">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <a key={index} href={image.link} className="flex-shrink-0 w-full">
              <img
                src={image.url}
                alt={`Slide ${index + 1}`}
                className="w-full h-auto object-cover opacity-100 hover:opacity-70 transition-opacity duration-200"
              />
            </a>
          ))}
        </div>
        <div className="absolute left-0 right-0 flex justify-center space-x-2 lg:bottom-2">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full hover:opacity-70 ${index === currentIndex ? 'bg-white' : 'bg-gray-400'
                }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromotionImageSlider2;
