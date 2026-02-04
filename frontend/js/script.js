document.addEventListener('DOMContentLoaded', () => {
    const originalTextarea = document.getElementById('original-text');
    const currentCharCountSpan = document.getElementById('current-char-count');
    const targetSelectionRadios = document.querySelectorAll('input[name="target"]');
    const convertButton = document.getElementById('convert-button');
    const convertedTextDisplay = document.getElementById('converted-text-display');
    const copyButton = document.getElementById('copy-button');
    const feedbackButtons = document.querySelectorAll('.feedback-btn');

    const MAX_CHARS = 500;
    const API_ENDPOINT = '/api/convert'; // 백엔드 API 엔드포인트

    // 1. 글자 수 카운터 업데이트
    originalTextarea.addEventListener('input', () => {
        const currentLength = originalTextarea.value.length;
        currentCharCountSpan.textContent = currentLength;
        // 최대 글자 수 초과 시 경고 (HTML maxlength 속성으로도 제한되지만, 시각적 피드백 제공)
        if (currentLength > MAX_CHARS) {
            originalTextarea.value = originalTextarea.value.substring(0, MAX_CHARS);
            currentCharCountSpan.textContent = MAX_CHARS;
        }
    });

    // 2. 변환하기 버튼 클릭 이벤트
    convertButton.addEventListener('click', async () => {
        const originalText = originalTextarea.value.trim();
        let selectedTarget = '';
        targetSelectionRadios.forEach(radio => {
            if (radio.checked) {
                selectedTarget = radio.value;
            }
        });

        if (!originalText) {
            alert('변환할 텍스트를 입력해주세요.');
            return;
        }
        if (!selectedTarget) {
            alert('변환 대상을 선택해주세요.');
            return;
        }

        // 로딩 상태 시작
        convertButton.disabled = true;
        convertButton.textContent = '변환 중...';
        convertedTextDisplay.textContent = '변환 중입니다. 잠시만 기다려주세요...';
        copyButton.disabled = true; // 복사 버튼 비활성화

        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: originalText, target: selectedTarget }),
            });

            const data = await response.json();

            if (response.ok) {
                convertedTextDisplay.textContent = data.converted_text;
                copyButton.disabled = false; // 성공 시 복사 버튼 활성화
            } else {
                // PRD FR-05: API 응답 지연 또는 실패 시 오류 메시지 표시
                convertedTextDisplay.textContent = `오류 발생: ${data.error || '알 수 없는 오류가 발생했습니다.'}`;
                alert(`변환 실패: ${data.error || '서버 응답 오류'}`);
            }
        } catch (error) {
            // PRD FR-05: 네트워크 오류 등 예외 처리
            console.error('Fetch Error:', error);
            convertedTextDisplay.textContent = '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
            alert('네트워크 오류가 발생했습니다.');
        } finally {
            // 로딩 상태 종료
            convertButton.disabled = false;
            convertButton.textContent = '변환하기';
        }
    });

    // 3. 복사하기 버튼 클릭 이벤트 (PRD FR-03)
    copyButton.addEventListener('click', async () => {
        const textToCopy = convertedTextDisplay.textContent;
        try {
            await navigator.clipboard.writeText(textToCopy);
            alert('변환된 텍스트가 클립보드에 복사되었습니다!'); // PRD FR-03: 시각적 피드백
        } catch (err) {
            console.error('클립보드 복사 실패:', err);
            alert('텍스트 복사에 실패했습니다. 수동으로 복사해주세요.');
        }
    });

    // 4. 피드백 버튼 클릭 이벤트 (PRD FR-06)
    feedbackButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const feedbackType = event.target.dataset.feedback;
            const convertedText = convertedTextDisplay.textContent;
            
            if (convertedText === '변환된 텍스트가 여기에 표시됩니다.' || convertedText.startsWith('오류 발생:')) {
                alert('유효한 변환 결과가 없습니다.');
                return;
            }

            // 실제 피드백 전송 로직은 Sprint 3/4에서 구현
            console.log(`피드백 전송: ${feedbackType}, 변환 텍스트: "${convertedText}"`);
            alert(`피드백 감사합니다! (${feedbackType})`);
            // UI적으로 피드백 버튼 비활성화 또는 상태 변경 가능
        });
    });
});