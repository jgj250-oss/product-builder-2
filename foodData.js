const allergyOptions = [
  { value: "egg", label: "계란" },
  { value: "dairy", label: "유제품" },
  { value: "wheat", label: "밀/글루텐" },
  { value: "peanut", label: "땅콩" },
  { value: "soy", label: "대두" },
  { value: "seafood", label: "해산물" },
  { value: "shellfish", label: "갑각류" },
  { value: "pork", label: "돼지고기" }
];

const goalProfiles = {
  diet: {
    label: "체지방 감량",
    calorieDelta: -450,
    macroRatio: { carb: 0.35, protein: 0.35, fat: 0.3 },
    tips: ["매 끼니 단백질 25g 이상", "액상 당류 최소화", "야식은 그릭요거트/두유로 대체"]
  },
  muscle: {
    label: "근육 증가",
    calorieDelta: 300,
    macroRatio: { carb: 0.4, protein: 0.35, fat: 0.25 },
    tips: ["운동 후 2시간 내 단백질+탄수화물 섭취", "하루 물 2L 이상", "취침 전 단백질 간식 권장"]
  },
  liver: {
    label: "간 건강",
    calorieDelta: -100,
    macroRatio: { carb: 0.45, protein: 0.3, fat: 0.25 },
    tips: ["저염 조리 우선", "가공육·튀김 빈도 축소", "채소 350g 이상 섭취"]
  },
  study: {
    label: "집중력 강화",
    calorieDelta: 0,
    macroRatio: { carb: 0.4, protein: 0.3, fat: 0.3 },
    tips: ["점심 과식 방지", "카페인 늦은 저녁 제한", "오메가3 식품 주 3회"]
  },
  general: {
    label: "균형 건강",
    calorieDelta: 0,
    macroRatio: { carb: 0.45, protein: 0.3, fat: 0.25 },
    tips: ["제철 채소 다양화", "통곡물 비중 확대", "주 1회 식단 점검"]
  }
};

const situationGuides = {
  office: "사무직은 활동량이 낮아 점심 탄수화물 과잉을 줄이고, 단백질 중심 간식을 배치하세요.",
  busy: "바쁜 일정이라면 20분 이하 조리 레시피 위주로 구성하고, 주말에 2~3일치 선조리하세요.",
  student: "수험/학습 상황은 혈당 급등을 피하기 위해 정제 탄수화물보다 통곡물과 견과류를 선택하세요.",
  workout: "운동 빈도가 높다면 점심/저녁 단백질량을 늘리고 운동 전후 탄수화물 타이밍을 맞추세요.",
  night: "야근이 잦다면 늦은 밤 고지방 식사를 피하고 따뜻한 단백질+채소 위주로 구성하세요."
};

