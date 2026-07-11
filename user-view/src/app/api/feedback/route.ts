import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { comment, page, xRatio, yRatio, nickname } = body;

    // 이슈 트래커 파일 절대 경로
    const trackerPath = "/Users/jmk/develop/afterglow/docs/04_테스트-및-QA/유저테스트-수정사항-이슈트래커.md";
    
    let fileContent = "";
    try {
      fileContent = fs.readFileSync(trackerPath, "utf-8");
    } catch (e) {
      return NextResponse.json({ success: false, error: "Tracker file not found on system." }, { status: 500 });
    }

    // 1. 최고 ID 넘버 계산 (| **#001** | 형태 매칭)
    const idRegex = /\|\s*\*\*#(\d+)\*\*\s*\|/g;
    let match;
    let maxId = 0;
    while ((match = idRegex.exec(fileContent)) !== null) {
      const num = parseInt(match[1], 10);
      if (num > maxId) {
        maxId = num;
      }
    }
    const nextIdNum = maxId + 1;
    const nextId = `#${String(nextIdNum).padStart(3, "0")}`;

    // 2. 현재 날짜 (MM/DD)
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const dateStr = `${mm}/${dd}`;

    // 3. 테이블 내 알맞은 위치에 추가
    const lines = fileContent.split("\n");
    let insertIndex = -1;

    // 뒤에서부터 테이블 데이터 끝 찾기
    for (let i = lines.length - 1; i >= 0; i--) {
      const trimmed = lines[i].trim();
      if (trimmed.startsWith("|") && (trimmed.includes("대기") || trimmed.includes("완료") || trimmed.includes("진행 중"))) {
        insertIndex = i + 1;
        break;
      }
    }

    const newRow = `| **${nextId}** | ${dateStr} | ${page} | ${comment} (위치: X ${xRatio}%, Y ${yRatio}%) | **P2** | **📋 대기** | - | 화면 직접 등록 피드백 (작성자: ${nickname}) |`;

    if (insertIndex !== -1) {
      lines.splice(insertIndex, 0, newRow);
    } else {
      lines.push(newRow);
    }

    fs.writeFileSync(trackerPath, lines.join("\n"), "utf-8");

    return NextResponse.json({ 
      success: true, 
      feedback: {
        id: nextId,
        date: dateStr,
        page,
        comment,
        xRatio,
        yRatio,
        nickname
      } 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, action, replyComment, nickname } = body; // action: "resolve" | "reply"

    if (!id) {
      return NextResponse.json({ success: false, error: "이슈 ID가 누락되었습니다." }, { status: 400 });
    }

    const trackerPath = "/Users/jmk/develop/afterglow/docs/04_테스트-및-QA/유저테스트-수정사항-이슈트래커.md";
    let fileContent = "";
    try {
      fileContent = fs.readFileSync(trackerPath, "utf-8");
    } catch (e) {
      return NextResponse.json({ success: false, error: "Tracker file not found on system." }, { status: 500 });
    }

    const lines = fileContent.split("\n");
    let found = false;

    const updatedLines = lines.map(line => {
      // 해당 ID를 마킹하고 있는 행 감지
      if (line.includes(`**${id}**`)) {
        found = true;

        if (action === "reply") {
          // ── 대댓글 달기 분기 ──
          const parts = line.split("|");
          if (parts.length >= 5) {
            const today = new Date();
            const mm = String(today.getMonth() + 1).padStart(2, "0");
            const dd = String(today.getDate()).padStart(2, "0");
            const dateStr = `${mm}/${dd}`;
            
            // parts[4]가 '발견된 문제 및 개선사항' 컬럼에 해당함
            parts[4] = parts[4].trim() + `<br> └ *${nickname || "크루"} (${dateStr}): ${replyComment}*`;
            return parts.join("|");
          }
        } else {
          // ── 완료(해결) 처리 분기 ──
          let resolvedLine = line
            .replace("📋 대기", "✅ 완료")
            .replace("⚙️ 진행 중", "✅ 완료");
          
          // 담당자 갱신 (빈 값인 경우 Antigravity로 변경)
          if (resolvedLine.includes("| - |")) {
            resolvedLine = resolvedLine.replace("| - |", "| Antigravity |");
          }
          return resolvedLine;
        }
      }
      return line;
    });

    if (!found) {
      return NextResponse.json({ success: false, error: `이슈 ID ${id}를 찾을 수 없습니다.` }, { status: 404 });
    }

    fs.writeFileSync(trackerPath, updatedLines.join("\n"), "utf-8");

    return NextResponse.json({ success: true, message: `이슈 ${id} 업데이트 완료 (${action || "resolve"})` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


