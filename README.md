# 시아상점 · 원석 팔찌 추천 & 비즈 커스텀

React + TypeScript + Vite 웹앱. 5문항 퀴즈로 9종 원석을 추천하고, SVG로 18알 팔찌를 실시간 커스텀합니다.

## 실행

```bash
npm install
npm run dev
```

## 테스트 / 도달 검증

```bash
npm test
npm run verify:reachability
```

## GitHub Pages

`vite.config.ts`의 `base`가 `/BeadsTest/`로 설정되어 있습니다. 저장소 이름에 맞게 수정한 뒤:

```bash
npm run build
```

`dist/`를 Pages에 배포하세요.

## 링크 수정

`src/config/store.ts`에서 인스타·틱톡·주문·달력 URL을 한곳에서 바꿉니다.
