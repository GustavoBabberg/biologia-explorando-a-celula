document.addEventListener('DOMContentLoaded', () => {
    const textToType = "Da célula à vida. A base de todo o conhecimento biológico.";
    const typingElement = document.getElementById('typing-text');
    let charIndex = 0;
    
    function typeText() {
        if (charIndex < textToType.length) {
            typingElement.textContent += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(typeText, 40); 
        } else {
            typingElement.classList.remove('typing-active');
        }
    }

    typingElement.classList.add('typing-active');
    typeText();


    
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, options);
    const revealElements = document.querySelectorAll('.scroll-reveal');

    revealElements.forEach((el, index) => {
        el.style.transitionDelay = `${index * 0.2}s`; 
        observer.observe(el);
    });
    const quizData = [
        {
            question: "Qual organela é conhecida como a 'usina de energia' da célula, responsável pela produção de ATP?",
            options: ["Lisossomo", "Ribossomo", "Mitocôndria", "Complexo de Golgi"],
            answer: "Mitocôndria",
            rationale: "As Mitocôndrias realizam a respiração celular, gerando a maior parte da energia (ATP) que a célula utiliza."
        },
        {
            question: "A principal função da Membrana Plasmática é:",
            options: ["Armazenar o DNA da célula.", "Realizar a fotossíntese.", "Controlar o que entra e sai da célula.", "Sintetizar proteínas."],
            answer: "Controlar o que entra e sai da célula.",
            rationale: "A Membrana Plasmática possui permeabilidade seletiva, regulando a passagem de substâncias entre o meio interno e externo."
        },
        {
            question: "O Retículo Endoplasmático Rugoso (R.E.R.) é 'rugoso' devido à presença de:",
            options: ["Vacúolos.", "Lisossomos.", "Ribossomos.", "Cromatina."],
            answer: "Ribossomos.",
            rationale: "Os Ribossomos aderidos à sua superfície dão o aspecto rugoso ao R.E.R., que é especializado na síntese de proteínas de exportação."
        },
        {
            question: "Em qual tipo de célula o material genético (DNA) encontra-se disperso no Citoplasma, sem núcleo definido?",
            options: ["Eucarionte Animal", "Eucarionte Vegetal", "Procarionte", "Célula Fúngica"],
            answer: "Procarionte",
            rationale: "Células Procariontes (como as bactérias) não possuem um núcleo delimitado pela carioteca, deixando o DNA solto no citoplasma."
        },
        {
            question: "Qual organela é responsável pela digestão intracelular e pela 'limpeza' de componentes celulares danificados?",
            options: ["Cloroplasto", "Lisossomo", "Nucléolo", "Mitocôndria"],
            answer: "Lisossomo",
            rationale: "Os Lisossomos contêm enzimas hidrolíticas que degradam substâncias absorvidas pela célula ou componentes celulares velhos (autofagia)."
        }
    ];

    let currentQuestionIndex = 0;
    let score = 0;
    let quizActive = false;

    const startBtn = document.getElementById('start-quiz-btn');
    const nextBtn = document.getElementById('next-question-btn');
    const restartBtn = document.getElementById('restart-quiz-btn');
    
    const quizContainer = document.getElementById('quiz-container');
    const questionTemplate = document.getElementById('question-template');
    const resultTemplate = document.getElementById('result-template');
    
    const questionNumberEl = document.getElementById('question-number');
    const questionTextEl = document.getElementById('question-text');
    const answerOptionsEl = document.getElementById('answer-options');
    const feedbackArea = document.getElementById('feedback-area');
    const feedbackMessage = document.getElementById('feedback-message');
    const feedbackRationale = document.getElementById('feedback-rationale');

    function startQuiz() {
        quizActive = true;
        currentQuestionIndex = 0;
        score = 0;
        quizContainer.style.display = 'none';
        resultTemplate.style.display = 'none';
        questionTemplate.style.display = 'block';
        loadQuestion();
    }

    function restartQuiz() {
        startQuiz();
    }

    function loadQuestion() {
        const q = quizData[currentQuestionIndex];
        
        questionNumberEl.textContent = `Pergunta ${currentQuestionIndex + 1}/${quizData.length}`;
        questionTextEl.textContent = q.question;
        answerOptionsEl.innerHTML = '';
        
        feedbackArea.style.display = 'none';
        nextBtn.style.display = 'none';

        q.options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'btn answer-btn';
            button.textContent = option;
            button.onclick = () => checkAnswer(button, option, q.answer, q.rationale);
            answerOptionsEl.appendChild(button);
        });
    }

    function checkAnswer(selectedButton, selectedAnswer, correctAnswer, rationale) {
        Array.from(answerOptionsEl.children).forEach(btn => btn.disabled = true);
        
        let isCorrect = selectedAnswer === correctAnswer;

        if (isCorrect) {
            selectedButton.classList.add('correct');
            score++;
            feedbackArea.className = 'alert mt-3 p-3 alert-success';
            feedbackMessage.textContent = '✅ Resposta Correta!';
        } else {
            selectedButton.classList.add('wrong');
            Array.from(answerOptionsEl.children).find(btn => btn.textContent === correctAnswer).classList.add('correct');
            feedbackArea.className = 'alert mt-3 p-3 alert-danger';
            feedbackMessage.textContent = '❌ Resposta Incorreta.';
        }
        
        feedbackRationale.textContent = `Justificativa: ${rationale}`;
        feedbackArea.style.display = 'block';
        nextBtn.style.display = 'block';
    }

    function nextQuestion() {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizData.length) {
            loadQuestion();
        } else {
            showResults();
        }
    }

    function showResults() {
        questionTemplate.style.display = 'none';
        resultTemplate.style.display = 'block';
        
        const finalScoreEl = document.getElementById('final-score');
        const resultMessageEl = document.getElementById('result-message');
        const percentage = (score / quizData.length) * 100;

        finalScoreEl.textContent = `${score}/${quizData.length} (${percentage.toFixed(0)}%)`;

        if (percentage === 100) {
            resultMessageEl.textContent = "Excelente! Você dominou a Citologia. Suas células estão orgulhosas!";
        } else if (percentage >= 70) {
            resultMessageEl.textContent = "Muito bom! Você tem um ótimo entendimento. Revise as áreas onde teve dificuldade para o domínio completo.";
        } else {
            resultMessageEl.textContent = "Continue estudando! Não se preocupe, a Biologia é complexa. Volte à seção de Fundamentos para revisar as organelas e conceitos.";
        }
    }

    startBtn.addEventListener('click', startQuiz);
    nextBtn.addEventListener('click', nextQuestion);
    restartBtn.addEventListener('click', restartQuiz);
    
});