const baseRecipePool = [
  {
    id: "b1",
    title: "그릭요거트 오트볼",
    cuisine: "western",
    mealType: "breakfast",
    tags: ["diet", "study", "general"],
    situations: ["office", "student", "busy"],
    bodyTypes: ["normal", "overweight", "obese"],
    dietary: ["omnivore", "vegetarian"],
    allergens: ["dairy", "wheat"],
    prepTime: 8,
    calories: 360,
    protein: 22,
    carbs: 42,
    fat: 11,
    ingredients: ["그릭요거트 150g", "오트밀 45g", "블루베리 60g", "호두 10g", "치아시드 1작은술"],
    steps: ["볼에 요거트와 오트밀을 넣어 섞습니다.", "블루베리와 견과류를 올립니다.", "치아시드를 뿌려 5분 두었다가 섭취합니다."],
    tip: "전날 밤 준비하면 아침 준비 시간을 더 줄일 수 있습니다."
  },
  {
    id: "b2",
    title: "닭가슴살 현미주먹밥",
    cuisine: "korean",
    mealType: "breakfast",
    tags: ["muscle", "general"],
    situations: ["workout", "busy"],
    bodyTypes: ["underweight", "normal", "overweight"],
    dietary: ["omnivore"],
    allergens: ["soy"],
    prepTime: 15,
    calories: 430,
    protein: 31,
    carbs: 50,
    fat: 9,
    ingredients: ["현미밥 180g", "닭가슴살 100g", "김가루", "저염간장 1작은술", "참기름 1작은술"],
    steps: ["닭가슴살을 삶아 잘게 찢습니다.", "현미밥과 닭가슴살, 김가루를 섞습니다.", "간장과 참기름으로 간한 뒤 주먹밥으로 만듭니다."],
    tip: "2개를 만들어 하나는 오전 간식으로 사용하세요."
  },
  {
    id: "b3",
    title: "두부 스크램블 토스트",
    cuisine: "western",
    mealType: "breakfast",
    tags: ["diet", "liver", "general"],
    situations: ["office", "night"],
    bodyTypes: ["normal", "overweight", "obese"],
    dietary: ["vegetarian"],
    allergens: ["wheat", "soy"],
    prepTime: 12,
    calories: 340,
    protein: 19,
    carbs: 33,
    fat: 14,
    ingredients: ["통밀식빵 1장", "단단한 두부 120g", "강황가루", "양파 20g", "시금치 한 줌"],
    steps: ["팬에 양파를 볶고 으깬 두부를 넣습니다.", "강황가루와 후추로 간해 스크램블처럼 익힙니다.", "토스트 위에 올리고 시금치를 곁들입니다."],
    tip: "달걀 알레르기 대체 아침으로 적합합니다."
  },
  {
    id: "b4",
    title: "연어 아보카도 덮밥",
    cuisine: "japanese",
    mealType: "breakfast",
    tags: ["study", "general", "muscle"],
    situations: ["student", "workout"],
    bodyTypes: ["underweight", "normal", "overweight"],
    dietary: ["pescatarian", "omnivore"],
    allergens: ["seafood"],
    prepTime: 14,
    calories: 490,
    protein: 29,
    carbs: 45,
    fat: 21,
    ingredients: ["훈제연어 90g", "현미밥 160g", "아보카도 1/2개", "오이", "레몬즙"],
    steps: ["밥 위에 슬라이스한 연어와 아보카도를 올립니다.", "오이를 얇게 썰어 곁들입니다.", "레몬즙을 뿌려 마무리합니다."],
    tip: "운동 전 2시간 식사로도 좋습니다."
  },
  {
    id: "b5",
    title: "북어해장 저염국 + 밥",
    cuisine: "korean",
    mealType: "breakfast",
    tags: ["liver", "general"],
    situations: ["office", "night"],
    bodyTypes: ["underweight", "normal", "overweight", "obese"],
    dietary: ["omnivore"],
    allergens: ["seafood", "egg"],
    prepTime: 18,
    calories: 380,
    protein: 24,
    carbs: 46,
    fat: 8,
    ingredients: ["북어채 40g", "무 80g", "달걀 1개", "밥 120g", "국간장 소량"],
    steps: ["북어채를 참기름에 살짝 볶습니다.", "물과 무를 넣고 끓입니다.", "달걀물을 풀고 국간장으로 약하게 간합니다."],
    tip: "저염 버전으로 간 건강 관리에 적합합니다."
  },
  {
    id: "b6",
    title: "바나나 단백질 스무디",
    cuisine: "western",
    mealType: "breakfast",
    tags: ["muscle", "busy"],
    situations: ["busy", "workout"],
    bodyTypes: ["underweight", "normal"],
    dietary: ["omnivore", "vegetarian"],
    allergens: ["dairy"],
    prepTime: 5,
    calories: 420,
    protein: 32,
    carbs: 48,
    fat: 9,
    ingredients: ["바나나 1개", "우유 250ml", "단백질파우더 1스쿱", "오트밀 20g", "얼음"],
    steps: ["모든 재료를 블렌더에 넣습니다.", "30초 이상 충분히 갈아줍니다.", "운동 후 바로 섭취합니다."],
    tip: "유당 민감하면 두유로 대체 가능합니다."
  },
  {
    id: "l1",
    title: "지중해 병아리콩 샐러드",
    cuisine: "mediterranean",
    mealType: "lunch",
    tags: ["diet", "liver", "general"],
    situations: ["office", "student"],
    bodyTypes: ["normal", "overweight", "obese"],
    dietary: ["vegetarian"],
    allergens: [],
    prepTime: 12,
    calories: 450,
    protein: 18,
    carbs: 52,
    fat: 18,
    ingredients: ["병아리콩 130g", "오이", "토마토", "올리브", "올리브오일 1큰술"],
    steps: ["채소를 깍둑썰기합니다.", "병아리콩과 함께 볼에 담습니다.", "올리브오일과 레몬즙으로 버무립니다."],
    tip: "통밀빵을 곁들이면 포만감이 오래갑니다."
  },
  {
    id: "l2",
    title: "닭가슴살 메밀국수",
    cuisine: "japanese",
    mealType: "lunch",
    tags: ["diet", "muscle", "study"],
    situations: ["office", "busy", "workout"],
    bodyTypes: ["normal", "overweight", "obese"],
    dietary: ["omnivore"],
    allergens: ["wheat", "soy"],
    prepTime: 20,
    calories: 510,
    protein: 35,
    carbs: 58,
    fat: 12,
    ingredients: ["메밀면 100g", "닭가슴살 120g", "오이", "무순", "저염 쯔유"],
    steps: ["메밀면을 삶아 찬물에 헹굽니다.", "닭가슴살을 삶아 슬라이스합니다.", "채소와 함께 담고 쯔유를 곁들입니다."],
    tip: "점심 졸림을 줄이는 깔끔한 식사입니다."
  },
  {
    id: "l3",
    title: "저염 된장 두부비빔밥",
    cuisine: "korean",
    mealType: "lunch",
    tags: ["liver", "general", "diet"],
    situations: ["office", "night"],
    bodyTypes: ["normal", "overweight", "obese"],
    dietary: ["vegetarian", "omnivore"],
    allergens: ["soy"],
    prepTime: 18,
    calories: 470,
    protein: 24,
    carbs: 57,
    fat: 14,
    ingredients: ["현미밥 160g", "두부 120g", "시금치", "콩나물", "저염된장"],
    steps: ["두부를 구워 한입 크기로 자릅니다.", "채소를 데칩니다.", "밥 위에 올리고 된장 소스를 소량 곁들입니다."],
    tip: "나트륨 관리가 필요한 직장인 점심으로 적합합니다."
  },
  {
    id: "l4",
    title: "소고기 퀴노아 볼",
    cuisine: "western",
    mealType: "lunch",
    tags: ["muscle", "general"],
    situations: ["workout", "office"],
    bodyTypes: ["underweight", "normal", "overweight"],
    dietary: ["omnivore"],
    allergens: [],
    prepTime: 22,
    calories: 620,
    protein: 39,
    carbs: 50,
    fat: 26,
    ingredients: ["우둔살 130g", "퀴노아 150g", "파프리카", "브로콜리", "올리브오일"],
    steps: ["퀴노아를 먼저 삶습니다.", "소고기를 센불에 빠르게 굽습니다.", "구운 채소와 함께 볼로 담습니다."],
    tip: "근력운동이 있는 날 점심으로 배치하면 좋습니다."
  },
  {
    id: "l5",
    title: "중화풍 두부채소 볶음",
    cuisine: "chinese",
    mealType: "lunch",
    tags: ["diet", "general", "study"],
    situations: ["busy", "student"],
    bodyTypes: ["normal", "overweight", "obese"],
    dietary: ["vegetarian"],
    allergens: ["soy"],
    prepTime: 15,
    calories: 430,
    protein: 22,
    carbs: 42,
    fat: 17,
    ingredients: ["두부 180g", "청경채", "버섯", "마늘", "저염간장"],
    steps: ["두부를 노릇하게 부칩니다.", "채소와 마늘을 볶아 향을 냅니다.", "저염간장으로 간해 마무리합니다."],
    tip: "밥량을 줄이면 감량식으로 활용 가능합니다."
  },
  {
    id: "l6",
    title: "참치 아보카도 통밀랩",
    cuisine: "western",
    mealType: "lunch",
    tags: ["study", "general", "diet"],
    situations: ["busy", "office", "student"],
    bodyTypes: ["normal", "overweight"],
    dietary: ["pescatarian", "omnivore"],
    allergens: ["wheat", "seafood", "egg"],
    prepTime: 10,
    calories: 520,
    protein: 31,
    carbs: 46,
    fat: 24,
    ingredients: ["통밀 또띠아 1장", "참치 100g", "아보카도 1/2개", "양상추", "요거트소스"],
    steps: ["참치와 소스를 섞습니다.", "또띠아에 채소와 아보카도, 참치를 올립니다.", "단단히 말아 반으로 잘라줍니다."],
    tip: "이동 중 식사 대체에 유리합니다."
  },
  {
    id: "d1",
    title: "연어 스테이크와 구운 채소",
    cuisine: "mediterranean",
    mealType: "dinner",
    tags: ["liver", "study", "general"],
    situations: ["office", "night"],
    bodyTypes: ["normal", "overweight", "obese"],
    dietary: ["pescatarian", "omnivore"],
    allergens: ["seafood"],
    prepTime: 22,
    calories: 540,
    protein: 36,
    carbs: 28,
    fat: 31,
    ingredients: ["연어 160g", "브로콜리", "파프리카", "올리브오일", "레몬"],
    steps: ["연어에 후추와 레몬즙을 뿌립니다.", "팬에서 앞뒤로 구워 익힙니다.", "채소를 함께 구워 곁들입니다."],
    tip: "야근 후에도 부담이 덜한 저탄수 저녁입니다."
  },
  {
    id: "d2",
    title: "한방 닭곰탕과 현미밥",
    cuisine: "korean",
    mealType: "dinner",
    tags: ["general", "muscle", "liver"],
    situations: ["night", "workout"],
    bodyTypes: ["underweight", "normal", "overweight"],
    dietary: ["omnivore"],
    allergens: [],
    prepTime: 30,
    calories: 590,
    protein: 40,
    carbs: 54,
    fat: 17,
    ingredients: ["닭가슴살 또는 닭다리살 170g", "대파", "마늘", "현미밥 130g"],
    steps: ["닭을 대파, 마늘과 함께 끓입니다.", "살을 찢어 다시 국물에 넣습니다.", "밥과 함께 제공합니다."],
    tip: "국물 간은 최소화해서 나트륨 부담을 줄이세요."
  },
  {
    id: "d3",
    title: "두부버섯 전골",
    cuisine: "korean",
    mealType: "dinner",
    tags: ["diet", "liver", "general"],
    situations: ["family", "night"],
    bodyTypes: ["normal", "overweight", "obese"],
    dietary: ["vegetarian", "omnivore"],
    allergens: ["soy"],
    prepTime: 25,
    calories: 420,
    protein: 27,
    carbs: 34,
    fat: 18,
    ingredients: ["두부 200g", "표고/느타리 버섯", "청경채", "무", "멸치육수"],
    steps: ["냄비에 육수와 무를 먼저 끓입니다.", "두부와 버섯을 넣고 익힙니다.", "채소를 넣어 3분간 더 끓입니다."],
    tip: "저녁 과식을 막는 고단백 저열량 메뉴입니다."
  },
  {
    id: "d4",
    title: "닭다리살 허브구이 플레이트",
    cuisine: "western",
    mealType: "dinner",
    tags: ["muscle", "general"],
    situations: ["workout", "family"],
    bodyTypes: ["underweight", "normal", "overweight"],
    dietary: ["omnivore"],
    allergens: [],
    prepTime: 28,
    calories: 650,
    protein: 44,
    carbs: 38,
    fat: 34,
    ingredients: ["닭다리살 180g", "감자 120g", "아스파라거스", "로즈마리", "올리브오일"],
    steps: ["닭다리살에 허브를 문질러 10분 둡니다.", "오븐 200도에서 18분 굽습니다.", "구운 감자와 채소를 함께 담습니다."],
    tip: "탄수화물이 필요한 훈련일 저녁에 적합합니다."
  },
  {
    id: "d5",
    title: "새우 브로콜리 마늘볶음",
    cuisine: "chinese",
    mealType: "dinner",
    tags: ["diet", "study", "general"],
    situations: ["busy", "office"],
    bodyTypes: ["normal", "overweight", "obese"],
    dietary: ["pescatarian", "omnivore"],
    allergens: ["seafood", "shellfish", "soy"],
    prepTime: 14,
    calories: 390,
    protein: 32,
    carbs: 24,
    fat: 16,
    ingredients: ["새우 170g", "브로콜리 150g", "마늘", "저염간장", "올리브오일"],
    steps: ["팬에 마늘 향을 냅니다.", "새우를 넣어 붉게 익힙니다.", "브로콜리와 소스를 넣고 3분 더 볶습니다."],
    tip: "야근일 15분 완성 저녁으로 좋습니다."
  },
  {
    id: "d6",
    title: "소고기 채소죽",
    cuisine: "korean",
    mealType: "dinner",
    tags: ["liver", "general", "study"],
    situations: ["night", "student"],
    bodyTypes: ["underweight", "normal", "overweight", "obese"],
    dietary: ["omnivore"],
    allergens: [],
    prepTime: 24,
    calories: 460,
    protein: 27,
    carbs: 56,
    fat: 13,
    ingredients: ["소고기 다짐육 90g", "불린 쌀 90g", "당근", "애호박", "참기름 소량"],
    steps: ["소고기를 볶아 향을 냅니다.", "불린 쌀과 물을 넣고 끓입니다.", "채소를 넣고 걸쭉해질 때까지 저어줍니다."],
    tip: "소화가 예민한 날 대체식으로 활용 가능합니다."
  }
];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function mergeUnique(base, extra) {
  return Array.from(new Set([...(base || []), ...(extra || [])]));
}

