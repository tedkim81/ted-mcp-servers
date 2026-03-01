# Ladder Pick — ChatGPT App 개발 계획

- **프로젝트명**: `ted-mcp-servers`
- **앱 이름(App Directory 표시)**: Ladder Pick
- **앱 언어**: 영어 우선 (UI/툴 description/프라이버시 정책 모두 영어, 계획 문서만 한글)

## 공식 개발자 문서 참고 링크

### 핵심 문서(필독)
- **Apps SDK 홈**: https://developers.openai.com/apps-sdk
- **Quickstart(Todo 예제 포함)**: https://developers.openai.com/apps-sdk/quickstart
- **MCP Server 개념**: https://developers.openai.com/apps-sdk/concepts/mcp-server
- **MCP Apps in ChatGPT**: https://developers.openai.com/apps-sdk/mcp-apps-in-chatgpt

### 설계/디자인
- **UX 원칙**: https://developers.openai.com/apps-sdk/concepts/ux-principles
- **UI 가이드라인**: https://developers.openai.com/apps-sdk/concepts/ui-guidelines
- **디자인 컴포넌트**: https://developers.openai.com/apps-sdk/plan/components
- **툴 정의**: https://developers.openai.com/apps-sdk/plan/tools
- **유스케이스 리서치**: https://developers.openai.com/apps-sdk/plan/use-case

### 빌드
- **MCP 서버 셋업**: https://developers.openai.com/apps-sdk/build/mcp-server
- **ChatGPT UI 빌드**: https://developers.openai.com/apps-sdk/build/chatgpt-ui
- **상태 관리**: https://developers.openai.com/apps-sdk/build/state-management
- **인증**: https://developers.openai.com/apps-sdk/build/auth
- **예제 앱 모음(GitHub)**: https://github.com/openai/openai-apps-sdk-examples
- **UI 라이브러리(GitHub)**: https://github.com/openai/apps-sdk-ui

### 배포/테스트/제출
- **배포 가이드**: https://developers.openai.com/apps-sdk/deploy
- **테스트 가이드**: https://developers.openai.com/apps-sdk/deploy/testing
- **ChatGPT 연결**: https://developers.openai.com/apps-sdk/deploy/connect-chatgpt
- **앱 제출 및 유지보수**: https://developers.openai.com/apps-sdk/deploy/submission
- **앱 제출 가이드라인(정책/규칙)**: https://developers.openai.com/apps-sdk/app-submission-guidelines
- **Developer Mode 설정**: https://platform.openai.com/docs/guides/developer-mode

### 가이드/참고
- **보안 & 프라이버시**: https://developers.openai.com/apps-sdk/guides/security-privacy
- **메타데이터 최적화**: https://developers.openai.com/apps-sdk/guides/optimize-metadata
- **트러블슈팅**: https://developers.openai.com/apps-sdk/deploy/troubleshooting
- **API 레퍼런스**: https://developers.openai.com/apps-sdk/reference
- **변경 로그**: https://developers.openai.com/apps-sdk/changelog

### 일반 참고
- **Apps in ChatGPT(Help Center)**: https://help.openai.com/en/articles/12503483-apps-in-chatgpt-and-the-apps-sdk
- **앱 디렉터리 제출(Help Center)**: https://help.openai.com/en/articles/20001040
- **앱 디렉터리 브라우징**: https://chatgpt.com/apps

---

## 목표
- ChatGPT App Directory에 등록 가능한 **"Ladder Pick"** 앱을 만든다.
- 채팅 안에서 **인터랙티브 위젯(iframe)**을 통해 참가자/항목 입력 → 사다리(랜덤 매칭) 생성 → 결과 공개까지 완료할 수 있게 한다.
- ChatGPT Developer Mode로 테스트 후, 최종적으로 **App Directory 제출/승인/Publish**를 목표로 한다.

## 전제/범위
- **MVP**: 인터랙티브 위젯(iframe UI) + MCP 툴 기반. 위젯에서 참가자/항목 입력, 결과 표시, 다시 섞기 등 핵심 인터랙션을 제공.
- **비범위(초기)**: 로그인/결제, 실시간 멀티플레이, 복잡한 애니메이션, 외부 데이터 연동.
- **인증 불필요**: 외부 서비스 연동이 없으므로 OAuth/인증 플로우 없이 시작.
- **안전/정책**: 외부 시스템에 쓰기(write) 동작 없음. 툴의 hint annotation:
  - `readOnlyHint: false` — 내부 상태를 생성/변경하므로 true가 아님
  - `destructiveHint: false` — 되돌리기 어려운 외부 영향 없음
  - `openWorldHint: false` — 공개 인터넷 상태 변경 없음

