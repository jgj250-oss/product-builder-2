const fallbackData = {
  allergyOptions: [
    { value: "egg", label: "계란" },
    { value: "dairy", label: "유제품" },
    { value: "wheat", label: "밀/글루텐" },
    { value: "peanut", label: "땅콩" },
    { value: "soy", label: "대두" },
    { value: "seafood", label: "해산물" },
    { value: "shellfish", label: "갑각류" },
    { value: "pork", label: "돼지고기" }
  ],
  goalProfiles: {
    diet: { label: "체지방 감량", calorieDelta: -450, macroRatio: { carb: 0.35, protein: 0.35, fat: 0.3 }, tips: ["단백질 우선", "당류 줄이기"] },
    muscle: { label: "근육 증가", calorieDelta: 300, macroRatio: { carb: 0.4, protein: 0.35, fat: 0.25 }, tips: ["운동 후 탄단 보충", "수분 충분히"] },
    liver: { label: "간 건강", calorieDelta: -100, macroRatio: { carb: 0.45, protein: 0.3, fat: 0.25 }, tips: ["저염 조리", "튀김 빈도 줄이기"] },
    study: { label: "집중력 강화", calorieDelta: 0, macroRatio: { carb: 0.4, protein: 0.3, fat: 0.3 }, tips: ["점심 과식 방지", "오메가3 식품 활용"] },
    general: { label: "균형 건강", calorieDelta: 0, macroRatio: { carb: 0.45, protein: 0.3, fat: 0.25 }, tips: ["통곡물 늘리기", "채소 다양화"] }
  },
  situationGuides: {
    office: "사무직이라면 점심 탄수화물 과다를 줄이고 단백질 간식을 활용하세요.",
    busy: "바쁜 일정에는 20분 이내 조리 가능한 메뉴를 우선 배치하세요.",
    student: "수험 기간에는 혈당 급등을 피하기 위해 통곡물 위주로 구성하세요.",
    workout: "운동일에는 운동 전후 탄수화물과 단백질 타이밍을 맞추세요.",
    night: "야근일에는 늦은 시간 고지방 식사를 피하고 소화가 쉬운 식사를 권장합니다."
  },
  recipePool: [
    { id: "fb1", title: "오트밀 요거트볼", cuisine: "western", mealType: "breakfast", tags: ["diet", "general", "study"], situations: ["office", "busy"], bodyTypes: ["normal", "overweight", "obese"], dietary: ["omnivore", "vegetarian"], allergens: ["dairy", "wheat"], prepTime: 8, calories: 360, protein: 20, carbs: 45, fat: 10, ingredients: ["오트밀", "요거트", "견과류"], steps: ["재료를 담아 섞습니다."], tip: "전날 준비하면 더 편합니다." },
    { id: "fb2", title: "닭가슴살 주먹밥", cuisine: "korean", mealType: "breakfast", tags: ["muscle", "general"], situations: ["workout", "busy"], bodyTypes: ["underweight", "normal", "overweight"], dietary: ["omnivore"], allergens: ["soy"], prepTime: 14, calories: 430, protein: 32, carbs: 48, fat: 10, ingredients: ["현미밥", "닭가슴살"], steps: ["재료를 섞어 주먹밥으로 만듭니다."], tip: "아침/간식으로 나눠 먹어도 좋습니다." },
    { id: "fb3", title: "두부 토스트", cuisine: "western", mealType: "breakfast", tags: ["diet", "liver", "general"], situations: ["office", "night"], bodyTypes: ["normal", "overweight", "obese"], dietary: ["vegetarian"], allergens: ["wheat", "soy"], prepTime: 12, calories: 340, protein: 19, carbs: 34, fat: 13, ingredients: ["통밀빵", "두부"], steps: ["두부를 구워 빵 위에 올립니다."], tip: "달걀 대체식으로 좋습니다." },
    { id: "fl1", title: "병아리콩 샐러드", cuisine: "mediterranean", mealType: "lunch", tags: ["diet", "liver", "general"], situations: ["office", "student"], bodyTypes: ["normal", "overweight", "obese"], dietary: ["vegetarian"], allergens: [], prepTime: 12, calories: 450, protein: 18, carbs: 52, fat: 18, ingredients: ["병아리콩", "채소"], steps: ["채소와 콩을 섞습니다."], tip: "통밀빵을 곁들이면 포만감이 좋습니다." },
    { id: "fl2", title: "닭가슴살 메밀국수", cuisine: "japanese", mealType: "lunch", tags: ["diet", "muscle", "study"], situations: ["office", "busy", "workout"], bodyTypes: ["normal", "overweight", "obese"], dietary: ["omnivore"], allergens: ["wheat", "soy"], prepTime: 20, calories: 510, protein: 35, carbs: 58, fat: 12, ingredients: ["메밀면", "닭가슴살"], steps: ["면을 삶고 닭가슴살과 함께 담습니다."], tip: "점심 졸림을 줄이는 데 도움이 됩니다." },
    { id: "fl3", title: "두부비빔밥", cuisine: "korean", mealType: "lunch", tags: ["liver", "general", "diet"], situations: ["office", "night"], bodyTypes: ["normal", "overweight", "obese"], dietary: ["vegetarian", "omnivore"], allergens: ["soy"], prepTime: 18, calories: 470, protein: 24, carbs: 57, fat: 14, ingredients: ["현미밥", "두부", "나물"], steps: ["재료를 밥 위에 올려 비빕니다."], tip: "저염 양념을 권장합니다." },
    { id: "fd1", title: "연어 구이와 채소", cuisine: "mediterranean", mealType: "dinner", tags: ["liver", "study", "general"], situations: ["office", "night"], bodyTypes: ["normal", "overweight", "obese"], dietary: ["pescatarian", "omnivore"], allergens: ["seafood"], prepTime: 22, calories: 540, protein: 36, carbs: 28, fat: 31, ingredients: ["연어", "브로콜리"], steps: ["연어와 채소를 구워 담습니다."], tip: "야식 대체 저녁으로 적합합니다." },
    { id: "fd2", title: "닭곰탕과 현미밥", cuisine: "korean", mealType: "dinner", tags: ["general", "muscle", "liver"], situations: ["night", "workout"], bodyTypes: ["underweight", "normal", "overweight"], dietary: ["omnivore"], allergens: [], prepTime: 30, calories: 590, protein: 40, carbs: 54, fat: 17, ingredients: ["닭고기", "현미밥"], steps: ["닭고기를 끓여 곰탕을 만듭니다."], tip: "국물 간을 약하게 조절하세요." },
    { id: "fd3", title: "두부버섯 전골", cuisine: "korean", mealType: "dinner", tags: ["diet", "liver", "general"], situations: ["night", "busy"], bodyTypes: ["normal", "overweight", "obese"], dietary: ["vegetarian", "omnivore"], allergens: ["soy"], prepTime: 25, calories: 420, protein: 27, carbs: 34, fat: 18, ingredients: ["두부", "버섯"], steps: ["육수에 두부와 버섯을 넣고 끓입니다."], tip: "저녁 과식을 줄이는 데 유리합니다." }
  ]
};

