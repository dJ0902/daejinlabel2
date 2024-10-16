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
      default={{ ...rndState }}
      minWidth={100}
      minHeight={100}
      lockAspectRatio={true} // Maintain 1:1 aspect ratio
      // Remove bounds="parent" to allow free movement
      onDragStart={() => {
        setRndState((prevState) => ({
          ...prevState,
          isDraggingOrResizing: true,
        }));
      }}
      onDragStop={(e, d) => {
        setRndState((prevState) => ({
          ...prevState,
          x: d.x,
          y: d.y,
          isDraggingOrResizing: false,
        }));
      }}
      onResizeStart={() => {
        setRndState((prevState) => ({
          ...prevState,
          isDraggingOrResizing: true,
        }));
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        setRndState({
          width: ref.style.width.replace("px", ""),
          height: ref.style.height.replace("px", ""),
          isDraggingOrResizing: false,
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
        className="w-full h-full"
        style={{
          opacity: rndState.isDraggingOrResizing ? 1 : 0,
        }}
      />
    </Rnd>
  );
};
