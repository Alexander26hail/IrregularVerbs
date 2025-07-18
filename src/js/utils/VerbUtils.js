// src/js/utils/VerbUtils.js
let ALL_VERBS = [];

async function loadVerbsFromJSON() {
    try {
        const response = await fetch('./data/verbs.json');
        const verbs = await response.json();
        ALL_VERBS = verbs; // Reemplazar la variable global
        console.log(`✅ Cargados ${ALL_VERBS.length} verbos desde JSON`);
        return ALL_VERBS;
    } catch (error) {
        console.error('❌ Error cargando verbos:', error);
        // Si falla, usar los verbos que ya están hardcodeados como fallback
        ALL_VERBS = [
            { infinitive: 'arise', pastSimple: 'arose', pastParticiple: 'arisen', spanish: 'surgir', explanation: 'Aparecer un problema o una oportunidad.', imageUrl: 'https://i.imgur.com/GvjYkQj.png' },
            { infinitive: 'be', pastSimple: 'was/were', pastParticiple: 'been', spanish: 'ser/estar', explanation: 'Indica existencia, estado o identidad.', imageUrl: 'https://i.imgur.com/041TSxr.png' },
            { infinitive: 'do', pastSimple: 'did', pastParticiple: 'done', spanish: 'hacer', explanation: 'Realizar una actividad o tarea.', imageUrl: 'https://i.imgur.com/zFdaIgH.png' },
            { infinitive: 'go', pastSimple: 'went', pastParticiple: 'gone', spanish: 'ir', explanation: 'Moverse de un lugar a otro.', imageUrl: '' },
            { infinitive: 'have', pastSimple: 'had', pastParticiple: 'had', spanish: 'tener', explanation: 'Poseer algo.', imageUrl: '' }
        ];
        return ALL_VERBS;
    }
}

// --- Generador de números pseudoaleatorios con semilla ---
function createSeededRandom(seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    
    let current = Math.abs(hash);
    return function() {
        current = (current * 1664525 + 1013904223) % Math.pow(2, 32);
        return current / Math.pow(2, 32);
    };
}

// --- Función determinista para mezclar array ---
function deterministicShuffle(array, seed) {
    const seededRandom = createSeededRandom(seed);
    const result = [...array];
    
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(seededRandom() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    
    return result;
}

function getCurrentVerbDay() {
    const today = new Date().toISOString().split('T')[0];
    
    // Verificar si hay un override manual para hoy
    const manualOverride = localStorage.getItem(`verbDay-${today}`);
    if (manualOverride) {
        return manualOverride;
    }
    
    // Si no hay override, usar la fecha actual
    return today;
}

function forceNewVerbDay() {
    const today = new Date().toISOString().split('T')[0];
    const timestamp = Date.now().toString();
    const artificialDay = `${today}-${timestamp}`;
    localStorage.setItem(`verbDay-${today}`, artificialDay);
    console.log('🔄 Forzando nuevo día de verbos:', artificialDay);
    return artificialDay;
}

// --- Función principal para generar verbos diarios ---
function generateDailyVerbs(forceReset = false) {
    let verbDay;
    
    if (forceReset) {
        verbDay = forceNewVerbDay();
    } else {
        verbDay = getCurrentVerbDay();
    }
    
    console.log('📅 Día de verbos:', verbDay);
    
    // Filtrar verbos activos
    const activeVerbs = ALL_VERBS.filter(verb => 
        verb.imageUrl && !verb.imageUrl.includes('URL_AQUÍ')
    );
    
    // Mezclar con la semilla del día de verbos
    const shuffledVerbs = deterministicShuffle(activeVerbs, verbDay);
    
    // Tomar los primeros 5
    const dailyVerbs = shuffledVerbs.slice(0, 5);
    
    console.log('📚 Verbos generados:', dailyVerbs.map(v => v.infinitive));
    
    return dailyVerbs;
}

// --- Función para limpiar verbos de días anteriores ---
function cleanOldDailyVerbs() {
    const keys = Object.keys(localStorage);
    const today = new Date().toISOString().split('T')[0];
    
    keys.forEach(key => {
        if (key.startsWith('dailyVerbs-') || 
            (key.startsWith('verbDay-') && !key.includes(today))) {
            localStorage.removeItem(key);
            console.log('🧹 Limpiando:', key);
        }
    });
}

// --- Función para verificar cambio de día ---
function checkDailyUpdate() {
    const today = new Date().toISOString().split('T')[0];
    const lastCheck = localStorage.getItem('lastDailyCheck');
    
    if (lastCheck !== today) {
        // Nuevo día natural - limpiar overrides del día anterior
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        localStorage.removeItem(`verbDay-${yesterday}`);
        localStorage.setItem('lastDailyCheck', today);
        
        console.log('🌅 Nuevo día detectado, limpiando datos antiguos...');
        cleanOldDailyVerbs();
    }
    
    return generateDailyVerbs(false);
}

// --- Función para obtener info de debug ---
function getDebugInfo() {
    const today = new Date().toISOString().split('T')[0];
    const verbDay = getCurrentVerbDay();
    
    return {
        today,
        verbDay,
        isManualOverride: verbDay !== today,
        lastCheck: localStorage.getItem('lastDailyCheck'),
        verbs: generateDailyVerbs(false).map(v => v.infinitive)
    };
}

async function initializeVerbs() {
    await loadVerbsFromJSON(); // Cargar verbos del JSON
    return checkDailyUpdate();   // Generar verbos del día
}

export { ALL_VERBS, generateDailyVerbs, checkDailyUpdate, getDebugInfo, initializeVerbs, loadVerbsFromJSON };