const dataSource = window.VITAL_DATA || fallbackData;
if (!window.VITAL_DATA) {
  console.warn("foodData.js 로드 실패로 폴백 데이터로 실행합니다.");
}

const { allergyOptions, goalProfiles, situationGuides, recipePool } = dataSource;

const dayNames = ["월", "화", "수", "목", "금", "토", "일"];
const mealOrder = ["breakfast", "lunch", "dinner"];
const mealLabel = { breakfast: "아침", lunch: "점심", dinner: "저녁" };

function showRuntimeError(message) {
  const banner = document.getElementById("runtime-error");
  if (!banner) return;
  banner.hidden = false;
  banner.textContent = `오류: ${message}`;
}

function setFormError(message) {
  const formError = document.getElementById("form-error");
  if (!formError) return;
  if (!message) {
    formError.hidden = true;
    formError.textContent = "";
    return;
  }
  formError.hidden = false;
  formError.textContent = message;
}

window.addEventListener("error", (event) => {
  showRuntimeError(event.message || "알 수 없는 스크립트 오류가 발생했습니다.");
});

window.addEventListener("unhandledrejection", () => {
  showRuntimeError("처리되지 않은 비동기 오류가 발생했습니다.");
});

document.addEventListener("DOMContentLoaded", () => {
  const allergyContainer = document.getElementById("allergy-list");
  const generateBtn = document.getElementById("generate-plan");
  const themeBtn = document.getElementById("theme-toggle");

  if (!allergyContainer || !generateBtn) {
    showRuntimeError("필수 UI 요소를 찾지 못했습니다. 페이지를 새로고침해 주세요.");
    return;
  }

  if (!allergyContainer.querySelector("input")) {
    allergyOptions.forEach((item) => {
      const label = document.createElement("label");
      label.className = "allergy-item";
      label.innerHTML = `<input type="checkbox" value="${item.value}"> ${item.label}`;
      allergyContainer.appendChild(label);
    });
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      document.body.classList.toggle("light-mode");
      const isLight = document.body.classList.contains("light-mode");
      themeBtn.textContent = isLight ? "다크 모드" : "라이트 모드";
    });
  }

  generateBtn.addEventListener("click", () => {
    try {
      const profile = collectProfile();
      if (!profile) {
        return;
      }
      setFormError("");

      const context = buildNutritionContext(profile);
      const plan = buildWeeklyPlan(context);
      renderResult(context, plan);
    } catch (error) {
      showRuntimeError("식단 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      console.error(error);
    }
  });
});

