class DinnerRecommender extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isEnglish = navigator.language.startsWith('en');
    
    // 메뉴별 이미지 검색을 위한 영문 키워드 매핑
    this.keywordMap = {
      '치킨': 'fried chicken', '피자': 'pizza', '삼겹살': 'pork belly', '족발': 'pork trotters', '햄버거': 'hamburger',
      '초밥': 'sushi', '마라탕': 'malatang', '떡볶이': 'tteokbokki', '돈까스': 'pork cutlet', '파스타': 'pasta',
      '제육볶음': 'spicy pork', '김치찌개': 'kimchi stew', '된장찌개': 'soybean paste stew', '비빔밥': 'bibimbap', '칼국수': 'kalguksu',
      '짜장면': 'jajangmyeon', '짬뽕': 'jjamppong', '탕수육': 'sweet and sour pork', '쌀국수': 'pho', '스테이크': 'steak'
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
        max-width: 500px;
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
        z-index: 10;
      }
      button:hover {
        transform: translateY(-2px);
        box-shadow: 0 0 20px rgba(255, 154, 158, 1), 0 0 40px rgba(250, 208, 196, 0.8);
      }
      .result {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
        width: 100%;
      }
      .label {
        font-size: 1.1rem;
        opacity: 0.9;
        font-weight: 500;
      }
      .menu-item {
        padding: 15px 35px;
        border-radius: 15px;
        font-size: 2.2rem;
        font-weight: 900;
        color: white;
        text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        background: linear-gradient(145deg, #f6d365, #fda085);
        animation: appear 0.5s ease-out forwards;
      }
      .image-container {
        width: 100%;
        height: 250px;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 15px 30px rgba(0,0,0,0.3);
        margin-top: 10px;
        animation: appear 0.8s ease-out forwards;
        background: #eee;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .menu-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      @keyframes appear {
        from {
          opacity: 0;
          transform: translateY(30px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
    `;

    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'wrapper');

    const button = document.createElement('button');
    button.textContent = this.isEnglish ? 'Show Me Another!' : '다른 거 추천해줘!';
    button.addEventListener('click', () => this.recommendMenu());

    const resultContainer = document.createElement('div');
    resultContainer.setAttribute('class', 'result');

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(wrapper);
    wrapper.appendChild(button);
    wrapper.appendChild(resultContainer);

    this.menus = this.isEnglish ? Object.values(this.keywordMap) : Object.keys(this.keywordMap);
  }

  recommendMenu() {
    const resultContainer = this.shadowRoot.querySelector('.result');
    resultContainer.innerHTML = '';
    
    const randomIndex = Math.floor(Math.random() * this.menus.length);
    const selectedMenu = this.menus[randomIndex];
    
    // 라벨 추가
    const label = document.createElement('div');
    label.setAttribute('class', 'label');
    label.textContent = this.isEnglish ? "How about this?" : "오늘 저녁은 이거다!";
    
    // 메뉴 텍스트 추가
    const menuDiv = document.createElement('div');
    menuDiv.setAttribute('class', 'menu-item');
    menuDiv.textContent = selectedMenu;
    
    // 이미지 컨테이너 및 이미지 추가
    const imgContainer = document.createElement('div');
    imgContainer.setAttribute('class', 'image-container');
    
    const img = document.createElement('img');
    img.setAttribute('class', 'menu-image');
    
    // 검색어 결정
    const searchKeyword = this.isEnglish ? selectedMenu : (this.keywordMap[selectedMenu] || selectedMenu);
    
    // Unsplash 소스 사용 (랜덤성을 위해 타임스탬프 추가)
    img.src = `https://source.unsplash.com/featured/?${encodeURIComponent(searchKeyword)},food&sig=${Date.now()}`;
    
    imgContainer.appendChild(img);
    resultContainer.appendChild(label);
    resultContainer.appendChild(menuDiv);
    resultContainer.appendChild(imgContainer);
  }
}

customElements.define('dinner-recommender', DinnerRecommender);

// 테마 토글
document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') body.classList.add('light-mode');

    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        localStorage.setItem('theme', body.classList.contains('light-mode') ? 'light' : 'dark');
    });
});