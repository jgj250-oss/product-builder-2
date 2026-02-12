document.addEventListener('DOMContentLoaded', () => {
    const allergyList = [
        "난류", "우유", "메밀", "땅콩", "대두", "밀", "고등어", "게", "새우", "돼지고기", 
        "복숭아", "토마토", "아황산류", "호두", "닭고기", "쇠고기", "오징어", "조개류", "잣", "전복",
        "굴", "홍합", "깨", "연어", "망고", "키위", "셀러리", "겨자", "루핀", "연체동물"
    ];

    const allergyContainer = document.getElementById('allergy-list');
    allergyList.forEach(item => {
        const label = document.createElement('label');
        label.style.display = 'flex';
        label.style.alignItems = 'center';
        label.style.gap = '5px';
        label.style.fontSize = '0.85rem';
        label.innerHTML = `<input type="checkbox" value="${item}"> ${item}`;
        allergyContainer.appendChild(label);
    });

    const generateBtn = document.getElementById('generate-plan');
    generateBtn.addEventListener('click', generateDietPlan);

    function generateDietPlan() {
        const gender = document.getElementById('gender').value;
        const age = document.getElementById('age').value;
        const height = document.getElementById('height').value;
        const weight = document.getElementById('weight').value;
        const country = document.getElementById('country').value;
        const goal = document.getElementById('goal').value;

        if (!age || !height || !weight) {
            alert('모든 기본 정보를 입력해주세요!');
            return;
        }

        const selectedAllergies = Array.from(document.querySelectorAll('#allergy-list input:checked')).map(cb => cb.value);
        
        // 로딩 효과
        generateBtn.textContent = 'AI가 최적의 식단을 계산 중...';
        generateBtn.disabled = true;

        setTimeout(() => {
            renderResult(gender, age, height, weight, country, goal, selectedAllergies);
            generateBtn.textContent = '맞춤형 일주일 식단 생성하기';
            generateBtn.disabled = false;
        }, 1500);
    }

    function renderResult(gender, age, height, weight, country, goal, allergies) {
        const resultDiv = document.getElementById('diet-result');
        resultDiv.style.display = 'block';
        
        // 기초대사량(BMR) 계산 (Mifflin-St Jeor 공식)
        let bmr = (10 * weight) + (6.25 * height) - (5 * age);
        bmr = (gender === 'male') ? bmr + 5 : bmr - 161;
        
        const goalTexts = {
            diet: "체중 감량 및 체지방 연소",
            muscle: "근성장 및 근력 증진",
            liver: "간 수치 개선 및 해독",
            study: "두뇌 활성화 및 집중력 향상",
            general: "균형 잡힌 건강 관리"
        };

        const countryTexts = {
            korean: "한식 (Korean)",
            mediterranean: "지중해식 (Mediterranean)",
            japanese: "일식 (Japanese)",
            western: "서양식 (Western)"
        };

        let html = `
            <div class="form-container" style="margin-top: 30px; border-top: 4px solid #ff9a9e;">
                <h2 style="text-align: center; color: #ff9a9e;">🗓️ 일주일 맞춤 식단 보고서</h2>
                <div style="background: rgba(0,0,0,0.05); padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                    <p><strong>분석 결과:</strong> 귀하의 일일 기초대사량은 약 <strong>${Math.round(bmr)} kcal</strong>입니다.</p>
                    <p><strong>목표:</strong> ${goalTexts[goal]} | <strong>선호 스타일:</strong> ${countryTexts[country]}</p>
                    ${allergies.length > 0 ? `<p style="color: #ff6b6b;"><strong>⚠️ 제외 알러지:</strong> ${allergies.join(', ')}</p>` : ''}
                </div>
                
                <div class="diet-grid" style="display: grid; gap: 20px;">
        `;

        const days = ["월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"];
        
        days.forEach(day => {
            html += `
                <div style="padding: 15px; border: 1px solid var(--border-color); border-radius: 15px; background: var(--form-bg);">
                    <h4 style="margin-top: 0; color: #fda085; border-bottom: 1px solid var(--border-color); padding-bottom: 5px;">${day}</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; font-size: 0.9rem;">
                        <div><strong>아침:</strong><br>${getMeal(country, goal, 'breakfast')}</div>
                        <div><strong>점심:</strong><br>${getMeal(country, goal, 'lunch')}</div>
                        <div><strong>저녁:</strong><br>${getMeal(country, goal, 'dinner')}</div>
                    </div>
                </div>
            `;
        });

        html += `
                </div>
                <div class="tip-box" style="margin-top: 30px;">
                    <span class="tip-title">💡 전문가의 건강 조언</span>
                    <p style="font-size: 0.95rem; line-height: 1.6;">${getHealthTip(goal)}</p>
                </div>
            </div>
        `;

        resultDiv.innerHTML = html;
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    }

    function getMeal(country, goal, time) {
        // 간단한 예시 데이터 (실제 서비스에서는 더 방대한 DB 필요)
        const meals = {
            korean: {
                diet: ["현미밥, 나물무침", "닭가슴살 샐러드", "두부구이, 현미밥"],
                muscle: ["소불고기, 흰쌀밥", "닭가슴살 볶음밥", "고등어구이, 단백질 쉐이크"],
                liver: ["재첩국, 채소 비빔밥", "복지리탕 (맑은국)", "청국장, 잡곡밥"],
                study: ["견과류 멸치볶음, 잡곡밥", "연어구이, 채소쌈", "전복죽"]
            },
            mediterranean: {
                diet: ["그릭 요거트, 베리류", "병아리콩 샐러드", "구운 생선과 채소"],
                muscle: ["오트밀, 계란", "그릴드 치킨 피타", "스테이크 샐러드"],
                liver: ["올리브유 샐러드", "렌틸콩 스프", "구운 연어"],
                study: ["견과류, 과일", "통곡물 샌드위치", "해산물 파스타"]
            }
        };

        const style = meals[country] || meals['korean'];
        const type = style[goal] || style['diet'];
        return type[Math.floor(Math.random() * type.length)];
    }

    function getHealthTip(goal) {
        const tips = {
            diet: "다이어트 시에는 단백질 섭취를 늘리고 탄수화물을 줄이는 것이 중요하지만, 통곡물 위주의 복합 탄수화물은 적당량 섭취해야 요요 현상을 방지할 수 있습니다. 수분 섭취를 하루 2L 이상 유지하세요.",
            muscle: "근성장을 위해서는 강도 높은 운동 후 30분 이내에 단백질을 섭취하는 것이 좋습니다. 또한 충분한 수면(7-8시간)이 근육 세포 재생의 핵심입니다.",
            liver: "간 건강을 위해서는 술, 과당, 가공식품을 멀리해야 합니다. 브로콜리, 양배추 같은 십자화과 채소는 간의 해독 작용을 돕는 성분이 풍부합니다.",
            study: "뇌는 포도당을 유일한 에너지원으로 사용합니다. 급격한 혈당 상승을 피하기 위해 현미나 통밀 같은 거친 음식을 드시고, 오메가-3가 풍부한 등푸른 생선과 견과류를 챙겨 드세요."
        };
        return tips[goal] || "균형 잡힌 식단과 꾸준한 운동은 건강의 기본입니다. 스트레스를 줄이고 규칙적인 식습관을 가지세요.";
    }

    // Theme Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    if (localStorage.getItem('theme') === 'light') body.classList.add('light-mode');

    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        localStorage.setItem('theme', body.classList.contains('light-mode') ? 'light' : 'dark');
    });
});