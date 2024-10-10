"use client";
import { Button } from "@nextui-org/react";
function page() {
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
            <span className="text-3xl">🏷️</span>
            <h2 className="text-2xl font-extrabold text-white">
              MY 라벨 만들기
            </h2>
          </div>
          <p className="text-white text-center mb-6 italic font-bold text-xl">
            사용법
          </p>
          <div className="space-y-4 border-4 border-white p-4 rounded-lg bg-green-700 bg-opacity-80">
            {[
              "상단에 QR코드를 스캔해주세요.",
              "접속 후 화면을 한번 터치해주세요.",
              "나만의 텍스트와 넣고 싶은 이미지를 올려주세요.(문구는 최대 다섯글자, 사진은 자유롭게 1장 넣을 수 있어요!)",
              "완성된 나만의 처음처럼 라벨을 저장해보세요!",
            ].map((step, index) => (
              <div
                key={index}
                className="bg-green-600 p-3 rounded flex items-start space-x-3"
              >
                <div className="bg-white text-green-700 font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-white font-bold text-small">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Button className="bg-green-700 text-white font-bold">꾸미러 가기</Button>
    </div>
  );
}

export default page;
