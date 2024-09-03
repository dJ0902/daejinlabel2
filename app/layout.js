import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "./components/Navbar";
import { NextUIProvider } from "@nextui-org/react";
import Script from "next/script";
import Footer from "./components/Footer";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "처음처럼",
  description: "커스텀 이미지 만들기",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextUIProvider>
          {/* <Nav></Nav> */}
          <div
                class="flex flex-col bg-[#F9FAFB] justify-around items-center w-screen h-screen px-10"
                id="js-oversized"
              >
          {children}
          {/* <Footer></Footer> */}
          </div>

        </NextUIProvider>
      </body>

    </html>
  );
}