## 사용자 경험(UX) 시나리오

### 기본 흐름(인터랙티브 위젯)
1. 사용자가 `@Ladder Pick` 또는 "play a ladder game"처럼 입력
2. ChatGPT가 `create_game` 툴을 호출하고, **Ladder Pick 위젯**이 iframe에 표시됨
3. 위젯 내에서:
   - **Players** 리스트: 참가자 이름 추가/삭제 (기본 4명)
   - **Items** 리스트: 결과 항목(상품/역할) 추가/삭제
   - **Options**: Reveal mode (All at once / One by one), Seed (auto / custom)
   - **"Pick!"** 버튼 클릭 → 매칭 결과 생성
4. 결과 영역:
   - **All at once**: 전체 매칭 표 즉시 표시
   - **One by one**: "Reveal Next" 버튼으로 한 명씩 공개
   - **"Reshuffle"** 버튼: 새 시드로 다시 섞기
   - **"Export"** 버튼: 결과를 텍스트로 복사

### 텍스트 폴백
- 위젯 없이도 ChatGPT가 툴 호출 결과를 텍스트(표)로 보여줄 수 있음
- 예: "Ladder Pick, match A,B,C,D with 1st,2nd,3rd,4th" → 텍스트 표 응답

### 에러 케이스
- 참가자 < 2명 → 에러 메시지: "At least 2 players are required."
- 항목 개수 ≠ 참가자 수 → 에러 메시지: "Number of items must match number of players. You have {n} players and {m} items."
- 항목 비어있음 → 에러 메시지: "Items list cannot be empty."

## 기능 요구사항

### 입력
- **참가자 목록(Players)**: 2~20명
- **결과 항목(Items)**: 참가자 수와 **정확히 동일한 개수**(불일치 시 에러 반환)
- **옵션**
  - Reveal mode: `all` | `one-by-one`
  - Seed: 자동 생성 또는 사용자 지정(재현 가능성)

### 출력
- **매칭 결과**: Player ↔ Item 1:1 매핑
- **사다리 표현**: Canvas 기반 시각적 사다리(수직선 + 가로 발판 + 색깔별 경로 애니메이션) 구현

### 상태/저장
- 모듈 레벨 `Map<gameId, GameState>`으로 프로세스 내 인메모리 관리
- 게임 생성 시 고유 ID 발급, 이후 reshuffle/reveal_next에서 해당 ID로 조회
- 영구 저장 없음(서버 재시작 시 초기화됨, 초기에는 이 정도로 충분)

## 기술 설계

### 아키텍처(공식 구조 기반)
ChatGPT Apps는 아래 두 요소로 구성된다:
1. **MCP 서버(필수)** — 앱의 기능(tools)을 정의하고, `/mcp` 엔드포인트로 ChatGPT에 노출. HTTP 서버로 동작하며 `StreamableHTTPServerTransport`를 사용.
2. **웹 컴포넌트** — ChatGPT 내부의 **iframe**에 렌더되는 HTML/CSS/JS. MCP 서버에 **리소스(`ui://...`)**로 등록하면 ChatGPT가 tool 호출 결과와 함께 UI를 표시. JSON-RPC over `postMessage`(`ui/*` 메서드)로 MCP 서버와 통신.

> MCP 서버가 곧 앱이다. "Apps SDK"는 MCP 서버 위에 UI 리소스와 툴을 등록하는 방식을 제공하는 것이며, 별도의 "앱 서버"를 따로 두는 구조가 아니다.

### 핵심 패키지
- `@modelcontextprotocol/sdk` `^1.27.1` — MCP 서버 프레임워크 (McpServer, StreamableHTTPServerTransport)
- `@modelcontextprotocol/ext-apps` `^1.1.2` — Apps SDK 헬퍼 (registerAppResource, registerAppTool, RESOURCE_MIME_TYPE)
- `zod` `^3.25.76` — 툴 입력 스키마 검증

