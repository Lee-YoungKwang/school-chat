-- ========================================================
-- 학교 대화 사이트: Supabase Seoul (ap-northeast-2) 스키마
-- ========================================================

-- 1. 게시물 테이블 (posts)
CREATE TABLE IF NOT EXISTS public.posts (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author TEXT NOT NULL,
    channel TEXT NOT NULL DEFAULT 'free-talk',
    role TEXT NOT NULL DEFAULT 'student',
    tag TEXT,
    likes INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. 덧글 테이블 (comments)
CREATE TABLE IF NOT EXISTS public.comments (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT REFERENCES public.posts(id) ON DELETE CASCADE,
    author TEXT NOT NULL,
    content TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. 점수 랭킹 테이블 (rankings)
CREATE TABLE IF NOT EXISTS public.rankings (
    id BIGSERIAL PRIMARY KEY,
    nickname TEXT NOT NULL,
    score INTEGER NOT NULL,
    played_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- RLS (Row Level Security) 활성화 및 전체 읽기/쓰기 정책 허용
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rankings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users on posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users on posts" ON public.posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users on posts" ON public.posts FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users on comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users on comments" ON public.comments FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users on rankings" ON public.rankings FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users on rankings" ON public.rankings FOR INSERT WITH CHECK (true);

-- 초기 샘플 데이터 삽입
INSERT INTO public.posts (title, content, author, channel, role, tag, likes)
VALUES
('🏫 2026학년도 2학기 학교 축제 (빛솔제) 부스 운영 및 일정 최종 안내', '안녕하세요, 학생안전부입니다. 2026학년도 빛솔 축제가 다음 주 금요일 개최됩니다. 각 학급별 동아리 체험 부스 배치도를 확인해 주세요.', '학생안전부장 박진우 선생님', 'all-notice', 'teacher', '축제공지', 42),
('📢 [2학년 3반] 내일 진로직업 현장체험학습 준수사항 및 모임 시간', '내일은 상암 IT 미디어 센터로 현장체험학습을 가는 날입니다. 아침 8시 40분까지 정문 운동장 스탠드에 정렬해 주세요.', '2-3 담임 최서연 선생님', 'class-notice', 'teacher', '알림장', 27),
('✨ 오늘 급식 로제 마라 떡볶이에 팝콘치킨 나온 거 먹은 사람??', '영양사 선생님 진짜 최고 아니신가요ㅠㅠㅠㅠ 치즈 떡에 바삭한 치킨 조합 미쳤음...', '급식탐험대 강태윤', 'free-talk', 'student', '급식자랑', 58),
('🔍 [습득] 3층 도서관 앞 복도에서 하늘색 필통 주웠어요!', '체육 시간 끝나고 올라오다가 바닥에 떨어진 산리오 시나모롤 하늘색 필통 주웠습니다. 교무실에 전달 완료!', '1학년 송하린', 'lost-found', 'student', '습득물', 19);

INSERT INTO public.rankings (nickname, score)
VALUES
('마라탕후루장인', 2850),
('3학년수학천재', 2500),
('체육부장김철수', 2250),
('빛솔중스마트보이', 1950),
('급식탐험대', 1800);
