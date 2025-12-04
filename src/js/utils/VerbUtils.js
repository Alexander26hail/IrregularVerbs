// src/js/utils/VerbUtils.js
let ALL_VERBS = [];
const VERB_HISTORY_KEY = 'recent_verb_ids';
const HISTORY_DAYS = 4;

function getRecentVerbIds() {
    const history = localStorage.getItem(VERB_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
}

function addToHistory(verbIds) {
    const history = getRecentVerbIds();
    const updated = [...verbIds, ...history].slice(0, HISTORY_DAYS * 6); 
    localStorage.setItem(VERB_HISTORY_KEY, JSON.stringify(updated));
}

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
    // SplitMix32 hash (mejor distribución que FNV-1a)
    let h = 0;
    for (let i = 0; i < seed.length; i++) {
        h = Math.imul(h ^ seed.charCodeAt(i), 0x85ebca6b);
        h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
    }
    h ^= h >>> 16;
    
    let state = Math.abs(h) >>> 0;
    
    // Mulberry32 (generador de alta calidad, período completo 2^32)
    return function() {
        state = Math.imul(state, 0x6c078965) + 1 | 0;
        let t = state ^ (state >>> 15);
        t = Math.imul(t, t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
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
    const today = getChileDate(); // Usar hora de Chile
    
    // Verificar si hay un override manual para hoy
    const manualOverride = localStorage.getItem(`verbDay-${today}`);
    if (manualOverride) {
        return manualOverride;
    }
    
    // Si no hay override, usar la fecha actual
    return today;
}

function forceNewVerbDay() {
    const today = getChileDate(); // Usar hora de Chile
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
    
    console.log('📅 Día de verbos (Chile):', verbDay);
    
    // Filtrar verbos activos
    const activeVerbs = ALL_VERBS.filter(verb => 
        verb.imageUrl && !verb.imageUrl.includes('URL_AQUÍ')
    );
    
    // Obtener verbos recientes
    const recentIds = getRecentVerbIds();
    
    // Separar en frescos y recientes
    const freshVerbs = activeVerbs.filter(v => !recentIds.includes(v.infinitive));
    const recentVerbs = activeVerbs.filter(v => recentIds.includes(v.infinitive));
    
    // Mezclar con la semilla del día
    const shuffledFresh = deterministicShuffle(freshVerbs, verbDay);
    const shuffledRecent = deterministicShuffle(recentVerbs, verbDay + '-fallback');
    
    // Priorizar frescos, completar con recientes si no hay suficientes
    let dailyVerbs;
    if (shuffledFresh.length >= 6) {
        dailyVerbs = shuffledFresh.slice(0, 6);
    } else {
        dailyVerbs = [...shuffledFresh, ...shuffledRecent.slice(0, 6 - shuffledFresh.length)];
    }
    
    // Guardar en historial
    addToHistory(dailyVerbs.map(v => v.infinitive));
    

    return dailyVerbs;
}

// --- Función para limpiar verbos de días anteriores ---
function cleanOldDailyVerbs() {
    const keys = Object.keys(localStorage);
    const today = getChileDate(); // Usar hora de Chile
    
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
    const today = getChileDate(); // Usar hora de Chile
    const lastCheck = localStorage.getItem('lastDailyCheck');
    
    if (lastCheck !== today) {
        // Nuevo día natural - limpiar overrides del día anterior
        const yesterday = new Date(new Date(today).getTime() - 24 * 60 * 60 * 1000);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        localStorage.removeItem(`verbDay-${yesterdayStr}`);
        localStorage.setItem('lastDailyCheck', today);
        
        console.log('🌅 Nuevo día detectado (Chile):', today);
        console.log('🧹 Limpiando datos antiguos...');
        cleanOldDailyVerbs();
    }
    
    return generateDailyVerbs(false);
}

// --- Función para obtener info de debug ---
function getDebugInfo() {
    const today = getChileDate(); // Usar hora de Chile
    const verbDay = getCurrentVerbDay();
    
    return {
        today,
        chileTime: new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' }),
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
function getChileDate() {
    // Obtener fecha y hora actual en zona horaria de Chile
    const formatter = new Intl.DateTimeFormat('en-CA', { 
        timeZone: 'America/Santiago',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    
    // Devuelve formato YYYY-MM-DD directamente
    return formatter.format(new Date()).replace(/\//g, '-');
}

export { ALL_VERBS, generateDailyVerbs, checkDailyUpdate, getDebugInfo, initializeVerbs, loadVerbsFromJSON };
