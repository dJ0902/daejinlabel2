"use client";
import { useState } from "react";

import { CompletePhase, EditPhase, ProcessingSpinner } from "@/components";
import { isIPhone } from "@/utils";

function Page() {
  // 진행 단계: 편집(Edit) -> 프로세싱(Processing) -> 완료(Completed)
  const [phase, setPhase] = useState("Edit");

  // 편집
  const [title, setTitle] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [rndState, setRndState] = useState({
    x: 100,
    y: 100,
    width: 200,
    height: 200,
  }); // 사용자 업로드 이미지 드래그앤드롭 관련 상태
  console.log(rndState);

  // 이미지 프로세싱 진행도(퍼센트)
  const [processingProgress, setProcessingProgress] = useState(0);

  // 완성된 이미지
  const [completeImage, setCompleteImage] = useState(null);

  const handleBackToEdit = () => {
    setPhase("Edit");
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
      }
    } else {
      console.log("No image available to download");
    }
  };

  if (phase === "Edit") {
    return (
      <EditPhase
        rndState={rndState}
        title={title}
        uploadedImage={uploadedImage}
        setCompleteImage={setCompleteImage}
        setPhase={setPhase}
        setProcessingProgress={setProcessingProgress}
        setRndState={setRndState}
        setTitle={setTitle}
        setUploadedImage={setUploadedImage}
      />
    );
  }
  if (phase === "Processing" || !completeImage) {
    return (
      <ProcessingSpinner
        progress={processingProgress}
        setProgress={setProcessingProgress}
      />
    );
  }
  // phase === 'Completed'
  return (
    <CompletePhase
      completeImage={completeImage}
      handleBackToEdit={handleBackToEdit}
      handleDownloadImage={handleDownloadImageFromS3}
    />
  );
}

export default Page;
