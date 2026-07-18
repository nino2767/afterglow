"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ModularItem } from "../../../components/modular/types";
import ModularCurationChat from "../../../components/modular/ModularCurationChat";

const ARTWORKS_LIST: ModularItem[] = [
  {
    id: "art_001",
    title: "윤슬",
    artist: "김하늘",
    section: "1구역: 잔물결의 언어",
    year: "2024",
    docent_script: "물감 같은 푸른 투사 광원 아래 서서, 일렁이는 파동을 가만히 내려다봅니다.",
    default_emotion_chips: [
      { emotion: "고요함", axis: "serene" },
      { emotion: "따뜻함", axis: "warm" }
    ]
  },
  {
    id: "art_002",
    title: "심연의 호흡",
    artist: "이태양",
    section: "2구역: 수압의 깊이",
    year: "2025",
    docent_script: "빛의 안개가 서서히 들이마시고 내쉬는 호흡 주기에 맞춰 일렁입니다.",
    default_emotion_chips: [
      { emotion: "몽환적인", axis: "dreamy" },
      { emotion: "심오함", axis: "contemplative" }
    ]
  },
  {
    id: "art_003",
    title: "기억의 잔광",
    artist: "박은하",
    section: "3구역: 물러나는 해안선",
    year: "2026",
    docent_script: "강렬하게 휘몰아치던 소리와 섬광이 물러나며, 아스라한 어둠 속에 아주 작은 빛 한 조각이 남습니다.",
    default_emotion_chips: [
      { emotion: "슬픔", axis: "melancholy" },
      { emotion: "압도적", axis: "awe" }
    ]
  }
];

function CuratorChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [nickname, setNickname] = useState("관람객");
  const [artworkSnaps, setArtworkSnaps] = useState<string[]>([]);
  const [currentArtwork, setCurrentArtwork] = useState<ModularItem | null>(null);

  useEffect(() => {
    try {
      const savedSession = localStorage.getItem("afterglow_session");
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        setNickname(parsed.nickname || "관람객");
      }
    } catch (e) {
      //
    }

    const artworkId = searchParams.get("artwork");
    const target = ARTWORKS_LIST.find(a => a.id === artworkId) || ARTWORKS_LIST[0];
    setCurrentArtwork(target);

    try {
      const savedSnaps = localStorage.getItem("afterglow_user_snaps");
      if (savedSnaps) {
        const snapsObj = JSON.parse(savedSnaps);
        setArtworkSnaps(snapsObj[target.id] || []);
      }
    } catch (e) {
      //
    }
  }, [searchParams]);

  if (!currentArtwork) {
    return (
      <div className="screen justify-center items-center">
        <p className="t-body">큐레이션을 준비하고 있습니다...</p>
      </div>
    );
  }

  return (
    <ModularCurationChat
      currentArtwork={currentArtwork}
      onBack={() => router.push(`/artwork?artwork=${currentArtwork.id}`)}
      theme="main"
      nickname={nickname}
      artworkSnaps={artworkSnaps}
      localStorageSessionKey="afterglow_session"
    />
  );
}

export default function CuratorChatPage() {
  return (
    <Suspense fallback={
      <div className="screen justify-center items-center">
        <p className="t-body">대화 내용을 불러오고 있어요...</p>
      </div>
    }>
      <CuratorChatContent />
    </Suspense>
  );
}
