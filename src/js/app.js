import {DAILY_VERBS, generateDailyVerbs, checkDailyUpdate,getDebugInfo} from './verbs/verbs.js';
// --- Constantes de la Sesión ---
let ATTEMPTS_PER_VERB = 4; // Cambiar de const a let
const REINFORCE_ATTEMPTS_RED = 3;
const REINFORCE_ATTEMPTS_YELLOW = 2;
const MIN_ATTEMPTS = 2;
const MAX_ATTEMPTS = 8;
let dailyVerbs = [...DAILY_VERBS]; // Copia de los verbos diarios actuales


// --- Elementos del DOM ---
const startScreen = document.getElementById('start-screen');
const practiceScreen = document.getElementById('practice-screen');
const summaryScreen = document.getElementById('summary-screen');
const startSessionBtn = document.getElementById('start-session-btn');
const resetVerbsBtn = document.getElementById('reset-verbs-btn');
const goToStartBtn = document.getElementById('go-to-start-btn');
const reinforceBtn = document.getElementById('reinforce-btn');
const refreshVerbsBtn = document.getElementById('refresh-verbs-btn');
const dailyVerbsListEl = document.getElementById('daily-verbs-list');

const sessionTitleEl = document.getElementById('session-title');
const progressTrackerEl = document.getElementById('progress-tracker');
const verbImageEl = document.getElementById('verb-image');
const spanishVerbEl = document.getElementById('spanish-verb');
const verbExplanationEl = document.getElementById('verb-explanation');
const infinitiveInput = document.getElementById('infinitive');
const pastSimpleInput = document.getElementById('past-simple');
const pastParticipleInput = document.getElementById('past-participle');
const checkBtn = document.getElementById('check-btn');
const nextBtn = document.getElementById('next-btn');
const feedbackMessageEl = document.getElementById('feedback-message');

const correctInfinitiveEl = document.getElementById('correct-infinitive');
const correctPastSimpleEl = document.getElementById('correct-past-simple');
const correctPastParticipleEl = document.getElementById('correct-past-participle');
const summaryStatsEl = document.getElementById('summary-stats');

const exitSessionBtn = document.getElementById('exit-session-btn');
const exitModal = document.getElementById('exit-modal');
const confirmExitBtn = document.getElementById('confirm-exit-btn');
const cancelExitBtn = document.getElementById('cancel-exit-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');

// Añadir nuevos elementos DOM después de los existentes
const translationExercise = document.getElementById('translation-exercise');
const englishVerbDisplay = document.getElementById('english-verb-display');
const infinitiveDisplay = document.getElementById('infinitive-display');
const pastSimpleDisplay = document.getElementById('past-simple-display');
const pastParticipleDisplay = document.getElementById('past-participle-display');
const spanishTranslationInput = document.getElementById('spanish-translation');
const correctTranslationEl = document.getElementById('correct-translation');
const decreaseAttemptsBtn = document.getElementById('decrease-attempts-btn');
const increaseAttemptsBtn = document.getElementById('increase-attempts-btn');
const attemptsDisplay = document.getElementById('attempts-display');
const attemptsProgress = document.getElementById('attempts-progress');
const totalQuestionsEl = document.getElementById('total-questions');
const sessionQuestionsCount = document.getElementById('session-questions-count');



const inputs = [infinitiveInput, pastSimpleInput, pastParticipleInput];

const EXERCISE_TYPES = {
    WRITE_FORMS: 'write_forms',
    TRANSLATE_TO_SPANISH: 'translate_to_spanish'
};
// --- Estado de la Aplicación ---
let sessionStats = {};
let currentVerb = null;
let isCorrectionMode = false;
let questionDeck = [];
let currentQuestionIndex = 0;
let isReinforcementSession = false;


