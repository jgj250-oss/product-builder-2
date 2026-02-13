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
    diet: { label: "체지방 감량", calorieDelta: -450, macroRatio: { carb: 0.35, protein: 0.35, fat: 0.3 }, tips: ["단백질 우선", "가공식품 줄이기"] },
    muscle: { label: "근육 증가", calorieDelta: 280, macroRatio: { carb: 0.42, protein: 0.33, fat: 0.25 }, tips: ["운동 후 탄단 보충", "수분 충분히"] },
    liver: { label: "간 건강", calorieDelta: -120, macroRatio: { carb: 0.43, protein: 0.32, fat: 0.25 }, tips: ["저염 조리", "튀김 빈도 축소"] },
    study: { label: "집중력 강화", calorieDelta: 0, macroRatio: { carb: 0.4, protein: 0.3, fat: 0.3 }, tips: ["혈당 급등 방지", "오메가3 식품 활용"] },
    general: { label: "균형 건강", calorieDelta: 0, macroRatio: { carb: 0.45, protein: 0.3, fat: 0.25 }, tips: ["통곡물 비중 확대", "채소 다양화"] }
  },
  situationGuides: {
    office: "사무직은 점심 과식과 오후 졸림을 줄이는 구성이 중요합니다.",
    busy: "바쁜 일정은 조리시간 20분 내 레시피 비중을 높이세요.",
    student: "수험 기간은 통곡물, 단백질, 오메가3 식품을 규칙적으로 섭취하세요.",
    workout: "운동일은 단백질과 탄수화물 타이밍을 맞추는 것이 핵심입니다.",
    night: "야근일은 늦은 시간 고지방 식사를 피하고 소화 쉬운 메뉴를 선택하세요."
  },
  recipeCatalog: []
};

const dataSource = window.VITAL_DATA || fallbackData;
const plannerAllergyOptions = dataSource.allergyOptions;
const plannerGoalProfiles = dataSource.goalProfiles;
const plannerSituationGuides = dataSource.situationGuides;
const plannerRecipeCatalog = dataSource.recipeCatalog || [];

const dayNames = ["월", "화", "수", "목", "금", "토", "일"];
const mealOrder = ["breakfast", "lunch", "dinner"];
const mealLabel = { breakfast: "아침", lunch: "점심", dinner: "저녁" };
const cuisineLabel = {
  korean: "한식",
  japanese: "일식",
  mediterranean: "지중해식",
  western: "서양식",
  chinese: "중식"
};
const mealRatioMap = { breakfast: 0.28, lunch: 0.37, dinner: 0.35 };

