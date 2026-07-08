import { redirect } from "next/navigation";

export default function RootPage() {
  // B2C 첫 화면인 온보딩 경로로 자동 리다이렉트 처리
  redirect("/onboarding");
}
