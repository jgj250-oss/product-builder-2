class LottoGenerator extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'wrapper');

    const button = document.createElement('button');
    button.textContent = 'Generate Numbers';
    button.addEventListener('click', () => this.generateNumbers());

    const numbersContainer = document.createElement('div');
    numbersContainer.setAttribute('class', 'numbers');

    const style = document.createElement('style');
    style.textContent = `
      .wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      button {
        padding: 15px 30px;
        font-size: 1.5rem;
        font-weight: bold;
        color: white;
        background: linear-gradient(145deg, #00d2ff, #3a7bd5);
        border: none;
        border-radius: 50px;
        cursor: pointer;
        margin-bottom: 40px;
        box-shadow: 0 0 15px rgba(58, 123, 213, 0.8), 0 0 30px rgba(0, 210, 255, 0.6);
        transition: all 0.3s ease-in-out;
      }
      button:hover {
        transform: translateY(-2px);
        box-shadow: 0 0 20px rgba(58, 123, 213, 1), 0 0 40px rgba(0, 210, 255, 0.8);
      }
      .numbers {
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
        justify-content: center;
      }
      .number {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        font-weight: bold;
        color: white;
        text-shadow: 0 0 5px rgba(0,0,0,0.5);
        box-shadow: 5px 5px 15px rgba(0,0,0,0.5), 
                    -5px -5px 15px rgba(255,255,255,0.1), 
                    inset 0 0 10px rgba(0,0,0,0.2);
        animation: appear 0.5s ease-out forwards;
        position: relative;
      }
      .number::before {
        content: '';
        position: absolute;
        top: 5px;
        left: 15px;
        width: 15px;
        height: 8px;
        background: rgba(255,255,255,0.4);
        border-radius: 50%;
        transform: rotate(45deg);
      }

      @keyframes appear {
        from {
          opacity: 0;
          transform: scale(0.5);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
    `;

    shadow.appendChild(style);
    shadow.appendChild(wrapper);
    wrapper.appendChild(button);
    wrapper.appendChild(numbersContainer);
  }

  getColor(number) {
    if (number <= 10) return 'linear-gradient(145deg, #ff9a9e, #fad0c4)'; // Pastel Red/Orange
    if (number <= 20) return 'linear-gradient(145deg, #a1c4fd, #c2e9fb)'; // Pastel Blue
    if (number <= 30) return 'linear-gradient(145deg, #84fab0, #8fd3f4)'; // Pastel Green/Blue
    if (number <= 40) return 'linear-gradient(145deg, #d299c2, #fef9d7)'; // Pastel Purple/Yellow
    return 'linear-gradient(145deg, #f6d365, #fda085)'; // Pastel Orange/Yellow
  }

  generateNumbers() {
    const numbersContainer = this.shadowRoot.querySelector('.numbers');
    numbersContainer.innerHTML = '';
    const numbers = new Set();
    while (numbers.size < 6) {
      numbers.add(Math.floor(Math.random() * 45) + 1);
    }
    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);
    
    sortedNumbers.forEach((number, index) => {
        setTimeout(() => {
            const numberDiv = document.createElement('div');
            numberDiv.setAttribute('class', 'number');
            numberDiv.textContent = number;
            numberDiv.style.background = this.getColor(number);
            numbersContainer.appendChild(numberDiv);
        }, index * 100); // Stagger the animation
    });
  }
}

customElements.define('lotto-generator', LottoGenerator);