const constraintByGoal = {
  diet: {
    kcalRange: [0.72, 1.12],
    minProtein: { breakfast: 20, lunch: 28, dinner: 30 },
    maxFat: { breakfast: 18, lunch: 26, dinner: 26 },
    maxSodiumPerMeal: 760
  },
  muscle: {
    kcalRange: [0.85, 1.25],
    minProtein: { breakfast: 24, lunch: 34, dinner: 34 },
    maxFat: { breakfast: 24, lunch: 36, dinner: 36 },
    maxSodiumPerMeal: 900
  },
  liver: {
    kcalRange: [0.75, 1.15],
    minProtein: { breakfast: 22, lunch: 28, dinner: 30 },
    maxFat: { breakfast: 16, lunch: 24, dinner: 24 },
    maxSodiumPerMeal: 650
  },
  study: {
    kcalRange: [0.75, 1.18],
    minProtein: { breakfast: 20, lunch: 26, dinner: 28 },
    maxFat: { breakfast: 20, lunch: 30, dinner: 30 },
    maxSodiumPerMeal: 820
  },
  general: {
    kcalRange: [0.74, 1.2],
    minProtein: { breakfast: 20, lunch: 26, dinner: 28 },
    maxFat: { breakfast: 20, lunch: 32, dinner: 32 },
    maxSodiumPerMeal: 850
  }
};

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
    plannerAllergyOptions.forEach((item) => {
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
      if (!profile) return;
      setFormError("");

      const context = buildNutritionContext(profile);
      const plan = buildWeeklyPlan(context);
      renderResult(context, plan);
    } catch (error) {
      setFormError(error.message || "현재 조건에 맞는 식단 구성이 어렵습니다. 조건을 완화해 주세요.");
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

function stableHash(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function getBodyType(bmi) {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  return "obese";
}

function getConstraint(goal, bodyType) {
  const base = constraintByGoal[goal] || constraintByGoal.general;
  const next = {
    kcalRange: [...base.kcalRange],
    minProtein: { ...base.minProtein },
    maxFat: { ...base.maxFat },
    maxSodiumPerMeal: base.maxSodiumPerMeal
  };

  if (bodyType === "underweight") {
    next.kcalRange[0] += 0.08;
    next.kcalRange[1] += 0.08;
    next.minProtein.breakfast += 2;
    next.minProtein.lunch += 2;
    next.minProtein.dinner += 2;
  }
  if (bodyType === "overweight") {
    next.kcalRange[0] -= 0.03;
    next.kcalRange[1] -= 0.07;
    next.maxFat.breakfast -= 2;
    next.maxFat.lunch -= 2;
    next.maxFat.dinner -= 2;
  }
  if (bodyType === "obese") {
    next.kcalRange[0] -= 0.06;
    next.kcalRange[1] -= 0.12;
    next.maxFat.breakfast -= 4;
    next.maxFat.lunch -= 4;
    next.maxFat.dinner -= 4;
    next.maxSodiumPerMeal -= 80;
  }

  return next;
}

function buildNutritionContext(profile) {
  const bmi = profile.weight / ((profile.height / 100) ** 2);
  const bodyType = getBodyType(bmi);

  let bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age;
  bmr += profile.gender === "male" ? 5 : -161;

  const maintenance = bmr * profile.activity;
  const goalProfile = plannerGoalProfiles[profile.goal] || plannerGoalProfiles.general;
  const targetCalories = Math.max(1200, Math.round(maintenance + goalProfile.calorieDelta));

  const mealTargets = {
    breakfast: Math.round(targetCalories * mealRatioMap.breakfast),
    lunch: Math.round(targetCalories * mealRatioMap.lunch),
    dinner: Math.round(targetCalories * mealRatioMap.dinner)
  };

  const seed = stableHash(
    `${profile.gender}-${profile.age}-${profile.height}-${profile.weight}-${profile.goal}-${profile.situation}-${profile.cuisine}-${profile.dietary}`
  );

  return {
    ...profile,
    bmi,
    bodyType,
    targetCalories,
    goalProfile,
    mealTargets,
    seed,
    constraint: getConstraint(profile.goal, bodyType),
    macroTarget: {
      carb: Math.round((targetCalories * goalProfile.macroRatio.carb) / 4),
      protein: Math.round((targetCalories * goalProfile.macroRatio.protein) / 4),
      fat: Math.round((targetCalories * goalProfile.macroRatio.fat) / 9)
    }
  };
}

function isDietaryAllowed(recipe, dietary) {
  if (dietary === "omnivore") return true;
  if (dietary === "vegetarian") return recipe.dietary.includes("vegetarian");
  if (dietary === "pescatarian") return recipe.dietary.includes("pescatarian") || recipe.dietary.includes("vegetarian");
  return false;
}

function isRecipeAllowed(recipe, context) {
  if (!isDietaryAllowed(recipe, context.dietary)) return false;
  if (recipe.allergens.some((item) => context.allergies.includes(item))) return false;
  return true;
}

function getPortionOptions(goal, bodyType) {
  if (goal === "muscle" || bodyType === "underweight") return [1.0, 1.15, 1.3];
  if (goal === "diet" || bodyType === "obese") return [0.8, 0.9, 1.0];
  return [0.9, 1.0, 1.1];
}

function getMealRepeatCount(history, mealType, recipeId) {
  return history.mealRecipeCount[mealType][recipeId] || 0;
}

function getProteinRepeatCount(history, mealType, proteinGroup) {
  return history.mealProteinGroupCount[mealType][proteinGroup] || 0;
}

function registerHistory(history, mealType, meal) {
  history.recipeIds.add(meal.id);
  history.recipeCount[meal.id] = (history.recipeCount[meal.id] || 0) + 1;
  history.mealRecipeCount[mealType][meal.id] = getMealRepeatCount(history, mealType, meal.id) + 1;
  history.mealProteinGroupCount[mealType][meal.proteinGroup] = getProteinRepeatCount(history, mealType, meal.proteinGroup) + 1;
  history.cuisineCount[meal.cuisine] = (history.cuisineCount[meal.cuisine] || 0) + 1;
}

function evaluateCandidate(recipe, portion, context, mealType, history, strict) {
  const scaled = {
    calories: Math.round(recipe.nutrition.calories * portion),
    protein: Math.round(recipe.nutrition.protein * portion),
    carbs: Math.round(recipe.nutrition.carbs * portion),
    fat: Math.round(recipe.nutrition.fat * portion),
    sodium: Math.round(recipe.nutrition.sodium * portion)
  };

  const mealTarget = context.mealTargets[mealType];
  const rule = context.constraint;
  const minCal = Math.round(mealTarget * rule.kcalRange[0]);
  const maxCal = Math.round(mealTarget * rule.kcalRange[1]);
  const minProtein = rule.minProtein[mealType];
  const maxFat = rule.maxFat[mealType];
  const maxSodium = rule.maxSodiumPerMeal;

  if (strict) {
    if (scaled.calories < minCal || scaled.calories > maxCal) return null;
    if (scaled.protein < minProtein) return null;
    if (scaled.fat > maxFat) return null;
    if (scaled.sodium > maxSodium) return null;
    if (getMealRepeatCount(history, mealType, recipe.id) > 0) return null;
  }

  let score = 220;
  score -= Math.abs(scaled.calories - mealTarget) / 6;
  score -= Math.abs(scaled.protein - minProtein) * 1.6;
  if (scaled.fat > maxFat) score -= (scaled.fat - maxFat) * 3.5;
  if (scaled.sodium > maxSodium) score -= (scaled.sodium - maxSodium) / 18;

  if (recipe.goals.includes(context.goal)) score += 20;
  if (recipe.situations.includes(context.situation)) score += 11;
  if (context.cuisine !== "any" && recipe.cuisine === context.cuisine) score += 8;
  if (recipe.prepTime <= context.maxPrep) score += 8;
  else score -= (recipe.prepTime - context.maxPrep) * 2;

  score -= getMealRepeatCount(history, mealType, recipe.id) * 120;
  score -= getProteinRepeatCount(history, mealType, recipe.proteinGroup) * 22;
  score -= (history.cuisineCount[recipe.cuisine] || 0) * 6;
  if (!history.recipeIds.has(recipe.id)) score += 9;

  return {
    score,
    meal: {
      id: recipe.id,
      title: recipe.title,
      mealType,
      cuisine: recipe.cuisine,
      proteinGroup: recipe.proteinGroup,
      prepTime: recipe.prepTime,
      portion,
      portionLabel: `${Math.round(portion * 100)}%`,
      calories: scaled.calories,
      protein: scaled.protein,
      carbs: scaled.carbs,
      fat: scaled.fat,
      sodium: scaled.sodium,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      tip: recipe.tip
    }
  };
}

function chooseBestCandidate(recipes, context, mealType, history, dayIndex) {
  const portions = getPortionOptions(context.goal, context.bodyType);
  const strictResults = [];
  const relaxedResults = [];

  recipes.forEach((recipe) => {
    portions.forEach((portion) => {
      const strictCandidate = evaluateCandidate(recipe, portion, context, mealType, history, true);
      if (strictCandidate) strictResults.push(strictCandidate);
      const relaxedCandidate = evaluateCandidate(recipe, portion, context, mealType, history, false);
      if (relaxedCandidate) relaxedResults.push(relaxedCandidate);
    });
  });

  const targetList = strictResults.length ? strictResults : relaxedResults;
  if (!targetList.length) return null;

  targetList.sort((a, b) => b.score - a.score);
  const topCount = Math.min(4, targetList.length);
  const top = targetList.slice(0, topCount);
  const pickIndex = stableHash(`${context.seed}-${dayIndex}-${mealType}-${topCount}`) % topCount;
  return top[pickIndex].meal;
}

function buildWeeklyPlan(context) {
  const history = {
    recipeIds: new Set(),
    recipeCount: {},
    cuisineCount: {},
    mealRecipeCount: { breakfast: {}, lunch: {}, dinner: {} },
    mealProteinGroupCount: { breakfast: {}, lunch: {}, dinner: {} }
  };

  const weeklyPlan = [];

  for (let day = 0; day < 7; day += 1) {
    const meals = mealOrder.map((mealType) => {
      const candidates = plannerRecipeCatalog.filter((recipe) => recipe.mealType === mealType && isRecipeAllowed(recipe, context));
      const chosen = chooseBestCandidate(candidates, context, mealType, history, day);
      if (!chosen) {
        throw new Error(`적합한 ${mealType} 후보가 없습니다.`);
      }
      registerHistory(history, mealType, chosen);
      return chosen;
    });

    const totals = meals.reduce(
      (acc, meal) => {
        acc.calories += meal.calories;
        acc.protein += meal.protein;
        acc.carbs += meal.carbs;
        acc.fat += meal.fat;
        acc.sodium += meal.sodium;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0, sodium: 0 }
    );

    weeklyPlan.push({ day: dayNames[day], meals, totals });
  }

  return weeklyPlan;
}

function buildMealReason(meal, context) {
  const reasons = [];
  const minProtein = context.constraint.minProtein[meal.mealType];
  const maxFat = context.constraint.maxFat[meal.mealType];

  if (meal.protein >= minProtein) {
    reasons.push(`단백질 ${meal.protein}g로 ${mealLabel[meal.mealType]} 기준(${minProtein}g) 충족`);
  } else {
    reasons.push(`단백질 ${meal.protein}g (권장 ${minProtein}g)`);
  }

  if (meal.fat <= maxFat) {
    reasons.push(`지방 ${meal.fat}g로 목표 기준(${maxFat}g) 이내`);
  }
  if (meal.sodium <= context.constraint.maxSodiumPerMeal) {
    reasons.push(`나트륨 ${meal.sodium}mg로 제한(${context.constraint.maxSodiumPerMeal}mg) 이내`);
  }
  if (meal.prepTime <= context.maxPrep) {
    reasons.push(`조리 ${meal.prepTime}분으로 설정(${context.maxPrep}분) 충족`);
  }
  if (context.cuisine !== "any" && meal.cuisine === context.cuisine) {
    reasons.push(`${cuisineLabel[meal.cuisine] || meal.cuisine} 선호 반영`);
  }

  return reasons.slice(0, 2).join(" · ");
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

  const uniqueRecipeCount = new Set(weeklyPlan.flatMap((dayPlan) => dayPlan.meals.map((meal) => meal.id))).size;
  const weeklyTotals = weeklyPlan.reduce(
    (acc, dayPlan) => {
      acc.calories += dayPlan.totals.calories;
      acc.protein += dayPlan.totals.protein;
      acc.carbs += dayPlan.totals.carbs;
      acc.fat += dayPlan.totals.fat;
      acc.sodium += dayPlan.totals.sodium;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, sodium: 0 }
  );
  const dailyAverageCalories = Math.round(weeklyTotals.calories / 7);
  const dailyAverageProtein = Math.round(weeklyTotals.protein / 7);
  const calorieGap = dailyAverageCalories - context.targetCalories;

  const guideByGoal = {
    diet: { href: "guide-diet", label: "체지방 감량 가이드" },
    muscle: { href: "guide-muscle", label: "근육 증가 가이드" },
    liver: { href: "guide-allergy", label: "알레르기·저자극 식단 가이드" },
    study: { href: "guide-focus", label: "집중력 식단 가이드" },
    general: { href: "guide-office", label: "사무직 체형관리 가이드" }
  };
  const recommendedGuide = guideByGoal[context.goal] || guideByGoal.general;

  let html = `
    <article class="summary-card">
      <h2>맞춤 분석 결과</h2>
      <div class="summary-grid">
        <div><small>BMI</small><strong>${context.bmi.toFixed(1)}</strong></div>
        <div><small>체형 분류</small><strong>${bodyTypeLabel}</strong></div>
        <div><small>목표 칼로리</small><strong>${context.targetCalories} kcal</strong></div>
        <div><small>권장 매크로</small><strong>탄 ${context.macroTarget.carb}g / 단 ${context.macroTarget.protein}g / 지 ${context.macroTarget.fat}g</strong></div>
      </div>
      <p class="guide">${plannerSituationGuides[context.situation] || "현재 생활 패턴에 맞춘 식단을 추천합니다."}</p>
      <p class="guide">${context.goalProfile.tips.join(" · ")}</p>
      <p class="guide">주간 다양성: ${uniqueRecipeCount}개 실존 레시피</p>
      <p class="guide">주간 평균: ${dailyAverageCalories} kcal / 단백질 ${dailyAverageProtein}g (목표 대비 ${calorieGap >= 0 ? "+" : ""}${calorieGap} kcal)</p>
      <p class="guide">심화 읽기: <a href="${recommendedGuide.href}">${recommendedGuide.label}</a></p>
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
          <p>${meal.protein}P / ${meal.carbs}C / ${meal.fat}F · Na ${meal.sodium}mg · ${meal.prepTime}분 · ${meal.portionLabel}</p>
          <p class="meal-reason">${buildMealReason(meal, context)}</p>
        </button>
      `;
    });

    html += `
      <div class="day-total">
        <span>일일 합계</span>
        <strong>${dayPlan.totals.calories} kcal</strong>
        <small>${dayPlan.totals.protein}P / ${dayPlan.totals.carbs}C / ${dayPlan.totals.fat}F / Na ${dayPlan.totals.sodium}mg</small>
      </div>
    </section>`;
  });

  html += "</section>";
  resultEl.innerHTML = html;

  resultEl.querySelectorAll(".meal-box").forEach((button) => {
    button.addEventListener("click", () => {
      const recipeId = button.dataset.recipeId;
      const recipe = weeklyPlan.flatMap((d) => d.meals).find((m) => m.id === recipeId);
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
      <div class="modal-meta">${recipe.calories} kcal · 단백질 ${recipe.protein}g · 탄수화물 ${recipe.carbs}g · 지방 ${recipe.fat}g · 나트륨 ${recipe.sodium}mg · 조리 ${recipe.prepTime}분 · ${recipe.portionLabel}</div>
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