function applyRecipeVariant(recipe, variant) {
  return {
    ...recipe,
    id: `${recipe.id}-${variant.key}`,
    title: `${recipe.title} (${variant.label})`,
    prepTime: clamp(recipe.prepTime + (variant.prepDelta || 0), 5, 45),
    calories: clamp(recipe.calories + (variant.calorieDelta || 0), 220, 980),
    protein: clamp(recipe.protein + (variant.proteinDelta || 0), 8, 95),
    carbs: clamp(recipe.carbs + (variant.carbDelta || 0), 8, 170),
    fat: clamp(recipe.fat + (variant.fatDelta || 0), 3, 70),
    ingredients: [...recipe.ingredients, ...(variant.ingredientsAdd || [])],
    steps: [...(variant.stepsAdd || []), ...recipe.steps],
    tip: `${recipe.tip} ${variant.tipAdd || ""}`.trim(),
    tags: mergeUnique(recipe.tags, variant.tagsAdd),
    situations: mergeUnique(recipe.situations, variant.situationsAdd),
    bodyTypes: mergeUnique(recipe.bodyTypes, variant.bodyTypesAdd),
    dietary: mergeUnique(recipe.dietary, variant.dietaryAdd)
  };
}

function createNutritionVariants(base) {
  const variants = [
    {
      key: "quick",
      label: "퀵",
      prepDelta: -4,
      calorieDelta: -35,
      proteinDelta: 2,
      carbDelta: -3,
      fatDelta: -2,
      ingredientsAdd: ["손질 채소 1컵"],
      stepsAdd: ["재료를 미리 손질해 조리 시간을 줄입니다."],
      tipAdd: "바쁜 일정용 퀵 버전입니다.",
      tagsAdd: ["general"],
      situationsAdd: ["busy"]
    },
    {
      key: "power",
      label: "고단백",
      prepDelta: 2,
      calorieDelta: 85,
      proteinDelta: 7,
      carbDelta: 3,
      fatDelta: 2,
      ingredientsAdd: ["단백질 보강 재료 1회분"],
      stepsAdd: ["마지막에 단백질 보강 재료를 추가합니다."],
      tipAdd: "훈련일 고단백 버전입니다.",
      tagsAdd: ["muscle", "general"],
      situationsAdd: ["workout"],
      bodyTypesAdd: ["underweight", "normal"]
    },
    {
      key: "low-sodium",
      label: "저염",
      prepDelta: 1,
      calorieDelta: -20,
      proteinDelta: 1,
      carbDelta: 0,
      fatDelta: -1,
      ingredientsAdd: ["저염 양념"],
      stepsAdd: ["소금 대신 허브와 향신 채소로 풍미를 냅니다."],
      tipAdd: "저염 관리 버전입니다.",
      tagsAdd: ["liver", "diet"],
      situationsAdd: ["office", "night"]
    },
    {
      key: "fiber",
      label: "고섬유",
      prepDelta: 2,
      calorieDelta: 15,
      proteinDelta: 0,
      carbDelta: 6,
      fatDelta: 1,
      ingredientsAdd: ["섬유질 채소 토핑"],
      stepsAdd: ["채소 토핑을 추가해 식이섬유 밀도를 높입니다."],
      tipAdd: "포만감 유지 버전입니다.",
      tagsAdd: ["diet", "study", "general"],
      situationsAdd: ["office", "student"]
    },
    {
      key: "night-light",
      label: "야간 라이트",
      prepDelta: -2,
      calorieDelta: -60,
      proteinDelta: 2,
      carbDelta: -8,
      fatDelta: -2,
      ingredientsAdd: ["가벼운 채소 가니시"],
      stepsAdd: ["늦은 시간 소화를 고려해 간을 약하게 조절합니다."],
      tipAdd: "야근일 저녁 부담을 줄인 버전입니다.",
      tagsAdd: ["diet", "liver"],
      situationsAdd: ["night", "busy"],
      bodyTypesAdd: ["overweight", "obese"]
    },
    {
      key: "recovery",
      label: "회복",
      prepDelta: 2,
      calorieDelta: 70,
      proteinDelta: 6,
      carbDelta: 8,
      fatDelta: 2,
      ingredientsAdd: ["회복용 단백질 토핑"],
      stepsAdd: ["운동 후 회복을 위해 단백질 비중을 높입니다."],
      tipAdd: "운동 후 회복 버전입니다.",
      tagsAdd: ["muscle", "general"],
      situationsAdd: ["workout"],
      bodyTypesAdd: ["underweight", "normal"]
    }
  ];

  return base.flatMap((recipe) => variants.map((variant) => applyRecipeVariant(recipe, variant)));
}

