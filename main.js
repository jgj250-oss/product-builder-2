const API_KEY = '879bd560d1bf4d34971e7541d8d8d748';

const foodTranslator = {
    "Chicken": "닭고기", "Salad": "샐러드", "Rice": "밥", "Soup": "국/수프", "Beef": "소고기", "Pork": "돼지고기", 
    "Fish": "생선", "Salmon": "연어", "Vegetable": "채소", "Noodle": "면", "Fried": "볶음/튀김", "Roasted": "구이",
    "Steamed": "찜", "Boiled": "삶은", "Healthy": "건강식", "Bowl": "덮밥", "Stew": "찌개", "Bread": "빵",
    "Tofu": "두부", "Egg": "계란", "Brown Rice": "현미밥", "Kimchi": "김치", "Porridge": "죽"
};

function translateText(text) {
    if (!text) return "";
    let translated = text;
    Object.keys(foodTranslator).forEach(key => {
        const regex = new RegExp(key, "gi");
        translated = translated.replace(regex, foodTranslator[key]);
    });
    return translated;
}

document.addEventListener('DOMContentLoaded', () => {
    const translations = {
        ko: { 
            title: "VitalPlate", subtitle: "AI 맞춤형 글로벌 식단 가이드", step1: "1. 정보 입력", step2: "2. 알러지", btn: "AI 맞춤 식단 생성", 
            recipeTitle: "상세 정보", breakfast: "☀️ 아침", lunch: "🌤️ 점심", dinner: "🌙 저녁", close: "닫기", 
            reportTitle: "나의 맞춤 식단 리포트", clickTip: "* 이미지를 클릭하면 상세 레시피를 확인합니다.",
            bmiLabel: "BMI 지수", statusLabel: "상태", targetCal: "추천 칼로리",
            underweight: "저체중", normal: "정상", overweight: "과체중", obese: "비만",
            loading: "최적의 식단을 구성 중입니다...", error: "분석 실패. 다시 시도해주세요."
        },
        en: { 
            title: "VitalPlate", subtitle: "AI-Powered Nutrition Guide", step1: "1. Info", step2: "2. Allergy", btn: "Generate Plan", 
            recipeTitle: "Meal Details", breakfast: "☀️ Breakfast", lunch: "🌤️ Lunch", dinner: "🌙 Dinner", close: "Close", 
            reportTitle: "Your Health Report", clickTip: "* Click on a meal for details.",
            bmiLabel: "BMI", statusLabel: "Status", targetCal: "Daily Calories",
            underweight: "Underweight", normal: "Normal", overweight: "Overweight", obese: "Obese",
            loading: "Analyzing and Composing...", error: "Failed to fetch data."
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

    const allergyContainer = document.getElementById('allergy-list');
    const allergies = ["egg", "dairy", "wheat", "peanut", "soy", "seafood", "shellfish", "pork"];
    allergies.forEach(item => {
        const label = document.createElement('label');
        label.className = 'allergy-item';
        label.innerHTML = `<input type="checkbox" value="${item}"> ${item}`;
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

        const bmi = (weight / ((height / 100) ** 2)).toFixed(1);
        let bmr = (10 * weight) + (6.25 * height) - (5 * age);
        bmr = (gender === 'male') ? bmr + 5 : bmr - 161;
        let targetCalories = bmr * 1.3 - (goal === 'diet' ? 500 : (goal === 'muscle' ? -500 : 0));

        try {
            const cuisine = { korean: 'Korean', japanese: 'Japanese', chinese: 'Chinese', mediterranean: 'Mediterranean', western: 'European' }[country];
            // 21개의 식단을 한꺼번에 가져옴 (아침7, 점심7, 저녁7)
            const query = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&cuisine=${cuisine}&number=21&addRecipeInformation=true&fillIngredients=true&addRecipeNutrition=true&language=${currentLang}`;
            
            const res = await fetch(query);
            const data = await res.json();
            renderResult(data.results, bmi, targetCalories, t);
        } catch (e) { alert(t.error); }
        finally { generateBtn.textContent = t.btn; generateBtn.disabled = false; }
    });

    function renderResult(recipes, bmi, targetCal, t) {
        const resultDiv = document.getElementById('diet-result');
        resultDiv.style.display = 'block';
        
        let status = t.normal;
        if (bmi < 18.5) status = t.underweight;
        else if (bmi >= 25 && bmi < 30) status = t.overweight;
        else if (bmi >= 30) status = t.obese;

        let html = `
            <div class="form-container result-card" style="margin-top: 30px;">
                <div class="bmi-info" style="display: flex; justify-content: space-around; background: #f8f9fa; padding: 20px; border-radius: 15px; margin-bottom: 30px;">
                    <div><small>${t.bmiLabel}</small><div style="font-size: 1.5rem; font-weight: bold;">${bmi}</div></div>
                    <div><small>${t.statusLabel}</small><div style="font-size: 1.5rem; font-weight: bold;">${status}</div></div>
                    <div><small>${t.targetCal}</small><div style="font-size: 1.5rem; font-weight: bold;">${Math.round(targetCal)} kcal</div></div>
                </div>
                <h2 style="text-align: center;">${t.reportTitle}</h2>
                <div class="diet-grid">
        `;

        ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].forEach((day, i) => {
            // 끼니별 데이터 배분 (중복 방지)
            const meals = [recipes[i] || recipes[0], recipes[i+7] || recipes[1], recipes[i+14] || recipes[2]];
            const times = [t.breakfast, t.lunch, t.dinner];

            html += `<div class="day-card"><h4>${day}</h4><div class="meal-time">`;
            meals.forEach((m, idx) => {
                const title = currentLang === 'ko' ? translateText(m.title) : m.title;
                html += `
                    <div class="meal-box" onclick="openFullRecipe(${m.id})">
                        <div class="meal-tag">${times[idx]}</div>
                        <img src="${m.image}" class="meal-img">
                        <div class="meal-name">${title}</div>
                    </div>`;
            });
            html += `</div></div>`;
        });

        html += `</div></div>`;
        resultDiv.innerHTML = html;
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    }

    window.openFullRecipe = async function(id) {
        const t = translations[currentLang] || translations['ko'];
        const res = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}&includeNutrition=true`);
        const r = await res.json();
        const nutrients = r.nutrition.nutrients.filter(n => ['Calories', 'Protein', 'Fat', 'Carbohydrates'].includes(n.name));
        
        const modal = document.createElement('div');
        modal.className = 'recipe-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-btn" onclick="this.parentElement.parentElement.remove()">&times;</span>
                <h2 style="color: #ff9a9e;">🍳 ${currentLang === 'ko' ? translateText(r.title) : r.title}</h2>
                <img src="${r.image}" style="width:100%; border-radius:15px; margin:15px 0;">
                <div style="background:#f8f9fa; padding:15px; border-radius:10px; margin-bottom:20px;">
                    <ul style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; padding:0; list-style:none;">
                        ${nutrients.map(n => `<li><strong>${n.name}:</strong> ${n.amount}${n.unit}</li>`).join('')}
                    </ul>
                </div>
                <div style="line-height:1.6;">${r.instructions || 'Check website for details.'}</div>
            </div>`;
        document.body.appendChild(modal);
    };
});