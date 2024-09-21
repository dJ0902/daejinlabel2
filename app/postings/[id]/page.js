"use client";
import React, { useState, useRef, useEffect } from "react";
import { Image } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Skeleton,
  Card,
} from "@nextui-org/react";
import ImageCropper from "../../components/ImageCropper";
import Draggable from "react-draggable"; // react-draggable 라이브러리를 추가해야 합니다
import { usePathname } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import html2canvas from "html2canvas";
import { Rnd } from "react-rnd";
import { CgArrowsExpandLeft } from "react-icons/cg";
import SlideUp from "@/app/components/SlideUp";
import { Spinner } from "@nextui-org/spinner";
import { Progress } from "@nextui-org/react";

function Page() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [completedCrop, setCompletedCrop] = useState();
  const [title, setTitle] = useState("");
  const [draggedPosition, setDraggedPosition] = useState({ x: 0, y: 0 });
  const imgRef = useRef(null);
  const backgroundRef = useRef(null);
  const uploadedImgRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();
  const [isComplete, setIsComplete] = useState(false);
  const [generatedImageSrc, setGeneratedImageSrc] = useState(null);
  const [testImage, setTestImage] = useState("/images/background1.png");
  const [completeImage, setCompleteImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isIPhone = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const [progressValue, setProgressValue] = useState(0);
  const [rndState, setRndState] = useState({
    x: 100,
    y: 100,
    width: 200,
    height: 200,
  }); // State to track Rnd position and size

  const handleConfirmClick = () => {
    if (imgRef.current && completedCrop) {
      const canvas = document.createElement("canvas");
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
      canvas.width = completedCrop.width * scaleX;
      canvas.height = completedCrop.height * scaleY;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(
          imgRef.current,
          completedCrop.x * scaleX,
          completedCrop.y * scaleY,
          completedCrop.width * scaleX,
          completedCrop.height * scaleY,
          0,
          0,
          completedCrop.width * scaleX,
          completedCrop.height * scaleY
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

  const handleSaveImage = () => {
    if (backgroundRef.current) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const backgroundImg = new window.Image();

      backgroundImg.src = `/images/background${
        parseInt(pathname.split("/").pop()) + 1
      }.png`;

      backgroundImg.onload = () => {
        canvas.width = backgroundImg.width;
        canvas.height = backgroundImg.height;

        // Draw the uploaded image if it exists
        if (uploadedImage && uploadedImgRef.current) {
          const uploadedImg = new window.Image();
          uploadedImg.src = uploadedImage;

          uploadedImg.onload = () => {
            const scaleX =
              backgroundImg.width / backgroundRef.current.offsetWidth;
            const scaleY =
              backgroundImg.height / backgroundRef.current.offsetHeight;
            const x = rndState.x * scaleX; // Use Rnd's state
            const y = rndState.y * scaleY;
            const width = rndState.width * scaleX;
            const height = rndState.height * scaleY;

            ctx.drawImage(uploadedImg, x, y, width, height);

            // Draw the background image on top
            ctx.drawImage(backgroundImg, 0, 0);
            drawTitleAndSave();
          };
        } else {
          // Draw the background image if no uploaded image
          ctx.drawImage(backgroundImg, 0, 0);
          drawTitleAndSave();
        }
      };

      function drawTitleAndSave() {
        // Calculate the position of the title text based on the pathname
        const pathEnd = pathname.split("/").pop();
        let titleX,
          titleY,
          fontSize,
          fontFamily,
          fontWeight,
          letterSpacing,
          lineHeight;

        if (pathEnd === "0") {
          titleX = backgroundImg.width / 2;
          titleY = (backgroundImg.height * 4) / 13;
          fontSize = "1000px";
          fontFamily = "YoonDokrip";
          fontWeight = "normal";
          letterSpacing = "normal";
          lineHeight = "normal";

          ctx.font = `${fontWeight} ${fontSize} ${fontFamily}`;
          ctx.fillStyle = "black";
          ctx.textAlign = "center";
          ctx.fillText(title, titleX, titleY);
        } else if (pathEnd === "1") {
          titleX = (backgroundImg.width * 28) / 100;
          fontSize = "300px";
          fontFamily = "SCDream";
          fontWeight = "700";
          letterSpacing = "-0.05em";
          lineHeight = "1em";

          // Calculate titleY so that the bottom of the last character is at 20% height
          const totalTextHeight = title.length * 1;
          titleY = (backgroundImg.height * 50) / 100 - totalTextHeight;

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
        } else if (pathEnd === "2") {
          titleX = (backgroundImg.width * 28) / 100;
          fontSize = "500px";
          fontFamily = "SCDream";
          fontWeight = "700";
          letterSpacing = "-0.05em";
          lineHeight = "1em";

          // Calculate titleY so that the bottom of the last character is at 20% height
          const totalTextHeight = title.length * 1;
          titleY = (backgroundImg.height * 45) / 100 - totalTextHeight;

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
        } else if (pathEnd === "3") {
          titleX = backgroundImg.width / 2;
          titleY = (backgroundImg.height * 8) / 10;
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

        // Convert canvas to dataURL and then to a downloadable link
        const dataURL = canvas.toDataURL("image/png");
        setGeneratedImageSrc(dataURL);
        setIsComplete(true);

        setProgressValue(0);
        const interval = setInterval(() => {
          setProgressValue((prevValue) => {
            if (prevValue >= 90) {
              clearInterval(interval);
              return 90;
            }
            return prevValue + 1;
          });
        }, 70);

        handleUploadToS3(dataURL);
        // Create a link to download the image
        // const link = document.createElement("a");
        // link.href = dataURL;
        // const currentTime = new Date()
        //   .toLocaleString("ko-KR", {
        //     year: "numeric",
        //     month: "2-digit",
        //     day: "2-digit",
        //     hour: "2-digit",
        //     minute: "2-digit",
        //     second: "2-digit",
        //   })
        //   .replace(/[:\s]/g, "")
        //   .replace(/,/g, "")
        //   .replace(
        //     /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
        //     "$1년$2월$3일$4시$5분$6초"
        //   );
        // link.download = `label_${title || "untitled"}_${currentTime}.png`; // Add default title
        //        link.setAttribute("type", "image/png"); // Specify the file type
        // link.setAttribute(
        //   "download",
        //   `label_${title || "untitled"}_${currentTime}.png`
        // ); // Specify the file type
        // link.click();
      }
    }
  };
  const handleSaveImage2 = () => {
    const backgroundElement = document.getElementById("picture");
    if (backgroundElement) {
      html2canvas(backgroundElement).then((canvas) => {
        canvas.toBlob((blob) => {
          if (blob) {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "captured_image.png";
            link.click();
          }
        }, "image/png");
      });
    }
  };

  const handleDragStop = (e, data) => {
    setDraggedPosition({ x: data.x, y: data.y });
  };
  const handleArrowBack = () => {
    router.push("/postinglist");
  };

  const handleBackToEdit = () => {
    setTitle("");
    setUploadedImage(null);
    setIsComplete(false);
  };

  const handleDownload = () => {
    if (generatedImageSrc) {
      const link = document.createElement("a");
      link.href = generatedImageSrc;
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
      link.download = `label_${title || "untitled"}_${currentTime}.png`; // Add default title
      link.setAttribute("type", "image/png"); // Specify the file type
      link.setAttribute(
        "download",
        `label_${title || "untitled"}_${currentTime}.png`
      ); // Specify the file type

      link.click();
    }
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

  const handleUploadToS3 = async (dataURL) => {
    try {
      const response = await fetch(
        "https://rksbcz4sea.execute-api.ap-northeast-2.amazonaws.com/process-image",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: dataURL }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to process image");
      }

      const result = await response.json();
      const s3_url = result.s3_url;

      setCompleteImage(s3_url);
      setIsLoading(false);
      setProgressValue(100);  // Set to 100 when loading is complete

    } catch (error) {
      console.error("Error uploading image:", error);
      setIsLoading(false);
      setProgressValue(100); 
    }
  };


  return (
    <div className="flex flex-col justify-center items-center w-full md:w-1/3 h-full gap-y-5">
      {!isComplete ? (
        <>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    이미지 편집
                  </ModalHeader>
                  <ModalBody className="flex max-h-[80vh] overflow-y-auto">
                    {/* <img src="/images/noimage.jpg" alt=""  className="w-full h-full"/> */}
                    <ImageCropper
                      uploadedImage={uploadedImage}
                      setUploadedImage={setUploadedImage}
                      handleConfirmClick={handleConfirmClick}
                      imgRef={imgRef}
                      setCompletedCrop={setCompletedCrop}
                      completedCrop={completedCrop}
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      취소
                    </Button>
                    <Button
                      className="bg-green-700 text-white"
                      onPress={() => {
                        handleConfirmClick();
                        onClose();
                      }}
                    >
                      확인
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
          <div onClick={handleArrowBack} className="absolute top-5 left-5">
            <IoIosArrowBack className="text-3xl cursor-pointer" />
          </div>

          <div
            id="picture"
            className="relative w-full h-auto"
            ref={backgroundRef}
          >
            {pathname.split("/").pop() === "0" && (
              <div
                id="title"
                className="title-text w-full flex justify-center items-center absolute top-2.5 left-1/2 transform -translate-x-1/2 text-[62px] text-black pt-1"
                style={{ fontFamily: "YoonDokrip", fontWeight: 700 }}
              >
                {title}
              </div>
            )}
            {pathname.split("/").pop() === "1" && (
              <div
                className="title-text w-full flex flex-col justify-center items-center absolute bottom-[30%] left-[28%] transform -translate-x-1/2 text-[30px] text-black"
                id="title"
                style={{
                  fontFamily: "SCDream",
                  fontWeight: 700,
                  letterSpacing: "-0.05em",
                  lineHeight: "1em",
                }}
              >
                {title.split("").map((char, index) => (
                  <span key={index} style={{ margin: "0 -0.1em" }}>
                    {char}
                  </span>
                ))}
              </div>
            )}
            {pathname.split("/").pop() === "2" && (
              <div
                id="title"
                className="title-text w-full flex flex-col justify-center items-center absolute bottom-[35%] left-[28%] transform -translate-x-1/2 text-[30px] text-black"
                style={{
                  fontFamily: "SCDream",
                  fontWeight: 700,
                  letterSpacing: "-0.05em",
                  lineHeight: "1em",
                }}
              >
                {title.split("").map((char, index) => (
                  <span key={index} style={{ margin: "0 -0.1em" }}>
                    {char}
                  </span>
                ))}
              </div>
            )}
            {pathname.split("/").pop() === "3" && (
              <div
                id="title"
                className="title-text w-full flex flex-col justify-center items-center absolute top-[70%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[24px] text-black"
                style={{
                  fontFamily: "SCDream",
                  fontWeight: 700,
                  letterSpacing: "-0.05em",
                  lineHeight: "1em",
                }}
              >
                {title}
              </div>
            )}

            {uploadedImage && (
              <Rnd
                default={{
                  x: rndState.x,
                  y: rndState.y,
                  width: rndState.width,
                  height: rndState.height,
                }}
                minWidth={100}
                minHeight={100}
                bounds="parent" // 부모 요소 안에서만 이동 및 크기 조절 가능
                onDragStop={(e, d) => {
                  setRndState((prevState) => ({
                    ...prevState,
                    x: d.x,
                    y: d.y,
                  }));
                }}
                onResizeStop={(e, direction, ref, delta, position) => {
                  setRndState({
                    width: ref.style.width.replace("px", ""),
                    height: ref.style.height.replace("px", ""),
                    ...position,
                  });
                }}
                resizeHandleComponent={{
                  bottomRight: (
                    <div
                      style={{
                        width: "30px",
                        height: "30px",
                        position: "absolute",
                        right: "0",
                        bottom: "0",
                        cursor: "se-resize",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "gray",
                        borderRadius: "50%",
                        padding: "5px",
                      }}
                    >
                      <CgArrowsExpandLeft className="text-2xl text-white font-bold" />
                    </div>
                  ),
                }}
              >
                <img
                  ref={uploadedImgRef}
                  src={uploadedImage}
                  alt="Draggable Resizable"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Rnd>
            )}
            <img
              alt="Background Image"
              id="background"
              src={`/images/background${
                parseInt(pathname.split("/").pop()) + 1
              }.png`}
              className="object-cover w-full h-full rounded-2xl z-0"
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
            type="email"
            label="상단 출력 문구"
          />
          <div className="flex gap-x-5 justify-center items-center w-full">
            {/* <Button onClick={handleUploadToS3}>S3업로드</Button> */}

            {pathname.split("/").pop() === "0" && (
              <Button className="bg-green-700 text-white" onClick={onOpen}>
                사진업로드
              </Button>
            )}
            {uploadedImage && (
              <Button color="danger" onClick={() => setUploadedImage(null)}>
                이미지삭제
              </Button>
            )}
            {["0", "1", "2", "3"].includes(pathname.split("/").pop()) && (
              <Button
                className="bg-green-700 text-white"
                onClick={handleSaveImage}
              >
                저장하기
              </Button>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col justify-center items-center w-full h-full gap-y-5">
          {isLoading ? (
            // <Spinner />
            <Progress
              aria-label="Downloading..."
              size="md"
              value={progressValue}
              // color="green-700"

              showValueLabel={true}
              classNames={{
                base: "max-w-md",
                track: "drop-shadow-md border border-default",
                indicator: "bg-gradient-to-r from-green-700 to-green-600",
                label: "tracking-wider font-medium text-default-600",
                value: "text-green-700 font-semibold",
              }}
            />
          ) : (
            <SlideUp>
              <img
                src={completeImage}
                alt="Generated Image"
                className={`max-w-full max-h-full object-contain ${
                  isIPhone ? "shakeAnimation" : ""
                }`}
              />
              {isIPhone && (
                <p className="text-green-700 font-bold text-sm my-2">
                  ※아이폰의 경우 이미지를 길게 눌러서 다운로드 해주세요
                </p>
              )}
              <div className="flex flex-col gap-y-2 my-2 justify-center items-center ">
                {!isIPhone && completeImage && (
                  <Button
                    className="w-2/3 animate-pulse bg-green-700 text-white"
                    color="primary"
                    onClick={handleDownloadImageFromS3}
                  >
                    다운로드
                  </Button>
                )}
                <Button
                  className="w-2/3 text-gray-500"
                  color="default"
                  variant="bordered"
                  onClick={() => {
                    setIsLoading(true);
                    handleBackToEdit();
                    setCompleteImage("")
                  }}
                >
                  편집으로 돌아가기
                </Button>
                <Button
                  className="w-2/3 text-gray-500"
                  color="default"
                  variant="bordered"
                  onClick={() => {
                    setIsLoading(true);
                    handleArrowBack();
                    setCompleteImage("")
                  }}
                >
                  첫 화면으로 돌아가기
                </Button>
              </div>
            </SlideUp>
          )}
        </div>
      )}
    </div>
  );
}

export default Page;
