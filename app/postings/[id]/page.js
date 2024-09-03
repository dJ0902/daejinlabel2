'use client'
import React from "react";
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
function page() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="flex flex-col justify-center items-center w-full md:w-1/3 h-full gap-y-5">
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                이미지 편집
              </ModalHeader>
              <ModalBody>
                {/* <img src="/images/noimage.jpg" alt=""  className="w-full h-full"/> */}
                <ImageCropper />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  취소
                </Button>
                <Button color="primary" onPress={onClose}>
                  확인
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <div className="relative w-full h-auto">
        <img alt="NextUI hero Image" src="/images/noimage.jpg" className="object-cover w-full h-full rounded-2xl"/>
      </div>

      <Input type="email" label="상단 출력 문구" />
      <div className="flex gap-x-5 justify-center items-center w-full">
        <Button color="primary" onClick={onOpen}>사진업로드</Button>
        <Button color="primary">저장하기</Button>
      </div>
    </div>
  );
}

export default page;
