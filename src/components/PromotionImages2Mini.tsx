import React, { useEffect, useState } from 'react'
import { useOptions } from 'containers/OptionsContext';


interface ImageData {
  ID: number;
  position: string;
  image: string;
}

const PromotionImages2Mini: React.FC = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const { getOptionByName } = useOptions();
  const basePath = getOptionByName('basePathAdmin');
  const [loading, setLoading] = useState(true);

 useEffect(() => {
    if (basePath) {
      fetch(`${basePath}api/getImage/frontend/getBrannerImageMini.php`, {
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
        .finally(() => {
          setLoading(false);
        });
    }
  }, [basePath]);

  return (
    <div className="flex flex-col overflow-hidden space-y-1">
      {images.map((image) => (
        <a key={image.ID}>
          <img
            className="w-72 h-auto rounded-lg hover:opacity-70 transition-opacity duration-200 object-cover"
            src={image.image}
            alt=''
          />
        </a>
      ))}
    </div>

  )
}

export default PromotionImages2Mini