// --- Lógica Principal ---
function createMixedQuestionDeck(verbs, attemptsPer) {
    const deck = [];
    verbs.forEach(verb => {
        for (let i = 0; i < attemptsPer; i++) {
            // 50% ejercicios de escribir formas (tu ejercicio actual)
            if (i < Math.floor(attemptsPer / 2)) {
                deck.push({
                    type: EXERCISE_TYPES.WRITE_FORMS,
                    verb: verb
                });
            } 
            // 50% ejercicios de traducción
            else {
                deck.push({
                    type: EXERCISE_TYPES.TRANSLATE_TO_SPANISH,
                    verb: verb
                });
            }
        }
    });
    shuffleArray(deck);
    return deck;
}
// VERBOS DIARIOS
function displayDailyVerbs() {
    // Verificar si es un nuevo día y actualizar automáticamente
    const updatedVerbs = checkDailyUpdate();
    if (JSON.stringify(updatedVerbs) !== JSON.stringify(dailyVerbs)) {
        dailyVerbs = [...updatedVerbs];
        showDayChangeNotification();
    }

    dailyVerbsListEl.innerHTML = '';
    
    // Mostrar fecha de hoy
    const today = new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Crear header con fecha
    const dateHeader = document.createElement('div');
    dateHeader.className = 'text-center mb-4 p-3 bg-indigo-50 rounded-lg';
    dateHeader.innerHTML = `
        <h3 class="text-lg font-semibold text-indigo-700 capitalize">${today}</h3>
        <p class="text-sm text-indigo-600">Verbos del día</p>
    `;
    dailyVerbsListEl.appendChild(dateHeader);
    
    // Mostrar verbos
    dailyVerbs.forEach((verb, index) => {
        const li = document.createElement('li');
        li.className = 'flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-indigo-300 transition-colors';
        li.innerHTML = `
            <div>
                <span class="inline-block w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full text-sm font-semibold text-center leading-6 mr-3">${index + 1}</span>
                <span class="font-semibold text-slate-800">${verb.infinitive}</span> 
                <span class="text-slate-500">- ${verb.pastSimple} - ${verb.pastParticiple}</span>
                <span class="text-slate-600 ml-2">(${verb.spanish})</span>
            </div>
        `;
        dailyVerbsListEl.appendChild(li);
    });
}
// --- Funciones para manejar el control de intentos ---
function updateAttemptsDisplay() {
    attemptsDisplay.textContent = ATTEMPTS_PER_VERB;
    
    // Calcular total de preguntas
    const totalQuestions = dailyVerbs.length * ATTEMPTS_PER_VERB;
    totalQuestionsEl.textContent = `${totalQuestions} preguntas totales`;
    sessionQuestionsCount.textContent = totalQuestions;
    
    // Actualizar barra de progreso (2-8 rango)
    const progressPercent = ((ATTEMPTS_PER_VERB - MIN_ATTEMPTS) / (MAX_ATTEMPTS - MIN_ATTEMPTS)) * 100;
    attemptsProgress.style.width = `${progressPercent}%`;
    
    // Actualizar estado de botones
    decreaseAttemptsBtn.disabled = ATTEMPTS_PER_VERB <= MIN_ATTEMPTS;
    increaseAttemptsBtn.disabled = ATTEMPTS_PER_VERB >= MAX_ATTEMPTS;
    
    // Guardar preferencia del usuario
    localStorage.setItem('userAttemptsPerVerb', ATTEMPTS_PER_VERB.toString());
    
    console.log(`🎯 Intentos por verbo: ${ATTEMPTS_PER_VERB}, Total preguntas: ${totalQuestions}`);
}
function decreaseAttempts() {
    if (ATTEMPTS_PER_VERB > MIN_ATTEMPTS) {
        ATTEMPTS_PER_VERB--;
        updateAttemptsDisplay();
        showAttemptsChangeNotification('decrease');
    }
}

