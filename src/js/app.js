import {ALL_VERBS, DAILY_VERBS, generateDailyVerbs, checkDailyUpdate} from './verbs/verbs.js';
// --- Constantes de la Sesión ---
const VERBS_PER_DAY = 5;
const ATTEMPTS_PER_VERB = 4;
const REINFORCE_ATTEMPTS_RED = 3;
const REINFORCE_ATTEMPTS_YELLOW = 2;
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
const fullscreenEnterIcon = document.getElementById('fullscreen-enter-icon');
const fullscreenExitIcon = document.getElementById('fullscreen-exit-icon');

const inputs = [infinitiveInput, pastSimpleInput, pastParticipleInput];

// --- Estado de la Aplicación ---
let sessionStats = {};
let currentVerb = null;
let isCorrectionMode = false;
let questionDeck = [];
let currentQuestionIndex = 0;
let isReinforcementSession = false;


// --- Lógica Principal ---

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
    // Mostrar confirmación
    if (confirm('¿Estás seguro de que quieres generar nuevos verbos del día? Se perderá el progreso actual.')) {
        dailyVerbs = generateDailyVerbs(true);
        displayDailyVerbs();
        
        // Reset de sesión si existe
        resetSessionStats();
        
        // Mostrar notificación
        showDayChangeNotification();
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


function createQuestionDeck(verbs, attemptsPer) {
    const deck = [];
    verbs.forEach(verb => {
        for (let i = 0; i < attemptsPer; i++) {
            deck.push(verb);
        }
    });
    shuffleArray(deck);
    return deck;
}

function startMainSession() {
    isReinforcementSession = false;
    sessionStats = {};
    dailyVerbs.forEach(verb => {
        sessionStats[verb.infinitive] = { ...verb, errors: 0, attempts: 0 };
    });
    questionDeck = createQuestionDeck(dailyVerbs, ATTEMPTS_PER_VERB);
    currentQuestionIndex = 0;
    
    sessionTitleEl.textContent = "Sesión Diaria";
    startScreen.classList.add('hidden');
    summaryScreen.classList.add('hidden');
    practiceScreen.classList.remove('hidden');

    setupNextQuestion();
}

function startReinforcementSession() {
    isReinforcementSession = true;
    
    const redZoneVerbs = Object.values(sessionStats).filter(stat => {
        const percentage = stat.attempts > 0 ? 100 - Math.round((stat.errors / stat.attempts) * 100) : 100;
        return percentage <= 50;
    });

    const yellowZoneVerbs = Object.values(sessionStats).filter(stat => {
        const percentage = stat.attempts > 0 ? 100 - Math.round((stat.errors / stat.attempts) * 100) : 100;
        return percentage > 50 && percentage <= 80;
    });

    const redDeck = createQuestionDeck(redZoneVerbs, REINFORCE_ATTEMPTS_RED);
    const yellowDeck = createQuestionDeck(yellowZoneVerbs, REINFORCE_ATTEMPTS_YELLOW);
    
    questionDeck = [...redDeck, ...yellowDeck];
    shuffleArray(questionDeck);

    currentQuestionIndex = 0;
    
    sessionTitleEl.textContent = "Sesión de Refuerzo";
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
            goToStartScreen();
        } else {
            showSummary();
        }
        return;
    }
    
    currentVerb = questionDeck[currentQuestionIndex];
    currentQuestionIndex++;

    // Reset UI
    progressTrackerEl.textContent = `Pregunta ${currentQuestionIndex} / ${questionDeck.length}`;
    verbImageEl.src = currentVerb.imageUrl || '';
    verbImageEl.style.animation = 'none';
    verbImageEl.offsetHeight;
    verbImageEl.style.animation = null;
    
    spanishVerbEl.textContent = currentVerb.spanish;
    verbExplanationEl.textContent = currentVerb.explanation;
    feedbackMessageEl.classList.add('hidden');
    checkBtn.textContent = 'Revisar';
    checkBtn.disabled = false;
    nextBtn.disabled = true;

    inputs.forEach(input => {
        input.value = '';
        input.disabled = false;
        input.classList.remove('correct', 'incorrect', 'correction-mode');
    });
    
    [correctInfinitiveEl, correctPastSimpleEl, correctPastParticipleEl].forEach(el => el.classList.add('hidden'));

    infinitiveInput.focus();
}

function checkAnswer() {
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
    
    if (!isReinforcementSession) {
        const statEntry = sessionStats[currentVerb.infinitive];
        statEntry.attempts++;
         if (!allCorrect) {
            statEntry.errors++;
        }
    }
   
    if (allCorrect) {
        handleCorrectAnswer();
    } else {
        handleIncorrectAnswer();
    }
}

function handleCorrectAnswer() {
    feedbackMessageEl.textContent = '¡Correcto!';
    feedbackMessageEl.classList.remove('hidden', 'bg-red-100', 'text-red-700', 'bg-blue-100', 'text-blue-700');
    feedbackMessageEl.classList.add('bg-green-100', 'text-green-700');
    checkBtn.disabled = true;
    nextBtn.disabled = false;
    inputs.forEach(input => input.disabled = true);
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
    setupDailyVerbs();
    
    // Verificar cambio de día cada 5 minutos
    setInterval(() => {
        const updatedVerbs = checkDailyUpdate();
        if (JSON.stringify(updatedVerbs) !== JSON.stringify(dailyVerbs)) {
            dailyVerbs = [...updatedVerbs];
            displayDailyVerbs();
            showDayChangeNotification();
        }
    }, 5 * 60 * 1000); // 5 minutos
};