function collectProfile() {
  const age = Number(document.getElementById("age").value);
  const height = Number(document.getElementById("height").value);
  const weight = Number(document.getElementById("weight").value);

  if (!age || !height || !weight) {
    setFormError("나이, 키, 체중을 모두 입력해 주세요.");
    return null;
  }
  if (age < 14 || age > 90 || height < 130 || height > 220 || weight < 35 || weight > 180) {
    setFormError("입력 범위를 확인해 주세요. (나이 14~90, 키 130~220, 체중 35~180)");
    return null;
  }

  const allergies = Array.from(document.querySelectorAll("#allergy-list input:checked")).map((el) => el.value);

  return {
    age,
    height,
    weight,
    gender: document.getElementById("gender").value,
    activity: Number(document.getElementById("activity").value),
    goal: document.getElementById("goal").value,
    situation: document.getElementById("situation").value,
    dietary: document.getElementById("dietary").value,
    cuisine: document.getElementById("cuisine").value,
    maxPrep: Number(document.getElementById("maxPrep").value),
    allergies
  };
}

function buildNutritionContext(profile) {
  const bmi = profile.weight / ((profile.height / 100) ** 2);
  const bodyType = getBodyType(bmi);

  let bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age;
  bmr += profile.gender === "male" ? 5 : -161;

  const maintenance = bmr * profile.activity;
  const goalProfile = goalProfiles[profile.goal] || goalProfiles.general;
  const targetCalories = Math.max(1200, Math.round(maintenance + goalProfile.calorieDelta));

  return {
    ...profile,
    bmi,
    bodyType,
    targetCalories,
    goalProfile,
    macroTarget: {
      carb: Math.round((targetCalories * goalProfile.macroRatio.carb) / 4),
      protein: Math.round((targetCalories * goalProfile.macroRatio.protein) / 4),
      fat: Math.round((targetCalories * goalProfile.macroRatio.fat) / 9)
    }
  };
}

function getBodyType(bmi) {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  return "obese";
}