function increaseAttempts() {
    if (ATTEMPTS_PER_VERB < MAX_ATTEMPTS) {
        ATTEMPTS_PER_VERB++;
        updateAttemptsDisplay();
        showAttemptsChangeNotification('increase');
    }
}
function showAttemptsChangeNotification(type) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm';
    
    const difficultyLevel = getDifficultyLevel(ATTEMPTS_PER_VERB);
    const emoji = type === 'increase' ? '📈' : '📉';
    
    notification.innerHTML = `
        <div class="flex items-center gap-2">
            <span>${emoji}</span>
            <span>${ATTEMPTS_PER_VERB} preguntas por verbo - ${difficultyLevel}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Eliminar notificación después de 2 segundos
    setTimeout(() => {
        notification.remove();
    }, 2000);
}
function getDifficultyLevel(attempts) {
    if (attempts <= 3) return 'Fácil';
    if (attempts <= 5) return 'Normal';
    if (attempts <= 7) return 'Difícil';
    return 'Experto';
}

function loadUserPreferences() {
    const savedAttempts = localStorage.getItem('userAttemptsPerVerb');
    if (savedAttempts) {
        const attempts = parseInt(savedAttempts);
        if (attempts >= MIN_ATTEMPTS && attempts <= MAX_ATTEMPTS) {
            ATTEMPTS_PER_VERB = attempts;
        }
    }
    updateAttemptsDisplay();
}
// --- Función para mostrar notificación de cambio de día ---
function showDayChangeNotification() {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce';
    notification.innerHTML = `
        <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            ¡Nuevos verbos del día generados!
        </div>
    `;
    document.body.appendChild(notification);
    
    // Eliminar notificación después de 3 segundos
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// --- Función para refrescar verbos manualmente ---
function refreshDailyVerbs() {
    if (confirm('¿Estás seguro de que quieres generar nuevos verbos del día? Esto se aplicará en TODOS los dispositivos.')) {
        dailyVerbs = generateDailyVerbs(true);
        displayDailyVerbs();
        resetSessionStats();
        showDayChangeNotification();
        
        // Mostrar debug info
        console.log('🔍 Debug Info:', getDebugInfo());
    }
}
// --- Función para resetear estadísticas de sesión ---
function resetSessionStats() {
    sessionStats = {};
    currentQuestionIndex = 0;
    questionDeck = [];
    isReinforcementSession = false;
}

// --- Actualizar función setupDailyVerbs existente ---
function setupDailyVerbs(forceReset = false) {
    if (forceReset) {
        dailyVerbs = generateDailyVerbs(true);
    } else {
        dailyVerbs = checkDailyUpdate();
    }
    displayDailyVerbs();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


function startMainSession() {
    isReinforcementSession = false;
    sessionStats = {};
    dailyVerbs.forEach(verb => {
        sessionStats[verb.infinitive] = { ...verb, errors: 0, attempts: 0 };
    });
    
    // Usar la variable ATTEMPTS_PER_VERB actual
    questionDeck = createMixedQuestionDeck(dailyVerbs, ATTEMPTS_PER_VERB);
    currentQuestionIndex = 0;
    
    sessionTitleEl.textContent = `Sesión Diaria (${ATTEMPTS_PER_VERB} por verbo)`;
    startScreen.classList.add('hidden');
    summaryScreen.classList.add('hidden');
    practiceScreen.classList.remove('hidden');

    setupNextQuestion();
}

function startReinforcementSession() {
    isReinforcementSession = true;
    
    // Obtener verbos con problemas del sessionStats
    const redZoneVerbs = Object.values(sessionStats).filter(stat => {
        const percentage = stat.attempts > 0 ? 100 - Math.round((stat.errors / stat.attempts) * 100) : 100;
        return percentage <= 50;
    });

    const yellowZoneVerbs = Object.values(sessionStats).filter(stat => {
        const percentage = stat.attempts > 0 ? 100 - Math.round((stat.errors / stat.attempts) * 100) : 100;
        return percentage > 50 && percentage <= 80;
    });

    // AQUÍ ESTÁ EL PROBLEMA - Crear deck de ejercicios mezclados para refuerzo
    const redDeck = createMixedReinforcementDeck(redZoneVerbs, REINFORCE_ATTEMPTS_RED);
    const yellowDeck = createMixedReinforcementDeck(yellowZoneVerbs, REINFORCE_ATTEMPTS_YELLOW);
    
    questionDeck = [...redDeck, ...yellowDeck];
    shuffleArray(questionDeck);

    if (questionDeck.length === 0) {
        // Si no hay preguntas de refuerzo, volver al inicio
        alert('¡Excelente! No hay verbos que necesiten refuerzo.');
        goToStartScreen();
        return;
    }

    currentQuestionIndex = 0;
    
    sessionTitleEl.textContent = `Sesión de Refuerzo (${questionDeck.length} preguntas)`;
    summaryScreen.classList.add('hidden');
    practiceScreen.classList.remove('hidden');

    setupNextQuestion();
}
function createMixedReinforcementDeck(verbs, attemptsPer) {
    const deck = [];
    verbs.forEach(verbStat => {
        // Crear objeto verbo limpio desde las estadísticas
        const cleanVerb = {
            infinitive: verbStat.infinitive,
            pastSimple: verbStat.pastSimple,
            pastParticiple: verbStat.pastParticiple,
            spanish: verbStat.spanish,
            explanation: verbStat.explanation,
            imageUrl: verbStat.imageUrl
        };
        
        for (let i = 0; i < attemptsPer; i++) {
            // 50% ejercicios de escribir formas
            if (i < Math.floor(attemptsPer / 2)) {
                deck.push({
                    type: EXERCISE_TYPES.WRITE_FORMS,
                    verb: cleanVerb
                });
            } 
            // 50% ejercicios de traducción
            else {
                deck.push({
                    type: EXERCISE_TYPES.TRANSLATE_TO_SPANISH,
                    verb: cleanVerb
                });
            }
        }
    });
    return deck;
}
function goToStartScreen() {
    summaryScreen.classList.add('hidden');
    practiceScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    setupDailyVerbs();
}

function setupNextQuestion() {
    if (currentQuestionIndex >= questionDeck.length) {
        if(isReinforcementSession) {
            // Mostrar mensaje de refuerzo completado
            showReinforcementCompletedMessage();
            goToStartScreen();
        } else {
            showSummary();
        }
        return;
    }
    
    const currentQuestion = questionDeck[currentQuestionIndex];
    
    // Verificar que la pregunta tiene la estructura correcta
    if (!currentQuestion || !currentQuestion.verb || !currentQuestion.type) {
        console.error('❌ Pregunta mal formada:', currentQuestion);
        currentQuestionIndex++;
        setupNextQuestion();
        return;
    }
    
    currentVerb = currentQuestion.verb;
    const exerciseType = currentQuestion.type;
    currentQuestionIndex++;

    // Reset del estado de corrección
    isCorrectionMode = false;
    // Reset UI común
    progressTrackerEl.textContent = `Pregunta ${currentQuestionIndex} / ${questionDeck.length}`;
    verbImageEl.src = currentVerb.imageUrl || '';
    verbImageEl.style.animation = 'none';
    verbImageEl.offsetHeight;
    verbImageEl.style.animation = null;
    
    feedbackMessageEl.classList.add('hidden');
    checkBtn.textContent = 'Revisar';
    checkBtn.disabled = false;
    nextBtn.disabled = true;

    // Ocultar ambas interfaces
    document.getElementById('verb-inputs').classList.add('hidden');
    translationExercise.classList.add('hidden');
    document.getElementById('verb-display').classList.remove('hidden'); // Asegurar que esté visible

    // Configurar según el tipo de ejercicio
    if (exerciseType === EXERCISE_TYPES.WRITE_FORMS) {
        setupWriteFormsExercise();
    } else if (exerciseType === EXERCISE_TYPES.TRANSLATE_TO_SPANISH) {
        setupTranslationExercise();
    } else {
        console.error('❌ Tipo de ejercicio desconocido:', exerciseType);
        setupNextQuestion(); // Saltar a la siguiente pregunta
    }
    
    console.log('✅ Pregunta configurada:', {
        index: currentQuestionIndex,
        total: questionDeck.length,
        type: exerciseType,
        verb: currentVerb.infinitive,
        isReinforcement: isReinforcementSession
    });
}
function showReinforcementCompletedMessage() {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.innerHTML = `
        <div class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span>¡Refuerzo completado! Muy buen trabajo.</span>
        </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
