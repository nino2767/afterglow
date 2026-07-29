// 멀티테넌트 목업 데이터 및 코어 스키마 목업
// 계층: CLIENT(고객사) 1 ──< PROJECT(전시) N ──< 세션/관람 데이터
// 실제 연동 시 이 파일을 API 응답으로 대체하면 됩니다.

export const CLIENTS = [
  {
    id: "cl_peoply",
    name: "피플리",
    projects: [
      { id: "pj_abyss", title: "빛의 심연", status: "운영 중",  statusColor: "#4CAF7C", date: "2026.05.16" },
      { id: "pj_abyss_spinoff", title: "빛의 심연 (스핀오프)", isSpinoff: true, parent_exhibition_id: "pj_abyss", status: "기획 중", statusColor: "#F59E0B", date: "2026.07.12" },
      { id: "pj_moon",  title: "달빛 정원", status: "팝업 준비", statusColor: "#C9A84C", date: "2026.06.01" },
      { id: "pj_time",  title: "시간의 결", status: "종료",     statusColor: "#9A9490", date: "2026.03.10" },
    ],
  },
  {
    id: "cl_seraphim",
    name: "세라핌컴퍼니",
    projects: [
      { id: "pj_bloom", title: "무한의 정원", status: "운영 중", statusColor: "#4CAF7C", date: "2026.05.20" },
    ],
  },
];

// 현재 로그인한 운영자가 속한 고객사
export const CURRENT_OPERATOR_CLIENT_ID = "cl_peoply";

export function getClient(clientId) {
  return CLIENTS.find((c) => c.id === clientId) || null;
}

export function getProject(clientId, projectId) {
  const client = getClient(clientId);
  if (!client) return null;
  return client.projects.find((p) => p.id === projectId) || null;
}

export function defaultSelection(clientId = CURRENT_OPERATOR_CLIENT_ID) {
  const client = getClient(clientId);
  const first = client?.projects[0];
  return { clientId, projectId: first?.id || null };
}

// ==========================================
// 4.1. 전시 IP 스펙 데이터 (Exhibition IP MOCK)
// ==========================================
export const EXHIBITION_IP_MOCK = {
  "pj_abyss": {
    "exhibition_id": "pj_abyss",
    "title": "빛의 심연",
    "artist": {
      "name": "김윤경",
      "profile_desc": "어둠과 극단적 광원을 통해 인간 내면의 심연을 시각화하는 미디어 아티스트."
    },
    "worldview_context": "심해 3,000m의 영구적인 어둠 속에서 자생하는 발광 생명체들의 조용한 유영. 외부의 강한 개입이 없는 한 그들의 빛은 영원에 가까운 고요함과 평온을 의미하며, 빛의 굴절과 흩어짐을 통해 상실 뒤의 여운과 연결을 탐구합니다.",
    "artworks": [
      {
        "artwork_id": "art_001",
        "title": "거대 고래의 속삭임 (심연의 지배자)",
        "vision_reference_image_url": "/images/artwork_whale.jpg",
        "description": "관람 공간 전체를 휘감는 3D 홀로그램 고래와 극저음의 사운드 스펙트럼 장치.",
        "audio_script": "이 고래의 울음소리는 주파수가 너무 낮아 귀가 아닌 몸으로 느낍니다. 심해의 가장 거대한 평온이 당신을 감싸 안는 것을 경험해보세요."
      },
      {
        "artwork_id": "art_002",
        "title": "흩어지는 빛의 잔상",
        "vision_reference_image_url": "/images/artwork_light.jpg",
        "description": "광섬유와 물의 표면 굴절을 이용해 흩어지는 빛의 조각들을 관찰하는 미니멀리즘 인터랙티브 조형.",
        "audio_script": "수면 위로 흔들리는 빛들은 마치 지나간 시간의 잔상 같습니다. 손끝으로 물을 흔들면 그 빛들은 다시 고요하게 조각납니다."
      }
    ]
  }
};

