import { useOptions } from 'containers/OptionsContext';
import React, { useState, useEffect } from 'react';

interface ImageData {
  ID: number;
  position: string;
  image: string;
}

const PromotionImageSlider = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true); // ✅ เพิ่ม loading state
  const { getOptionByName } = useOptions();
  const basePath = getOptionByName('basePathAdmin');

  useEffect(() => {
    if (basePath) {
      fetch(`${basePath}api/getImage/frontend/getBrannerImage.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data?.results?.product) {
            setImages(data.results.product);
          } else {
            setImages([]);
          }
        })
        .catch((error) => {
          console.error('Error fetching image data:', error);
        })
        .finally(() => setLoading(false)); // ✅ เมื่อโหลดเสร็จให้ปิด Skeleton
    }
  }, [basePath]);

  useEffect(() => {
    if (images.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [images]);

  return (
    <div className="relative max-w-xl mx-1 h-auto overflow-hidden rounded-lg bg-gray-200">
      {loading ? (
        <div className="animate-pulse">
          <div className="w-96 h-full bg-gray-300 rounded-lg"></div>
        </div>
      ) : images.length > 0 ? (
        images.map((image, index) =>
          index === currentIndex ? (
            <a key={image.ID} href={`${image.ID}`}>
              <img
                src={image.image}
                alt={`Slide ${index + 1}`}
                className="w-full h-auto object-cover opacity-100 hover:opacity-70 transition-opacity duration-200 rounded-lg"
              />
            </a>
          ) : null
        )
      ) : (
        <p className="text-center py-4 text-gray-500">ไม่มีรูปภาพ</p>
      )}

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
  );
};

export default PromotionImageSlider;
