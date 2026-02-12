document.addEventListener('DOMContentLoaded', () => {
    const allergyList = [
        "난류", "우유", "메밀", "땅콩", "대두", "밀", "고등어", "게", "새우", "돼지고기", 
        "복숭아", "토마토", "아황산류", "호두", "닭고기", "쇠고기", "오징어", "조개류", "잣", "전복",
        "굴", "홍합", "깨", "연어", "망고", "키위", "셀러리", "겨자", "루핀", "연체동물"
    ];

    const mealDatabase = {
        korean: {
            diet: ["곤약 비빔밥", "닭가슴살 채소쌈", "두부 면 파스타", "오이 소박이와 현미밥", "청경채 버섯볶음", "무생채와 보리밥", "구운 고구마와 저지방 우유"],
            muscle: ["소고기 사태찜", "닭다리살 구이", "돼지 안심 장조림", "오징어 숙회", "고등어 자반 구이", "계란 흰자 찜", "콩자반과 잡곡밥"],
            liver: ["재첩국", "올갱이 해장국", "쑥국", "미나리 무침", "냉이 된장국", "브로콜리 두부무침", "양배추 쌈"],
            study: ["전복죽", "견과류 멸치볶음", "연어 데리야끼", "계란말이", "블루베리 샐러드", "시금치 나물", "소고기 미역국"]
        },
        mediterranean: {
            diet: ["그릭 요거트와 견과류", "병아리콩 샐러드", "구운 토마토와 발사믹", "허브 생선 구이", "퀴노아 샐러드", "아보카도 토스트", "렌틸콩 스프"],
            muscle: ["그릴드 치킨과 쿠스쿠스", "참치 타다끼", "양고기 스테이크", "치즈 오믈렛", "연어 스테이크", "통곡물 파스타와 조개", "터키 샌드위치"],
            liver: ["올리브유 야채 절임", "구운 아티초크", "마늘 레몬 연어구이", "후무스와 야채 스틱", "견과류 믹스", "바질 페스토 파스타", "과일 샐러드"],
            study: ["호두 정과", "블루베리 요거트", "연어 샐러드", "통밀 펜네 파스타", "구운 피스타치오", "석류 에이드", "닭가슴살 아보카도 롤"]
        },
        japanese: {
            diet: ["낫또 비빔밥", "미역 줄기 무침", "회 덮밥 (밥 적게)", "메밀 소바", "연두부 샐러드", "야채 우동", "무 조림"],
            muscle: ["참치 회", "닭고기 가라아게 (에어프라이어)", "장어 구이", "소고기 타다끼", "계란말이 (교쿠)", "생선 초밥", "돼지고기 샤브샤브"],
            liver: ["바지락 맑은 국", "문어 숙회", "삶은 콩 (에다마메)", "시금치 깨침", "구운 버섯", "대구 지리탕", "매실 장아찌"],
            study: ["전복 초밥", "구운 주먹밥 (오니기리)", "연어 오차즈케", "낫또", "고등어 미소 조림", "새우 튀김", "도미 구이"]
        },
        chinese: {
            diet: ["청경채 굴소스 볶음", "토마토 달걀 볶음", "목이버섯 무침", "두부 피 샐러드", "야채 탕면", "해물 누룽지탕 (야채위주)", "숙주 볶음"],
            muscle: ["양꼬치 구이", "고추잡채와 꽃빵", "유린기 (에어프라이어)", "팔보채", "동파육 (살코기)", "마파두부", "쇠고기 탕수육"],
            liver: ["산사차", "보이차", "전복 소스 청경채", "브로콜리 마늘 볶음", "해파리 냉채", "게살 스프", "버섯 덮밥"],
            study: ["잣죽", "호두 강정", "딤섬 (새우)", "계란 토마토 스프", "오향장육", "건두부 볶음", "완탕면"]
        },
        western: {
            diet: ["가든 샐러드", "콜리플라워 라이스", "치킨 브레스트 랩", "구운 아스파라거스", "야채 수프", "저지방 치즈 플레이트", "그릴드 베지터블"],
            muscle: ["뉴욕 스트립 스테이크", "칠리 콘 카르네", "치킨 알프레도 파스타", "치즈 버거 (번 제외)", "돼지 등심 구이", "프로틴 팬케이크", "로스트 비프"],
            liver: ["비트 레몬 주스", "자몽 샐러드", "아몬드 우유", "통밀 크래커", "구운 브로콜리", "시금치 스무디", "블루베리 오트밀"],
            study: ["다크 초콜릿", "연어 샌드위치", "계란 베이컨 머핀", "통밀 시리얼", "피넛 버터 토스트", "칠면조 슬라이스", "홈메이드 그래놀라"]
        }
    };

    const allergyContainer = document.getElementById('allergy-list');
    allergyList.forEach(item => {
        const label = document.createElement('label');
        label.className = 'allergy-item';
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
        
        generateBtn.textContent = 'AI가 수만 개의 조합을 분석 중...';
        generateBtn.disabled = true;

        setTimeout(() => {
            renderResult(gender, age, height, weight, country, goal, selectedAllergies);
            generateBtn.textContent = '맞춤형 일주일 식단 생성하기';
            generateBtn.disabled = false;
        }, 1200);
    }

    function renderResult(gender, age, height, weight, country, goal, allergies) {
        const resultDiv = document.getElementById('diet-result');
        resultDiv.style.display = 'block';
        
        let bmr = (10 * weight) + (6.25 * height) - (5 * age);
        bmr = (gender === 'male') ? bmr + 5 : bmr - 161;
        
        const goalTexts = { diet: "다이어트", muscle: "근성장", liver: "간 건강", study: "공부 집중력", general: "일반 건강" };
        const countryTexts = { korean: "한식", mediterranean: "지중해식", japanese: "일식", chinese: "중식", western: "서양식" };

        let html = `
            <div class="form-container result-card" style="margin-top: 30px; border-top: 5px solid #ff9a9e;">
                <h2 style="text-align: center; color: #ff9a9e; margin-bottom: 25px;">🗓️ 일주일 맞춤 건강 리포트</h2>
                <div class="info-summary" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px; background: rgba(0,0,0,0.03); padding: 20px; border-radius: 15px;">
                    <div><strong>기초대사량:</strong> ${Math.round(bmr)} kcal</div>
                    <div><strong>목표:</strong> ${goalTexts[goal]}</div>
                    <div><strong>추천 스타일:</strong> ${countryTexts[country]}</div>
                    <div><strong>주의 알러지:</strong> ${allergies.length > 0 ? allergies.join(', ') : '없음'}</div>
                </div>
                
                <p style="text-align: center; font-size: 0.9rem; color: #888; margin-bottom: 20px;">* 각 음식을 클릭하면 레시피와 영상을 볼 수 있습니다.</p>
                <div class="diet-grid">
        `;

        const days = ["월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"];
        
        days.forEach(day => {
            html += `
                <div class="day-card">
                    <h4>${day}</h4>
                    <div class="meal-time">
                        <div class="meal-item" onclick="showRecipe('${getMeal(country, goal)}')"><strong>☀️ 아침</strong><br><span>${getMeal(country, goal)}</span></div>
                        <div class="meal-item" onclick="showRecipe('${getMeal(country, goal)}')"><strong>🌤️ 점심</strong><br><span>${getMeal(country, goal)}</span></div>
                        <div class="meal-item" onclick="showRecipe('${getMeal(country, goal)}')"><strong>🌙 저녁</strong><br><span>${getMeal(country, goal)}</span></div>
                    </div>
                </div>
            `;
        });

        html += `
                </div>
                <div class="tip-box" style="margin-top: 30px;">
                    <span class="tip-title">💡 목표 달성을 위한 핵심 가이드</span>
                    <p style="font-size: 0.95rem; line-height: 1.6;">${getHealthTip(goal)}</p>
                </div>
            </div>
        `;

        resultDiv.innerHTML = html;
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    }

    function getMeal(country, goal) {
        const style = mealDatabase[country] || mealDatabase['korean'];
        const list = style[goal] || style['diet'];
        return list[Math.floor(Math.random() * list.length)];
    }

    function getHealthTip(goal) {
        const tips = {
            diet: "체중 감량의 핵심은 '당질 제한'과 '충분한 식이섬유'입니다. 식사 전 물 한 컵을 마시면 과식을 방지할 수 있습니다.",
            muscle: "근육 합성을 위해 끼니마다 단백질을 20-30g 포함하세요. 비타민 D와 마그네슘 섭취도 근기능 유지에 중요합니다.",
            liver: "간은 침묵의 장기입니다. 충분한 휴식과 함께 타우린이 풍부한 해산물, 비타민 B가 풍부한 채소를 자주 섭취하세요.",
            study: "두뇌 회전에는 오메가-3와 안토시아닌이 좋습니다. 혈당을 급격히 올리는 단 음식보다는 견과류 위주의 간식을 추천합니다."
        };
        return tips[goal] || "규칙적인 식습관이 건강의 첫걸음입니다.";
    }

    // Modal & Recipe Function
    window.showRecipe = function(foodName) {
        const modal = document.createElement('div');
        modal.className = 'recipe-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-btn" onclick="this.parentElement.parentElement.remove()">&times;</span>
                <h2>🍳 ${foodName} 레시피</h2>
                <div class="recipe-info">
                    <p>이 음식은 건강한 재료로 구성된 ${foodName}입니다. 아래 버튼을 눌러 유튜브에서 조리 과정을 직접 확인해보세요.</p>
                </div>
                <div class="video-container">
                    <iframe width="100%" height="315" src="https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(foodName + ' 레시피')}" frameborder="0" allowfullscreen></iframe>
                </div>
                <button class="submit-btn" style="margin-top:20px;" onclick="window.open('https://www.youtube.com/results?search_query=${encodeURIComponent(foodName + ' 레시피')}', '_blank')">유튜브에서 전체 결과 보기</button>
            </div>
        `;
        document.body.appendChild(modal);
    };

    // Theme Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    if (localStorage.getItem('theme') === 'light') body.classList.add('light-mode');

    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        localStorage.setItem('theme', body.classList.contains('light-mode') ? 'light' : 'dark');
    });
});