function createFlavorVariants(base) {
  const flavorByCuisine = {
    korean: [
      { key: "k-sesame", label: "들깨향", ingredientsAdd: ["들깨가루 소량"], stepsAdd: ["마무리로 들깨향을 더합니다."], tipAdd: "고소한 풍미 버전입니다." },
      { key: "k-fresh", label: "깔끔채소", ingredientsAdd: ["제철 생채소"], stepsAdd: ["아삭한 생채소를 곁들입니다."], tipAdd: "산뜻한 풍미 버전입니다." }
    ],
    japanese: [
      { key: "j-yuzu", label: "유자향", ingredientsAdd: ["유자즙 소량"], stepsAdd: ["유자향을 더해 마무리합니다."], tipAdd: "상큼한 향 버전입니다." },
      { key: "j-kelp", label: "다시마풍미", ingredientsAdd: ["다시마 우린 물"], stepsAdd: ["육수에 다시마 풍미를 더합니다."], tipAdd: "감칠맛 강화 버전입니다." }
    ],
    mediterranean: [
      { key: "m-herb", label: "올리브허브", ingredientsAdd: ["허브 블렌드"], stepsAdd: ["허브를 더해 지중해풍 향을 강화합니다."], tipAdd: "허브향 강화 버전입니다." },
      { key: "m-lemon", label: "레몬오레가노", ingredientsAdd: ["레몬 제스트"], stepsAdd: ["레몬 제스트를 마무리로 뿌립니다."], tipAdd: "레몬향 강화 버전입니다." }
    ],
    western: [
      { key: "w-herb", label: "허브레몬", ingredientsAdd: ["허브 레몬 드레싱"], stepsAdd: ["허브 레몬 드레싱으로 맛을 정리합니다."], tipAdd: "밸런스 강화 버전입니다." },
      { key: "w-basil", label: "바질토핑", ingredientsAdd: ["신선한 바질"], stepsAdd: ["바질 토핑으로 향을 완성합니다."], tipAdd: "향긋한 바질 버전입니다." }
    ],
    chinese: [
      { key: "c-ginger", label: "생강파향", ingredientsAdd: ["생강채", "대파"], stepsAdd: ["생강과 대파 향을 더해 마무리합니다."], tipAdd: "풍미 강화 버전입니다." },
      { key: "c-garlic", label: "마늘후추", ingredientsAdd: ["통마늘", "후추"], stepsAdd: ["마늘과 후추 향을 올립니다."], tipAdd: "담백한 매운 향 버전입니다." }
    ]
  };

  return base.flatMap((recipe) => {
    const flavors = flavorByCuisine[recipe.cuisine] || [];
    return flavors.map((flavor) =>
      applyRecipeVariant(recipe, {
        ...flavor,
        key: flavor.key,
        label: flavor.label,
        prepDelta: 1,
        calorieDelta: 10,
        proteinDelta: 0,
        carbDelta: 1,
        fatDelta: 1,
        tagsAdd: ["general"],
        situationsAdd: ["office"]
      })
    );
  });
}

