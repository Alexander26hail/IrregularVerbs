import { LOCAL_STORAGE_KEYS } from '../config/constants.js';

class VerbService {
    constructor() {
        this.allVerbs = [];
    }

    async loadVerbsFromJSON() {
        try {
            const response = await fetch('./data/verbs.json');
            const verbs = await response.json();
            this.allVerbs = verbs;
            console.log(`✅ Cargados ${this.allVerbs.length} verbos desde JSON`);
            return this.allVerbs;
        } catch (error) {
            console.error('❌ Error cargando verbos:', error);
            this.allVerbs = this.getFallbackVerbs();
            return this.allVerbs;
        }
    }

    getFallbackVerbs() {
        return [
            { infinitive: 'be', pastSimple: 'was/were', pastParticiple: 'been', spanish: 'ser/estar', explanation: 'Indica existencia, estado o identidad.', imageUrl: 'https://i.imgur.com/041TSxr.png' },
            { infinitive: 'do', pastSimple: 'did', pastParticiple: 'done', spanish: 'hacer', explanation: 'Realizar una actividad o tarea.', imageUrl: 'https://i.imgur.com/zFdaIgH.png' },
            { infinitive: 'go', pastSimple: 'went', pastParticiple: 'gone', spanish: 'ir', explanation: 'Moverse de un lugar a otro.', imageUrl: '' },
            { infinitive: 'have', pastSimple: 'had', pastParticiple: 'had', spanish: 'tener', explanation: 'Poseer algo.', imageUrl: '' },
            { infinitive: 'come', pastSimple: 'came', pastParticiple: 'come', spanish: 'venir', explanation: 'Moverse hacia el hablante.', imageUrl: 'https://i.imgur.com/sBYpwGH.png' }
        ];
    }

    getActiveVerbs() {
        return this.allVerbs.filter(verb => 
            verb.imageUrl && !verb.imageUrl.includes('URL_AQUÍ')
        );
    }

    // Tu lógica de generación diaria exacta
    generateDailyVerbs(forceReset = false) {
        let verbDay;
        
        if (forceReset) {
            verbDay = this.forceNewVerbDay();
        } else {
            verbDay = this.getCurrentVerbDay();
        }
        
        console.log('📅 Día de verbos:', verbDay);
        
        const activeVerbs = this.getActiveVerbs();
        const shuffledVerbs = this.deterministicShuffle(activeVerbs, verbDay);
        const dailyVerbs = shuffledVerbs.slice(0, 5);
        
        console.log('📚 Verbos generados:', dailyVerbs.map(v => v.infinitive));
        return dailyVerbs;
    }

    getCurrentVerbDay() {
        const today = new Date().toISOString().split('T')[0];
        const manualOverride = localStorage.getItem(`${LOCAL_STORAGE_KEYS.VERB_DAY}-${today}`);
        if (manualOverride) {
            return manualOverride;
        }
        return today;
    }

    forceNewVerbDay() {
        const today = new Date().toISOString().split('T')[0];
        const timestamp = Date.now().toString();
        const artificialDay = `${today}-${timestamp}`;
        localStorage.setItem(`${LOCAL_STORAGE_KEYS.VERB_DAY}-${today}`, artificialDay);
        console.log('🔄 Forzando nuevo día de verbos:', artificialDay);
        return artificialDay;
    }

    // Tu lógica determinística exacta
    createSeededRandom(seed) {
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

    deterministicShuffle(array, seed) {
        const seededRandom = this.createSeededRandom(seed);
        const result = [...array];
        
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(seededRandom() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        
        return result;
    }

    checkDailyUpdate() {
        const today = new Date().toISOString().split('T')[0];
        const lastCheck = localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_CHECK);
        
        if (lastCheck !== today) {
            const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            localStorage.removeItem(`${LOCAL_STORAGE_KEYS.VERB_DAY}-${yesterday}`);
            localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_CHECK, today);
            
            console.log('🌅 Nuevo día detectado, limpiando datos antiguos...');
            this.cleanOldDailyVerbs();
        }
        
        return this.generateDailyVerbs(false);
    }

    cleanOldDailyVerbs() {
        const keys = Object.keys(localStorage);
        const today = new Date().toISOString().split('T')[0];
        
        keys.forEach(key => {
            if (key.startsWith(LOCAL_STORAGE_KEYS.DAILY_VERBS) || 
                (key.startsWith(LOCAL_STORAGE_KEYS.VERB_DAY) && !key.includes(today))) {
                localStorage.removeItem(key);
                console.log('🧹 Limpiando:', key);
            }
        });
    }

    async initializeVerbs() {
        await this.loadVerbsFromJSON();
        return this.checkDailyUpdate();
    }

    getDebugInfo() {
        const today = new Date().toISOString().split('T')[0];
        const verbDay = this.getCurrentVerbDay();
        
        return {
            today,
            verbDay,
            isManualOverride: verbDay !== today,
            lastCheck: localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_CHECK),
            totalVerbs: this.allVerbs.length,
            verbs: this.generateDailyVerbs(false).map(v => v.infinitive)
        };
    }
}

// Crear instancia singleton
export const verbService = new VerbService();