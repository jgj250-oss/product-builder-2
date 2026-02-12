class DinnerRecommender extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isEnglish = navigator.language.startsWith('en');
    
    this.keywordMap = {
      '치킨': { en: 'fried chicken', desc: '바삭한 튀김옷과 촉촉한 속살의 조화! 오늘 하루 고생한 당신에게 주는 최고의 선물입니다.', tips: '맥주나 콜라와 함께 즐기면 더욱 맛있어요.' },
      '피자': { en: 'pizza', desc: '다양한 토핑과 치즈의 풍미가 가득! 가족이나 친구와 함께 나누어 먹기 좋습니다.', tips: '갈릭 디핑 소스를 곁들여 보세요.' },
      '삼겹살': { en: 'pork belly', desc: '지글지글 구워지는 소리만으로도 행복해지는 맛. 쌈 채소와 함께 건강하게 즐기세요.', tips: '구운 김치와 마늘은 필수입니다.' },
      '족발': { en: 'pork trotters', desc: '콜라겐 가득 쫄깃한 식감! 야식의 대명사이지만 저녁 식사로도 든든합니다.', tips: '막국수와 함께 먹으면 느끼함을 잡아줍니다.' },
      '햄버거': { en: 'hamburger', desc: '간편하면서도 영양 가득한 한 끼. 신선한 야채와 패티의 육즙을 느껴보세요.', tips: '감자튀김 대신 샐러드를 선택해 건강을 챙겨보세요.' },
      '초밥': { en: 'sushi', desc: '신선한 해산물의 깔끔한 맛. 담백하고 고급스러운 저녁 식사를 원하신다면 추천합니다.', tips: '흰 살 생선부터 붉은 살 생선 순으로 드셔보세요.' },
      '마라탕': { en: 'malatang', desc: '얼큰하고 매콤한 국물이 생각나는 날. 좋아하는 재료를 듬뿍 넣어 나만의 메뉴를 만들어보세요.', tips: '매운 맛 단계는 신중하게 선택하세요!' },
      '떡볶이': { en: 'tteokbokki', desc: '매콤달콤한 소스와 쫄깃한 떡의 만남. 한국인의 소울푸드로 기분 전환을 해보세요.', tips: '튀김이나 순대를 소스에 찍어 먹는 것이 국룰입니다.' },
      '돈까스': { en: 'pork cutlet', desc: '겉바속촉의 정석! 남녀노소 누구나 좋아하는 든든한 일식/경양식 메뉴입니다.', tips: '와사비를 살짝 얹어 먹으면 풍미가 살아납니다.' },
      '파스타': { en: 'pasta', desc: '우아한 분위기를 내고 싶은 저녁. 크림, 토마토, 오일 등 취향에 맞는 소스를 선택하세요.', tips: '면의 익힘 정도(알 덴테)를 확인해보세요.' },
      '제육볶음': { en: 'spicy pork', desc: '매콤한 양념에 볶아낸 고기와 흰 쌀밥의 완벽한 조합. 밥도둑이 따로 없습니다.', tips: '상추쌈에 싸 먹으면 더욱 맛있습니다.' },
      '김치찌개': { en: 'kimchi stew', desc: '한국인의 힘! 푹 익은 김치와 돼지고기가 우러난 깊은 국물 맛을 느껴보세요.', tips: '계란말이나 계란후라이와 찰떡궁합입니다.' },
      '된장찌개': { en: 'soybean paste stew', desc: '구수하고 담백한 고향의 맛. 속을 편안하게 해주는 건강한 저녁 식사입니다.', tips: '두부와 애호박을 듬뿍 넣어보세요.' },
      '비빔밥': { en: 'bibimbap', desc: '색색의 나물과 고추장의 조화. 영양 밸런스가 가장 뛰어난 한국의 대표 음식입니다.', tips: '참기름 한 방울이 고소함을 더해줍니다.' },
      '칼국수': { en: 'kalguksu', desc: '비 오는 날이나 쌀쌀한 날씨에 제격! 쫄깃한 면발과 시원한 국물이 일품입니다.', tips: '겉절이 김치와 함께 드시면 더욱 좋습니다.' },
      '짜장면': { en: 'jajangmyeon', desc: '이사하는 날만 먹는 게 아니죠! 달콤 짭조름한 춘장 소스의 유혹을 이겨내기 힘듭니다.', tips: '고춧가루를 살짝 뿌려 먹으면 느끼함을 줄여줍니다.' },
      '짬뽕': { en: 'jjamppong', desc: '해물이 가득 들어간 시원하고 칼칼한 국물. 스트레스를 한 방에 날려버릴 매운맛입니다.', tips: '단무지는 필수입니다.' },
      '탕수육': { en: 'sweet and sour pork', desc: '부먹? 찍먹? 어떻게 먹어도 맛있는 바삭한 고기 튀김과 달콤한 소스의 만남.', tips: '간장, 식초, 고춧가루 소스에 찍어 드셔보세요.' },
      '쌀국수': { en: 'pho', desc: '부담 없는 깔끔한 국물. 고수와 레몬즙을 더해 이국적인 풍미를 즐겨보세요.', tips: '해칠 소스와 스리라차 소스를 섞어 고기를 찍어 드세요.' },
      '스테이크': { en: 'steak', desc: '특별한 날, 나를 위한 선물. 육즙 가득한 고품격 저녁 식사를 즐겨보세요.', tips: '굽기 정도(미디움 등)를 취향에 맞게 선택하세요.' }
    };

    this.render();
  }

  connectedCallback() {
    this.recommendMenu();
  }

  render() {
    const style = document.createElement('style');
    style.textContent = `
      .wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        max-width: 600px;
      }
      button {
        padding: 15px 40px;
        font-size: 1.2rem;
        font-weight: bold;
        color: white;
        background: linear-gradient(145deg, #ff9a9e, #fad0c4);
        border: none;
        border-radius: 50px;
        cursor: pointer;
        margin-bottom: 30px;
        box-shadow: 0 0 15px rgba(255, 154, 158, 0.8), 0 0 30px rgba(250, 208, 196, 0.6);
        transition: all 0.3s ease-in-out;
      }
      button:hover {
        transform: translateY(-2px);
        box-shadow: 0 0 20px rgba(255, 154, 158, 1), 0 0 40px rgba(250, 208, 196, 0.8);
      }
      .result {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        width: 100%;
        background: rgba(255, 255, 255, 0.05);
        padding: 25px;
        border-radius: 30px;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      .label {
        font-size: 1.1rem;
        opacity: 0.9;
        font-weight: 500;
      }
      .menu-item {
        padding: 15px 35px;
        border-radius: 15px;
        font-size: 2.5rem;
        font-weight: 900;
        color: white;
        text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        background: linear-gradient(145deg, #f6d365, #fda085);
        animation: appear 0.5s ease-out forwards;
      }
      .description {
        line-height: 1.6;
        text-align: center;
        word-break: keep-all;
        font-size: 1.1rem;
        color: var(--text-color);
        opacity: 0.9;
      }
      .tip-box {
        background: rgba(255, 165, 0, 0.15);
        padding: 15px 20px;
        border-radius: 15px;
        font-size: 0.95rem;
        border-left: 5px solid #ffa500;
        width: 100%;
        box-sizing: border-box;
      }
      .tip-title {
        font-weight: bold;
        color: #ffa500;
        margin-bottom: 5px;
        display: block;
      }
      .image-container {
        width: 100%;
        height: 350px;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 15px 30px rgba(0,0,0,0.3);
        margin-top: 10px;
        background: #333;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      }
      .menu-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0;
        transition: opacity 0.5s ease-in-out;
      }
      .menu-image.loaded {
        opacity: 1;
      }
      .loading-text {
        position: absolute;
        color: white;
        font-size: 0.9rem;
      }

      @keyframes appear {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(style);
    
    const wrapper = document.createElement('div');
    wrapper.className = 'wrapper';
    
    const button = document.createElement('button');
    button.textContent = this.isEnglish ? 'Show Me Another!' : '오늘 저녁 메뉴 다시 추천받기';
    button.onclick = () => this.recommendMenu();
    
    this.resultContainer = document.createElement('div');
    this.resultContainer.className = 'result';
    
    wrapper.appendChild(button);
    wrapper.appendChild(this.resultContainer);
    this.shadowRoot.appendChild(wrapper);

    this.menus = Object.keys(this.keywordMap);
  }

  recommendMenu() {
    this.resultContainer.innerHTML = '';
    
    const randomIndex = Math.floor(Math.random() * this.menus.length);
    const selectedMenuName = this.menus[randomIndex];
    const selectedMenu = this.keywordMap[selectedMenuName];
    
    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = "AI가 고심해서 고른 오늘 저녁 추천 메뉴는?";
    
    const menuDiv = document.createElement('div');
    menuDiv.className = 'menu-item';
    menuDiv.textContent = selectedMenuName;

    const descDiv = document.createElement('div');
    descDiv.className = 'description';
    descDiv.textContent = selectedMenu.desc;

    const tipBox = document.createElement('div');
    tipBox.className = 'tip-box';
    const tipTitle = document.createElement('span');
    tipTitle.className = 'tip-title';
    tipTitle.textContent = "💡 더 맛있게 즐기는 팁";
    tipBox.appendChild(tipTitle);
    tipBox.insertAdjacentText('beforeend', selectedMenu.tips);
    
    const imgContainer = document.createElement('div');
    imgContainer.className = 'image-container';
    
    const loadingText = document.createElement('div');
    loadingText.className = 'loading-text';
    loadingText.textContent = '맛있는 이미지 불러오는 중...';
    
    const img = document.createElement('img');
    img.className = 'menu-image';
    
    const searchKeyword = selectedMenu.en;
    img.src = `https://loremflickr.com/600/450/${encodeURIComponent(searchKeyword)},food/all?lock=${Math.floor(Math.random() * 1000)}`;
    
    img.onload = () => {
      img.classList.add('loaded');
      loadingText.style.display = 'none';
    };
    
    img.onerror = () => {
      img.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=60';
      img.classList.add('loaded');
      loadingText.style.display = 'none';
    };
    
    imgContainer.appendChild(loadingText);
    imgContainer.appendChild(img);

    this.resultContainer.appendChild(label);
    this.resultContainer.appendChild(menuDiv);
    this.resultContainer.appendChild(imgContainer);
    this.resultContainer.appendChild(descDiv);
    this.resultContainer.appendChild(tipBox);
  }
}

customElements.define('dinner-recommender', DinnerRecommender);

document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    if (localStorage.getItem('theme') === 'light') body.classList.add('light-mode');

    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        localStorage.setItem('theme', body.classList.contains('light-mode') ? 'light' : 'dark');
    });
});