function setupWriteFormsExercise() {
    // Mostrar interfaz de escribir formas
    document.getElementById('verb-inputs').classList.remove('hidden');
    
    // Configurar como antes
    spanishVerbEl.textContent = currentVerb.spanish;
    verbExplanationEl.textContent = currentVerb.explanation;

    [infinitiveInput, pastSimpleInput, pastParticipleInput].forEach(input => {
        input.value = '';
        input.disabled = false;
        input.classList.remove('correct', 'incorrect', 'correction-mode');
    });
    
    [correctInfinitiveEl, correctPastSimpleEl, correctPastParticipleEl].forEach(el => el.classList.add('hidden'));

    infinitiveInput.focus();
}
function setupTranslationExercise() {
    // Mostrar interfaz de traducción
    translationExercise.classList.remove('hidden');
    
    // Ocultar el verb-display actual
    document.getElementById('verb-display').classList.add('hidden');
    
    // Configurar displays
    englishVerbDisplay.textContent = currentVerb.infinitive;
    infinitiveDisplay.textContent = currentVerb.infinitive;
    pastSimpleDisplay.textContent = currentVerb.pastSimple;
    pastParticipleDisplay.textContent = currentVerb.pastParticiple;
    
    // Reset input
    spanishTranslationInput.value = '';
    spanishTranslationInput.disabled = false;
    spanishTranslationInput.classList.remove('correct', 'incorrect', 'correction-mode');
    correctTranslationEl.classList.add('hidden');

    spanishTranslationInput.focus();
}
// Función simple y flexible para comparar español
function isSpanishTranslationCorrect(userInput, correctSpanish) {
    const normalizedUser = userInput.toLowerCase().trim();
    const normalizedCorrect = correctSpanish.toLowerCase();
    
    // 1. Coincidencia exacta
    if (normalizedUser === normalizedCorrect) {
        return true;
    }
    
    // 2. Remover acentos de ambos
    const userNoAccents = removeAccents(normalizedUser);
    const correctNoAccents = removeAccents(normalizedCorrect);
    
    if (userNoAccents === correctNoAccents) {
        return true;
    }
    
    // 3. Verificar si el usuario escribió la palabra principal
    // "convertirse en" -> si escribes "convertirse" o "convertir" está bien
    if (correctNoAccents.includes(userNoAccents) && userNoAccents.length >= 3) {
        return true;
    }
    
    // 4. Verificar variaciones comunes sin paréntesis
    const correctWithoutParentheses = correctNoAccents.replace(/\([^)]*\)/g, '').trim();
    if (userNoAccents === correctWithoutParentheses) {
        return true;
    }
    
    // 5. Verificar palabras clave principales
    const mainWords = extractMainWords(correctNoAccents);
    return mainWords.some(word => word === userNoAccents || userNoAccents.includes(word));
}
// Función auxiliar para remover acentos
function removeAccents(text) {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Función auxiliar para extraer palabras principales
function extractMainWords(text) {
    // Remover paréntesis, artículos y preposiciones comunes
    const cleaned = text
        .replace(/\([^)]*\)/g, '') // Remover paréntesis
        .replace(/\b(en|a|el|la|los|las|un|una|se)\b/g, '') // Remover palabras comunes
        .trim();
    
    // Dividir en palabras y filtrar las que tengan al menos 3 caracteres
    return cleaned.split(/\s+/).filter(word => word.length >= 3);
}
function checkAnswer() {
    const currentQuestion = questionDeck[currentQuestionIndex - 1];
    const exerciseType = currentQuestion.type;

    if (exerciseType === EXERCISE_TYPES.WRITE_FORMS) {
        checkWriteFormsAnswer();
    } else if (exerciseType === EXERCISE_TYPES.TRANSLATE_TO_SPANISH) {
        checkTranslationAnswer();
    }
}
function checkWriteFormsAnswer() {
    if (isCorrectionMode) {
        handleCorrection();
        return;
    }

    const userInfinitive = infinitiveInput.value.trim().toLowerCase();
    const userPastSimple = pastSimpleInput.value.trim().toLowerCase();
    const userPastParticiple = pastParticipleInput.value.trim().toLowerCase();

    let allCorrect = true;
    
    const isInfCorrect = userInfinitive === currentVerb.infinitive;
    infinitiveInput.classList.toggle('correct', isInfCorrect);
    infinitiveInput.classList.toggle('incorrect', !isInfCorrect);
    if (!isInfCorrect) allCorrect = false;

    const correctPastSimples = currentVerb.pastSimple.split('/');
    const isPastCorrect = correctPastSimples.includes(userPastSimple);
    pastSimpleInput.classList.toggle('correct', isPastCorrect);
    pastSimpleInput.classList.toggle('incorrect', !isPastCorrect);
    if (!isPastCorrect) allCorrect = false;

    const isParticipleCorrect = currentVerb.pastParticiple.split('/').includes(userPastParticiple);
    pastParticipleInput.classList.toggle('correct', isParticipleCorrect);
    pastParticipleInput.classList.toggle('incorrect', !isParticipleCorrect);
    if (!isParticipleCorrect) allCorrect = false;
    
    updateSessionStats(allCorrect);
    
    if (allCorrect) {
        handleCorrectAnswer();
    } else {
        handleIncorrectAnswer();
    }
}
function checkTranslationAnswer() {
    if (isCorrectionMode) {
        handleTranslationCorrection();
        return;
    }

    const userTranslation = spanishTranslationInput.value.trim();
    const correctTranslation = currentVerb.spanish;
    
    // Usar la nueva función simple
    const isCorrect = isSpanishTranslationCorrect(userTranslation, correctTranslation);
    
    spanishTranslationInput.classList.toggle('correct', isCorrect);
    spanishTranslationInput.classList.toggle('incorrect', !isCorrect);
    
    updateSessionStats(isCorrect);
    
    if (isCorrect) {
        handleCorrectAnswer();
    } else {
        handleTranslationIncorrectAnswer();
    }
}
function handleTranslationIncorrectAnswer() {
    isCorrectionMode = true;
    feedbackMessageEl.textContent = 'Incorrecto. Escribe la traducción correcta para continuar.';
    feedbackMessageEl.classList.remove('hidden', 'bg-green-100', 'text-green-700');
    feedbackMessageEl.classList.add('bg-red-100', 'text-red-700');
    
    checkBtn.textContent = 'Confirmar Corrección';
    
    correctTranslationEl.textContent = `Correcto: ${currentVerb.spanish}`;
    correctTranslationEl.classList.remove('hidden');
    
    spanishTranslationInput.value = '';
    spanishTranslationInput.classList.add('correction-mode');
    spanishTranslationInput.focus();
}
function handleTranslationCorrection() {
    const userTranslation = spanishTranslationInput.value.trim();
    const correctTranslation = currentVerb.spanish;
    
    // Usar la nueva función simple
    const isCorrect = isSpanishTranslationCorrect(userTranslation, correctTranslation);
    
    if (isCorrect) {
        feedbackMessageEl.textContent = '¡Muy bien! Error corregido.';
        feedbackMessageEl.classList.remove('bg-red-100', 'text-red-700');
        feedbackMessageEl.classList.add('bg-blue-100', 'text-blue-700');
        isCorrectionMode = false;
        checkBtn.disabled = true;
        checkBtn.textContent = 'Revisar';
        nextBtn.disabled = false;
        spanishTranslationInput.disabled = true;
        nextBtn.focus();
    } else {
        feedbackMessageEl.textContent = 'Aún no es correcto. Intenta con una palabra principal.';
    }
}
function updateSessionStats(isCorrect) {
    if (!isReinforcementSession) {
        const statEntry = sessionStats[currentVerb.infinitive];
        if (statEntry) {
            statEntry.attempts++;
            if (!isCorrect) {
                statEntry.errors++;
            }
        }
    }
    // En sesión de refuerzo no actualizamos estadísticas
}
function handleCorrectAnswer() {
    feedbackMessageEl.textContent = '¡Correcto!';
    feedbackMessageEl.classList.remove('hidden', 'bg-red-100', 'text-red-700', 'bg-blue-100', 'text-blue-700');
    feedbackMessageEl.classList.add('bg-green-100', 'text-green-700');
    checkBtn.disabled = true;
    nextBtn.disabled = false;
    
    // Deshabilitar todos los inputs activos
    [infinitiveInput, pastSimpleInput, pastParticipleInput, spanishTranslationInput].forEach(input => {
        if (!input.closest('.hidden')) {
            input.disabled = true;
        }
    });
    
    nextBtn.focus();
}

