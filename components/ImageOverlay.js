"use client";
import React, { useState, useRef } from "react";
import Draggable from "react-draggable";

const ImageOverlay = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  // 이미지 합치기 및 다운로드 함수
  const mergeAndDownload = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = 400;
    canvas.height = 400;

    const img1 = new Image();
    const img2 = new Image();

    img1.src = "/images/noimage.jpg";
    img2.src = "/images/noimage.jpg";

    img1.onload = () => {
      ctx.drawImage(img1, 0, 0, 200, 200);
      img2.onload = () => {
        ctx.drawImage(img2, position.x, position.y, 200, 200);

        // 다운로드 링크 생성
        const link = document.createElement('a');
        link.download = 'merged-image.png';
        link.href = canvas.toDataURL();
        link.click();
      };
    };
  };

  const handleDrag = (e, data) => {
    setPosition({ x: data.x, y: data.y });
  };

  return (
    <div
      style={{
        position: "relative",
        width: "400px",
        height: "400px",
        border: "1px solid black",
      }}
    >
      {/* 고정된 이미지 */}
      <img
        src="/images/noimage.jpg"
        alt="Fixed"
        style={{
          width: "200px",
          position: "absolute",
          top: "0",
          left: "0",
        }}
      />

      {/* 드래그 가능한 이미지 */}
      <Draggable
        bounds="parent"
        position={position}
        onDrag={handleDrag}
      >
        <img
          src="/images/noimage.jpg"
          alt="Draggable"
          style={{
            width: "200px",
            position: "absolute",
            cursor: "move",
          }}
        />
      </Draggable>

      {/* 다운로드 버튼 */}
      <button
        onClick={mergeAndDownload}
        style={{ position: "absolute", bottom: "-30px" }}
      >
        Download Merged Image
      </button>

      {/* 숨겨진 캔버스 */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default ImageOverlay;
