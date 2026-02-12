const API_KEY = '879bd560d1bf4d34971e7541d8d8d748';

document.addEventListener('DOMContentLoaded', () => {
    const translations = {
        ko: { 
            title: "VitalPlate", subtitle: "BMI 분석 기반 AI 맞춤형 식단 솔루션", step1: "1. 정보 입력", step2: "2. 알러지", btn: "AI 맞춤 식단 생성", 
            recipeTitle: "식단 상세 정보", breakfast: "☀️ 아침 식단", lunch: "🌤️ 점심 식단", dinner: "🌙 저녁 식단", close: "닫기", 
            reportTitle: "분석 리포트 및 맞춤 식단", clickTip: "* 각 음식을 클릭하면 영양 성분과 레시피를 확인합니다.",
            bmiLabel: "나의 BMI 수치", statusLabel: "상태", targetCal: "추천 일일 섭취량",
            underweight: "저체중", normal: "정상", overweight: "과체중", obese: "비만",
            loading: "신체 정보를 분석하여 최적의 식단을 조합 중...", error: "분석 실패. 다시 시도해주세요."
        },
        en: { 
            title: "VitalPlate", subtitle: "BMI-Based AI Nutrition Solution", step1: "1. Info", step2: "2. Allergy", btn: "Generate Personal Plan", 
            recipeTitle: "Meal Details", breakfast: "☀️ Breakfast", lunch: "🌤️ Lunch", dinner: "🌙 Dinner", close: "Close", 
            reportTitle: "Analysis & Meal Plan", clickTip: "* Click on a meal for details.",
            bmiLabel: "Your BMI", statusLabel: "Status", targetCal: "Recommended Daily Intake",
            underweight: "Underweight", normal: "Normal", overweight: "Overweight", obese: "Obese",
            loading: "Analyzing body info and composing meals...", error: "Failed to fetch data."
        }
    };

    let currentLang = 'ko';
    const langSelect = document.getElementById('language-select');
    langSelect.addEventListener('change', (e) => { currentLang = e.target.value; updateUILanguage(); });

    function updateUILanguage() {
        const t = translations[currentLang] || translations['ko'];
        document.getElementById('txt-title').textContent = t.title;
        document.getElementById('txt-subtitle').textContent = t.subtitle;
        document.getElementById('txt-step1').textContent = t.step1;
        document.getElementById('txt-step2').textContent = t.step2;
        document.getElementById('generate-plan').textContent = t.btn;
    }

    const allergyMap = { "난류": "egg", "우유": "dairy", "메밀": "wheat", "땅콩": "peanut", "대두": "soy", "밀": "wheat", "고등어": "seafood", "게": "shellfish", "새우": "shellfish", "돼지고기": "pork", "복숭아": "fruit", "토마토": "nightshade" };
    const allergyContainer = document.getElementById('allergy-list');
    Object.keys(allergyMap).forEach(item => {
        const label = document.createElement('label');
        label.className = 'allergy-item';
        label.innerHTML = `<input type="checkbox" value="${allergyMap[item]}"> ${item}`;
        allergyContainer.appendChild(label);
    });

    document.getElementById('generate-plan').addEventListener('click', async () => {
        const t = translations[currentLang] || translations['ko'];
        const age = parseInt(document.getElementById('age').value);
        const height = parseInt(document.getElementById('height').value);
        const weight = parseInt(document.getElementById('weight').value);
        const gender = document.getElementById('gender').value;
        const country = document.getElementById('country').value;
        const goal = document.getElementById('goal').value;

        if (!age || !height || !weight) { alert('Check inputs!'); return; }

        const generateBtn = document.getElementById('generate-plan');
        generateBtn.textContent = t.loading;
        generateBtn.disabled = true;

        // 1. BMI 및 TDEE 계산
        const bmi = (weight / ((height / 100) ** 2)).toFixed(1);
        let bmr = (10 * weight) + (6.25 * height) - (5 * age);
        bmr = (gender === 'male') ? bmr + 5 : bmr - 161;
        let tdee = bmr * 1.375; // 평균 활동량 기준

        let targetCalories = tdee;
        if (goal === 'diet') targetCalories -= 500;
        if (goal === 'muscle') targetCalories += 500;

        const selectedIntolerances = Array.from(document.querySelectorAll('#allergy-list input:checked')).map(cb => cb.value).join(',');
        
        try {
            // 메인 요리 검색 (단백질 중심)
            const mainQuery = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&cuisine=${getCC(country)}&type=main course&intolerances=${selectedIntolerances}&number=14&addRecipeInformation=true&fillIngredients=true&minProtein=${goal === 'muscle' ? 25 : 15}`;
            // 사이드 및 국물 요리 검색
            const sideQuery = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&cuisine=${getCC(country)}&type=side dish,salad,soup&intolerances=${selectedIntolerances}&number=14&addRecipeInformation=true`;

            const [mainRes, sideRes] = await Promise.all([fetch(mainQuery), fetch(sideQuery)]);
            const mainData = await mainRes.json();
            const sideData = await sideRes.json();

            renderImprovedResult(mainData.results, sideData.results, bmi, targetCalories, t);
        } catch (error) {
            alert(t.error);
        } finally {
            generateBtn.textContent = t.btn;
            generateBtn.disabled = false;
        }
    });

    function getCC(c) {
        const m = { korean: 'Korean', japanese: 'Japanese', chinese: 'Chinese', mediterranean: 'Mediterranean', western: 'European' };
        return m[c] || 'Korean';
    }

    function renderImprovedResult(mains, sides, bmi, targetCal, t) {
        const resultDiv = document.getElementById('diet-result');
        resultDiv.style.display = 'block';
        
        let status = t.normal;
        let color = "#4caf50";
        if (bmi < 18.5) { status = t.underweight; color = "#2196f3"; }
        else if (bmi >= 25 && bmi < 30) { status = t.overweight; color = "#ff9800"; }
        else if (bmi >= 30) { status = t.obese; color = "#f44336"; }

        let html = `
            <div class="form-container result-card" style="margin-top: 30px; border-top: 8px solid ${color};">
                <div style="display: flex; justify-content: space-around; align-items: center; background: rgba(0,0,0,0.03); padding: 20px; border-radius: 15px; margin-bottom: 30px;">
                    <div style="text-align:center;">
                        <small>${t.bmiLabel}</small>
                        <div style="font-size: 2rem; font-weight: 800; color: ${color};">${bmi}</div>
                    </div>
                    <div style="text-align:center;">
                        <small>${t.statusLabel}</small>
                        <div style="font-size: 1.2rem; font-weight: 700;">${status}</div>
                    </div>
                    <div style="text-align:center;">
                        <small>${t.targetCal}</small>
                        <div style="font-size: 1.2rem; font-weight: 700;">${Math.round(targetCal)} kcal</div>
                    </div>
                </div>

                <h2 style="text-align: center; margin-bottom: 20px;">🗓️ ${t.reportTitle}</h2>
                <div class="diet-grid">
        `;

        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        days.forEach((day, i) => {
            const morning = { main: mains[i] || mains[0], side: sides[i] || sides[0] };
            const evening = { main: mains[i+7] || mains[1], side: sides[i+7] || sides[1] };

            html += `
                <div class="day-card" style="background: var(--form-bg);">
                    <h4 style="background: ${color}; color: white; padding: 5px 15px; border-radius: 10px; display: inline-block;">${day}</h4>
                    <div class="meal-time">
                        <div class="meal-box" onclick="openFullRecipe(${morning.main.id})">
                            <div class="meal-tag">${t.breakfast}</div>
                            <img src="${morning.main.image}" class="meal-img">
                            <div class="meal-name">${morning.main.title}</div>
                            <div class="meal-side">+ ${morning.side.title}</div>
                        </div>
                        <div class="meal-box" onclick="openFullRecipe(1003)"> <!-- 가상의 건강식 덮밥 -->
                            <div class="meal-tag">${t.lunch}</div>
                            <div class="meal-name">Healthy Grain Bowl with Protein</div>
                            <div class="meal-side">+ Fresh Garden Salad</div>
                        </div>
                        <div class="meal-item api-meal" onclick="openFullRecipe(${evening.main.id})">
                            <div class="meal-tag">${t.dinner}</div>
                            <img src="${evening.main.image}" class="meal-img">
                            <div class="meal-name">${evening.main.title}</div>
                            <div class="meal-side">+ ${evening.side.title}</div>
                        </div>
                    </div>
                </div>`;
        });

        html += `</div></div>`;
        resultDiv.innerHTML = html;
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    }

    window.openFullRecipe = async function(recipeId) {
        // ... 기존 코드와 동일 (영양 성분 표시 포함)
        try {
            const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}&includeNutrition=true`);
            const recipe = await response.json();
            const modal = document.createElement('div');
            modal.className = 'recipe-modal';
            const nutrition = recipe.nutrition.nutrients.filter(n => ['Calories', 'Protein', 'Fat', 'Carbohydrates'].includes(n.name));
            let nHtml = nutrition.map(n => `<li><strong>${n.name}:</strong> ${n.amount}${n.unit}</li>`).join('');

            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-btn" onclick="this.parentElement.parentElement.remove()">&times;</span>
                    <h2 style="color: #ff9a9e;">🍳 ${recipe.title}</h2>
                    <img src="${recipe.image}" style="width: 100%; border-radius: 15px; margin: 15px 0;">
                    <div class="nutrition-card" style="background: #fdf2f2; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                        <ul style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding:0; list-style:none;">${nHtml}</ul>
                    </div>
                    <div style="font-size: 1rem; line-height:1.6;">${recipe.instructions || 'Detailed instructions at: <a href="'+recipe.sourceUrl+'" target="_blank">View Site</a>'}</div>
                </div>`;
            document.body.appendChild(modal);
        } catch(e) {}
    };
});