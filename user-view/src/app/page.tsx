import { redirect } from "next/navigation";

export default function RootPage() {
  // 기본 루트 접속 시 계정 홈(/home)으로 자동 랜딩 처리
  redirect("/home");
}