function handleIncorrectAnswer() {
    isCorrectionMode = true;
    feedbackMessageEl.textContent = 'Incorrecto. Escribe las formas correctas para continuar.';
    feedbackMessageEl.classList.remove('hidden', 'bg-green-100', 'text-green-700');
    feedbackMessageEl.classList.add('bg-red-100', 'text-red-700');
    
    checkBtn.textContent = 'Confirmar Corrección';
    
    correctInfinitiveEl.textContent = `Correcto: ${currentVerb.infinitive}`;
    correctPastSimpleEl.textContent = `Correcto: ${currentVerb.pastSimple}`;
    correctPastParticipleEl.textContent = `Correcto: ${currentVerb.pastParticiple}`;

    if (!infinitiveInput.classList.contains('correct')) {
        correctInfinitiveEl.classList.remove('hidden');
        infinitiveInput.value = '';
        infinitiveInput.classList.add('correction-mode');
        infinitiveInput.focus();
    }
    if (!pastSimpleInput.classList.contains('correct')) {
        correctPastSimpleEl.classList.remove('hidden');
        pastSimpleInput.value = '';
        pastSimpleInput.classList.add('correction-mode');
    }
    if (!pastParticipleInput.classList.contains('correct')) {
        correctPastParticipleEl.classList.remove('hidden');
        pastParticipleInput.value = '';
        pastParticipleInput.classList.add('correction-mode');
    }
}

