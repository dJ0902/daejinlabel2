"use client";
import React from "react";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { Chip } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";

export default function CardSection() {
  const router = useRouter();
  const list = [
    {
      title: "처음처럼",
      img: "/images/background1.png",
      price: "$5.50",
    },
    {
      title: "새로",
      img: "/images/background2.png",
      price: "$5.50",
    },
    {
      title: "새로살구",
      img: "/images/background3.png",
      price: "$5.50",
    },
    {
      title: "크러시",
      img: "/images/background4.png",
      price: "$5.50",
    },
  ];

  const handleArrowBack = () => {
    router.push("/");
  };

  return (
    <div className="w-full h-full gap-5 grid grid-cols-2 sm:grid-cols-2">
      <div onClick={handleArrowBack} className="absolute top-5 left-5">
        <IoIosArrowBack className="text-3xl cursor-pointer" />
      </div>

      {list.map((item, index) => (
        <Card
          shadow="sm"
          key={index}
          isPressable
          onPress={() => console.log("item pressed")}
          className="w-full h-full "
        >
          <Link className="w-full h-full" href={`/postings/${index}`}>
            <CardBody className="overflow-visible p-0">
              <div className="w-full h-full relative">
                <img
                  shadow="sm"
                  radius="lg"
                  alt={item.title}
                  className="w-full h-[20vh] object-fill rounded-2xl shadow-md"
                  src={item.img}
                />
              </div>
            </CardBody>
            <CardFooter className="text-small justify-between ">
              <p className="text-center w-full font-bold text-black">
                {item.title}
              </p>
            </CardFooter>
          </Link>
        </Card>
      ))}
    </div>
  );
}
