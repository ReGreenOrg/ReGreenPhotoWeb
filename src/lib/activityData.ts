type datum = {
  id: string,
  title: string,
  imageSrc: string,
  activityButtonTitle: string,
  url: string
}

export type data = {
  activities: datum[]
}

export const DATA: data = {
  "activities": [
    {
      "id": "activity-1",
      "title": "친구·가족에게 '잘 지내?' 한 줄 보내기",
      "imageSrc": "/activity/activity-1",
      "activityButtonTitle": "메시지 보내기",
      "url": "sms:"
    },
    {
      "id": "activity-2",
      "title": "유튜브 게시물 1개에 좋은 댓글 달기",
      "imageSrc": "/activity/activity-2",
      "activityButtonTitle": "유튜브 보러 가기",
      "url": "https://www.youtube.com"
    },
    {
      "id": "activity-3",
      "title": "기분 좋아지는 자세 하기",
      "imageSrc": "/activity/activity-3",
      "activityButtonTitle": "자세 보기",
      "url": "https://www.google.com/search?q=기분+좋아지는+자세"
    },
    {
      "id": "activity-4",
      "title": "동네 가게 리뷰 1줄 남기기",
      "imageSrc": "/activity/activity-4",
      "activityButtonTitle": "리뷰 쓰기",
      "url": "https://maps.google.com"
    },
    {
      "id": "activity-5",
      "title": "집에서 거울 보고 춤추기",
      "imageSrc": "/activity/activity-5",
      "activityButtonTitle": "춤추기 시작",
      "url": "https://www.youtube.com/results?search_query=댄스+음악"
    },
    {
      "id": "activity-6",
      "title": "카톡 프로필에 오늘 기분 이모지 추가",
      "imageSrc": "/activity/activity-6",
      "activityButtonTitle": "이모지 추가하기",
      "url": "kakaotalk://"
    },
    {
      "id": "activity-7",
      "title": "커뮤니티에 인사 남기기 ('오늘도 파이팅~')",
      "imageSrc": "/activity/activity-7",
      "activityButtonTitle": "인사하기",
      "url": "https://cafe.naver.com"
    },
    {
      "id": "activity-8",
      "title": "재밌는 영상 1개 친구나 커뮤니티에 공유",
      "imageSrc": "/activity/activity-8",
      "activityButtonTitle": "영상 공유하기",
      "url": "https://www.youtube.com/feed/trending"
    },
    {
      "id": "activity-9",
      "title": "'3초간 허밍하기' (녹음 없이 그냥 클릭)",
      "imageSrc": "/activity/activity-9",
      "activityButtonTitle": "허밍하기",
      "url": "https://www.google.com/search?q=허밍"
    },
    {
      "id": "activity-10",
      "title": "다가올 생일·기념일 캘린더에 표시",
      "imageSrc": "/activity/activity-10",
      "activityButtonTitle": "캘린더 열기",
      "url": "https://calendar.google.com"
    },
    {
      "id": "activity-11",
      "title": "오늘 감사했던 일 1줄 메모",
      "imageSrc": "/activity/activity-11",
      "activityButtonTitle": "메모 작성하기",
      "url": "https://keep.google.com"
    },
    {
      "id": "activity-12",
      "title": "오늘 찍은 사진 1장 전송",
      "imageSrc": "/activity/activity-12",
      "activityButtonTitle": "사진 전송하기",
      "url": "mailto:"
    },
    {
      "id": "activity-13",
      "title": "날씨 이야기로 대화 시작하기 ('오늘 하늘 미쳤네')",
      "imageSrc": "/activity/activity-13",
      "activityButtonTitle": "날씨 이야기 시작",
      "url": "https://www.weather.com"
    },
    {
      "id": "activity-14",
      "title": "이모지 3개로 대화 시작하기",
      "imageSrc": "/activity/activity-14",
      "activityButtonTitle": "랜덤 이모지 3개 복사하기",
      "url": "https://emojipedia.org/random"
    }
  ]
};