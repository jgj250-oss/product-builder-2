document.addEventListener('DOMContentLoaded', () => {
    const translations = {
        ko: { title: "VitalPlate", subtitle: "AI 맞춤형 글로벌 식단 가이드", step1: "1. 정보 입력", step2: "2. 알러지", btn: "식단 생성", recipeTitle: "조리법", breakfast: "아침", lunch: "점심", dinner: "저녁", close: "닫기", reportTitle: "맞춤형 건강 리포트", clickTip: "* 음식을 클릭하면 상세 레시피를 볼 수 있습니다." },
        en: { title: "VitalPlate", subtitle: "AI-Powered Nutrition Guide", step1: "1. Info", step2: "2. Allergy", btn: "Generate", recipeTitle: "Recipe", breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner", close: "Close", reportTitle: "Personalized Health Report", clickTip: "* Click on a meal to see the detailed recipe." },
        zh: { title: "VitalPlate", subtitle: "AI 全球营养指南", step1: "1. 输入信息", step2: "2. 过敏检查", btn: "生成计划", recipeTitle: "食谱", breakfast: "早餐", lunch: "午餐", dinner: "晚餐", close: "关闭", reportTitle: "个性化健康报告", clickTip: "* 点击食物查看详细食谱。" },
        ja: { title: "VitalPlate", subtitle: "AI グローバル栄養ガイド", step1: "1. 情報入力", step2: "2. アレルギー", btn: "献立作成", recipeTitle: "レシピ", breakfast: "朝食", lunch: "昼食", dinner: "夕食", close: "閉じる", reportTitle: "パーソナライズ健康レポート", clickTip: "* 料理をクリックすると詳細なレシピが表示されます。" },
        fr: { title: "VitalPlate", subtitle: "Guide Nutritionnel IA", step1: "1. Infos", step2: "2. Allergies", btn: "Générer", recipeTitle: "Recette", breakfast: "Petit-déj", lunch: "Déjeuner", dinner: "Dîner", close: "Fermer", reportTitle: "Rapport de santé", clickTip: "* Cliquez sur un repas pour voir la recette." },
        de: { title: "VitalPlate", subtitle: "KI-Ernährungsberater", step1: "1. Info", step2: "2. Allergien", btn: "Erstellen", recipeTitle: "Rezept", breakfast: "Frühstück", lunch: "Mittagessen", dinner: "Abendessen", close: "Schließen", reportTitle: "Gesundheitsbericht", clickTip: "* Klicken Sie auf eine Mahlzeit für das Rezept." }
    };

    const foodMaster = {
        ko: {
            korean: {
                diet: ["현미 두부 비빔밥", "닭가슴살 미역줄기볶음", "곤약 면 콩국수", "버섯 들깨탕", "청경채 버섯볶음", "두부 구이와 겉절이", "단호박 찜", "양배추 쌈밥", "도토리묵 무침", "메밀 전병", "가지 구이", "무나물 샐러드"],
                muscle: ["한우 사태찜", "돼지 안심 수육", "닭다리살 채소구이", "고등어 양념구이", "전복 소고기죽", "임이면 구이", "수제 닭가슴살 소시지", "소고기 우둔살 볶음", "달걀 흰자 찜", "오징어 숙회", "연어 스테이크", "장어 소금구이"],
                liver: ["재첩국", "올갱이 해장국", "쑥국", "미나리 무침", "냉이 된장국", "브로콜리 두부무침", "양배추 찜", "바지락 맑은국", "황태 해장국"],
                study: ["전복죽", "견과류 멸치볶음", "연어 데리야끼", "소고기 미역국", "시금치 나물", "계란말이", "블루베리 샐러드", "호두 조림"],
                recipe: {
                    "현미 두부 비빔밥": "1. 현미밥을 고슬하게 짓습니다.\n2. 두부를 으깨 팬에 볶아 수분을 제거합니다.\n3. 상추, 당근, 콩나물을 준비합니다.\n4. 저염 고추장과 참기름 한 방울로 비벼 드세요.",
                    "닭가슴살 미역줄기볶음": "1. 미역줄기를 찬물에 담가 소금기를 뺍니다.\n2. 닭가슴살은 삶아서 결대로 찢습니다.\n3. 팬에 들기름을 두르고 다진 마늘과 함께 볶습니다.",
                    "곤약 면 콩국수": "1. 곤약면을 끓는 물에 살짝 데칩니다.\n2. 무설탕 두유와 구운 견과류를 믹서에 갑니다.\n3. 시원한 콩물에 면을 담고 오이채를 올립니다.",
                    "버섯 들깨탕": "1. 멸치 육수를 냅니다.\n2. 표고버섯, 느타리버섯을 넣고 끓입니다.\n3. 들깨가루를 듬뿍 넣어 걸쭉하게 만듭니다.",
                    "한우 사태찜": "1. 사태의 핏물을 빼고 삶습니다.\n2. 무, 당근과 함께 간장 양념에 졸입니다.",
                    "돼지 안심 수육": "1. 안심을 된장, 대파와 함께 삶습니다.\n2. 기름기를 빼고 얇게 썰어 냅니다.",
                    "재첩국": "1. 재첩을 깨끗이 씻어 해감합니다.\n2. 물에 넣고 끓인 뒤 부추를 띄웁니다.",
                    "전복죽": "1. 불린 쌀과 전복 내장을 참기름에 볶습니다.\n2. 물을 붓고 쌀알이 퍼질 때까지 끓인 뒤 전복 살을 넣습니다."
                }
            }
        },
        en: {
            western: {
                diet: ["Quinoa Avocado Salad", "Roasted Turkey Breast", "Zucchini Noodles with Pesto", "Baked Cod with Asparagus", "Kale & Apple Salad", "Lentil Soup", "Steamed Artichokes", "Greek Yogurt Bowl", "Cauliflower Steak", "Berry Spinach Smoothie"],
                muscle: ["Grilled Ribeye Steak", "Chicken Breast with Sweet Potato", "Baked Salmon with Asparagus", "Tuna Tartare", "Lean Pork Tenderloin", "Greek Yogurt with Whey", "Egg White Omelet", "Beef and Broccoli", "Cottage Cheese with Berries"],
                recipe: {
                    "Quinoa Avocado Salad": "1. Rinse quinoa and boil for 15 minutes.\n2. Dice fresh avocado and cherry tomatoes.\n3. Mix with extra virgin olive oil and lemon juice.",
                    "Roasted Turkey Breast": "1. Rub turkey breast with sage and rosemary.\n2. Roast at 190°C until internal temperature reaches 75°C.\n3. Rest for 10 minutes before slicing.",
                    "Zucchini Noodles with Pesto": "1. Spiralize zucchini into thin strands.\n2. Sauté in a pan for 2-3 minutes.\n3. Mix with fresh basil pesto and pine nuts.",
                    "Grilled Ribeye Steak": "1. Season steak with sea salt and garlic.\n2. Grill on high heat to desired doneness.\n3. Serve with roasted vegetables.",
                    "Baked Salmon with Asparagus": "1. Season salmon with lemon and dill.\n2. Place on a tray with asparagus.\n3. Bake at 200°C for 15 minutes."
                }
            }
        },
        zh: {
            chinese: {
                diet: ["清蒸鲈鱼 (Steamed Bass)", "清炒西兰花 (Sautéed Broccoli)", "番茄炒蛋 (Tomato Egg)", "凉拌木耳 (Wood Ear Salad)", "上汤娃娃菜", "蚝油生菜", "冬瓜排骨汤", "芹菜炒豆干"],
                recipe: {
                    "清蒸鲈鱼 (Steamed Bass)": "1. 鱼表面抹盐，铺上姜片和葱段。\n2. 水开后大火蒸8-10分钟。\n3. 倒掉多余水分，淋上热油和蒸鱼豉油。",
                    "清炒西兰花 (Sautéed Broccoli)": "1. 西兰花切小朵，焯水备用。\n2. 热锅凉油，下蒜片爆香。\n3. 加入西兰花和少许盐，快速翻炒出锅。",
                    "番茄炒蛋 (Tomato Egg)": "1. 鸡蛋打散炒熟盛出。\n2. 西红柿切块炒出汁。\n3. 加入鸡蛋混合，少许糖和盐调味。",
                    "冬瓜排骨汤": "1. 排骨焯水去血沫。\n2. 与冬瓜、姜片一同炖煮1小时。\n3. 加盐调味即可。"
                }
            }
        },
        ja: {
            japanese: {
                diet: ["湯豆腐 (Yudofu)", "刺身盛り合わせ (Sashimi)", "焼き魚定食 (Grilled Fish)", "切り干し大根", "ひじきの煮物", "冷奴", "筑前煮", "サバの塩焼き"],
                recipe: {
                    "湯豆腐 (Yudofu)": "1. 土鍋に昆布を敷き、水を張ります。\n2. 豆腐を入れ、弱火で温めます。\n3. ポン酢、鰹節、刻みネギを添えて完成。",
                    "刺身盛り合わせ (Sashimi)": "1. 新鮮な魚を薄く切り分けます。\n2. 大根のツマと大葉を皿に盛ります。\n3. ワサビと醤油を添えて召し上がれ。",
                    "焼き魚定食 (Grilled Fish)": "1. 魚に塩を振り、グリルで焼きます。\n2. 大根おろしを添えます。\n3. 玄米ご飯とお味噌汁と一緒にどうぞ。",
                    "ひじきの煮物": "1. ひじきを水で戻します。\n2. 人参、油揚げと一緒に醤油、みりんで煮ます。"
                }
            }
        },
        fr: {
            western: {
                diet: ["Ratatouille", "Salade Niçoise", "Poisson Grillé", "Soupe à l'Oignon (Healthy)", "Poulet aux Herbes", "Légumes Vapeur", "Quiche aux Poireaux"],
                recipe: {
                    "Ratatouille": "1. Couper les légumes en dés.\n2. Faire revenir séparément à l'huile d'olive.\n3. Mijoter ensemble avec du thym et du laurier.",
                    "Salade Niçoise": "1. Mélanger salade, thon, œufs durs et olives.\n2. Ajouter haricots verts vapeur.\n3. Vinaigrette au citron.",
                    "Poisson Grillé": "1. Griller le poisson avec du fenouil.\n2. Servir avec un filet d'huile d'olive."
                }
            }
        },
        de: {
            western: {
                diet: ["Gedünsteter Lachs", "Vollkornbrot mit Avocado", "Linseneintopf", "Putensteak mit Salat", "Gebackener Blumenkohl", "Rote Bete Salat"],
                recipe: {
                    "Gedünsteter Lachs": "1. Lachs mit Dill und Zitrone würzen.\n2. Bei schwacher Hitze in der Pfanne garen.\n3. Mit Spinat servieren.",
                    "Linseneintopf": "1. Linsen mit Gemüse weich kochen.\n2. Mit Essig und Petersilie abschmecken.",
                    "Vollkornbrot mit Avocado": "1. Avocado zerdrücken und auf Brot streichen.\n2. Mit Pfeffer und Chili würzen."
                }
            }
        }
    };

    let currentLang = 'ko';
    const langSelect = document.getElementById('language-select');

    langSelect.addEventListener('change', (e) => {
        currentLang = e.target.value;
        updateUILanguage();
    });

    function updateUILanguage() {
        const t = translations[currentLang];
        document.getElementById('txt-title').textContent = t.title;
        document.getElementById('txt-subtitle').textContent = t.subtitle;
        document.getElementById('txt-step1').textContent = t.step1;
        document.getElementById('txt-step2').textContent = t.step2;
        document.getElementById('generate-plan').textContent = t.btn;
    }

    const allergyList = ["난류", "우유", "메밀", "땅콩", "대두", "밀", "고등어", "게", "새우", "돼지고기", "복숭아", "토마토"];
    const allergyContainer = document.getElementById('allergy-list');
    allergyList.forEach(item => {
        const label = document.createElement('label');
        label.className = 'allergy-item';
        label.innerHTML = `<input type="checkbox" value="${item}"> ${item}`;
        allergyContainer.appendChild(label);
    });

    document.getElementById('generate-plan').addEventListener('click', () => {
        const t = translations[currentLang];
        const resultDiv = document.getElementById('diet-result');
        resultDiv.style.display = 'block';
        
        const style = document.getElementById('country').value;
        const goal = document.getElementById('goal').value;

        const langData = foodMaster[currentLang];
        // 스타일이 해당 언어 데이터에 없으면 첫 번째 가용 스타일 선택
        let category = langData[style] || langData[Object.keys(langData)[0]];
        let list = category[goal] || category['diet'];

        let html = `<div class="form-container result-card" style="margin-top: 30px;">
                    <h2 style="text-align: center;">${t.reportTitle}</h2>
                    <p style="text-align: center; font-size: 0.9rem; color: #888; margin-bottom: 20px;">${t.clickTip}</p>
                    <div class="diet-grid">`;

        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        days.forEach(day => {
            const m1 = list[Math.floor(Math.random() * list.length)];
            const m2 = list[Math.floor(Math.random() * list.length)];
            const m3 = list[Math.floor(Math.random() * list.length)];
            html += `
                <div class="day-card">
                    <h4>${day}</h4>
                    <div class="meal-time">
                        <div class="meal-item" onclick="openRecipe('${m1.replace(/'/g, "\\'")}')"><strong>${t.breakfast}</strong><br><span>${m1}</span></div>
                        <div class="meal-item" onclick="openRecipe('${m2.replace(/'/g, "\\'")}')"><strong>${t.lunch}</strong><br><span>${m2}</span></div>
                        <div class="meal-item" onclick="openRecipe('${m3.replace(/'/g, "\\'")}')"><strong>${t.dinner}</strong><br><span>${m3}</span></div>
                    </div>
                </div>`;
        });
        html += `</div></div>`;
        resultDiv.innerHTML = html;
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    });

    window.openRecipe = function(food) {
        const t = translations[currentLang];
        const langData = foodMaster[currentLang];
        let recipe = currentLang === 'ko' ? "레시피 정보가 준비 중입니다." : "Recipe is coming soon...";
        
        // 데이터베이스에서 해당 음식의 레시피 검색
        for (let styleKey in langData) {
            if (langData[styleKey].recipe && langData[styleKey].recipe[food]) {
                recipe = langData[styleKey].recipe[food];
                break;
            }
        }

        const modal = document.createElement('div');
        modal.className = 'recipe-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-btn" onclick="this.parentElement.parentElement.remove()">&times;</span>
                <h2 style="color: #ff9a9e; margin-bottom: 20px;">🍳 ${food}</h2>
                <div style="line-height: 1.8; font-size: 1.1rem; color: var(--text-color);">${recipe.replace(/\n/g, '<br>')}</div>
                <button class="submit-btn" style="margin-top:30px;" onclick="this.parentElement.parentElement.remove()">${t.close}</button>
            </div>`;
        document.body.appendChild(modal);
    };

    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('light-mode');
    });
});