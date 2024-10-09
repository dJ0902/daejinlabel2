import CardSection from "@/components/CardSection";

export const metadata = {
  title: "처음처럼",
  description: "커스텀 이미지 만들기",
  icons: {
    icon: "/images/product.png", // 일반 아이콘
    shortcut: "/images/product.png", // 쇼트컷 아이콘
    apple: "/images/product.png", // 애플 터치 아이콘
  },
};

export default function Home() {
  return (
    <div className="w-[90vw] md:w-[50vw] h-auto">
      <CardSection />
    </div>
  );
}
