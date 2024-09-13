'use client'
import React from 'react'
import ImageOverlay from '@/app/components/ImageOverlay'
import { Button } from '@nextui-org/react'
function page() {

  const handleImage = () => {
    console.log('그림');
    const url = "https://vn3xcq2ahg.execute-api.ap-northeast-2.amazonaws.com/remove-background/";
    const file_path = "/images/test1.jpg";

    fetch(file_path)
      .then(response => response.blob())
      .then(blob => {
        const formData = new FormData();
        formData.append("file", blob, "background2.png");

        fetch(url, {
          method: "POST",
          body: formData
        })
        .then(response => {
          response.blob().then(blob => {
            if (response.status === 200) {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.style.display = "none";
              a.href = url;
              const currentTime = new Date().toLocaleTimeString().replace(/:/g, '');
              a.download = `output_${currentTime}.png`;
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
              console.log("배경 제거된 이미지가 output.png로 저장되었습니다.");
            } else {
              console.log(`요청 실패: ${response.status}`);
            }
          });
        })
        .catch(error => console.error('Error:', error));
      })
      .catch(error => console.error('Error:', error));
  }

  return (
    <div>
      {/* <ImageOverlay /> */}
      <Button onClick={handleImage}>그림</Button>
    </div>
  )
}

export default page