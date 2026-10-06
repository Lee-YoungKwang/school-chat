import { Post, Ranking, ChannelInfo } from '@/types';

export const CHANNELS: ChannelInfo[] = [
  {
    id: 'all-notice',
    name: '전체 공지',
    description: '학교 전체 학생 및 교직원 필독 공지사항입니다.',
    icon: 'Megaphone',
    color: 'bg-clay-yellow text-black border-black',
  },
  {
    id: 'class-notice',
    name: '학급 공지',
    description: '각 학년 및 반별 알림장과 중요 전달사항입니다.',
    icon: 'BellRing',
    color: 'bg-clay-blue text-black border-black',
  },
  {
    id: 'free-talk',
    name: '자유 소통',
    description: '학생과 교직원이 자유롭게 나누는 일상 이야기와 방명록입니다.',
    icon: 'MessageSquare',
    color: 'bg-clay-mint text-black border-black',
  },
  {
    id: 'lost-found',
    name: '분실물 센터',
    description: '소중한 물건을 잃어버렸거나 습득했을 때 공유하는 공간입니다.',
    icon: 'Search',
    color: 'bg-clay-orange text-black border-black',
  },
  {
    id: 'student-council',
    name: '학생회 전달',
    description: '학생회 소식, 자치 활동, 학생 건의사항 수렴 창구입니다.',
    icon: 'Award',
    color: 'bg-clay-purple text-black border-black',
  },
  {
    id: 'teacher-lounge',
    name: '교직원 전용',
    description: '교직원 전용 비공개 업무 공유 및 교무 회의 소통 공간입니다.',
    icon: 'Lock',
    staffOnly: true,
    color: 'bg-clay-pink text-black border-black',
  },
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    channel: 'all-notice',
    title: '🏫 2026학년도 2학기 학교 축제 (빛솔제) 부스 운영 및 일정 최종 안내',
    content: '안녕하세요, 학생안전부입니다. 2026학년도 빛솔 축제가 다음 주 금요일 개최됩니다. 각 학급별 동아리 체험 부스 배치도 및 공연 관람 시 안전 유의사항을 확인해 주세요. 즐겁고 안전한 축제가 될 수 있도록 적극적인 참여 바랍니다!',
    author: '학생안전부장 박진우 선생님',
    role: 'teacher',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    likes: 42,
    tag: '축제공지',
    comments: [
      {
        id: 'c-1',
        author: '2학년 3반 김민지',
        role: 'student',
        content: '선생님! 밴드부 공연 순서는 몇 시부터 시작하나요??',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      },
      {
        id: 'c-2',
        author: '학생안전부 박진우',
        role: 'teacher',
        content: '밴드부 공연은 오후 2시 대강당에서 시작될 예정입니다. 일정표를 강당 입구에 부착하겠습니다.',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
      }
    ]
  },
  {
    id: 'post-2',
    channel: 'class-notice',
    title: '📢 [2학년 3반] 내일 진로직업 현장체험학습 준수사항 및 모임 시간',
    content: '내일은 상암 IT 미디어 센터로 현장체험학습을 가는 날입니다. 아침 8시 40분까지 정문 운동장 스탠드에 학급별로 정렬해 주세요. 단정한 교복 착용, 개인 텀블러 지참 필수입니다!',
    author: '2-3 담임 최서연 선생님',
    role: 'teacher',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    likes: 27,
    tag: '알림장',
    comments: [
      {
        id: 'c-3',
        author: '이준호',
        role: 'student',
        content: '점심식사는 체험관 구내식당에서 다 같이 먹나요?',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      }
    ]
  },
  {
    id: 'post-3',
    channel: 'free-talk',
    title: '✨ 오늘 급식 로제 마라 떡볶이에 팝콘치킨 나온 거 먹은 사람??',
    content: '영양사 선생님 진짜 최고 아니신가요ㅠㅠㅠㅠ 치즈 떡에 바삭한 치킨 조합 미쳤음... 친구들이랑 두 판씩 리필해서 먹었네요ㅋㅋ 오늘 하루 힘차게 버틸 수 있는 원동력!',
    author: '급식탐험대 강태윤',
    role: 'student',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    likes: 58,
    tag: '급식자랑',
    comments: [
      {
        id: 'c-4',
        author: '윤다은',
        role: 'student',
        content: '인정합니다 국물에 밥 비벼먹은 사람 나야 나 ㅋㅋㅋ',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      },
      {
        id: 'c-5',
        author: '영양교사 김은주 선생님',
        role: 'teacher',
        content: '학생들이 맛있게 먹어줘서 급식실 선생님들 모두 보람찹니다! 앞으로도 맛있는 메뉴 기대해 주세요 :)',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      }
    ]
  },
  {
    id: 'post-4',
    channel: 'lost-found',
    title: '🔍 [습득] 3층 도서관 앞 복도에서 하늘색 필통 주웠어요!',
    content: '체육 시간 끝나고 올라오다가 바닥에 떨어진 산리오 시나모롤 하늘색 필통 주웠습니다. 안에 샤프랑 지우개 들어있어요. 2학년 교무실 분실물 보관함에 전달해 두었습니다! 주인분 찾아가세요.',
    author: '1학년 송하린',
    role: 'student',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    likes: 19,
    tag: '습득물',
    comments: [
      {
        id: 'c-6',
        author: '박수아',
        role: 'student',
        content: '헐 제 필통이에요!! 찾아주셔서 정말 감사합니다 ㅠㅠ 바로 교무실 갈게요!',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      }
    ]
  },
  {
    id: 'post-5',
    channel: 'student-council',
    title: '🎖️ [학생회] 2026 2학기 학교생활 개선 아이디어 공모 및 설문조사',
    content: '학생 여러분들의 손으로 만들어가는 더 좋은 우리 학교! 복도 휴게 벤치 설치, 급식 자율배식 코너 확대 등 평소 바랐던 건의사항을 자유롭게 댓글이나 학생회실로 접수해 주세요. 적극적으로 반영하겠습니다.',
    author: '학생회장 정우진',
    role: 'student',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
    likes: 33,
    tag: '학생회공지',
    comments: []
  },
  {
    id: 'post-6',
    channel: 'teacher-lounge',
    title: '🔒 [교직원 공람] 2학기 중간평가 출제원안 제출 및 이원목적분류표 확인의 건',
    content: '선생님들 수고 많으십니다. 2학기 중간평가 교과별 출제원안 제출 마감일이 이번 주 금요일 16:30까지입니다. 나이스(NEIS) 등록 후 교과협의회 서명 날인된 출력본을 교육과정부에 제출 부탁드립니다.',
    author: '교무부장 이현석 선생님',
    role: 'teacher',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    likes: 12,
    tag: '교무행정',
    isStaffOnly: true,
    comments: [
      {
        id: 'c-7',
        author: '수학교과 박도현 선생님',
        role: 'teacher',
        content: '2학년 수학 출제원안 교과협의 완료 후 금일 4교시 후 제출하겠습니다.',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
      }
    ]
  }
];