function createSeasonalVariants(base) {
  const seasonal = [
    {
      key: "spring",
      label: "제철채소",
      prepDelta: 1,
      calorieDelta: 20,
      proteinDelta: 0,
      carbDelta: 2,
      fatDelta: 0,
      ingredientsAdd: ["제철 채소 토핑"],
      stepsAdd: ["제철 채소를 더해 식감을 보강합니다."],
      tipAdd: "계절 채소 강화 버전입니다.",
      tagsAdd: ["general", "study"],
      situationsAdd: ["office", "student"]
    },
    {
      key: "warm",
      label: "온기플랜",
      prepDelta: 2,
      calorieDelta: 40,
      proteinDelta: 1,
      carbDelta: 4,
      fatDelta: 1,
      ingredientsAdd: ["따뜻한 수프 또는 국물 곁들임"],
      stepsAdd: ["따뜻하게 섭취하도록 마지막 온도를 맞춥니다."],
      tipAdd: "체온 유지 버전입니다.",
      tagsAdd: ["general", "liver"],
      situationsAdd: ["night", "office"]
    }
  ];

  return base.flatMap((recipe) => seasonal.map((variant) => applyRecipeVariant(recipe, variant)));
}

function buildRecipePool(base) {
  const nutritionVariants = createNutritionVariants(base);
  const flavorVariants = createFlavorVariants(base);
  const seasonalVariants = createSeasonalVariants(base);

  const merged = [...base, ...nutritionVariants, ...flavorVariants, ...seasonalVariants];
  const dedupMap = new Map();
  merged.forEach((recipe) => {
    if (!dedupMap.has(recipe.id)) dedupMap.set(recipe.id, recipe);
  });
  return Array.from(dedupMap.values());
}

const recipePool = buildRecipePool(baseRecipePool);

window.VITAL_DATA = {
  allergyOptions,
  goalProfiles,
  situationGuides,
  recipePool
};
