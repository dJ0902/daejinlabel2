"use client";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import React from "react";

import { ImageCropper } from "@/components";

export const EditPhaseImageUploadModal = ({
  isOpen,
  imgRef,
  uploadedImage,
  completedCrop,
  handleConfirmClick,
  onClose,
  onOpenChange,
  setCompletedCrop,
  setUploadedImage,
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">이미지 편집</ModalHeader>

        <ModalBody className="flex max-h-[80vh] overflow-y-auto">
          <ImageCropper
            uploadedImage={uploadedImage}
            setUploadedImage={setUploadedImage}
            imgRef={imgRef}
            setCompletedCrop={setCompletedCrop}
            completedCrop={completedCrop}
          />
        </ModalBody>

        <ModalFooter>
          <Button
            className="font-['ChumChurumTitle'] pb-[0.1rem]"
            color="danger"
            variant="light"
            onPress={() => {}}
          >
            취소
          </Button>

          <Button
            className="bg-green-700 text-white font-['ChumChurumTitle'] pb-[0.1rem]"
            onPress={() => {
              handleConfirmClick();
              onClose();
            }}
          >
            확인
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