function handleCorrection() {
    let correctionComplete = true;
    if (infinitiveInput.classList.contains('correction-mode') && infinitiveInput.value.trim().toLowerCase() !== currentVerb.infinitive) correctionComplete = false;
    
    const correctPastSimples = currentVerb.pastSimple.split('/');
    if (pastSimpleInput.classList.contains('correction-mode') && !correctPastSimples.includes(pastSimpleInput.value.trim().toLowerCase())) correctionComplete = false;
    
    const correctPastParticiples = currentVerb.pastParticiple.split('/');
    if (pastParticipleInput.classList.contains('correction-mode') && !correctPastParticiples.includes(pastParticipleInput.value.trim().toLowerCase())) correctionComplete = false;

    if(correctionComplete) {
        feedbackMessageEl.textContent = '¡Muy bien! Error corregido.';
        feedbackMessageEl.classList.remove('bg-red-100', 'text-red-700');
        feedbackMessageEl.classList.add('bg-blue-100', 'text-blue-700');
        isCorrectionMode = false;
        checkBtn.disabled = true;
        checkBtn.textContent = 'Revisar';
        nextBtn.disabled = false;
        inputs.forEach(input => input.disabled = true);
        nextBtn.focus();
    } else {
         feedbackMessageEl.textContent = 'Aún no es correcto. Cópialo exactamente como se muestra.';
    }
}

