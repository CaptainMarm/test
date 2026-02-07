// ===== ДЕРЕВО ВОПРОСОВ =====

const questions = {
    q1: {
		text: "1. Какой вкус сегодня ищет твоя душа?",
    answers: [
      { text: "Проверенная классика", next: "q2a" },
      { text: "Что-то эдакое, с изюминкой!", next: "q2b" }
    ]
  },

  q2a: {
    text: "2. Что важнее в идеальном мармеладе?",
    answers: [
      { text: "Текстура и форма", next: "q31a" },
      { text: "Натуральность и состав", next: "q32a" },
      { text: "Узнаваемый, культовый вкус", next: "q33a" }
    ]
  },

  q2b: {
    text: "2. Какое вкусовое приключение ты выбираешь?",
    answers: [
      { text: "Экстремальный вызов!", next: "q31b" },
      { text: "Путешествие в прошлое", next: "q32b" },
      { text: "Неожиданный, но приятный сюрприз", next: "q33b" }
    ]
  },

  // === 3 УРОВЕНЬ ===

  q31a: {
    text: "3. Какая форма мармелада вызывает больше улыбки?",
    answers: [
      { text: "Забавные зверушки, червячки и фигурки", result: "Фруктовые червячки и мишки" },
      { text: "Эстетичные ягодки и дольки", result: "Мармеладные ягодки" }
    ]
  },

  q32a: {
    text: "3. Что тебя больше обрадует в мармеладе с натуральным составом?",
    answers: [
      { text: "Разнообразие форм", result: "Российский мармелад «Трофимов»" },
      { text: "Поддержка ценностей экоактивизма", result: "Клубнички Vegan от Damel" }
    ]
  },

  q33a: {
    text: "3. Какой культовый образ тебе ближе?",
    answers: [
      { text: "Знакомый с детства, из сказок и мультиков", result: "Фруктовые червячки и мишки" },
      { text: "Символ праздника и весёлой вечеринки", result: "Бутылочки со вкусом кока-колы" },
      { text: "Вкус летних каникул у бабушки", result: "Мармеладные ягодки" }
    ]
  },

  q31b: {
    text: "3. Какой вызов тебе по душе?",
    answers: [
      { text: "Испытание огнём!", result: "Острый мармелад, перчики и манго" },
      { text: "Кислотная атака!", result: "Кислые колечки и дольки" }
    ]
  },

  q32b: {
    text: "3. Какую историческую находку ищешь?",
    answers: [
      { text: "Вкус столетий", result: "Лакрица" },
      { text: "Ретро-эмоция", result: "Кислые колечки и дольки" }
    ]
  },

  q33b: {
    text: "3. Какой вкус приятно тебя удивит?",
    answers: [
      { text: "Невероятно бодрящий и кислый", result: "Кислые колечки и дольки" },
      { text: "Терпкий, не сладкий, но запоминающийся", result: "Лакрица с начинкой" }
    ]
  }
};

// ===== КАРТИНКИ РЕЗУЛЬТАТОВ =====

const resultsImages = {
  "Фруктовые червячки и мишки": "worms_bears.jpg",
  "Мармеладные ягодки": "berries.jpg",
  "Российский мармелад «Трофимов»": "trofimov.jpg",
  "Клубнички Vegan от Damel": "damel.jpg",
  "Бутылочки со вкусом кока-колы": "cola.jpg",
  "Острый мармелад, перчики и манго": "spicy.jpg",
  "Кислые колечки и дольки": "sour.jpg",
  "Лакрица": "licorice.jpg",
  "Лакрица с начинкой": "licorice.jpg"
};

// ===== СОСТОЯНИЕ =====

let currentQuestionId = "q1";

// ===== СТАРТ =====

function startQuiz() {
  currentQuestionId = "q1";
  switchScreen("start-screen", "question-screen");
  showQuestion();
}

// ===== ПОКАЗ ВОПРОСА =====

function showQuestion() {
  const q = questions[currentQuestionId];
  document.getElementById("question-text").innerText = q.text;

  const answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";

  q.answers.forEach(answer => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.innerText = answer.text;
    btn.onclick = () => handleAnswer(answer);
    answersDiv.appendChild(btn);
  });
}

// ===== ОБРАБОТКА ОТВЕТА =====

function handleAnswer(answer) {
  if (answer.next) {
    currentQuestionId = answer.next;
    showQuestion();
  } else if (answer.result) {
    finishQuiz(answer.result);
  }
}

// ===== ФИНИШ =====
function finishQuiz(result) {
  saveStat(result); // Эта функция отправит данные
  showResult(result);
}


// ===== РЕЗУЛЬТАТ =====

function showResult(result) {
  switchScreen("question-screen", "result-screen");
  document.getElementById("result-title").innerText = result;
  document.getElementById("result-image").src = resultsImages[result];
}


// ===== СТАТИСТИКА =====

async function showStats() {
  switchScreen("result-screen", "stats-screen");
  
  const list = document.getElementById("stats-list");
  list.innerHTML = "<li>Загрузка статистики...</li>";
  
  try {
    // Загружаем статистику из Google Таблицы
    const response = await fetch('https://script.google.com/macros/s/AKfycbwYmATRCRb5rdFhg7J5th1pEQMKTtBewyIKHcxRGbZ3cM0QRGeOL0uQBms8v_4N2Up5DQ/exec');
    const stats = await response.json();
    
    // Очищаем список
    list.innerHTML = "";
    
    // Сортируем по убыванию
    Object.entries(stats)
      .sort((a, b) => b[1] - a[1])
      .forEach(([name, count]) => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${name}</strong> — ${count} раз`;
        list.appendChild(li);
      });
      
  } catch (error) {
    list.innerHTML = "<li>Статистика появится после нескольких прохождений</li>";
  }
}

function saveStat(result) {
  // Отправляем результат в Google Таблицу для общей статистики
  fetch('https://script.google.com/macros/s/AKfycbwYmATRCRb5rdFhg7J5th1pEQMKTtBewyIKHcxRGbZ3cM0QRGeOL0uQBms8v_4N2Up5DQ/exec?result=' + encodeURIComponent(result), {
    mode: 'no-cors'
  });
}

// ===== УТИЛИТА =====

function switchScreen(from, to) {
  document.getElementById(from).classList.remove("active");
  document.getElementById(to).classList.add("active");
}