function buildWeeklyPlan(context) {
  const usedIds = new Set();
  const weeklyPlan = [];

  for (let day = 0; day < 7; day += 1) {
    const meals = mealOrder.map((mealType) => pickBestRecipe(mealType, context, usedIds));
    const totals = meals.reduce(
      (acc, meal) => {
        acc.calories += meal.calories;
        acc.protein += meal.protein;
        acc.carbs += meal.carbs;
        acc.fat += meal.fat;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    weeklyPlan.push({
      day: dayNames[day],
      meals,
      totals
    });
  }

  return weeklyPlan;
}

function pickBestRecipe(mealType, context, usedIds) {
  let candidates = recipePool.filter((recipe) => recipe.mealType === mealType && isRecipeAllowed(recipe, context));

  if (!candidates.length) {
    candidates = recipePool.filter((recipe) => recipe.mealType === mealType);
  }

  const ranked = candidates
    .map((recipe) => ({
      recipe,
      score: scoreRecipe(recipe, context, usedIds)
    }))
    .sort((a, b) => b.score - a.score);

  const selected = ranked[0]?.recipe || candidates[0];
  usedIds.add(selected.id);
  return selected;
}

function isRecipeAllowed(recipe, context) {
  const allergyConflict = recipe.allergens.some((item) => context.allergies.includes(item));
  if (allergyConflict) return false;

  if (context.dietary === "omnivore") {
    return true;
  }

  return recipe.dietary.includes(context.dietary);
}

function scoreRecipe(recipe, context, usedIds) {
  let score = 0;

  if (recipe.tags.includes(context.goal)) score += 18;
  if (recipe.situations.includes(context.situation)) score += 10;
  if (recipe.bodyTypes.includes(context.bodyType)) score += 10;
  if (recipe.dietary.includes(context.dietary)) score += 14;
  if (context.cuisine !== "any" && recipe.cuisine === context.cuisine) score += 8;

  const prepGap = Math.max(0, recipe.prepTime - context.maxPrep);
  score -= prepGap;

  const kcalGap = Math.abs(recipe.calories - Math.round(context.targetCalories / 3));
  score -= Math.round(kcalGap / 30);

  if (usedIds.has(recipe.id)) score -= 35;

  return score;
}

function renderResult(context, weeklyPlan) {
  const resultEl = document.getElementById("diet-result");
  resultEl.style.display = "block";

  const bodyTypeLabel = {
    underweight: "저체중",
    normal: "정상",
    overweight: "과체중",
    obese: "비만"
  }[context.bodyType];

  let html = `
    <article class="summary-card">
      <h2>맞춤 분석 결과</h2>
      <div class="summary-grid">
        <div><small>BMI</small><strong>${context.bmi.toFixed(1)}</strong></div>
        <div><small>체형 분류</small><strong>${bodyTypeLabel}</strong></div>
        <div><small>목표 칼로리</small><strong>${context.targetCalories} kcal</strong></div>
        <div><small>권장 매크로</small><strong>탄 ${context.macroTarget.carb}g / 단 ${context.macroTarget.protein}g / 지 ${context.macroTarget.fat}g</strong></div>
      </div>
      <p class="guide">${situationGuides[context.situation] || "현재 생활 패턴에 맞춰 균형 식단을 추천합니다."}</p>
      <p class="guide">${context.goalProfile.tips.join(" · ")}</p>
    </article>
    <section class="diet-grid">
  `;

  weeklyPlan.forEach((dayPlan) => {
    html += `<section class="day-card"><h3>${dayPlan.day}요일</h3>`;

    dayPlan.meals.forEach((meal) => {
      html += `
        <button class="meal-box" data-recipe-id="${meal.id}" type="button">
          <div class="meal-header">
            <span class="meal-tag">${mealLabel[meal.mealType]}</span>
            <span class="meal-kcal">${meal.calories} kcal</span>
          </div>
          <strong>${meal.title}</strong>
          <p>${meal.protein}P / ${meal.carbs}C / ${meal.fat}F · ${meal.prepTime}분</p>
        </button>
      `;
    });

    html += `
      <div class="day-total">
        <span>일일 합계</span>
        <strong>${dayPlan.totals.calories} kcal</strong>
        <small>${dayPlan.totals.protein}P / ${dayPlan.totals.carbs}C / ${dayPlan.totals.fat}F</small>
      </div>
    </section>`;
  });

  html += "</section>";
  resultEl.innerHTML = html;

  resultEl.querySelectorAll(".meal-box").forEach((button) => {
    button.addEventListener("click", () => {
      const recipeId = button.dataset.recipeId;
      const recipe = recipePool.find((item) => item.id === recipeId);
      if (recipe) openRecipeModal(recipe);
    });
  });

  resultEl.scrollIntoView({ behavior: "smooth" });
}

function openRecipeModal(recipe) {
  const modal = document.createElement("div");
  modal.className = "recipe-modal";

  modal.innerHTML = `
    <div class="modal-content" role="dialog" aria-modal="true">
      <button class="close-btn" type="button">닫기</button>
      <h3>${recipe.title}</h3>
      <div class="modal-meta">${recipe.calories} kcal · 단백질 ${recipe.protein}g · 조리 ${recipe.prepTime}분</div>
      <h4>재료</h4>
      <ul>${recipe.ingredients.map((item) => `<li>${item}</li>`).join("")}</ul>
      <h4>레시피</h4>
      <ol>${recipe.steps.map((step) => `<li>${step}</li>`).join("")}</ol>
      <p class="modal-tip">팁: ${recipe.tip}</p>
    </div>
  `;

  modal.querySelector(".close-btn").addEventListener("click", () => modal.remove());
  modal.addEventListener("click", (event) => {
    if (event.target === modal) modal.remove();
  });

  document.body.appendChild(modal);
}
