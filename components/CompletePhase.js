"use client";
import { Button } from "@nextui-org/react";
import React from "react";
import { useRouter } from "next/navigation";

import { SlideUp } from "@/components";
import { isIPhone } from "@/utils";

export const CompletePhase = ({
  completeImage,
  handleBackToEdit,
  handleDownloadImage,
}) => {
  const router = useRouter();

  // 아이폰
  if (isIPhone) {
    return (
      <div className="flex flex-col justify-center items-center w-full md:w-1/3 h-full gap-y-5">
        <div className="flex flex-col justify-center items-center w-full h-full gap-y-5">
          <SlideUp>
            <ul className="list-inside list-disc text-sm text-justify mb-3">
              <li className="mb-1">
                비방, 비하, 욕설, 성적 수치심 등 타인에게 불쾌감을 주는 문구는
                금지합니다.
              </li>
              <li>
                해당 이미지는 특정 단체나 기관, 개인의 의견을 대표하지 않습니다.
              </li>
            </ul>

            <img
              src={completeImage}
              alt="Generated Image"
              className="max-w-full max-h-full object-contain rounded-2xl shakeAnimation"
            />

            <p className="text-panton-500 font-['ChumChurumTitle'] pb-[0.1rem] text-sm my-2">
              ※ 아이폰의 경우 위 이미지를 길게 눌러서 다운로드 해주세요
            </p>

            <div className="flex flex-col gap-y-2 my-2 justify-center items-center ">
              <Button
                className="w-2/3 bg-white border-white text-gray-500 font-['ChumChurumTitle'] pb-[0.1rem]"
                color="default"
                variant="bordered"
                onClick={handleBackToEdit}
              >
                다시 꾸미러 가기
              </Button>

              <Button
                className="w-2/3 bg-white border-white text-gray-500 font-['ChumChurumTitle'] pb-[0.1rem]"
                color="default"
                variant="bordered"
                onClick={() => {
                  router.push("/");
                }}
              >
                사용법 보러가기
              </Button>
            </div>
          </SlideUp>
        </div>
      </div>
    );
  }
  // 안드로이드
  return (
    <div className="flex flex-col justify-center items-center w-full md:w-1/3 h-full gap-y-5">
      <div className="flex flex-col justify-center items-center w-full h-full gap-y-5">
        <SlideUp>
          <ul className="list-inside list-disc text-sm text-justify mb-3">
            <li className="mb-1">
              비방, 비하, 욕설, 성적 수치심 등 타인에게 불쾌감을 주는 문구는
              금지합니다.
            </li>
            <li>
              해당 이미지는 특정 단체나 기관, 개인의 의견을 대표하지 않습니다.
            </li>
          </ul>

          <img
            src={completeImage}
            alt="Generated Image"
            className="max-w-full max-h-full object-contain rounded-2xl"
          />

          <div className="flex flex-col gap-y-2 my-2 justify-center items-center ">
            <Button
              className="w-2/3 animate-pulse bg-panton-500 text-white font-['ChumChurumTitle'] pb-[0.1rem]"
              color="primary"
              onClick={handleDownloadImage}
            >
              다운로드
            </Button>

            <Button
              className="w-2/3 bg-white border-white text-gray-500 font-['ChumChurumTitle'] pb-[0.1rem]"
              color="default"
              variant="bordered"
              onClick={handleBackToEdit}
            >
              다시 꾸미러 가기
            </Button>

            <Button
              className="w-2/3 bg-white border-white text-gray-500 font-['ChumChurumTitle'] pb-[0.1rem]"
              color="default"
              variant="bordered"
              onClick={() => {
                router.push("/");
              }}
            >
              사용법 보러가기
            </Button>
          </div>
        </SlideUp>
      </div>
    </div>
  );
};
