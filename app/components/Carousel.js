"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";

function Carousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  const totalSlides = 3; // 현재 이미지 슬라이드 수

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prevSlide) => (prevSlide + 1) % totalSlides);
    }, 5000); // 5초마다 자동 슬라이드

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (slideIndex) => {
    setActiveSlide(slideIndex);
  };

  const goToPrevSlide = () => {
    setActiveSlide((prevSlide) => (prevSlide - 1 + totalSlides) % totalSlides);
  };

  const goToNextSlide = () => {
    setActiveSlide((prevSlide) => (prevSlide + 1) % totalSlides);
  };

  return (
    <div
      class="relative mt-10"
      tabindex="-1"
      uk-slider="autoplay: true;finite: false;autoplayInterval:2000"
    >
      <div class="uk-slider-container pb-1">
        <ul
          class="uk-slider-items w-[calc(100%+14px)]"
          uk-scrollspy="target: > li; cls: uk-animation-scale-up; delay: 20;repeat:true"
        >
          <li
            class="pr-3 md:w-1/2 w-full"
            uk-scrollspy-class="uk-animation-fade"
          >
            <div class="card h-64 flex flex-col">
              <div class="card-media sm:aspect-[2/1.7] h-36">
                <img src={"/images/noimage.jpg"} alt="" />
                <div class="card-overly"></div>
              </div>
              <div class="card-body relative">
                <span class="text-teal-600 font-semibold text-xs line-clamp-2 my-1">
                  제목
                </span>
                <p class=" text-xs mt-0.5 line-clamp-2 my-1">설명 </p>

                <div class="text-xs flex justify-end">
                  <span class="text-gray-500 text-xs">김지원</span>
                </div>
              </div>
            </div>
          </li>
          <li
            class="pr-3 md:w-1/2 w-full"
            uk-scrollspy-class="uk-animation-fade"
          >
            <div class="card h-64 flex flex-col">
              <div class="card-media sm:aspect-[2/1.7] h-36">
                <img src={"/images/noimage.jpg"} alt="" />
                <div class="card-overly"></div>
              </div>
              <div class="card-body relative">
                <span class="text-teal-600 font-semibold text-xs line-clamp-2 my-1">
                  제목
                </span>
                <p class=" text-xs mt-0.5 line-clamp-2 my-1">설명 </p>

                <div class="text-xs flex justify-end">
                  <span class="text-gray-500 text-xs">김지원</span>
                </div>
              </div>
            </div>
          </li>
          <li
            class="pr-3 md:w-1/2 w-full"
            uk-scrollspy-class="uk-animation-fade"
          >
            <div class="card h-64 flex flex-col">
              <div class="card-media sm:aspect-[2/1.7] h-36">
                <img src={"/images/noimage.jpg"} alt="" />
                <div class="card-overly"></div>
              </div>
              <div class="card-body relative">
                <span class="text-teal-600 font-semibold text-xs line-clamp-2 my-1">
                  제목
                </span>
                <p class=" text-xs mt-0.5 line-clamp-2 my-1">설명 </p>

                <div class="text-xs flex justify-end">
                  <span class="text-gray-500 text-xs">김지원</span>
                </div>
              </div>
            </div>
          </li>
          <li
            class="pr-3 md:w-1/2 w-full"
            uk-scrollspy-class="uk-animation-fade"
          >
            <div class="card h-64 flex flex-col">
              <div class="card-media sm:aspect-[2/1.7] h-36">
                <img src={"/images/noimage.jpg"} alt="" />
                <div class="card-overly"></div>
              </div>
              <div class="card-body relative">
                <span class="text-teal-600 font-semibold text-xs line-clamp-2 my-1">
                  제목
                </span>
                <p class=" text-xs mt-0.5 line-clamp-2 my-1">설명 </p>

                <div class="text-xs flex justify-end">
                  <span class="text-gray-500 text-xs">김지원</span>
                </div>
              </div>
            </div>
          </li>
          
        </ul>
      </div>

      <div class="max-md:hidden">
        <a
          class="nav-prev !bottom-1/2 !top-auto"
          href="#"
          uk-slider-item="previous"
        >
          {" "}
          <ion-icon name="chevron-back" class="text-2xl"></ion-icon>{" "}
        </a>
        <a
          class="nav-next !bottom-1/2 !top-auto"
          href="#"
          uk-slider-item="next"
        >
          {" "}
          <ion-icon name="chevron-forward" class="text-2xl"></ion-icon>
        </a>
      </div>

      <div class="flex justify-center">
        <ul class="inline-flex flex-wrap justify-center my-5 gap-2 uk-dotnav uk-slider-nav">
          {" "}
        </ul>
      </div>
    </div>
  );
}

export default Carousel;
