"use client";
import {
  Button,
  CircularProgress,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import imageCompression from "browser-image-compression";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CgArrowsExpandLeft } from "react-icons/cg";
import { IoIosArrowBack } from "react-icons/io";
import { Rnd } from "react-rnd";
import { v4 as uuidv4 } from "uuid";

import { ImageCropper, SlideUp } from "@/components";
import { useBoxSize } from "@/hooks";

function Page() {
  const [title, setTitle] = useState("");
  const [completedCrop, setCompletedCrop] = useState();
  const [rndState, setRndState] = useState({
    x: 100,
    y: 100,
    width: 200,
    height: 200,
  }); // State to track Rnd position and size

  const [isLoading, setIsLoading] = useState(true);
  const [progressValue, setProgressValue] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [generatedImageSrc, setGeneratedImageSrc] = useState(null);
  const [completeImage, setCompleteImage] = useState(null); // 완성된 이미지

  const { ref: backgroundRef, boxSize } = useBoxSize();
  const imgRef = useRef(null);
  const uploadedImgRef = useRef(null);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const pathname = usePathname();
  const router = useRouter();

  const isIPhone = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const templateNumber = pathname.split("/")[2];

  const handleConfirmClick = () => {
    if (imgRef.current && completedCrop) {
      const canvas = document.createElement("canvas");
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
      canvas.width = imgRef.current.naturalWidth;
      canvas.height = imgRef.current.naturalHeight;
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
          imgRef.current.naturalWidth,
          imgRef.current.naturalHeight
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
            setGeneratedImageSrc(URL.createObjectURL(compressedBlob));
            setIsComplete(true);
            setProgressValue(0);
            handleUploadToS3(compressedBlob);
          }
        }, "image/png");
      }
    }
  };

  useEffect(() => {
    if (isLoading) {
      const timer = setInterval(() => {
        setProgressValue((oldProgress) => {
          let newProgress = oldProgress + 3; // Increase progress by 3
          if (newProgress > 100) {
            newProgress = 100; // If progress exceeds 100, set it to 100
          }
          // progress 값에 따라 숫자를 업데이트
          setProgressValue(newProgress);
          return newProgress;
        });
      }, 100);

      return () => {
        clearInterval(timer);
      };
    }
  }, [isLoading]);

  const redirectToHome = () => {
    router.push("/");
  };

  const handleBackToEdit = () => {
    setTitle("");
    setUploadedImage(null);
    setIsComplete(false);
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
        setIsLoading(false);
        setProgressValue(100);
      };
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
            className="relative w-full h-auto"
            ref={backgroundRef}
          >
            {templateNumber === "0" &&
              backgroundRef &&
              backgroundRef.current && (
                <div
                  id="title"
                  className="title-text w-full flex justify-center items-center absolute left-1/2 transform -translate-x-1/2  text-black pt-1"
                  style={{
                    fontFamily: "ChumChurumTitle",
                    fontWeight: 400,
                    fontSize: `${(boxSize.width * 0.2).toFixed(3)}px`,
                    top: "11%",
                  }}
                >
                  {title}
                </div>
              )}
            {templateNumber === "1" && (
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
            {templateNumber === "2" && (
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
            {templateNumber === "3" && (
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
                lockAspectRatio={true} // Maintain 1:1 aspect ratio
                // Remove bounds="parent" to allow free movement
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
                  style={{ width: "100%", height: "100%", objectFit: "fill" }}
                />
              </Rnd>
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
            type="email"
            label="상단 출력 문구"
          />
          <div className="flex gap-x-5 justify-center items-center w-full">
            {/* <Button onClick={handleUploadToS3}>S3업로드</Button> */}

            {templateNumber === "0" && (
              <Button className="bg-green-700 text-white" onClick={onOpen}>
                사진업로드
              </Button>
            )}
            {uploadedImage && (
              <Button color="danger" onClick={() => setUploadedImage(null)}>
                이미지삭제
              </Button>
            )}
            {["0", "1", "2", "3"].includes(templateNumber) && (
              <Button
                className="bg-green-700 text-white"
                onClick={() => {
                  setProgressValue(0);
                  handleSaveImage();
                }}
              >
                저장하기
              </Button>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col justify-center items-center w-full h-full gap-y-5">
          {isLoading && !completeImage ? (
            <CircularProgress
              aria-label="Loading..."
              size="lg"
              value={progressValue}
              showValueLabel={true}
              color="success"
            />
          ) : (
            <SlideUp>
              {/* !isLoading || completeImage */}
              <ul className="list-inside list-disc text-sm text-justify mb-3">
                <li className="mb-1">
                  비방, 비하, 욕설, 성적 수치심 등 타인에게 불쾌감을 주는 문구는
                  금지합니다.
                </li>
                <li>
                  해당 이미지는 특정 단체나 기관, 개인의 의견을 대표하지
                  않습니다.
                </li>
              </ul>

              <img
                src={completeImage}
                alt="Generated Image"
                className={`max-w-full max-h-full object-contain ${
                  isIPhone ? "shakeAnimation" : ""
                }`}
              />

              {isIPhone && (
                <p className="text-green-700 font-bold text-sm my-2">
                  ※ 아이폰의 경우 위 이미지를 길게 눌러서 다운로드 해주세요
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
                    setCompleteImage("");
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
                    redirectToHome();
                    setCompleteImage("");
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
