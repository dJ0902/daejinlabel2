class LRUCache {
  constructor(limit) {
    this.cache = new Map();
    this.limit = limit;
  }
  get(key) {
    if (!this.cache.has(key)) {
      return null;
    }
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key, value) {
    if (this.cache.size >= this.limit) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
}
//캐싱
const badWordCache = new LRUCache(50);

const checkForBadWords = async (inputText) => {
  // 캐시에서 먼저 비속어 여부 확인
  const cachedResult = badWordCache.get(inputText);
  if (cachedResult !== null) {
    return cachedResult; // 캐시에서 결과를 반환
  }
  // 캐시에 없다면 API 호출
  var myHeaders = new Headers();
  myHeaders.append("x-api-key", "083d7d7a3c7457b69473683ff0d77565");
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  var urlencoded = new URLSearchParams();
  urlencoded.append("text", inputText);
  urlencoded.append("mode", "quick");

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow",
  };
  try {
    const res = await fetch(
      "https://www.safekiso.com/api/v1/filter",
      requestOptions
    );
    const data = await res.json();
    // API 결과를 캐시에 저장
    const hasBadWords =
      Array.isArray(data.Detected) && data.Detected.length > 0
        ? "TRUE"
        : "FALSE";
    badWordCache.set(inputText, hasBadWords);
  } catch (err) {
    console.error(err);
    badWordCache.set(inputText, "TRUE");
  }

  return badWordCache.get(inputText);
};

export const hasBadWords = async (inputText) => {
  const result = await checkForBadWords(inputText);
  return result === "TRUE" ? true : false;
};

const TO_RADIANS = Math.PI / 180;

export const isIPhone = /iPhone|iPad|iPod/i.test(navigator.userAgent);

export async function previewCanvas(
  image,
  canvas,
  crop,
  scale = 1,
  rotate = 0
) {
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  // devicePixelRatio slightly increases sharpness on retina devices
  // at the expense of slightly slower render times and needing to
  // size the image back down if you want to download/upload and be
  // true to the images natural size.
  const pixelRatio = window.devicePixelRatio;
  // const pixelRatio = 1

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = "high";

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  const rotateRads = rotate * TO_RADIANS;
  const centerX = image.naturalWidth / 2;
  const centerY = image.naturalHeight / 2;

  ctx.save();

  // 5) Move the crop origin to the canvas origin (0,0)
  ctx.translate(-cropX, -cropY);
  // 4) Move the origin to the center of the original position
  ctx.translate(centerX, centerY);
  // 3) Rotate around the origin
  ctx.rotate(rotateRads);
  // 2) Scale the image
  ctx.scale(scale, scale);
  // 1) Move the center of the image to the origin (0,0)
  ctx.translate(-centerX, -centerY);
  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight
  );

  ctx.restore();
}
