"use client";
import { Button, Input, useDisclosure } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";

import {
  EditPhaseImageUploadModal,
  EditPhaseTitle,
  EditPhaseUploadedImage,
  ProcessingSpinner,
} from "@/components";
import { useBoxSize } from "@/hooks";
import { hasBadWords } from "@/utils";

export const EditPhase = ({
  rndState,
  title,
  uploadedImage,
  setCompleteImage,
  setRndState,
  setTitle,
  setUploadedImage,
}) => {
  // 사용자 이미지 업로드 모달 관련
  const [completedCrop, setCompletedCrop] = useState();
  const [isContainProfanity, setIsContainProfanity] = useState(false);
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
  const [processingProgress, setProcessingProgress] = useState(0);
  const [showProgressSpinner, setShowProgressSpinner] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const templateNumber = pathname.split("/")[2];

  const redirectToHome = () => {
    router.push("/");
  };

  const handleSaveImage = () => {
    setShowProgressSpinner(true);
    setProcessingProgress(0);

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

        ctx.globalCompositeOperation = "destination-over";
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const dataURL = canvas.toDataURL();
        setProcessingProgress(100);
        setShowProgressSpinner(false);
        setCompleteImage(dataURL);
      }
    }
  };

  return (
    <>
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

        <div
          id="picture"
          className="relative w-full aspect-[1920/1873]"
          ref={backgroundRef}
        >
          {uploadedImage && (
            <div
              style={{
                position: "absolute",
                left: rndState.x,
                top: rndState.y,
                width: `${rndState.width}px`,
                height: `${rndState.height}px`,
                opacity: rndState.isDraggingOrResizing ? 0 : 1,
              }}
            >
              <img
                src={uploadedImage}
                alt="Draggable Resizable"
                className="w-full h-full"
              />
            </div>
          )}

          {backgroundRef && backgroundRef.current && (
            <EditPhaseTitle
              boxSize={boxSize}
              title={title}
              templateNumber={templateNumber}
            />
          )}

          <img
            alt="Background Image"
            id="background"
            src={`/images/background${templateNumber}.png`}
            className="object-cover w-full h-full rounded-2xl border  border-gray-300 absolute"
          />

          {uploadedImage && (
            <EditPhaseUploadedImage
              rndState={rndState}
              uploadedImgRef={uploadedImgRef}
              uploadedImage={uploadedImage}
              setRndState={setRndState}
            />
          )}
        </div>

        <Input
          value={title.length > 5 ? title.substring(0, 5) : title}
          onChange={async (e) => {
            setTitle(
              e.target.value.length > 5
                ? e.target.value.substring(0, 5)
                : e.target.value
            );

            if (await hasBadWords(e.target.value)) {
              setIsContainProfanity(true);
            } else {
              if (isContainProfanity) {
                setIsContainProfanity(false);
              }
            }
          }}
          type="text"
          color={isContainProfanity ? "danger" : ""}
          label="상단 출력 문구"
        />

        {isContainProfanity ? (
          <p className="text-sm text-[#f31261] text-center">
            타인에게 불쾌감을 주는 문구는 입력할 수 없습니다.
          </p>
        ) : null}

        <div className="flex gap-x-5 justify-center items-center w-full">
          {templateNumber === "0" && (
            <Button
              className="bg-panton-500 text-white font-['ChumChurumTitle'] pb-[0.1rem]"
              onClick={onModalOpen}
            >
              사진업로드
            </Button>
          )}

          {uploadedImage && (
            <Button
              className="font-['ChumChurumTitle'] pb-[0.1rem]"
              color="danger"
              onClick={() => setUploadedImage(null)}
            >
              이미지삭제
            </Button>
          )}

          {templateNumber === "0" && (
            <Button
              className={`bg-panton-500 text-white font-['ChumChurumTitle'] pb-[0.1rem] ${
                isContainProfanity ? "opacity-25" : ""
              }`}
              disabled={isContainProfanity}
              onClick={handleSaveImage}
            >
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

      {showProgressSpinner && (
        <ProcessingSpinner
          progress={processingProgress}
          setProgress={setProcessingProgress}
        />
      )}
    </>
  );
};
