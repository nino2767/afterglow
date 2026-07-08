/**
 * track.ts — 정적 UI용 임시 이벤트 트래킹 모킹 (데이터 레이어 보류 지침 준수)
 */

export function track(event: string, extra?: Record<string, any>) {
  console.log(`[Event Tracked] ${event}`, extra || {});
}
