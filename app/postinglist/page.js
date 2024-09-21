import Image from "next/image";
import ImageCropper from "@/app/components/ImageCropper";
import Carousel from "@/app/components/Carousel";
import Script from "next/script";
import CardSection from "@/app/components/CardSection";
export default function Home() {
  return (
    <div className="w-[90vw] md:w-[50vw] h-auto">
      {/* <Carousel></Carousel> */}
      <CardSection></CardSection>
      
    </div>
  );
}
