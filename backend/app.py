import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from groq import Groq
from dotenv import load_dotenv

# .env 파일에서 환경 변수 로드
load_dotenv()

app = Flask(__name__)
# 프론트엔드からの 모든 출처에서의 요청을 허용
CORS(app) 

# Groq 클라이언트 초기화
# API 키는 환경 변수 'GROQ_API_KEY'에서 자동으로 로드됩니다.
try:
    groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
    print("Groq client initialized successfully.")
except Exception as e:
    groq_client = None
    print(f"Error initializing Groq client: {e}")

# 대상별 프롬프트 정의
SYSTEM_PROMPTS = {
    "상사": "당신은 상사에게 보고하는 어조로 텍스트를 변환하는 전문 비즈니스 커뮤니케이션 어시스턴트입니다. 정중하고 격식 있으며, 결론부터 명확하게 제시하는 보고 형식으로 변환해 주세요.",
    "타팀 동료": "당신은 타팀 동료와 협업하는 어조로 텍스트를 변환하는 전문 비즈니스 커뮤니케이션 어시스턴트입니다. 친절하고 상호 존중하며, 요청 사항과 마감 기한을 명확히 전달하는 협조 요청 형식으로 변환해 주세요.",
    "고객": "당신은 고객에게 응대하는 어조로 텍스트를 변환하는 전문 비즈니스 커뮤니케이션 어시스턴트입니다. 극존칭을 사용하고, 전문성과 서비스 마인드를 강조하며, 안내, 공지, 사과 등의 목적에 부합하는 형식으로 변환해 주세요.",
}

@app.route('/api/convert', methods=['POST'])
def convert_text():
    """
    텍스트 변환을 위한 API 엔드포인트.
    Groq AI API를 사용하여 실제 텍스트 변환을 수행합니다.
    """
    data = request.json
    original_text = data.get('text')
    target = data.get('target')

    if not original_text or not target:
        return jsonify({"error": "텍스트와 변환 대상은 필수입니다."}), 400

    if groq_client is None:
        return jsonify({"error": "Groq 클라이언트가 초기화되지 않았습니다. API 키를 확인해 주세요."}), 500

    system_prompt = SYSTEM_PROMPTS.get(target)
    if not system_prompt:
        return jsonify({"error": "유효하지 않은 변환 대상입니다."}), 400

    try:
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": system_prompt,
                },
                {
                    "role": "user",
                    "content": original_text,
                }
            ],
            model="moonshotai/kimi-k2-instruct-0905",  # PRD에 명시된 모델 사용
            temperature=0.7, # 창의적인 응답을 위해 조정
            max_tokens=500, # 최대 토큰 설정
        )
        converted_text = chat_completion.choices[0].message.content
        
        response_data = {
            "original_text": original_text,
            "converted_text": converted_text,
            "target": target
        }
        return jsonify(response_data)

    except Exception as e:
                print(f"Error during Groq API call: {e}")
                return jsonify({"error": f"텍스트 변환 중 오류가 발생했습니다: {str(e)}"}), 500
        