"use client";
import { useState } from "react";

import { CompletePhase, EditPhase } from "@/components";
import { isIPhone } from "@/utils";

const fetchData = async () => {
  const host = typeof window !== "undefined" ? window.location.hostname : "";
  let apiBaseUrl;

  if (host.includes("chilsunglabels.vercel.app")) {
    //QR코드
    apiBaseUrl = "https://chilsunglabels.vercel.app/api/count/content-download";
  } else if (host.includes("chilsunglabel-user.vercel.app")) {
    //WEB접근
    apiBaseUrl =
      "https://chilsunglabel-user.vercel.app/api/count/content-download";
  }

  const response = await fetch(apiBaseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: {},
  });

  if (!response.ok) {
    console.log("Count is loss.....");
  }
};

function Page() {
  // 편집
  const [title, setTitle] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [rndState, setRndState] = useState({
    isDraggingOrResizing: false,
    x: 100,
    y: 100,
    width: 200,
    height: 200,
  }); // 사용자 업로드 이미지 드래그앤드롭 관련 상태

  // 완성된 이미지
  const [completeImage, setCompleteImage] = useState(null);

  const handleBackToEdit = () => {
    setTitle("");
    setUploadedImage(null);
    setCompleteImage(null);
  };

  const handleDownloadImageFromS3 = () => {
    if (completeImage) {
      // 모바일 기기 감지

      if (isIPhone) {
        // 모바일 기기일 경우 새 탭에서 이미지 열기
        window.open(completeImage, "_blank");
        fetchData();
      } else {
        // 데스크톱일 경우 기존 다운로드 로직 유지
        const link = document.createElement("a");
        link.href = completeImage;
        const currentTime = new Date()
          .toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
          .replace(/[:\s]/g, "")
          .replace(/,/g, "")
          .replace(
            /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
            "$1년$2월$3일$4시$5분$6초"
          );
        link.download = `label_image_${currentTime}.png`;
        link.click();
        fetchData();
      }
    } else {
      console.log("No image available to download");
    }
  };

  if (!completeImage) {
    return (
      <EditPhase
        rndState={rndState}
        title={title}
        uploadedImage={uploadedImage}
        setCompleteImage={setCompleteImage}
        setRndState={setRndState}
        setTitle={setTitle}
        setUploadedImage={setUploadedImage}
      />
    );
  }
  return (
    <CompletePhase
      completeImage={completeImage}
      handleBackToEdit={handleBackToEdit}
      handleDownloadImage={handleDownloadImageFromS3}
    />
  );
}

export default Page;
