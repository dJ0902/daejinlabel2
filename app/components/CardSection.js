"use client";
import React from "react";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { Chip } from "@nextui-org/react";
import Link from "next/link";
export default function CardSection() {
  const list = [
    {
      title: "처음처럼",
      img: "/images/background1.png",
      price: "$5.50",
    }
  ];

  return (
    <div className="w-full h-full gap-5 grid grid-cols-1 sm:grid-cols-1">
      {list.map((item, index) => (
        <Card
          shadow="sm"
          key={index}
          isPressable={index !== 1 && index !== 2 && index !== 3}
          onPress={() =>
            index !== 1 &&
            index !== 2 &&
            index !== 3 &&
            console.log("item pressed")
          }
          className="w-full h-full"
        >
          {index !== 1 && index !== 2 && index !== 3 ? (
            <Link href={`/postings/${index}`}>
              <CardBody className="overflow-visible p-0">
                <div className="w-full h-full relative">
                  <img
                    shadow="sm"
                    radius="lg"
                    alt={item.title}
                    fill
                    className="w-full h-full object-cover rounded-2xl shadow-md"
                    src={item.img}
                  />
                </div>

                {(index === 1 || index === 2 || index === 3) && (
                  <div className="absolute inset-0 flex items-center justify-center z-50 opacity-100">
                    <Chip color="danger" variant="flat">
                      준비중
                    </Chip>
                  </div>
                )}
              </CardBody>
              <CardFooter className="text-small justify-between">
                <p
                  className={`text-center w-full font-bold ${
                    index === 1 || index === 2 || index === 3
                      ? "text-gray-300"
                      : ""
                  }`}
                >
                  {item.title}
                </p>
                {/* <p className="text-default-500">{item.price}</p> */}
              </CardFooter>
            </Link>
          ) : (
            <>
              <CardBody className="overflow-visible p-0">
                <div className="w-full h-full relative">
                  <img
                    shadow="sm"
                    radius="lg"
                    // width="100%"
                    fill
                    className="w-full h-full object-cover rounded-2xl shadow-md"
                    alt={item.title}
                    src={item.img}
                  />
                </div>

                {(index === 1 || index === 2 || index === 3) && (
                  <div className="absolute inset-0 flex items-center justify-center z-50 opacity-100">
                    <Chip color="danger" variant="flat">
                      준비중
                    </Chip>
                  </div>
                )}
              </CardBody>
              <CardFooter className="text-small justify-between">
                <p
                  className={`text-center w-full font-bold ${
                    index === 1 || index === 2 || index === 3
                      ? "text-gray-300"
                      : ""
                  }`}
                >
                  {item.title}
                </p>
                {/* <p className="text-default-500">{item.price}</p> */}
              </CardFooter>
            </>
          )}
        </Card>
      ))}
    </div>
  );
}
