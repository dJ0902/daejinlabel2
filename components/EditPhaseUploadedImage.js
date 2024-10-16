"use client";
import React from "react";
import { CgArrowsExpandLeft } from "react-icons/cg";
import { Rnd } from "react-rnd";

const ResizeButton = () => (
  <div
    style={{
      width: "30px",
      height: "30px",
      position: "absolute",
      right: "0",
      bottom: "0",
      cursor: "se-resize",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "gray",
      borderRadius: "50%",
      padding: "5px",
    }}
  >
    <CgArrowsExpandLeft className="text-2xl text-white font-bold" />
  </div>
);

export const EditPhaseUploadedImage = ({
  rndState,
  uploadedImgRef,
  uploadedImage,
  setRndState,
}) => {
  return (
    <Rnd
      default={{
        x: rndState.x,
        y: rndState.y,
        width: rndState.width,
        height: rndState.height,
      }}
      minWidth={100}
      minHeight={100}
      lockAspectRatio={true} // Maintain 1:1 aspect ratio
      // Remove bounds="parent" to allow free movement
      onDragStop={(e, d) => {
        setRndState((prevState) => ({
          ...prevState,
          x: d.x,
          y: d.y,
        }));
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        setRndState({
          width: ref.style.width.replace("px", ""),
          height: ref.style.height.replace("px", ""),
          ...position,
        });
      }}
      resizeHandleComponent={{
        bottomRight: <ResizeButton />,
      }}
    >
      <img
        ref={uploadedImgRef}
        src={uploadedImage}
        alt="Draggable Resizable"
        style={{ width: "100%", height: "100%", objectFit: "fill" }}
      />
    </Rnd>
  );
};
