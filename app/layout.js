import { Inter } from "next/font/google";
import { NextUIProvider } from "@nextui-org/react";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "처음처럼",
  description: "커스텀 이미지 만들기",
  icons: {
    icon: "/images/product.png", // 일반 아이콘
    shortcut: "/images/product.png", // 쇼트컷 아이콘
    apple: "/images/product.png", // 애플 터치 아이콘
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextUIProvider>
          <div
            class="flex flex-col bg-[#F9FAFB] justify-around items-center w-screen h-screen px-10"
            id="js-oversized"
          >
            {children}
          </div>
        </NextUIProvider>
      </body>
    </html>
  );
}
