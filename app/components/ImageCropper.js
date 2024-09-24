'use client'
import React, { useState, useRef } from 'react'
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
  convertToPixelCrop,
} from 'react-image-crop'
import { canvasPreview } from './canvasPreview'
import { useDebounceEffect } from './useDebounceEffect'
import { Button } from '@nextui-org/react'
import 'react-image-crop/dist/ReactCrop.css'

// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.
function centerAspectCrop(
  mediaWidth,
  mediaHeight,
  aspect,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

export default function ImageCropper({uploadedImage, setUploadedImage, handleConfirmClick, imgRef, setCompletedCrop, completedCrop}) {
  const previewCanvasRef = useRef(null)
  const hiddenAnchorRef = useRef(null)
  const blobUrlRef = useRef('')
  const [crop, setCrop] = useState()
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)
  const [aspect, setAspect] = useState(1) // 비율을 1:1로 설정
  const [isLoading, setIsLoading] = useState(false)

  async function onSelectFile(e) {
    setIsLoading(true)
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined) // Makes crop preview update between images.
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("https://vn3xcq2ahg.execute-api.ap-northeast-2.amazonaws.com/remove-background/", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const blob = await response.blob();
          const reader = new FileReader();
          reader.addEventListener('load', () =>
            setUploadedImage(reader.result?.toString() || ''),
          );
          reader.readAsDataURL(blob);
        } else {
          console.error(`Request failed with status ${response.status}`);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
    setIsLoading(false)
  }

  function onImageLoad(e) {
    const { width, height } = e.currentTarget
    const crop = centerAspectCrop(width, height, 1) // 1:1 비율로 설정
    setCrop(crop)
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate,
        )
      }
    },
    100,
    [completedCrop, scale, rotate],
  )

  return (
    <div className="App flex flex-col justify-center items-center gap-y-5">
      <div className="Crop-Controls flex flex-col justify-center items-center gap-y-5">
        <Button isLoading={isLoading} className="bg-green-700 text-white" onClick={() => document.querySelector('input[type="file"]').click()}>
          이미지 선택
        </Button>
        <input className='hidden' type="file" accept="image/*" onChange={onSelectFile} />
      </div>
      <div className='flex justify-center items-center w-full h-auto'>
        {!!uploadedImage ? (
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1} // 비율을 1:1로 고정
            minHeight={100}
          >
            <img
              ref={imgRef}
              alt="Crop me"
              src={uploadedImage}
              style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
        ) : (
          <img src="/images/noimage.jpg" alt="Crop me" />
        )}
      </div>
    </div>
  )
}
