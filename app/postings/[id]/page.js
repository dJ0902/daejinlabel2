"use client";
import React, { useState, useRef } from "react";
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
} from "@nextui-org/react";
import ImageCropper from "../../components/ImageCropper";
import Draggable from "react-draggable"; // react-draggable 라이브러리를 추가해야 합니다

function Page() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [completedCrop, setCompletedCrop] = useState()
  const imgRef = useRef(null)

  const handleConfirmClick = () => {
    if (imgRef.current && completedCrop) {
      const canvas = document.createElement('canvas');
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
      canvas.width = completedCrop.width * scaleX;
      canvas.height = completedCrop.height * scaleY;
      const ctx = canvas.getContext('2d');

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
        }, 'image/jpeg');
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full md:w-1/3 h-full gap-y-5">
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
                <Button color="primary" onPress={() => { 
                  handleConfirmClick();
                  onClose();
                }}>
                  확인
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <div className="relative w-full h-auto">
        <img
          alt="Background Image"
          src="/images/background1.jpg"
          className="object-cover w-full h-full rounded-2xl"
        />
        {uploadedImage && (
          <Draggable>
            <img
              src={uploadedImage}
              alt="Uploaded Image"
              className="absolute top-0 left-0 w-1/2 h-auto cursor-move"
            />
          </Draggable>
        )}
      </div>

      <Input type="email" label="상단 출력 문구" />
      <div className="flex gap-x-5 justify-center items-center w-full">
        <Button color="primary" onClick={onOpen}>
          사진업로드
        </Button>
        <Button color="primary">저장하기</Button>
      </div>
    </div>
  );
}

export default Page;

