// src/js/main.js
import { generateDailyVerbs, checkDailyUpdate, getDebugInfo, initializeVerbs } from './utils/VerbUtils.js';
import { EXERCISE_TYPES, createMixedQuestionDeck, createMixedReinforcementDeck, shuffleArray } from './utils/ExerciseUtils.js';
import { toggleFullScreen, handleFullscreenChange } from './components/FullscreenManager.js';
import { StartScreenManager } from './components/StartScreenManager.js';
import { PracticeSessionManager } from './components/PracticeSessionManager.js';
import { SummaryManager } from './components/SummaryManager.js';
import { SESSION_CONFIG, PERFORMANCE_THRESHOLDS } from './config/constants.js';

// --- Constantes de la Sesión ---
let ATTEMPTS_PER_VERB = SESSION_CONFIG.ATTEMPTS_PER_VERB_DEFAULT;
let dailyVerbs = [];

// --- Elementos del DOM ---
const startScreen = document.getElementById('start-screen');
const practiceScreen = document.getElementById('practice-screen');
const summaryScreen = document.getElementById('summary-screen');
const startSessionBtn = document.getElementById('start-session-btn');
const reinforceBtn = document.getElementById('reinforce-btn');
const goToStartBtn = document.getElementById('go-to-start-btn');
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

// --- Estado de la Aplicación ---
let sessionStats = {};
let currentVerb = null;
let isCorrectionMode = false;
let questionDeck = [];
let currentQuestionIndex = 0;
let isReinforcementSession = false;

// --- Inicializar Managers ---
const startScreenManager = new StartScreenManager({
    dailyVerbsListEl,
    attemptsDisplay,
    totalQuestionsEl,
    sessionQuestionsCount,
    attemptsProgress,
    decreaseAttemptsBtn,
    increaseAttemptsBtn
});

const practiceSessionManager = new PracticeSessionManager({
    sessionTitleEl,
    progressTrackerEl,
    verbImageEl,
    spanishVerbEl,
    verbExplanationEl,
    infinitiveInput,
    pastSimpleInput,
    pastParticipleInput,
    checkBtn,
    nextBtn,
    feedbackMessageEl,
    correctInfinitiveEl,
    correctPastSimpleEl,
    correctPastParticipleEl,
    translationExercise,
    englishVerbDisplay,
    infinitiveDisplay,
    pastSimpleDisplay,
    pastParticipleDisplay,
    spanishTranslationInput,
    correctTranslationEl,
    matchingExercise: document.getElementById('matching-exercise'),
    matchingVerbInfinitive: document.getElementById('matching-verb-infinitive'),
    englishWordsContainer: document.getElementById('english-words'),
    spanishWordsContainer: document.getElementById('spanish-words'),
    matchingFeedback: document.getElementById('matching-feedback'),
    matchingProgress: document.getElementById('matching-progress'),
    correctMatches: document.getElementById('correct-matches'),
    totalMatches: document.getElementById('total-matches')
});

const summaryManager = new SummaryManager({
    summaryStatsEl,
    reinforceBtn
});

// --- Funciones principales ---
function checkAnswer() {
    const currentQuestion = questionDeck[currentQuestionIndex - 1];
    const exerciseType = currentQuestion.type;
    let result;
    if (exerciseType === EXERCISE_TYPES.WRITE_FORMS) {
        result = practiceSessionManager.checkWriteFormsAnswer(currentVerb, isCorrectionMode);
    } else if (exerciseType === EXERCISE_TYPES.TRANSLATE_TO_SPANISH) {
        result = practiceSessionManager.checkTranslationAnswer(currentVerb, isCorrectionMode);
    } else if (exerciseType === EXERCISE_TYPES.MATCH_TRANSLATION) {
        result = practiceSessionManager.checkMatchingAnswer();
    } else {
        console.error('Tipo desconocido:', exerciseType);
        return;
    }
    if (result) {
        updateSessionStats(result.isCorrect);
        isCorrectionMode = result.isCorrectionMode;
    }
}
function displayDailyVerbs() {
    dailyVerbs = startScreenManager.displayDailyVerbs(dailyVerbs);
}

function updateAttemptsDisplay() {
    startScreenManager.updateAttemptsDisplay(ATTEMPTS_PER_VERB, dailyVerbs);
}

function decreaseAttempts() {
    if (ATTEMPTS_PER_VERB > SESSION_CONFIG.MIN_ATTEMPTS) {
        ATTEMPTS_PER_VERB--;
        updateAttemptsDisplay();
        startScreenManager.showAttemptsChangeNotification('decrease', ATTEMPTS_PER_VERB);
    }
}