function showSummary() {
    practiceScreen.classList.add('hidden');
    summaryScreen.classList.remove('hidden');
    
    summaryStatsEl.innerHTML = '';
    
    const sortedStats = Object.values(sessionStats).sort((a, b) => {
        const percentageA = a.attempts > 0 ? 100 - Math.round((a.errors / a.attempts) * 100) : 100;
        const percentageB = b.attempts > 0 ? 100 - Math.round((b.errors / b.attempts) * 100) : 100;
        return percentageA - percentageB;
    });

    const failedVerbs = sortedStats.filter(stat => {
        const percentage = stat.attempts > 0 ? 100 - Math.round((stat.errors / stat.attempts) * 100) : 100;
        return percentage <= 80;
    });

    if (failedVerbs.length > 0) {
        reinforceBtn.classList.remove('hidden');
    } else {
        reinforceBtn.classList.add('hidden');
    }

    const title = document.createElement('h2');
    title.className = 'text-xl font-bold text-slate-700 mb-4 border-b pb-2';
    title.textContent = 'Resultados del Examen';
    summaryStatsEl.appendChild(title);

    sortedStats.forEach(stat => {
        const percentage = stat.attempts > 0 ? 100 - Math.round((stat.errors / stat.attempts) * 100) : 100;
        let bgColor = '';
        if (percentage <= 50) {
            bgColor = 'bg-red-50';
        } else if (percentage <= 80) {
            bgColor = 'bg-amber-50';
        }

        const statDiv = document.createElement('div');
        statDiv.className = `flex justify-between items-center p-3 rounded-lg ${bgColor}`;
        statDiv.innerHTML = `
            <div class="text-left">
                <p class="font-bold text-lg text-slate-800">${stat.infinitive} / ${stat.pastSimple} / ${stat.pastParticiple}</p>
                <p class="text-sm text-slate-500">${stat.errors} ${stat.errors === 1 ? 'error' : 'errores'} de ${stat.attempts} intentos</p>
            </div>
            <div class="font-bold text-xl ${percentage <= 80 ? 'text-red-500' : 'text-green-500'}">
                ${percentage}%
            </div>
        `;
        summaryStatsEl.appendChild(statDiv);
    });
}
// full screan
function toggleFullScreen() {
    const doc = window.document;
    const docEl = document.documentElement;

    // Detectar si es un dispositivo móvil
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

    if (isMobile) {
        // En móviles, usar diferentes métodos
        toggleMobileFullscreen();
    } else {
        // En desktop, usar la API estándar
        toggleDesktopFullscreen();
    }
}

function toggleDesktopFullscreen() {
    const doc = window.document;
    const docEl = document.documentElement;

    const requestFullScreen = docEl.requestFullscreen || 
                              docEl.mozRequestFullScreen || 
                              docEl.webkitRequestFullscreen || 
                              docEl.msRequestFullscreen;
    
    const cancelFullScreen = doc.exitFullscreen || 
                            doc.mozCancelFullScreen || 
                            doc.webkitExitFullscreen || 
                            doc.msExitFullscreen;

    if (!doc.fullscreenElement && 
        !doc.mozFullScreenElement && 
        !doc.webkitFullscreenElement && 
        !doc.msFullscreenElement) {
        
        if (requestFullScreen) {
            requestFullScreen.call(docEl).catch(err => {
                console.log('Error entering fullscreen:', err);
                // Fallback para desktop si falla
                toggleMobileFullscreen();
            });
        }
    } else {
        if (cancelFullScreen) {
            cancelFullScreen.call(doc);
        }
    }
}

function toggleMobileFullscreen() {
    const appContainer = document.getElementById('app-container');
    const body = document.body;
    const html = document.documentElement;
    
    if (!body.classList.contains('mobile-fullscreen')) {
        // Entrar en modo fullscreen móvil
        body.classList.add('mobile-fullscreen');
        
        // Ocultar barras del navegador en móviles
        if (window.screen && window.screen.orientation) {
            // Para Android Chrome
            try {
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen().catch(() => {
                        // Si falla, aplicar estilos manuales
                        applyMobileFullscreenStyles();
                    });
                } else {
                    applyMobileFullscreenStyles();
                }
            } catch (e) {
                applyMobileFullscreenStyles();
            }
        } else {
            applyMobileFullscreenStyles();
        }
        
        updateFullscreenIcons(true);
    } else {
        // Salir del modo fullscreen móvil
        body.classList.remove('mobile-fullscreen');
        removeMobileFullscreenStyles();
        
        if (document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
        }
        
        updateFullscreenIcons(false);
    }
}

