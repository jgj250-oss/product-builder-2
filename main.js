class DinnerRecommender extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isEnglish = navigator.language.startsWith('en');
    
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
      }
      .menu-item {
        padding: 15px 35px;
        border-radius: 15px;
        font-size: 2.2rem;
        font-weight: 900;
        color: white;
        text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        background: linear-gradient(145deg, #f6d365, #fda085);
        animation: appear 0.5s ease-out forwards;
      }
      .image-container {
        width: 100%;
        height: 300px;
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
    button.textContent = this.isEnglish ? 'Show Me Another!' : '다른 거 추천해줘!';
    button.onclick = () => this.recommendMenu();
    
    this.resultContainer = document.createElement('div');
    this.resultContainer.className = 'result';
    
    wrapper.appendChild(button);
    wrapper.appendChild(this.resultContainer);
    this.shadowRoot.appendChild(wrapper);

    this.menus = this.isEnglish ? Object.values(this.keywordMap) : Object.keys(this.keywordMap);
  }

  recommendMenu() {
    this.resultContainer.innerHTML = '';
    
    const randomIndex = Math.floor(Math.random() * this.menus.length);
    const selectedMenu = this.menus[randomIndex];
    
    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = this.isEnglish ? "How about this?" : "오늘 저녁은 이거다!";
    
    const menuDiv = document.createElement('div');
    menuDiv.className = 'menu-item';
    menuDiv.textContent = selectedMenu;
    
    const imgContainer = document.createElement('div');
    imgContainer.className = 'image-container';
    
    const loadingText = document.createElement('div');
    loadingText.className = 'loading-text';
    loadingText.textContent = this.isEnglish ? 'Loading delicious image...' : '맛있는 이미지 불러오는 중...';
    
    const img = document.createElement('img');
    img.className = 'menu-image';
    
    const searchKeyword = this.isEnglish ? selectedMenu : this.keywordMap[selectedMenu];
    // loremflickr를 사용하고 고유성을 위해 랜덤 쿼리 추가
    img.src = `https://loremflickr.com/500/400/${encodeURIComponent(searchKeyword)},food/all?lock=${Math.floor(Math.random() * 1000)}`;
    
    img.onload = () => {
      img.classList.add('loaded');
      loadingText.style.display = 'none';
    };
    
    img.onerror = () => {
      img.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=60';
      img.classList.add('loaded');
      loadingText.style.display = 'none';
    };
    
    imgContainer.appendChild(loadingText);
    imgContainer.appendChild(img);
    this.resultContainer.appendChild(label);
    this.resultContainer.appendChild(menuDiv);
    this.resultContainer.appendChild(imgContainer);
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