function increaseAttempts() {
    if (ATTEMPTS_PER_VERB < SESSION_CONFIG.MAX_ATTEMPTS) {
        ATTEMPTS_PER_VERB++;
        updateAttemptsDisplay();
        startScreenManager.showAttemptsChangeNotification('increase', ATTEMPTS_PER_VERB);
    }
}

function loadUserPreferences() {
    const savedAttempts = startScreenManager.loadUserPreferences();
    ATTEMPTS_PER_VERB = savedAttempts;
    updateAttemptsDisplay();
}

function refreshDailyVerbs() {
    if (confirm('¿Estás seguro de que quieres generar nuevos verbos del día?')) {
        dailyVerbs = generateDailyVerbs(true);
        displayDailyVerbs();
        resetSessionStats();
        startScreenManager.showDayChangeNotification();
        console.log('🔍 Debug Info:', getDebugInfo());
    }
}

function resetSessionStats() {
    sessionStats = {};
    currentQuestionIndex = 0;
    questionDeck = [];
    isReinforcementSession = false;
}

function setupDailyVerbs(forceReset = false) {
    if (forceReset) {
        dailyVerbs = generateDailyVerbs(true);
    } else {
        dailyVerbs = checkDailyUpdate();
    }
    displayDailyVerbs();
}

function startMainSession() {
    isReinforcementSession = false;
    sessionStats = {};
    dailyVerbs.forEach(verb => {
        sessionStats[verb.infinitive] = { ...verb, errors: 0, attempts: 0 };
    });
    
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
    
    const redZoneVerbs = Object.values(sessionStats).filter(stat => {
        const percentage = stat.attempts > 0 ? 100 - Math.round((stat.errors / stat.attempts) * 100) : 100;
        return percentage <= PERFORMANCE_THRESHOLDS.RED_ZONE;
    });

    const yellowZoneVerbs = Object.values(sessionStats).filter(stat => {
        const percentage = stat.attempts > 0 ? 100 - Math.round((stat.errors / stat.attempts) * 100) : 100;
        return percentage > PERFORMANCE_THRESHOLDS.RED_ZONE && percentage <= PERFORMANCE_THRESHOLDS.YELLOW_ZONE;
    });

    const redDeck = createMixedReinforcementDeck(redZoneVerbs, SESSION_CONFIG.REINFORCE_ATTEMPTS_RED);
    const yellowDeck = createMixedReinforcementDeck(yellowZoneVerbs, SESSION_CONFIG.REINFORCE_ATTEMPTS_YELLOW);
    
    questionDeck = [...redDeck, ...yellowDeck];
    shuffleArray(questionDeck);

    if (questionDeck.length === 0) {
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

function goToStartScreen() {
    summaryScreen.classList.add('hidden');
    practiceScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    setupDailyVerbs();
}

function setupNextQuestion() {
    if (currentQuestionIndex >= questionDeck.length) {
        if(isReinforcementSession) {
            practiceSessionManager.showReinforcementCompletedMessage();
            goToStartScreen();
        } else {
            showSummary();
        }
        return;
    }
    
    const currentQuestion = questionDeck[currentQuestionIndex];
    currentQuestionIndex++;

    const result = practiceSessionManager.setupNextQuestion(currentQuestion, currentQuestionIndex, questionDeck, currentVerb);
    
    if (result.skip) {
        setupNextQuestion();
        return;
    }
    
    currentVerb = result.currentVerb;
    isCorrectionMode = result.isCorrectionMode;
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
}

function showSummary() {
    practiceScreen.classList.add('hidden');
    summaryScreen.classList.remove('hidden');
    
    summaryManager.showSummary(sessionStats);
}

// --- Event Listeners ---
decreaseAttemptsBtn.addEventListener('click', decreaseAttempts);
increaseAttemptsBtn.addEventListener('click', increaseAttempts);
startSessionBtn.addEventListener('click', startMainSession);
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

// Manejar eventos de fullscreen
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('MSFullscreenChange', handleFullscreenChange);

// Prevenir zoom en iOS
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
window.onload = async function() {
    try {
        loadUserPreferences();
        
        dailyVerbs = await initializeVerbs();
        
        displayDailyVerbs();
        updateAttemptsDisplay();
        
        console.log('✅ App inicializada');
        console.log('🔍 Debug Info:', getDebugInfo());
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
                updateAttemptsDisplay();
                startScreenManager.showDayChangeNotification();
                console.log('🔍 Verbos actualizados automáticamente');
            }
        }, 5 * 60 * 1000);
        
    } catch (error) {
        console.error('❌ Error inicializando:', error);
        alert('Error cargando la aplicación. Recarga la página.');
    }
};
