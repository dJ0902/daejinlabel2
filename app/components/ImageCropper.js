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

export default function ImageCropper({uploadedImage, setUploadedImage,handleConfirmClick,imgRef,setCompletedCrop,completedCrop}) {
  const previewCanvasRef = useRef(null)
  // const imgRef = useRef(null)
  const hiddenAnchorRef = useRef(null)
  const blobUrlRef = useRef('')
  const [crop, setCrop] = useState()
  // const [completedCrop, setCompletedCrop] = useState()
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)
  const [aspect, setAspect] = useState(undefined)
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
    const crop = centerAspectCrop(width, height, 16 / 9)
    setCrop(crop)
  }

  async function onDownloadCropClick() {
    const image = imgRef.current
    const previewCanvas = previewCanvasRef.current
    if (!image || !previewCanvas || !completedCrop) {
      throw new Error('Crop canvas does not exist')
    }

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
    )
    const ctx = offscreen.getContext('2d', { alpha: true }) // Ensure alpha channel is enabled
    if (!ctx) {
      throw new Error('No 2d context')
    }

    // Clear the canvas to ensure transparency
    ctx.clearRect(0, 0, offscreen.width, offscreen.height)

    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height,
    )
    const blob = await offscreen.convertToBlob({
      type: 'image/png', // Ensure the image format supports transparency
    })

    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current)
    }
    blobUrlRef.current = URL.createObjectURL(blob)

    if (hiddenAnchorRef.current) {
      hiddenAnchorRef.current.href = blobUrlRef.current
      hiddenAnchorRef.current.click()
    }
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
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
        <Button isLoading={isLoading}color="primary" onClick={() => document.querySelector('input[type="file"]').click()}>
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
            aspect={aspect}
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
        ):(
          <img src="/images/noimage.jpg" alt="Crop me" />
        )}
      </div>
      {/* {!!completedCrop && (
        <Button color="primary" onClick={handleConfirmClick}>
          확인
        </Button>
      )} */}
      
    </div>
  )
}
