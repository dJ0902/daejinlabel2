"use client";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// 로컬스토리지에 API 호출 기록을 저장하는 함수
const saveApiCall = (endpoint) => {
  const now = new Date().getTime();
  const apiCalls = JSON.parse(localStorage.getItem("apiCalls")) || {};

  // API 호출 엔드포인트와 호출 시간 저장
  apiCalls[endpoint] = now;
  localStorage.setItem("apiCalls", JSON.stringify(apiCalls));
};

// 3시간이 지났는지 확인하는 함수
const hasThreeHoursPassed = (lastCallTime) => {
  const now = new Date().getTime();
  const threeHoursInMillis = 3 * 60 * 60 * 1000;
  return now - lastCallTime > threeHoursInMillis;
};

const fetchData = async () => {
  const host = typeof window !== "undefined" ? window.location.hostname : "";
  let apiBaseUrl;

  if (host.includes("chilsunglabels.vercel.app")) {
    //QR코드
    apiBaseUrl = "https://chilsunglabels.vercel.app/api/count/qr-code-access";
  } else if (host.includes("chilsunglabel-user.vercel.app")) {
    //WEB접근
    apiBaseUrl = "https://chilsunglabel-user.vercel.app/api/count/web-access";
  }

  // //check ls
  // const apiCalls = JSON.parse(localStorage.getItem("apiCalls")) || {};

  // // 로컬스토리지에 저장된 이전 호출 시간 확인
  // if (apiCalls[apiBaseUrl]) {
  //   const lastCallTime = apiCalls[apiBaseUrl];

  //   // 마지막 호출이 3시간 이내이면 호출을 생략
  //   if (!hasThreeHoursPassed(lastCallTime)) {
  //     console.log(`API call skipped : ${apiBaseUrl}`);
  //     return;
  //   }
  // }

  const response = await fetch(apiBaseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: {},
  });

  if (!response.ok) {
    console.log("Count is loss.....");
  }
  // saveApiCall(apiBaseUrl);
};

const IntroductionPage = () => {
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

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
            <img src="/images/title.png" alt="제목" />
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
                <div className="bg-white text-green-700 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-['ChumChurumTitle'] pb-[0.1rem]">
                  {index + 1}
                </div>
                <div>
                  <p className="text-white text-small">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Button
        className="bg-green-700 text-white font-['ChumChurumTitle'] pb-[0.1rem]"
        onClick={() => router.push("/postings/0")}
      >
        꾸미러 가기
      </Button>
    </div>
  );
};

export default IntroductionPage;
