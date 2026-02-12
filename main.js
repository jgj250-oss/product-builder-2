const API_KEY = '879bd560d1bf4d34971e7541d8d8d748';

document.addEventListener('DOMContentLoaded', () => {
    const translations = {
        ko: { title: "VitalPlate", subtitle: "AI 실시간 글로벌 영양 가이드", step1: "1. 정보 입력", step2: "2. 알러지", btn: "AI 실시간 식단 생성", recipeTitle: "상세 레시피", breakfast: "아침", lunch: "점심", dinner: "저녁", close: "닫기", reportTitle: "실시간 건강 분석 리포트", clickTip: "* 이미지를 클릭하면 상세 레시피와 영양 정보를 확인합니다.", loading: "전 세계 레시피 분석 중...", error: "데이터를 가져오는데 실패했습니다." },
        en: { title: "VitalPlate", subtitle: "AI-Powered Real-time Nutrition Guide", step1: "1. Info", step2: "2. Allergy", btn: "Generate Live Plan", recipeTitle: "Recipe", breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner", close: "Close", reportTitle: "Live Health Report", clickTip: "* Click on an image for full recipe and nutrition.", loading: "Analyzing global recipes...", error: "Failed to fetch data." },
        zh: { title: "VitalPlate", subtitle: "AI 实时全球营养指南", step1: "1. 输入信息", step2: "2. 过敏检查", btn: "生成实时计划", recipeTitle: "食谱", breakfast: "早餐", lunch: "午餐", dinner: "晚餐", close: "关闭", reportTitle: "实时健康报告", clickTip: "* 点击图片查看食谱和营养信息。", loading: "正在分析全球食谱...", error: "获取数据失败。" },
        ja: { title: "VitalPlate", subtitle: "AI リアルタイム栄養ガイド", step1: "1. 情報入力", step2: "2. アレルギー", btn: "リアルタイム献立作成", recipeTitle: "レシピ", breakfast: "朝食", lunch: "昼食", dinner: "夕食", close: "閉じる", reportTitle: "健康分析レポート", clickTip: "* 画像をクリックして詳細なレシピを確認してください。", loading: "世界中のレシピを分析中...", error: "データの取得に失敗しました。" }
    };

    let currentLang = 'ko';
    const langSelect = document.getElementById('language-select');
    langSelect.addEventListener('change', (e) => { currentLang = e.target.value; updateUILanguage(); });

    function updateUILanguage() {
        const t = translations[currentLang] || translations['en'];
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
        const t = translations[currentLang] || translations['en'];
        const age = document.getElementById('age').value;
        const height = document.getElementById('height').value;
        const weight = document.getElementById('weight').value;
        const country = document.getElementById('country').value;
        const goal = document.getElementById('goal').value;

        if (!age || !height || !weight) { alert('Check inputs!'); return; }

        const resultDiv = document.getElementById('diet-result');
        const generateBtn = document.getElementById('generate-plan');
        
        generateBtn.textContent = t.loading;
        generateBtn.disabled = true;

        const selectedIntolerances = Array.from(document.querySelectorAll('#allergy-list input:checked')).map(cb => cb.value).join(',');
        
        // 목표에 따른 Spoonacular 다이어트 유형 매핑
        const dietMapping = { diet: 'low-carb', muscle: 'high-protein', liver: 'whole30', study: 'mediterranean', general: '' };
        const cuisineMapping = { korean: 'Korean', japanese: 'Japanese', chinese: 'Chinese', mediterranean: 'Mediterranean', western: 'European' };

        try {
            // Spoonacular API 호출 (21개 음식을 한 번에 가져옴)
            const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&cuisine=${cuisineMapping[country]}&diet=${dietMapping[goal]}&intolerances=${selectedIntolerances}&number=21&addRecipeInformation=true&fillIngredients=true`);
            const data = await response.json();

            if (!data.results || data.results.length === 0) throw new Error('No results');

            renderResult(data.results, t);
        } catch (error) {
            alert(t.error);
        } finally {
            generateBtn.textContent = t.btn;
            generateBtn.disabled = false;
        }
    });

    function renderResult(recipes, t) {
        const resultDiv = document.getElementById('diet-result');
        resultDiv.style.display = 'block';
        
        let html = `<div class="form-container result-card" style="margin-top: 30px; border-top: 5px solid #ff9a9e;">
                    <h2 style="text-align: center;">${t.reportTitle}</h2>
                    <p style="text-align: center; font-size: 0.9rem; color: #888; margin-bottom: 20px;">${t.clickTip}</p>
                    <div class="diet-grid">`;

        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        days.forEach((day, index) => {
            const m1 = recipes[index * 3] || recipes[0];
            const m2 = recipes[index * 3 + 1] || recipes[1];
            const m3 = recipes[index * 3 + 2] || recipes[2];

            html += `
                <div class="day-card">
                    <h4>${day}</h4>
                    <div class="meal-time">
                        <div class="meal-item api-meal" onclick="openFullRecipe(${m1.id})">
                            <img src="${m1.image}" alt="${m1.title}" style="width: 100%; border-radius: 10px; margin-bottom: 10px;">
                            <strong>${t.breakfast}</strong><br><span>${m1.title}</span>
                        </div>
                        <div class="meal-item api-meal" onclick="openFullRecipe(${m2.id})">
                            <img src="${m2.image}" alt="${m2.title}" style="width: 100%; border-radius: 10px; margin-bottom: 10px;">
                            <strong>${t.lunch}</strong><br><span>${m2.title}</span>
                        </div>
                        <div class="meal-item api-meal" onclick="openFullRecipe(${m3.id})">
                            <img src="${m3.image}" alt="${m3.title}" style="width: 100%; border-radius: 10px; margin-bottom: 10px;">
                            <strong>${t.dinner}</strong><br><span>${m3.title}</span>
                        </div>
                    </div>
                </div>`;
        });
        html += `</div></div>`;
        resultDiv.innerHTML = html;
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    }

    window.openFullRecipe = async function(recipeId) {
        const t = translations[currentLang] || translations['en'];
        try {
            const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}&includeNutrition=true`);
            const recipe = await response.json();

            const modal = document.createElement('div');
            modal.className = 'recipe-modal';
            
            const nutrition = recipe.nutrition.nutrients.filter(n => ['Calories', 'Protein', 'Fat', 'Carbohydrates'].includes(n.name));
            let nutritionHtml = nutrition.map(n => `<li>${n.name}: ${n.amount}${n.unit}</li>`).join('');

            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-btn" onclick="this.parentElement.parentElement.remove()">&times;</span>
                    <h2 style="color: #ff9a9e;">🍳 ${recipe.title}</h2>
                    <img src="${recipe.image}" style="width: 100%; border-radius: 15px; margin: 20px 0;">
                    
                    <div style="background: rgba(0,0,0,0.05); padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                        <h4 style="margin-top:0;">📊 Nutrition (Per Serving)</h4>
                        <ul style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 0; list-style: none; font-size: 0.9rem;">
                            ${nutritionHtml}
                        </ul>
                    </div>

                    <h4 style="margin-bottom: 10px;">📋 Instructions</h4>
                    <div style="line-height: 1.6; font-size: 1rem;">
                        ${recipe.instructions || 'Please follow the link for instructions: <a href="'+recipe.sourceUrl+'" target="_blank">View Full Recipe</a>'}
                    </div>
                    <button class="submit-btn" style="margin-top:30px;" onclick="this.parentElement.parentElement.remove()">${t.close}</button>
                </div>`;
            document.body.appendChild(modal);
        } catch (error) {
            alert('Recipe details not available.');
        }
    };

    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    themeToggleBtn.addEventListener('click', () => { body.classList.toggle('light-mode'); });
});