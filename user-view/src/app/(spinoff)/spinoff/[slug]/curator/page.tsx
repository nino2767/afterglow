"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { ModularItem } from "../../../../../components/modular/types";
import ModularCurationChat from "../../../../../components/modular/ModularCurationChat";

const SCENE_DATA: ModularItem[] = [
  {
    id: "scene_1",
    title: "빛이 닿지 않는 정원",
    section: "Scene 1 / 3",
    docent_script: "본전시 마지막 방에서 유실되어 흘러 들어온 미약한 빛무리들이 검푸른 바닥 이끼 틈으로 흩어져 자리 잡았습니다.",
    default_emotion_chips: [
      { emotion: "고요함", axis: "serene" },
      { emotion: "평온", axis: "serene" }
    ]
  },
  {
    id: "scene_2",
    title: "가라앉은 메아리",
    section: "Scene 2 / 3",
    docent_script: "작품 윤슬의 물결 소리가 차분히 가라앉아 수압에 짓눌리며, 보이지 않는 저 깊은 기포음들의 메아리로 재구성됩니다.",
    default_emotion_chips: [
      { emotion: "몽환적인", axis: "dreamy" },
      { emotion: "심오함", axis: "contemplative" }
    ]
  },
  {
    id: "scene_3",
    title: "심연의 틈새",
    section: "Scene 3 / 3",
    docent_script: "수면 아래 가장 가파른 낭떠러지 틈새에서 부풀어 올랐다 수축하는 수수께끼의 푸른 광원들이 호흡을 나누고 있습니다.",
    default_emotion_chips: [
      { emotion: "쓸쓸함", axis: "melancholy" },
      { emotion: "압도적", axis: "awe" }
    ]
  }
];

function SpinoffCuratorChatContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params?.slug as string || "abyss-wave";

  const [nickname, setNickname] = useState("관람객");
  const [sceneSnaps, setSceneSnaps] = useState<string[]>([]);
  const [currentScene, setCurrentScene] = useState<ModularItem | null>(null);

  useEffect(() => {
    let activeNickname = "관람객";
    let activeSnaps: string[] = [];
    const artworkId = searchParams.get("artwork");
    const target = SCENE_DATA.find(s => s.id === artworkId) || SCENE_DATA[0];

    try {
      const savedSession = localStorage.getItem("afterglow_spinoff_session");
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        activeNickname = parsed.nickname || "관람객";
      }
    } catch {
      //
    }

    try {
      const savedSnaps = localStorage.getItem("afterglow_spinoff_user_snaps");
      if (savedSnaps) {
        const snapsObj = JSON.parse(savedSnaps);
        activeSnaps = snapsObj[target.id] || [];
      }
    } catch {
      //
    }

    setTimeout(() => {
      setNickname(activeNickname);
      setCurrentScene(target);
      setSceneSnaps(activeSnaps);
    }, 0);
  }, [searchParams]);

  if (!currentScene) {
    return (
      <div className="screen justify-center items-center">
        <p className="t-body">안내자 대화를 불러오고 있습니다...</p>
      </div>
    );
  }

  return (
    <ModularCurationChat
      currentArtwork={currentScene}
      onBack={() => router.push(`/spinoff/${slug}/viewer`)}
      theme="spinoff"
      nickname={nickname}
      artworkSnaps={sceneSnaps}
      localStorageSessionKey="afterglow_spinoff_session"
    />
  );
}

export default function SpinoffCuratorChatPage() {
  return (
    <Suspense fallback={
      <div className="screen justify-center items-center">
        <p className="t-body">대화 내용을 불러오고 있어요...</p>
      </div>
    }>
      <SpinoffCuratorChatContent />
    </Suspense>
  );
}
