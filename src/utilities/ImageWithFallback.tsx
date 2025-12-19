import { useState, useCallback, useEffect } from 'react';
import defaultImage from '../../public/defaultImage.png';

function ImageWithFallback({ src, alt }: { src: string; alt: string }) {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  const handleError = useCallback(() => {
    setImgSrc(defaultImage);
  }, []);

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
    />
  );
}

export default ImageWithFallback;