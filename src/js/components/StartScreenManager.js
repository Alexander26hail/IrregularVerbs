// src/js/components/StartScreenManager.js
import { generateDailyVerbs, checkDailyUpdate } from '../utils/VerbUtils.js';

export class StartScreenManager {
    constructor(elements) {
        this.dailyVerbsListEl = elements.dailyVerbsListEl;
        this.attemptsDisplay = elements.attemptsDisplay;
        this.totalQuestionsEl = elements.totalQuestionsEl;
        this.sessionQuestionsCount = elements.sessionQuestionsCount;
        this.attemptsProgress = elements.attemptsProgress;
        this.decreaseAttemptsBtn = elements.decreaseAttemptsBtn;
        this.increaseAttemptsBtn = elements.increaseAttemptsBtn;
        
        this.MIN_ATTEMPTS = 2;
        this.MAX_ATTEMPTS = 8;
    }

    displayDailyVerbs(dailyVerbs) {
        // Verificar si es un nuevo día y actualizar automáticamente
        const updatedVerbs = checkDailyUpdate();
        if (JSON.stringify(updatedVerbs) !== JSON.stringify(dailyVerbs)) {
            dailyVerbs = [...updatedVerbs];
            this.showDayChangeNotification();
        }

        this.dailyVerbsListEl.innerHTML = '';
        
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
        this.dailyVerbsListEl.appendChild(dateHeader);
        
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
            this.dailyVerbsListEl.appendChild(li);
        });

        return dailyVerbs;
    }

    updateAttemptsDisplay(ATTEMPTS_PER_VERB, dailyVerbs) {
        this.attemptsDisplay.textContent = ATTEMPTS_PER_VERB;
        
        // Calcular total de preguntas
        const totalQuestions = dailyVerbs.length * ATTEMPTS_PER_VERB;
        this.totalQuestionsEl.textContent = `${totalQuestions} preguntas totales`;
        this.sessionQuestionsCount.textContent = totalQuestions;
        
        // Actualizar barra de progreso (2-8 rango)
        const progressPercent = ((ATTEMPTS_PER_VERB - this.MIN_ATTEMPTS) / (this.MAX_ATTEMPTS - this.MIN_ATTEMPTS)) * 100;
        this.attemptsProgress.style.width = `${progressPercent}%`;
        
        // Actualizar estado de botones
        this.decreaseAttemptsBtn.disabled = ATTEMPTS_PER_VERB <= this.MIN_ATTEMPTS;
        this.increaseAttemptsBtn.disabled = ATTEMPTS_PER_VERB >= this.MAX_ATTEMPTS;
        
        // Guardar preferencia del usuario
        localStorage.setItem('userAttemptsPerVerb', ATTEMPTS_PER_VERB.toString());
        
        console.log(`🎯 Intentos por verbo: ${ATTEMPTS_PER_VERB}, Total preguntas: ${totalQuestions}`);
    }

    showAttemptsChangeNotification(type, ATTEMPTS_PER_VERB) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm';
        
        const difficultyLevel = this.getDifficultyLevel(ATTEMPTS_PER_VERB);
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

    getDifficultyLevel(attempts) {
        if (attempts <= 3) return 'Fácil';
        if (attempts <= 5) return 'Normal';
        if (attempts <= 7) return 'Difícil';
        return 'Experto';
    }

    showDayChangeNotification() {
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

    loadUserPreferences() {
        const savedAttempts = localStorage.getItem('userAttemptsPerVerb');
        if (savedAttempts) {
            const attempts = parseInt(savedAttempts);
            if (attempts >= this.MIN_ATTEMPTS && attempts <= this.MAX_ATTEMPTS) {
                return attempts;
            }
        }
        return 4; // Default
    }
}