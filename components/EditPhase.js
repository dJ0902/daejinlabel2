"use client";
import { Button, Input, useDisclosure } from "@nextui-org/react";
import imageCompression from "browser-image-compression";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { v4 as uuidv4 } from "uuid";

import {
  EditPhaseImageUploadModal,
  EditPhaseTitle,
  EditPhaseUploadedImage,
} from "@/components";
import { useBoxSize } from "@/hooks";

export const EditPhase = ({
  rndState,
  title,
  uploadedImage,
  setCompleteImage,
  setPhase,
  setProcessingProgress,
  setRndState,
  setTitle,
  setUploadedImage,
}) => {
  // 사용자 이미지 업로드 모달 관련
  const [completedCrop, setCompletedCrop] = useState();
  const {
    isOpen: isModalOpen,
    onClose: onModalClose,
    onOpen: onModalOpen,
    onOpenChange: onModalOpenChange,
  } = useDisclosure();
  const uploadModalImgRef = useRef(null);

  const handleConfirmCropImageButton = () => {
    if (uploadModalImgRef.current && completedCrop) {
      const canvas = document.createElement("canvas");
      const scaleX =
        uploadModalImgRef.current.naturalWidth /
        uploadModalImgRef.current.width;
      const scaleY =
        uploadModalImgRef.current.naturalHeight /
        uploadModalImgRef.current.height;
      canvas.width = uploadModalImgRef.current.naturalWidth;
      canvas.height = uploadModalImgRef.current.naturalHeight;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(
          uploadModalImgRef.current,
          completedCrop.x * scaleX,
          completedCrop.y * scaleY,
          completedCrop.width * scaleX,
          completedCrop.height * scaleY,
          0,
          0,
          uploadModalImgRef.current.naturalWidth,
          uploadModalImgRef.current.naturalHeight
        );

        // Convert canvas to blob and then to base64
        canvas.toBlob((blob) => {
          if (blob) {
            const reader = new FileReader();
            reader.onloadend = () => {
              setUploadedImage(reader.result);
            };
            reader.readAsDataURL(blob);
          }
        }, "image/png"); // Change to "image/png" to maintain transparency
      }
    }
  };

  // 편집 화면 관련
  const { ref: backgroundRef, boxSize } = useBoxSize();
  const uploadedImgRef = useRef(null);

  const pathname = usePathname();
  const router = useRouter();
  const templateNumber = pathname.split("/")[2];

  const redirectToHome = () => {
    router.push("/");
  };

  const compressImage = async (blob) => {
    const options = {
      maxSizeMB: 10,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      const compressedBlob = await imageCompression(blob, options);
      return compressedBlob;
    } catch (error) {
      console.error("Error compressing image:", error);
      return blob; // 압축에 실패하면 원본 blob 반환
    }
  };

  const handleSaveImage = () => {
    setPhase("Processing");
    setProcessingProgress(0);

    console.log("handleSaveImage start:", new Date());
    if (backgroundRef.current) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const backgroundImg = new window.Image();

      backgroundImg.src = `/images/background${templateNumber}.png`;

      backgroundImg.onload = () => {
        let canvasWidth = backgroundImg.width;
        let canvasHeight = backgroundImg.height;

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // Draw the uploaded image if it exists
        if (uploadedImage && uploadedImgRef.current) {
          const uploadedImg = new window.Image();
          uploadedImg.src = uploadedImage;

          uploadedImg.onload = () => {
            const scaleX = canvasWidth / backgroundRef.current.offsetWidth;
            const scaleY = canvasHeight / backgroundRef.current.offsetHeight;
            const scale = Math.min(scaleX, scaleY); // Use the smaller scale to maintain aspect ratio
            const x = rndState.x * scale; // Use Rnd's state
            const y = rndState.y * scale;
            const width = rndState.width * scale;
            const height = rndState.height * scale;

            ctx.drawImage(uploadedImg, x, y, width, height); // Adjust width and height to match the uploaded image
            // Draw the background image on top
            ctx.drawImage(backgroundImg, 0, 0);
            drawTitleAndSave(canvasWidth, canvasHeight);
          };
        } else {
          // Draw the background image if no uploaded image
          ctx.drawImage(backgroundImg, 0, 0);
          drawTitleAndSave(canvasWidth, canvasHeight);
        }
      };

      function drawTitleAndSave(canvasWidth, canvasHeight) {
        // Calculate the position of the title text based on the pathname
        let titleX,
          titleY,
          fontSize,
          fontFamily,
          fontWeight,
          letterSpacing,
          lineHeight;

        if (templateNumber === "0") {
          titleX = canvasWidth / 2;
          // titleY = (canvasHeight * 4) / 13;
          titleY = 700;
          fontSize = "384px";
          fontFamily = "ChumChurumTitle";
          fontWeight = "normal";
          letterSpacing = "normal";
          lineHeight = "normal";

          ctx.font = `${fontWeight} ${fontSize} ${fontFamily}`;
          ctx.fillStyle = "black";
          ctx.textAlign = "center";
          ctx.fillText(title, titleX, titleY);
        } else if (templateNumber === "1") {
          titleX = (canvasWidth * 28) / 100;
          fontSize = "300px";
          fontFamily = "SCDream";
          fontWeight = "700";
          letterSpacing = "-0.05em";
          lineHeight = "1em";

          // Calculate titleY so that the bottom of the last character is at 20% height
          const totalTextHeight = title.length * 1;
          titleY = (canvasHeight * 50) / 100 - totalTextHeight;

          // Adjust titleY based on the number of characters
          if (title.length === 4) {
            titleY -= parseInt(fontSize);
          }
          if (title.length === 5) {
            titleY -= 2 * parseInt(fontSize);
          }

          // Draw the title text vertically
          ctx.font = `${fontWeight} ${fontSize} ${fontFamily}`;
          ctx.fillStyle = "black";
          ctx.textAlign = "center";
          const chars = title.split("");
          chars.forEach((char, index) => {
            ctx.fillText(char, titleX, titleY + index * parseInt(fontSize));
          });
        } else if (templateNumber === "2") {
          titleX = (canvasWidth * 28) / 100;
          fontSize = "500px";
          fontFamily = "SCDream";
          fontWeight = "700";
          letterSpacing = "-0.05em";
          lineHeight = "1em";

          // Calculate titleY so that the bottom of the last character is at 20% height
          const totalTextHeight = title.length * 1;
          titleY = (canvasHeight * 45) / 100 - totalTextHeight;

          // Adjust titleY based on the number of characters
          if (title.length === 4) {
            titleY -= parseInt(fontSize);
          }
          if (title.length === 5) {
            titleY -= 2 * parseInt(fontSize);
          }

          // Draw the title text vertically
          ctx.font = `${fontWeight} ${fontSize} ${fontFamily}`;
          ctx.fillStyle = "black";
          ctx.textAlign = "center";
          const chars = title.split("");
          chars.forEach((char, index) => {
            ctx.fillText(char, titleX, titleY + index * parseInt(fontSize));
          });
        } else if (templateNumber === "3") {
          titleX = canvasWidth / 2;
          titleY = (canvasHeight * 8) / 10;
          fontSize = "400px";
          fontFamily = "SCDream";
          fontWeight = "normal";
          letterSpacing = "normal";
          lineHeight = "normal";

          ctx.font = `${fontWeight} ${fontSize} ${fontFamily}`;
          ctx.fillStyle = "black";
          ctx.textAlign = "center";
          ctx.fillText(title, titleX, titleY);
        }

        canvas.toBlob(async (blob) => {
          if (blob) {
            const compressedBlob = await compressImage(blob);
            // setIsComplete(true);
            // setProgressValue(0);
            handleUploadToS3(compressedBlob);
          }
        }, "image/png");
      }
    }
  };

  const handleUploadToS3 = async (blob) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Data = reader.result.split(",")[1];

        const chunkSize = 500000; // 약 500KB
        const totalChunks = Math.ceil(base64Data.length / chunkSize);
        const requestId = uuidv4(); // Generate a unique requestId

        for (let i = 0; i < totalChunks; i++) {
          let chunk = base64Data.slice(i * chunkSize, (i + 1) * chunkSize);

          // Base64 패딩 추가 (필요한 경우)
          while (chunk.length % 4 !== 0) {
            chunk += "=";
          }

          console.log("/process-image-chunk start:", new Date());
          const response = await fetch(
            "https://5ih5aln40m.execute-api.ap-northeast-2.amazonaws.com/process-image-chunk",
            // "http://localhost:8000/process-image-chunk",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                image: chunk,
                chunkIndex: i,
                totalChunks: totalChunks,
                requestId: requestId,
              }),
            }
          );
          console.log("/process-image-chunk end:", new Date());

          if (!response.ok) {
            throw new Error(`Failed to process image chunk ${i + 1}`);
          }
        }

        console.log("/complete-image-upload start:", new Date());

        // 모든 청크 업로드 완료 후 처리
        const finalResponse = await fetch(
          "https://5ih5aln40m.execute-api.ap-northeast-2.amazonaws.com//complete-image-upload",
          // "http://localhost:8000/complete-image-upload",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              totalChunks: totalChunks,
              requestId: requestId,
            }),
          }
        );
        console.log("/complete-image-upload end:", new Date());

        const result = await finalResponse.json();
        const s3_url = result.s3_url;

        setCompleteImage(s3_url);
      };
      setProcessingProgress(100);
      setPhase("Completed");
    } catch (error) {
      console.error("Error uploading image:", error);
      setProcessingProgress(100);
      setPhase("Edit");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full md:w-1/3 h-full gap-y-5">
      <div onClick={redirectToHome} className="absolute top-5 left-5">
        <IoIosArrowBack className="text-3xl cursor-pointer" />
      </div>

      <ul className="list-inside list-disc text-sm text-justify">
        <li>
          비방, 비하, 욕설, 성적 수치심 등 타인에게 불쾌감을 주는 문구는
          금지합니다.
        </li>
        <li>
          해당 이미지는 특정 단체나 기관, 개인의 의견을 대표하지 않습니다.
        </li>
      </ul>

      <div id="picture" className="relative w-full h-auto" ref={backgroundRef}>
        {backgroundRef && backgroundRef.current && (
          <EditPhaseTitle
            boxSize={boxSize}
            title={title}
            templateNumber={templateNumber}
          />
        )}

        {uploadedImage && (
          <EditPhaseUploadedImage
            rndState={rndState}
            uploadedImgRef={uploadedImgRef}
            uploadedImage={uploadedImage}
            setRndState={setRndState}
          />
        )}

        <img
          alt="Background Image"
          id="background"
          src={`/images/background${templateNumber}.png`}
          className="object-cover w-full h-full rounded-2xl z-0 border border-gray-300"
        />
      </div>

      <Input
        value={title.length > 5 ? title.substring(0, 5) : title}
        onChange={(e) =>
          setTitle(
            e.target.value.length > 5
              ? e.target.value.substring(0, 5)
              : e.target.value
          )
        }
        type="text"
        label="상단 출력 문구"
      />

      <div className="flex gap-x-5 justify-center items-center w-full">
        {templateNumber === "0" && (
          <Button className="bg-green-700 text-white" onClick={onModalOpen}>
            사진업로드
          </Button>
        )}

        {uploadedImage && (
          <Button color="danger" onClick={() => setUploadedImage(null)}>
            이미지삭제
          </Button>
        )}

        {templateNumber === "0" && (
          <Button className="bg-green-700 text-white" onClick={handleSaveImage}>
            저장하기
          </Button>
        )}
      </div>

      <EditPhaseImageUploadModal
        isOpen={isModalOpen}
        imgRef={uploadModalImgRef}
        uploadedImage={uploadedImage}
        completedCrop={completedCrop}
        handleConfirmClick={handleConfirmCropImageButton}
        onClose={onModalClose}
        onOpenChange={onModalOpenChange}
        setCompletedCrop={setCompletedCrop}
        setUploadedImage={setUploadedImage}
      />
    </div>
  );
};
