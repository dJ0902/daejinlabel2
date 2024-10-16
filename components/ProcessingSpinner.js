"use client";
import React, { useEffect } from "react";

import { CircularProgress } from "@nextui-org/react";

export const ProcessingSpinner = ({ progress, setProgress }) => {
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        let newProgress = oldProgress + 3; // Increase progress by 3
        if (newProgress > 100) {
          newProgress = 100; // If progress exceeds 100, set it to 100
        }
        // progress 값에 따라 숫자를 업데이트
        setProgress(newProgress);
        return newProgress;
      });
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="flex flex-col justify-center items-center w-full md:w-1/3 h-full gap-y-5">
      <div className="flex flex-col justify-center items-center w-full h-full gap-y-5">
        <CircularProgress
          aria-label="Loading..."
          size="lg"
          value={progress}
          showValueLabel={true}
          color="success"
        />
      </div>
    </div>
  );
};
