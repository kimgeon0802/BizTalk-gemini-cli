### 프로젝트 개요
"BizTone Converter"는 일반적인 한국어 텍스트를 상사, 동료, 고객과 같은 특정 대상에 맞춰 전문적인 비즈니스 언어로 변환하도록 설계된 AI 기반 웹 솔루션입니다. Flask 백엔드는 텍스트 변환을 위해 Groq AI API와 통합되며, HTML, Tailwind CSS 및 JavaScript로 구축된 프론트엔드는 직관적인 사용자 인터페이스를 제공합니다. 이 프로젝트는 명확한 커뮤니케이션, 효율성, 그리고 비즈니스 커뮤니케이션 표준 준수를 강조합니다.

**주요 기술:**
*   **프론트엔드:** HTML5, Tailwind CSS (CDN 경유), JavaScript (ES6+)
*   **백엔드:** Python 3.11, Flask (RESTful API), `python-dotenv`, `Flask-CORS`
*   **AI:** Groq AI API (`moonshotai/kimi-k2-instruct-0905` 모델)
*   **배포:** Vercel (예정)
*   **버전 관리:** Git, GitHub

### 아키텍처
이 프로젝트는 명확한 관심사 분리를 통해 모듈식 클라이언트-서버 아키텍처를 따릅니다:
*   **프론트엔드:** 정적 웹 애플리케이션은 사용자 상호작용, 입력 수집 및 변환 결과 표시를 처리합니다. RESTful API를 통해 백엔드와 통신합니다.
*   **백엔드:** Flask 애플리케이션은 정적 프론트엔드 파일을 제공하고 텍스트 변환을 위한 API 엔드포인트(`api/convert`)를 노출합니다. 사용자 요청을 처리하고, 대상별 프롬프트를 구성하며, Groq AI API와 상호작용하여 변환된 텍스트를 반환합니다.

### 빌드 및 실행

**전제 조건:**
*   Python 3.11+
*   Node.js (빌드 단계가 도입될 경우 프론트엔드 개발용, 현재는 Tailwind CSS CDN 사용)
*   Groq API 키 (`.env` 파일에 저장)

**1. 백엔드 설정:**
*   **가상 환경 생성 및 활성화:**
    ```bash
    python -m venv .venv
    # Windows의 경우:
    .venv\Scripts\activate
    # macOS/Linux의 경우:
    source .venv/bin/activate
    ```
*   **Python 종속성 설치:**
    ```bash
    pip install -r backend/requirements.txt
    ```
*   **프로젝트 루트에 `.env` 파일 생성:**
    ```
    GROQ_API_KEY="YOUR_GROQ_API_KEY"
    ```
    `"YOUR_GROQ_API_KEY"`를 실제 Groq API 키로 대체하세요.
*   **Flask 백엔드 서버 실행:**
    ```bash
    python backend/app.py
    ```
    서버는 `http://127.0.0.1:5000`에서 실행됩니다 (기본값).

**2. 프론트엔드:**
프론트엔드는 Flask 백엔드에 의해 직접 제공됩니다. 현재 Tailwind CSS CDN을 사용하므로 별도의 빌드 단계는 필요하지 않습니다.

**3. 애플리케이션 접속:**
백엔드 서버가 실행되면 웹 브라우저를 열고 `http://127.0.0.1:5000`으로 이동합니다.

### 개발 규칙
*   **코딩 스타일:** Python (Flask 및 일반적인 관행에 따라 PEP 8 준수), HTML5, JavaScript (ES6+).
*   **버전 관리:** Pull Request를 통한 코드 리뷰가 필수적인 Git Flow (main, develop, feature 브랜치 전략).
*   **환경 변수:** API 키와 같은 민감한 정보는 `.env` 파일을 통해 관리되며 서버 측에서만 접근 가능합니다.
*   **UI/UX:** 반응형 디자인으로 직관적이고 전문적이며 효율적인 사용자 경험에 중점을 둡니다.
*   **API 상호작용:** 프론트엔드는 Flask 백엔드와의 비동기 통신을 위해 Fetch API를 사용합니다.

### 프로젝트 구조
```
.
├── .env                  # 환경 변수 (예: GROQ_API_KEY)
├── .gitignore            # 추적하지 않을 파일 및 디렉토리 지정
├── PRD.md                # 제품 요구사항 문서
├── 프로그램개요서.md       # 프로젝트 개요 문서
├── backend/              # Flask 백엔드 애플리케이션
│   ├── app.py            # Groq API 통합이 포함된 주요 Flask 애플리케이션
│   └── requirements.txt  # Python 종속성
├── frontend/             # 정적 프론트엔드 파일
│   ├── index.html        # Tailwind CSS가 적용된 주요 HTML 파일
│   └── js/               # JavaScript 로직
│       └── script.js     # API 호출, DOM 조작을 위한 클라이언트 측 로직
└── .venv/                # Python 가상 환경