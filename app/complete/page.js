"use client";
import { useEffect, useState } from 'react';

export default function CompletePage() {
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    const storedImage = sessionStorage.getItem('completedImage');
    if (storedImage) {
      setImageData(storedImage);
      // 사용 후 세션 스토리지에서 제거 (선택사항)
      sessionStorage.removeItem('completedImage');
    }
  }, []);

  return (
    <div>
      <h1>완성된 이미지</h1>
      {imageData && (
        <img src={`data:image/png;base64,${imageData}`} alt="Completed Image" />
      )}
    </div>
  );
}