### 스택
- **Node.js + TypeScript**
- **패키지 매니저: pnpm**
- UI: 바닐라 HTML/CSS/JS 단일 파일(공식 Quickstart 패턴), 필요 시 React 전환
- (선택) `@openai/apps-sdk-ui` — 공식 오픈소스 UI 라이브러리
- **배포: AWS Lightsail** (Nginx 리버스 프록시 + Let's Encrypt HTTPS, 멀티 앱 모노리포)

### 폴더 구조
```
ted-mcp-servers/                    # 모노리포 루트
├── README.md
├── apps/
│   └── ladder-pick/                # Ladder Pick 앱
│       ├── package.json
│       ├── tsconfig.json
│       ├── .env.example            # PORT 등 환경변수 예시
│       ├── assets/
│       │   └── ladder-pick-icon.png  # App Directory 제출용 앱 아이콘
│       ├── public/
│       │   └── ladder-widget.html  # ChatGPT iframe 위젯 (standalone 모드 포함)
│       ├── src/
│       │   ├── server.ts           # MCP 서버 엔트리 (HTTP + /mcp 엔드포인트)
│       │   ├── types.ts            # 공유 타입 정의
│       │   ├── tools/
│       │   │   ├── create-game.ts
│       │   │   ├── reshuffle.ts
│       │   │   ├── reveal-next.ts
│       │   │   └── export-result.ts
│       │   └── core/
│       │       ├── ladder.ts       # 매칭 알고리즘 (Fisher-Yates shuffle)
│       │       ├── rng.ts          # mulberry32 시드 기반 RNG
│       │       ├── validate.ts     # 입력 검증
│       │       └── game-store.ts   # Map 기반 인메모리 게임 상태 저장
│       ├── dist/                   # TypeScript 빌드 결과물
│       └── docs/
│           ├── privacy-policy.md
│           └── test-prompts.md
│   └── other-app/                  # 추후 추가될 앱 (예시)
│       └── ...
```

## 핵심 알고리즘

### 매칭
- Players 배열과 Items 배열의 길이가 동일한지 검증 → **불일치 시 에러 반환** (자동 보정하지 않음)
- **mulberry32** 시드 기반 RNG + **Fisher-Yates shuffle**로 Items를 섞어 Players와 1:1 매핑
- 시드가 없으면 `Math.random().toString(36)` 기반으로 12자리 시드를 생성해 반환(재현 가능)
- 서버(Node.js)와 위젯(브라우저 JS) 양쪽에 동일한 mulberry32 알고리즘을 구현하여 같은 시드로 동일한 결과 보장

### 사다리 시각화 (Canvas)
- **수직선**: 참가자 수만큼 수직선 배치
- **가로 발판(rungs)**: 시드 기반으로 인접 수직선 사이에 랜덤 가로선 배치
- **경로 역산**: Fisher-Yates 결과(permutation)를 bubble sort 인접 교환으로 분해하여 가로선을 추가 배치 → 정확한 매칭 구현
- **경로 애니메이션**: easeInOutCubic 이징, 플레이어별 색상으로 경로 표시
  - All at once: 전체 경로 동시 애니메이션 (2.2초)
  - One by one: 한 명씩 경로 공개 (1.6초/명)
- **시작점/도착점 뱃지**: 플레이어 이름(상단) + 아이템 이름(하단), 동일한 색상으로 연결 관계 표시

## MCP 툴 설계

### 공통 메타
모든 툴의 description/title은 **영어**로 작성.
hint annotation 기본값:
```json
{
  "readOnlyHint": false,
  "destructiveHint": false,
  "openWorldHint": false
}
```
- `readOnlyHint: false` — 내부 게임 상태를 생성/변경하므로 순수 조회가 아님
- `destructiveHint: false` — 외부 시스템에 되돌릴 수 없는 영향 없음
- `openWorldHint: false` — 공개 인터넷 상태 변경 없음
- 예외: `export_result`는 순수 조회이므로 `readOnlyHint: true`

> 이 annotation이 실제 동작과 불일치하면 심사에서 반려된다. (공식 반려 사유 참고)

### Tool 1: `create_game`
- title: "Create ladder game"
- description: "Creates a new ladder game with the given players and items, producing a random 1:1 matching."
- 입력 스키마(zod): `players: z.array(z.string().min(1)).min(2).max(20)`, `items: z.array(z.string().min(1)).min(2).max(20)`, `seed?: z.string()`, `revealMode?: z.enum(["all", "one-by-one"]).default("all")`
- 검증: `players.length !== items.length` → 에러 반환
- 출력(structuredContent): `gameId`, `seed`, `revealMode`, `players[]`, `items[]`, `mapping[]`, `totalCount`, `revealedCount`
  - revealMode 관계없이 항상 `players[]`, `items[]`, `mapping[]` 모두 포함 (위젯이 사다리를 구성하는 데 필요)
  - `revealedCount`: all 모드는 `mapping.length`, one-by-one 모드는 `0`
- UI: `_meta.ui.resourceUri: "ui://widget/ladder.html"`

### Tool 2: `reshuffle`
- title: "Reshuffle"
- description: "Reshuffles the matching of an existing game with a new seed."
- 입력: `gameId: z.string()`, `seed?: z.string()`
- 출력(structuredContent): `gameId`, `seed`, `revealMode`, `players[]`, `items[]`, 새 `mapping[]`, `totalCount`, `revealedCount: 0`

### Tool 3: `reveal_next`
- title: "Reveal next"
- description: "Reveals the next player-item pair in one-by-one mode."
- 입력: `gameId: z.string()`
- 출력: `player`, `item`, `revealedSoFar`, `remainingCount`

### Tool 4: `export_result`
- title: "Export result"
- description: "Exports the full game result as shareable text or JSON."
- 입력: `gameId: z.string()`, `format: z.enum(["text", "json"])`
- 출력: 결과 문자열
- hint: `readOnlyHint: true`

## 웹 컴포넌트(위젯) 설계

### 렌더링 방식
- `public/ladder-widget.html` 단일 HTML 파일(CSS/JS 인라인), **모든 UI 텍스트는 영어**
- ChatGPT 내 **iframe**으로 렌더됨
- JSON-RPC over `postMessage`로 MCP 서버와 통신:
  - `ui/initialize` → `ui/notifications/initialized` (브릿지 초기화)
  - `tools/call` (위젯에서 툴 호출)
  - `ui/notifications/tool-result` (모델이 호출한 툴 결과 수신)

### UI 구성(영어)
- **Input 카드**
  - "Players" 리스트: 텍스트 입력 + Add/Remove 버튼 (태그 형식)
  - "Items" 리스트: 텍스트 입력 + Add/Remove 버튼 (태그 형식)
  - Options: Reveal mode 토글 (All at once / One by one), Seed 입력(선택)
  - CTA 버튼: **"🎲 Pick!"**
  - ChatGPT에서 게임 결과가 수신되면 Players/Items 목록이 서버 결과로 자동 동기화됨
- **Ladder 카드**
  - Canvas 기반 사다리 시각화 (수직선 + 가로 발판 + 색깔별 경로 애니메이션)
  - 버튼: "Reveal Next ▶" (one-by-one 모드), "🔀 Reshuffle", "📋 Export", "↩ New"
  - 진행 상태 표시: "{n}/{total} revealed"
  - Seed 표시 (하단)
- **에러 표시**
  - 인라인 에러 메시지 (빨간색, 입력 카드 내)
  - "At least 2 players are required."
  - "Number of items must match number of players. You have {n} players and {m} items."
  - "Items list cannot be empty."

### Standalone 모드
- `public/ladder-widget.html`을 브라우저에서 직접 열면 **MCP 서버 없이** 테스트 가능
- iframe 감지 + bridge 초기화 타임아웃(2초)으로 standalone 자동 판별
- 상단에 "Standalone Mode — testing without MCP server" 배너 표시
- `localCall()` 함수로 `create_game`, `reshuffle`, `export_result` 로컬 실행
- 서버와 동일한 mulberry32 RNG 사용 → 같은 시드로 동일한 결과 보장

### 스타일
- 깔끔한 카드 UI, 라운드 코너(14px), 그림자, CSS 변수 기반 컬러 시스템
- 플레이어별 20가지 고정 색상 팔레트 (시작점·경로·도착점 모두 동일 색상)
- 반응형: 모바일 ChatGPT 앱에서도 정상 동작 (`max-width: 520px`, 모바일 미디어쿼리)

## 개발 단계(실행 순서)

### 0. 프로젝트 부트스트랩
- `pnpm init`
- `package.json`에 `"type": "module"` 설정
- `pnpm add @modelcontextprotocol/sdk @modelcontextprotocol/ext-apps zod`
- `pnpm add -D typescript @types/node`
- TypeScript 설정(`tsconfig.json`): `target: ES2022`, `module: NodeNext`, `moduleResolution: NodeNext`
- 빌드 스크립트: `build` (tsc), `start` (node dist/server.js), `dev` (node --watch dist/server.js), `build:watch` (tsc --watch)

### 1. 코어 로직 구현
- 입력 검증(`validate.ts`): players/items 길이 불일치 시 **에러 반환**, 공백 trim, 빈 문자열 제거
- RNG(`rng.ts`): mulberry32 알고리즘 기반 시드 RNG + Fisher-Yates shuffle, `generateSeed()`로 12자리 랜덤 시드 생성
- 매칭 알고리즘(`ladder.ts`): `createMapping(players, items, seed)` — shuffle 결과로 1:1 매핑
- 인메모리 GameStore(`game-store.ts`): `Map<string, GameState>`, `setGame/getGame/updateGame` API
- 공유 타입(`types.ts`): `GameState`, `Pairing`, `RevealMode`

### 2. MCP 서버 구현
- `src/server.ts`: HTTP 서버 + `/mcp` 엔드포인트 + CORS 처리 + `GET /` 헬스체크
- `registerAppResource`로 `public/ladder-widget.html`을 `ui://widget/ladder.html`에 등록
- `registerAppTool`로 4개 툴 등록(zod 스키마 + `_meta.ui.resourceUri` 연결)
- 각 툴에 hint annotation 명시
- 모든 tool title/description은 영어로 작성

### 3. 인터랙티브 위젯 구현
- `public/ladder-widget.html` 작성 (영어 UI, 단일 파일 CSS/JS 인라인)
- **MCP 브릿지**: `ui/initialize` → `ui/notifications/initialized`, `tools/call`, `ui/notifications/tool-result` 수신
- **Standalone 모드**: iframe 감지 + 2초 타임아웃으로 자동 판별, `localCall()`로 로컬 실행
- **Canvas 사다리 시각화**: mulberry32 RNG + bubble swap 역산으로 사다리 구성, 경로 애니메이션
- **상태 동기화**: 서버/ChatGPT 결과 수신 시 Input 카드의 Players/Items UI도 함께 갱신
- 반응형 레이아웃(모바일 ChatGPT 앱 대응)

### 4. 로컬 테스트
- **Standalone 브라우저 테스트** (MCP 서버 없이):
  ```bash
  open public/ladder-widget.html
  ```
- **빌드 및 서버 실행**:
  ```bash
  pnpm build && pnpm start
  # → http://localhost:8787/mcp
  ```
- **MCP Inspector로 툴 단위 테스트**:
  ```bash
  npx @modelcontextprotocol/inspector@latest --server-url http://localhost:8787/mcp --transport http
  ```
- **ngrok으로 로컬 서버 공개 노출**:
  ```bash
  ngrok http 8787
  ```
- **ChatGPT Developer Mode 연결**:
  - Settings → Apps & Connectors → Advanced settings에서 Developer mode 활성화
  - 채팅창 `+` 버튼 → More → URL 입력: `https://<id>.ngrok.app/mcp`, 인증: None
  - 대화에서 `@Ladder Pick` 또는 More 메뉴에서 선택하여 테스트
- **테스트 범위**: 대표 프롬프트 10개 + 에러 케이스(개수 불일치/빈 입력/특수문자)
- **모바일 테스트**: ChatGPT iOS/Android 앱에서 위젯 렌더링 확인(웹+모바일 모두 통과 필수)

### 5. AWS 배포 (Lightsail + Nginx + Let's Encrypt)

#### 멀티 앱 아키텍처

하나의 Lightsail 인스턴스에서 **여러 ChatGPT 앱의 MCP 서버**를 함께 호스팅한다.

```
                     ┌─────────────────────────────────────────┐
                     │         Lightsail ($5/월)                │
                     │                                         │
  HTTPS 443         │   Nginx (리버스 프록시 + SSL)            │
  ─────────────►    │     /ladder-pick/*  → localhost:8787     │
                     │     /other-app/*   → localhost:8788     │
                     │     /next-app/*    → localhost:8789     │
                     │     ...                                 │
                     │                                         │
                     │   PM2 (프로세스 관리)                    │
                     │     ├─ ladder-pick   :8787              │
                     │     ├─ other-app     :8788              │
                     │     └─ next-app      :8789              │
                     └─────────────────────────────────────────┘
```

- **경로 기반 라우팅**: 각 앱은 고유 경로 prefix를 가짐 (예: `/ladder-pick/mcp`)
- **포트 분리**: 각 앱은 별도 포트에서 PM2로 독립 실행
- **SSL 공유**: Let's Encrypt 인증서 1개를 모든 앱이 공유
- **독립 배포**: 각 앱은 개별 `git pull → build → pm2 restart`로 독립 배포 가능
- 새 앱 추가 시: 코드 배포 → PM2 등록 → Nginx location 블록 추가 → `nginx -s reload`

#### 5-1. 인스턴스 생성

1. [Lightsail 콘솔](https://lightsail.aws.amazon.com/) 접속
2. **Create instance** 클릭
3. 설정:
   - 리전: `us-east-1` (또는 선호 리전)
   - 플랫폼: **Linux/Unix**
   - 블루프린트: **OS Only → Amazon Linux 2023** (또는 **Node.js** 블루프린트)
   - 플랜: **$5/월** (1GB RAM, 앱 수 증가 시 $10 플랜으로 업그레이드)
   - 인스턴스 이름: `ted-mcp-servers`
4. **Create instance** 클릭

#### 5-2. 고정 IP 연결

Lightsail 콘솔 → 인스턴스 → **Networking** 탭:
1. **Attach static IP** 클릭 → 고정 IP 생성 및 연결
2. 이 IP를 도메인 DNS에 사용

#### 5-3. 방화벽 설정

Lightsail 콘솔 → 인스턴스 → **Networking** 탭 → **IPv4 Firewall**:

| 규칙 | 프로토콜 | 포트 |
|---|---|---|
| SSH | TCP | 22 (기본 설정됨) |
| HTTP | TCP | 80 (기본 설정됨) |
| **HTTPS** | **TCP** | **443** ← 추가 필요 |

**+ Add rule** → HTTPS (443) 추가

#### 5-4. 도메인 및 DNS 설정

```
도메인 예시: apps.yourdomain.com  (모든 앱이 공유)

DNS 설정 (Lightsail DNS 또는 외부 DNS):
  A 레코드 → Lightsail 고정 IP 주소
```

Lightsail 무료 DNS 존을 사용하려면:
1. Lightsail 콘솔 → **Networking** → **Create DNS zone**
2. 도메인 입력 → 네임서버를 도메인 등록기관에 설정
3. A 레코드 추가: `apps.yourdomain.com` → 고정 IP

> 앱별 서브도메인이 아닌 **경로 기반** 라우팅이므로 도메인 1개만 필요.

#### 5-5. 서버 환경 구성 (SSH 접속 후)

```bash
# ─── 공통 환경 설치 (최초 1회) ───
curl -fsSL https://rpm.nodesource.com/setup_22.x | sudo bash -
sudo yum install -y nodejs git
sudo npm install -g pnpm pm2

# ─── 리포 클론 ───
cd ~
git clone https://github.com/<your-repo>/ted-mcp-servers.git
cd ted-mcp-servers

# ─── Ladder Pick 배포 ───
cd apps/ladder-pick
echo "optional=false" > .npmrc
pnpm install --frozen-lockfile
pnpm build
PORT=8787 pm2 start dist/server.js --name ladder-pick
cd ../..

# ─── 새 앱 추가 시 (예시) ───
# cd apps/other-app
# pnpm install --frozen-lockfile && pnpm build
# PORT=8788 pm2 start dist/server.js --name other-app
# cd ../..

# ─── PM2 자동 시작 등록 ───
pm2 save
pm2 startup  # 출력되는 sudo 명령어를 실행하여 재부팅 시 자동 시작 등록
```

#### 5-6. Nginx 리버스 프록시 설정

```bash
# ─── Nginx 설치 ───
sudo yum install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

**설정 파일 작성** (`/etc/nginx/conf.d/ted-mcp-servers.conf`):
```nginx
server {
    listen 80;
    server_name apps.yourdomain.com;

    # ─── Ladder Pick (port 8787) ───
    location /ladder-pick/ {
        proxy_pass http://127.0.0.1:8787/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_buffering off;
        proxy_read_timeout 3600s;
    }

    # ─── Add new app: copy location block ───
    # location /other-app/ {
    #     proxy_pass http://127.0.0.1:8788/;
    #     ... (same proxy settings)
    # }

    # ─── Health check ───
    location = / {
        return 200 'ted-mcp-servers server is running';
        add_header Content-Type text/plain;
    }
}
```

> **경로 매핑**: `https://apps.yourdomain.com/ladder-pick/mcp` → `http://127.0.0.1:8787/mcp`  
> `proxy_pass` 끝의 `/`가 location prefix를 strip 하는 역할.

```bash
# Nginx 설정 테스트 및 재시작
sudo nginx -t
sudo systemctl restart nginx

# HTTP 동작 확인
curl http://apps.yourdomain.com/ladder-pick/
# → "Ladder Pick MCP server is running"
```

**새 앱 추가 시**: `ted-mcp-servers.conf`에 location 블록 추가 → `sudo nginx -s reload`

#### 5-7. Let's Encrypt HTTPS 설정

```bash
# ─── Certbot 설치 ───
sudo yum install -y certbot python3-certbot-nginx

# ─── 인증서 발급 (nginx 자동 설정 포함) ───
sudo certbot --nginx -d apps.yourdomain.com

# 프롬프트에서:
# - 이메일 입력
# - 약관 동의 (Y)
# - HTTP→HTTPS 리다이렉트 설정 (권장: Yes)

# ─── 자동 갱신 테스트 ───
sudo certbot renew --dry-run

# certbot은 systemd 타이머로 자동 갱신이 등록됨 (90일마다)
```

완료 후 nginx 설정이 자동으로 갱신되어 최종 상태:
```nginx
server {
    server_name apps.yourdomain.com;

    # ─── Ladder Pick ───
    location /ladder-pick/ {
        proxy_pass http://127.0.0.1:8787/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_buffering off;
        proxy_read_timeout 3600s;
    }

    # ─── 앱 추가 시 location 블록 추가 ───

    location = / {
        return 200 'ted-mcp-servers server is running';
        add_header Content-Type text/plain;
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/apps.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/apps.yourdomain.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    listen 80;
    server_name apps.yourdomain.com;
    return 301 https://$host$request_uri;
}
```

> **인증서 1개**로 모든 앱 경로를 커버. 앱을 추가해도 인증서 재발급 불필요.

#### 5-8. 배포 후 검증

```bash
# 서버 전체 헬스체크
curl https://apps.yourdomain.com/
# → "ted-mcp-servers server is running"

# Ladder Pick 헬스체크
curl https://apps.yourdomain.com/ladder-pick/
# → "Ladder Pick MCP server is running"

# Ladder Pick MCP 툴 목록 확인
curl -X POST https://apps.yourdomain.com/ladder-pick/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
# → 4개 툴 목록 반환 확인

# SSL 인증서 확인
curl -vI https://apps.yourdomain.com/ 2>&1 | grep "SSL certificate"
```

#### 5-9. 코드 업데이트 방법

```bash
# SSH 접속 후 — 특정 앱만 업데이트 (다른 앱에 영향 없음)
cd ~/ted-mcp-servers/apps/ladder-pick
git pull
pnpm install --frozen-lockfile
pnpm build
pm2 restart ladder-pick

# 전체 앱 상태 확인
pm2 status
```

#### 5-10. 배포 체크리스트

**공통 인프라 (최초 1회)**:
- [ ] Lightsail 인스턴스(`ted-mcp-servers`) 생성 및 고정 IP 연결
- [ ] 방화벽에 HTTPS(443) 포트 추가
- [ ] DNS A 레코드 (`apps.yourdomain.com`) → 고정 IP 설정
- [ ] Node.js + pnpm + PM2 설치
- [ ] Nginx 설치 및 기본 설정
- [ ] Let's Encrypt 인증서 발급 및 자동 갱신 확인

**앱별 (Ladder Pick 및 이후 추가 앱마다)**:
- [ ] 코드 배포 (`git clone → pnpm install → pnpm build`)
- [ ] PM2로 앱 프로세스 등록 (`PORT=<포트> pm2 start`)
- [ ] Nginx location 블록 추가 → `sudo nginx -s reload`
- [ ] `GET /<app-path>/` 헬스체크 200 응답 확인
- [ ] `POST /<app-path>/mcp` tools/list 정상 반환 확인
- [ ] CORS 헤더 포함 여부 확인 (`Access-Control-Allow-Origin: *`)
- [ ] CSP 헤더 설정 확인
- [ ] ChatGPT 커넥터 URL 설정 (예: `https://apps.yourdomain.com/ladder-pick/mcp`)
- [ ] ChatGPT Developer Mode에서 배포 서버로 재테스트 (웹 + 모바일)

### 6. 디렉터리 제출 준비
- **개인(individual) 검증**: `platform.openai.com/settings/organization/general` → Identity verification 완료 확인
- **Owner 권한**: 앱 제출에는 조직의 Owner 역할 필요
- **프라이버시 정책** 작성 완료(`docs/privacy-policy.md`) → 웹에 호스팅 후 URL 준비
- **테스트 프롬프트/기대 결과** 문서화 완료(`docs/test-prompts.md`)
- **앱 아이콘** 준비 완료(`assets/ladder-pick-icon.png`, 2048×2048px PNG)
- **제출 자료(영어)**:
  - App name: Ladder Pick
  - Logo/아이콘: `assets/ladder-pick-icon.png`
  - Description (한 줄 + 상세)
  - Privacy policy URL (웹 호스팅 필요)
  - MCP server URL: `https://apps.yourdomain.com/ladder-pick/mcp`
  - Tool annotation 정당성 설명 (readOnlyHint/destructiveHint/openWorldHint 각 툴별)
  - 스크린샷(웹/모바일)
  - 테스트 프롬프트 + 기대 응답 (`docs/test-prompts.md` 참고)
  - 지원 국가 설정
- **EU 데이터 레지던시 제약**: EU data residency 프로젝트에서는 제출 불가, global data residency 프로젝트 사용 필요

### 7. 제출 → 리뷰 대응 → Publish
- OpenAI Platform Dashboard(`platform.openai.com/apps-manage`)에서 "Submit for review"
- 심사 중 상태 확인: 대시보드 + 이메일 알림
- **주요 반려 사유 대비**:
  - MCP 서버 접속 불가(URL 오류 등, 인증 없으므로 크리덴셜 이슈는 없음)
  - 테스트 케이스 결과 불일치(웹/모바일 모두 확인)
  - tool hint annotation 불일치
  - 프라이버시 정책에 미공개된 사용자 데이터 반환
  - 불필요한 PII/내부 식별자가 응답에 포함
- 승인 후 대시보드에서 **Publish** 클릭 → App Directory에 노출
- 이후 업데이트 시 새 버전 드래프트 → 재제출/재심사

## 테스트 계획

### 기능 테스트
- **재현성**: 동일 seed → 동일 mapping
- **무결성**: 중복 매칭 없음(1:1)
- **입력 검증(에러 반환)**:
  - players < 2 → 에러
  - items 개수 ≠ players 개수 → 에러 (자동 보정 안 함)
  - items 비어있음 → 에러
  - 이름 중복/공백/이모지/특수문자 → 정규화 후 처리
- **UX**:
  - one-by-one 모드에서 reveal_next가 상태를 올바르게 진행
  - reshuffle 시 seed와 결과가 바뀌는지

### 위젯 테스트
- **Standalone 모드**: 브라우저에서 `ladder-widget.html` 직접 열어 기본 동작 확인
- iframe 내에서 콘솔 에러 없이 렌더링
- 위젯 상태 복원(tool-result 알림 수신 후 UI 갱신)
- ChatGPT에서 게임 생성 시 Input 카드의 Players/Items가 서버 결과로 동기화되는지 확인
- Canvas 사다리 렌더링 정상 여부 (수직선, 가로 발판, 색깔별 경로, 시작점/도착점 뱃지)
- 에러 메시지 인라인 표시
- 모바일 레이아웃 정상 동작

### Regression 체크리스트(공식 문서 기반)
- 골든 프롬프트에서 올바른 툴 선택/인수 전달
- 네거티브 프롬프트에서 불필요하게 트리거되지 않음
- structuredContent가 선언된 스키마와 일치
- 미사용 프로토타입 툴이 남아있지 않음

## 제출/운영 관점 체크리스트
- **권한 최소화**: 외부 데이터 접근 없음, 인증 불필요
- **hint annotation 정확성**: 실제 동작과 hint 일치 재확인(심사 반려 1순위)
- **데이터 최소화**: 사용자 입력(players/items)만 처리, 응답에 PII/내부 식별자/토큰 포함하지 않기
- **CSP 정의**: MCP 서버에서 Content Security Policy 설정(제출 필수)
- **프라이버시 정책**: 수집/처리하는 모든 데이터 카테고리를 영어로 명시
- **지역/플랜 이슈**: Connect 버튼이 비활성화될 수 있음을 가정하고 안내 문구 준비
- **공개 전 언론 조율**: 런칭 관련 공개 발표 시 사전에 press@openai.com 연락 필요

## 백로그(선택 확장)
- "제약 매칭"(A는 B와 매칭 금지 등)
- 다국어 지원(한국어 등)
- 팀/워크스페이스용 공유 링크
- 다양한 게임 모드(벌칙/역할 등)
- React 기반 위젯 전환(복잡도 증가 시)
- 수익화(Agentic Commerce Protocol 연동)
- 사다리 애니메이션 속도 조절 옵션
- 최대 플레이어 수 확장 (현재 20명 상한)

## 개발 산출물(완료 정의)

### 완료된 항목 ✅
- MCP 서버 구현 완료 (4개 툴: create_game, reshuffle, reveal_next, export_result)
- Canvas 기반 인터랙티브 위젯 구현 완료 (사다리 시각화 + 경로 애니메이션)
- Standalone 모드 구현 완료 (MCP 서버 없이 브라우저에서 직접 테스트 가능)
- MCP Inspector로 모든 툴 정상 동작 확인
- 프라이버시 정책(`docs/privacy-policy.md`) 작성 완료
- 테스트 프롬프트(`docs/test-prompts.md`) 작성 완료
- 앱 아이콘(`assets/ladder-pick-icon.png`, 2048×2048px) 생성 완료

### 남은 항목
- ngrok + Developer Mode에서 ChatGPT 웹/모바일 앱 테스트 통과
- AWS Lightsail 멀티 앱 서버 배포 완료 (Nginx 경로 기반 라우팅 + Let's Encrypt HTTPS)
- CSP 헤더 설정 (`src/server.ts`에 추가)
- 프라이버시 정책 웹 호스팅 (URL 준비)
- OpenAI Identity verification 완료 (`platform.openai.com/settings/organization/general`)
- App Directory 제출 및 승인
