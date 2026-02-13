const dataSource = window.VITAL_DATA;

if (!dataSource) {
  throw new Error("식단 데이터 로딩에 실패했습니다. foodData.js 로드 순서를 확인해주세요.");
}

const { allergyOptions, goalProfiles, situationGuides, recipePool } = dataSource;

const dayNames = ["월", "화", "수", "목", "금", "토", "일"];
const mealOrder = ["breakfast", "lunch", "dinner"];
const mealLabel = { breakfast: "아침", lunch: "점심", dinner: "저녁" };

document.addEventListener("DOMContentLoaded", () => {
  const allergyContainer = document.getElementById("allergy-list");
  const generateBtn = document.getElementById("generate-plan");
  const themeBtn = document.getElementById("theme-toggle");

  allergyOptions.forEach((item) => {
    const label = document.createElement("label");
    label.className = "allergy-item";
    label.innerHTML = `<input type="checkbox" value="${item.value}"> ${item.label}`;
    allergyContainer.appendChild(label);
  });

  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    const isLight = document.body.classList.contains("light-mode");
    themeBtn.textContent = isLight ? "다크 모드" : "라이트 모드";
  });

  generateBtn.addEventListener("click", () => {
    const profile = collectProfile();
    if (!profile) {
      return;
    }

    const context = buildNutritionContext(profile);
    const plan = buildWeeklyPlan(context);
    renderResult(context, plan);
  });
});

function collectProfile() {
  const age = Number(document.getElementById("age").value);
  const height = Number(document.getElementById("height").value);
  const weight = Number(document.getElementById("weight").value);

  if (!age || !height || !weight) {
    alert("나이, 키, 체중을 모두 입력해주세요.");
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
      <p class="guide">${situationGuides[context.situation]}</p>
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
