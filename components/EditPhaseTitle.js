"use client";
import React from "react";

export const EditPhaseTitle = ({ title, boxSize, templateNumber = 0 }) => {
  if (templateNumber === "0") {
    return (
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
    );
  }

  if (templateNumber === "1") {
    return (
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
    );
  }

  if (templateNumber === "2") {
    return (
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
    );
  }

  // templateNumber === "3"
  return (
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
  );
};
