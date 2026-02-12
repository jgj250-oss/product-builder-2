class DinnerRecommender extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'wrapper');

    const button = document.createElement('button');
    button.textContent = '오늘 뭐 먹지?';
    button.addEventListener('click', () => this.recommendMenu());

    const resultContainer = document.createElement('div');
    resultContainer.setAttribute('class', 'result');

    const style = document.createElement('style');
    style.textContent = `
      .wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      button {
        padding: 15px 40px;
        font-size: 1.5rem;
        font-weight: bold;
        color: white;
        background: linear-gradient(145deg, #ff9a9e, #fad0c4);
        border: none;
        border-radius: 50px;
        cursor: pointer;
        margin-bottom: 40px;
        box-shadow: 0 0 15px rgba(255, 154, 158, 0.8), 0 0 30px rgba(250, 208, 196, 0.6);
        transition: all 0.3s ease-in-out;
      }
      button:hover {
        transform: translateY(-2px);
        box-shadow: 0 0 20px rgba(255, 154, 158, 1), 0 0 40px rgba(250, 208, 196, 0.8);
      }
      .result {
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
        justify-content: center;
        min-height: 100px;
      }
      .menu-item {
        padding: 20px 40px;
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2.5rem;
        font-weight: bold;
        color: white;
        text-shadow: 0 0 5px rgba(0,0,0,0.5);
        box-shadow: 5px 5px 15px rgba(0,0,0,0.3);
        animation: appear 0.5s ease-out forwards;
        background: linear-gradient(145deg, #f6d365, #fda085);
      }

      @keyframes appear {
        from {
          opacity: 0;
          transform: translateY(20px) scale(0.9);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
    `;

    shadow.appendChild(style);
    shadow.appendChild(wrapper);
    wrapper.appendChild(button);
    wrapper.appendChild(resultContainer);

    this.menus = [
      '치킨', '피자', '삼겹살', '족발', '햄버거', 
      '초밥', '마라탕', '떡볶이', '돈까스', '파스타',
      '제육볶음', '김치찌개', '된장찌개', '비빔밥', '칼국수',
      '짜장면', '짬뽕', '탕수육', '쌀국수', '스테이크'
    ];
  }

  recommendMenu() {
    const resultContainer = this.shadowRoot.querySelector('.result');
    resultContainer.innerHTML = '';
    
    // Pick a random menu
    const randomIndex = Math.floor(Math.random() * this.menus.length);
    const selectedMenu = this.menus[randomIndex];
    
    const menuDiv = document.createElement('div');
    menuDiv.setAttribute('class', 'menu-item');
    menuDiv.textContent = selectedMenu;
    
    resultContainer.appendChild(menuDiv);
  }
}

class DinnerRecommenderEn extends DinnerRecommender {
  constructor() {
    super();
    this.shadowRoot.querySelector('button').textContent = 'What should I eat?';
    this.menus = [
      'Fried Chicken', 'Pizza', 'Grilled Pork Belly', 'Pig\'s Trotters', 'Burger',
      'Sushi', 'Malatang', 'Tteokbokki', 'Pork Cutlet', 'Pasta',
      'Stir-fried Pork', 'Kimchi Stew', 'Soybean Paste Stew', 'Bibimbap', 'Kalguksu',
      'Jajangmyeon', 'Jjamppong', 'Sweet and Sour Pork', 'Pho', 'Steak'
    ];
  }
}

customElements.define('dinner-recommender', DinnerRecommender);
customElements.define('dinner-recommender-en', DinnerRecommenderEn);

// Theme toggle logic
document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
    }

    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        if (body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
        } else {
            localStorage.setItem('theme', 'dark');
        }
    });
});