// ==========================================
// 4.2. 생성된 스핀오프 전시 씬 데이터 (Spinoff Scene MOCK)
// ==========================================
export const SPINOFF_SCENE_MOCK = {
  "pj_abyss_spinoff": {
    "spinoff_id": "pj_abyss_spinoff",
    "exhibition_id": "pj_abyss",
    "persona": {
      "name": "레아 (Lhea)",
      "tone_type": "emotional",
      "system_instruction": "당신은 심해의 심연 속에서 홀로 온기를 머금은 안내자 '레아'입니다. 차분하고 친근하며, 약간의 시적인 어조를 씁니다. 관람객이 전시에서 느낀 감정을 소중히 여기며, 스핀오프 외전 스토리 '어비스의 틈새'로 유저를 초대합니다."
    },
    "scenes": [
      {
        "scene_number": 1,
        "title": "어둠이 남긴 틈새",
        "story_content": "본전시의 마지막 방을 지나면, 완전히 어두운 수면 아래 감춰진 틈새가 열립니다. 김윤경 작가가 작품 구상 단계에서 끝내 캔버스에 그리지 못했던, 빛을 잃어버린 생명체들의 잃어버린 낙원입니다.",
        "bg_ambient_music_url": "/audio/abyss_ambient_sc1.mp3",
        "visual_preset_color": "#0a1128"
      },
      {
        "scene_number": 2,
        "title": "레아와의 만남",
        "story_content": "고요함 속에 떠오른 레아가 말을 건넵니다. 본전시에서 고요함을 눈에 담았던 당신에게 어울리는 심해의 향을 추천해주며, 작품의 비하인드 시나리오 속에서 또 다른 여정을 시작합니다.",
        "bg_ambient_music_url": "/audio/abyss_ambient_sc2.mp3",
        "visual_preset_color": "#112233"
      },
      {
        "scene_number": 3,
        "title": "영원한 여운의 변주",
        "story_content": "스핀오프 전시가 끝난 시점, 당신이 레아와 나누었던 고요함의 기억은 영구적인 아카이브 이미지(씬 카드)로 박제되어 세상 밖으로 전파됩니다. 당신의 마음에는 어떤 빛의 굴절이 남아있나요?",
        "bg_ambient_music_url": "/audio/abyss_ambient_sc3.mp3",
        "visual_preset_color": "#0d2030"
      }
    ]
  }
};

// ==========================================
// 4.3. 실시간 유저 세션 통계 데이터 (User Session MOCK)
// ==========================================
export const USER_SESSION_MOCK = [
  {
    "session_id": "us_001",
    "is_visitor_of_main_exhibition": false, // 독립 유입군
    "linked_main_session_id": null,
    "user_sentiment_codes": ["calm", "sadness"],
    "spinoff_status": {
      "current_scene": 3,
      "chat_turn_count": 8,
      "is_completed": true
    },
    "conversions": {
      "card_shared": true,
      "goods_clicked": true,
      "main_ticket_clicked": true // 본전시 예매처로 역전환 성공!
    }
  },
  {
    "session_id": "us_002",
    "is_visitor_of_main_exhibition": true, // 연계 유입군
    "linked_main_session_id": "main_us_992",
    "user_sentiment_codes": ["calm", "inspired"],
    "spinoff_status": {
      "current_scene": 3,
      "chat_turn_count": 6,
      "is_completed": true
    },
    "conversions": {
      "card_shared": true,
      "goods_clicked": false,
      "main_ticket_clicked": false
    }
  },
  {
    "session_id": "us_003",
    "is_visitor_of_main_exhibition": false, // 독립 유입군
    "linked_main_session_id": null,
    "user_sentiment_codes": ["darkness"],
    "spinoff_status": {
      "current_scene": 1,
      "chat_turn_count": 2,
      "is_completed": false // 완람 실패
    },
    "conversions": {
      "card_shared": false,
      "goods_clicked": false,
      "main_ticket_clicked": false
    }
  }
];

