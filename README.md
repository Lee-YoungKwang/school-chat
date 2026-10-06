# 🏫 학교 대화 사이트 (School Chat & Community)

> **교직원 & 중학생 통합 소통 및 커뮤니티 플랫폼**  
> UI 스타일: **[글래스모피즘 + 클레이모피즘 + 네오 브루탈리즘] 융합 스타일**  
> 인프라 최적화: **Vercel Serverless (Seoul `icn1`) + Supabase DB (Seoul `ap-northeast-2`) 리전 통일 (RTT &lt; 5ms)**

---

## 🌟 주요 기능

1. **실시간 피드 & 방명록**:
   - 실시간 새 글 등록, 반응형 피드 즉시 렌더링
   - 글별 좋아요(하트 팝 애니메이션) 및 실시간 덧글 작성
2. **학생 & 교직원 장소 분리 및 보안**:
   - 교직원 전용 공간(교무실/공람) 분리
   - 학생 역할 시 교직원 공간 진입 차단 및 교직원 핀코드 인증 모달 (`7777`)
3. **분야별 채널**:
   - 🏫 전체 공지
   - 📢 학급 공지
   - 💬 자유 소통
   - 🔍 분실물 센터
   - 🎖️ 학생회 전달
   - 🔒 교직원 전용
4. **학교 상식 퀴즈 & 명예의 전당 랭킹보드**:
   - 5문항 인터랙티브 퀴즈 게임 (축하 컨페티 효과)
   - Supabase `rankings` 테이블 실시간 동기화
5. **다크 모드 / 라이트 모드**:
   - 우측 상단 원클릭 테마 토글

---

## ⚡ 리전 통일 최적화 (Seoul Region)

- **Vercel Region**: `icn1` (Seoul, South Korea) 강제 지정 (`vercel.json`)
- **Supabase Region**: `ap-northeast-2` (Seoul, South Korea)
- 초저지연 RTT 5ms 이하 극단적 성능 최적화 달성

---

## 🛠️ 데이터베이스 스키마 (`supabase-schema.sql`)

- **posts**: `(id, title, content, author, channel, role, tag, likes, created_at)`
- **comments**: `(id, post_id, author, content, role, created_at)`
- **rankings**: `(id, nickname, score, played_at)`