function applyMobileFullscreenStyles() {
    const body = document.body;
    const html = document.documentElement;
    
    // Aplicar estilos para ocultar barras del navegador
    body.style.cssText = `
        margin: 0 !important;
        padding: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        overflow: hidden !important;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        background: #f1f5f9 !important;
    `;
    
    html.style.cssText = `
        margin: 0 !important;
        padding: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        overflow: hidden !important;
    `;
    
    // Ocultar la barra de direcciones en móviles
    window.scrollTo(0, 1);
    
    // Forzar el viewport
    let viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
    }
}

function removeMobileFullscreenStyles() {
    const body = document.body;
    const html = document.documentElement;
    
    // Remover estilos personalizados
    body.style.cssText = '';
    html.style.cssText = '';
    
    // Restaurar viewport original
    let viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
    }
}

function updateFullscreenIcons(isFullscreen) {
    const enterIcon = document.getElementById('fullscreen-enter-icon');
    const exitIcon = document.getElementById('fullscreen-exit-icon');
    
    if (isFullscreen) {
        enterIcon.classList.add('hidden');
        exitIcon.classList.remove('hidden');
    } else {
        enterIcon.classList.remove('hidden');
        exitIcon.classList.add('hidden');
    }
}
// --- Event Listeners para los nuevos botones ---
decreaseAttemptsBtn.addEventListener('click', decreaseAttempts);
increaseAttemptsBtn.addEventListener('click', increaseAttempts);

// --- Event Listeners ---
startSessionBtn.addEventListener('click', startMainSession);
resetVerbsBtn?.addEventListener('click', () => setupDailyVerbs(true));  
reinforceBtn.addEventListener('click', startReinforcementSession);
goToStartBtn.addEventListener('click', goToStartScreen);
checkBtn.addEventListener('click', checkAnswer);
nextBtn.addEventListener('click', setupNextQuestion);
refreshVerbsBtn?.addEventListener('click', refreshDailyVerbs);

exitSessionBtn.addEventListener('click', () => exitModal.classList.remove('hidden'));
cancelExitBtn.addEventListener('click', () => exitModal.classList.add('hidden'));
confirmExitBtn.addEventListener('click', () => {
    exitModal.classList.add('hidden');
    goToStartScreen();
});

spanishTranslationInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        if (!checkBtn.disabled) {
            checkBtn.click();
        } else if (!nextBtn.disabled) {
            nextBtn.click();
        }
    }
});

fullscreenBtn.addEventListener('click', toggleFullScreen);

inputs.forEach(input => {
    input.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (!checkBtn.disabled) {
                checkBtn.click();
            } else if (!nextBtn.disabled) {
                nextBtn.click();
            }
        }
    });
});
// Manejar eventos de fullscreen en diferentes navegadores
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('MSFullscreenChange', handleFullscreenChange);

function handleFullscreenChange() {
    const isFullscreen = !!(document.fullscreenElement || 
                           document.webkitFullscreenElement || 
                           document.mozFullScreenElement || 
                           document.msFullscreenElement);
    
    updateFullscreenIcons(isFullscreen);
    
    // Si salimos del fullscreen del navegador, también salir del modo móvil
    if (!isFullscreen && document.body.classList.contains('mobile-fullscreen')) {
        document.body.classList.remove('mobile-fullscreen');
        removeMobileFullscreenStyles();
    }
}

// Prevenir zoom en iOS cuando se hace doble tap
document.addEventListener('touchstart', function(event) {
    if (event.touches.length > 1) {
        event.preventDefault();
    }
}, { passive: false });

let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);
// --- Inicialización ---
window.onload = function() {
    loadUserPreferences(); // Cargar preferencias antes de setup
    setupDailyVerbs();
    
    // Mostrar info de debug en consola
    console.log('🔍 Verbos Debug Info:', getDebugInfo());
    console.log('🎯 Configuración:', { 
        attemptsPerVerb: ATTEMPTS_PER_VERB, 
        totalQuestions: dailyVerbs.length * ATTEMPTS_PER_VERB 
    });
    
    // Verificar cambio de día cada 5 minutos
    setInterval(() => {
        const updatedVerbs = checkDailyUpdate();
        if (JSON.stringify(updatedVerbs) !== JSON.stringify(dailyVerbs)) {
            dailyVerbs = [...updatedVerbs];
            displayDailyVerbs();
            updateAttemptsDisplay(); // Actualizar conteo de preguntas
            showDayChangeNotification();
            console.log('🔍 Verbos actualizados:', getDebugInfo());
        }
    }, 5 * 60 * 1000); // 5 minutos
};