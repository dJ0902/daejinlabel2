"use client";
import React from "react";
import ImageOverlay from "@/app/components/ImageOverlay";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { MdOutlineDesignServices } from "react-icons/md";

const Intoruction = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen px-5 gap-y-5">
      <div className=" bg-green-700 p-6 rounded-lg max-w-md overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: "url('/placeholder.svg?height=400&width=400')",
            filter: "blur(2px)",
          }}
        ></div>

        <div className="relative z-10">
          <div className="flex items-center justify-center mb-4 space-x-2">
            
            <img src="https://labelimages.s3.ap-northeast-2.amazonaws.com/title.png" alt="" />
            {/* <h2 className="text-2xl font-extrabold text-white">
              🏷️MY 라벨 만들기 사용법
            </h2> */}
            
          </div>
          
          <div className="space-y-4 border-4 border-white p-4 rounded-lg bg-green-700 bg-opacity-80">
            {[
              "상단에 QR코드를 스캔해주세요.",
              "접속 후 화면을 한번 터치해주세요.",
              "나만의 텍스트와 넣고 싶은 이미지를 올려주세요.(문구는 최대 다섯글자, 사진은 자유롭게 1장 넣을 수 있어요!)",
              "완성된 나만의 처음처럼 라벨을 저장해보세요!",
            ].map((step, index) => (
              <div
                key={index}
                className="bg-green-600 p-3 rounded flex items-center space-x-3 justify-start"
              >
                <div className="bg-white text-green-700 font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  {index + 1}
                </div>
                <div>
                <p className="text-white font-bold text-small">{step}</p>
                </div>
                
              </div>
            ))}
          </div>
        </div>
      </div>
      <Button  className="bg-green-700 text-white" onClick={() => router.push("/postinglist")}>꾸미러 가기</Button>
    </div>
  )
}

export default Intoruction