export const INITIAL_RANKINGS: Ranking[] = [
  { id: 'r-1', nickname: '마라탕후루장인', score: 2850, played_at: '2026-10-06 14:20', badge: '🥇 1위' },
  { id: 'r-2', nickname: '3학년수학천재', score: 2500, played_at: '2026-10-06 15:45', badge: '🥈 2위' },
  { id: 'r-3', nickname: '체육부장김철수', score: 2250, played_at: '2026-10-06 16:10', badge: '🥉 3위' },
  { id: 'r-4', nickname: '빛솔중스마트보이', score: 1950, played_at: '2026-10-06 17:00' },
  { id: 'r-5', nickname: '급식탐험대', score: 1800, played_at: '2026-10-06 17:35' },
  { id: 'r-6', nickname: '전교회장정우진', score: 1650, played_at: '2026-10-06 18:12' },
];

export const SCHOOL_QUIZ_QUESTIONS = [
  {
    question: "우리나라 헌법 제1조 1항에 명시된 '대한민국은 00공화국이다'의 빈칸은?",
    options: ["민주", "자유", "평화", "연방"],
    answerIndex: 0,
    points: 500,
  },
  {
    question: "학교에서 소중한 물건을 잃어버렸을 때 이용하는 게시판은?",
    options: ["자유 소통", "분실물 센터", "교직원 전용", "학급 공지"],
    answerIndex: 1,
    points: 400,
  },
  {
    question: "조선시대 한글(훈민정음)을 창제하신 왕은 누구일까요?",
    options: ["태조", "세종대왕", "정조", "영조"],
    answerIndex: 1,
    points: 500,
  },
  {
    question: "중학교 교실 수업 시작을 알리는 종소리의 보통 이름은?",
    options: ["시작종", "예비종 및 본종", "기상나팔", "퇴근종"],
    answerIndex: 1,
    points: 450,
  },
  {
    question: "다음 중 분리배출 시 비닐류에 해당하지 않는 것은?",
    options: ["라면 봉지", "택배 뽁뽁이(에어캡)", "음식물이 묻은 기름종이", "과자 비닐포장재"],
    answerIndex: 2,
    points: 550,
  },
];
