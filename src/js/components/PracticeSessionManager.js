// src/js/components/PracticeSessionManager.js
import { EXERCISE_TYPES, isSpanishTranslationCorrect } from '../utils/ExerciseUtils.js';

export class PracticeSessionManager {
    constructor(elements) {
        this.sessionTitleEl = elements.sessionTitleEl;
        this.progressTrackerEl = elements.progressTrackerEl;
        this.verbImageEl = elements.verbImageEl;
        this.spanishVerbEl = elements.spanishVerbEl;
        this.verbExplanationEl = elements.verbExplanationEl;
        this.infinitiveInput = elements.infinitiveInput;
        this.pastSimpleInput = elements.pastSimpleInput;
        this.pastParticipleInput = elements.pastParticipleInput;
        this.checkBtn = elements.checkBtn;
        this.nextBtn = elements.nextBtn;
        this.feedbackMessageEl = elements.feedbackMessageEl;
        this.correctInfinitiveEl = elements.correctInfinitiveEl;
        this.correctPastSimpleEl = elements.correctPastSimpleEl;
        this.correctPastParticipleEl = elements.correctPastParticipleEl;
        this.translationExercise = elements.translationExercise;
        this.englishVerbDisplay = elements.englishVerbDisplay;
        this.infinitiveDisplay = elements.infinitiveDisplay;
        this.pastSimpleDisplay = elements.pastSimpleDisplay;
        this.pastParticipleDisplay = elements.pastParticipleDisplay;
        this.spanishTranslationInput = elements.spanishTranslationInput;
        this.correctTranslationEl = elements.correctTranslationEl;
        this.inputs = [this.infinitiveInput, this.pastSimpleInput, this.pastParticipleInput];
    }

    setupNextQuestion(currentQuestion, currentQuestionIndex, questionDeck, currentVerb) {
        // Verificar que la pregunta tiene la estructura correcta
        if (!currentQuestion || !currentQuestion.verb || !currentQuestion.type) {
            console.error('❌ Pregunta mal formada:', currentQuestion);
            return { skip: true };
        }
        
        currentVerb = currentQuestion.verb;
        const exerciseType = currentQuestion.type;

        // Reset del estado de corrección
        const isCorrectionMode = false;
        // Reset UI común
        this.progressTrackerEl.textContent = `Pregunta ${currentQuestionIndex} / ${questionDeck.length}`;
        this.verbImageEl.src = currentVerb.imageUrl || '';
        this.verbImageEl.style.animation = 'none';
        this.verbImageEl.offsetHeight;
        this.verbImageEl.style.animation = null;
        
        this.feedbackMessageEl.classList.add('hidden');
        this.checkBtn.textContent = 'Revisar';
        this.checkBtn.disabled = false;
        this.nextBtn.disabled = true;

        // Ocultar ambas interfaces
        document.getElementById('verb-inputs').classList.add('hidden');
        this.translationExercise.classList.add('hidden');
        document.getElementById('verb-display').classList.remove('hidden'); // Asegurar que esté visible

        // Configurar según el tipo de ejercicio
        if (exerciseType === EXERCISE_TYPES.WRITE_FORMS) {
            this.setupWriteFormsExercise(currentVerb);
        } else if (exerciseType === EXERCISE_TYPES.TRANSLATE_TO_SPANISH) {
            this.setupTranslationExercise(currentVerb);
        } else {
            console.error('❌ Tipo de ejercicio desconocido:', exerciseType);
            return { skip: true };
        }
        
        console.log('✅ Pregunta configurada:', {
            index: currentQuestionIndex,
            total: questionDeck.length,
            type: exerciseType,
            verb: currentVerb.infinitive,
            isReinforcement: false
        });

        return { currentVerb, isCorrectionMode };
    }

    setupWriteFormsExercise(currentVerb) {
        // Mostrar interfaz de escribir formas
        document.getElementById('verb-inputs').classList.remove('hidden');
        
        // Configurar como antes
        this.spanishVerbEl.textContent = currentVerb.spanish;
        this.verbExplanationEl.textContent = currentVerb.explanation;

        [this.infinitiveInput, this.pastSimpleInput, this.pastParticipleInput].forEach(input => {
            input.value = '';
            input.disabled = false;
            input.classList.remove('correct', 'incorrect', 'correction-mode');
        });
        
        [this.correctInfinitiveEl, this.correctPastSimpleEl, this.correctPastParticipleEl].forEach(el => el.classList.add('hidden'));

        this.infinitiveInput.focus();
    }

    setupTranslationExercise(currentVerb) {
        // Mostrar interfaz de traducción
        this.translationExercise.classList.remove('hidden');
        
        // Ocultar el verb-display actual
        document.getElementById('verb-display').classList.add('hidden');
        
        // Configurar displays
        this.englishVerbDisplay.textContent = currentVerb.infinitive;
        this.infinitiveDisplay.textContent = currentVerb.infinitive;
        this.pastSimpleDisplay.textContent = currentVerb.pastSimple;
        this.pastParticipleDisplay.textContent = currentVerb.pastParticiple;
        
        // Reset input
        this.spanishTranslationInput.value = '';
        this.spanishTranslationInput.disabled = false;
        this.spanishTranslationInput.classList.remove('correct', 'incorrect', 'correction-mode');
        this.correctTranslationEl.classList.add('hidden');

        this.spanishTranslationInput.focus();
    }

    checkWriteFormsAnswer(currentVerb, isCorrectionMode) {
        if (isCorrectionMode) {
            return this.handleCorrection(currentVerb);
        }

        const userInfinitive = this.infinitiveInput.value.trim().toLowerCase();
        const userPastSimple = this.pastSimpleInput.value.trim().toLowerCase();
        const userPastParticiple = this.pastParticipleInput.value.trim().toLowerCase();

        let allCorrect = true;
        
        const isInfCorrect = userInfinitive === currentVerb.infinitive;
        this.infinitiveInput.classList.toggle('correct', isInfCorrect);
        this.infinitiveInput.classList.toggle('incorrect', !isInfCorrect);
        if (!isInfCorrect) allCorrect = false;

        const correctPastSimples = currentVerb.pastSimple.split('/');
        const isPastCorrect = correctPastSimples.includes(userPastSimple);
        this.pastSimpleInput.classList.toggle('correct', isPastCorrect);
        this.pastSimpleInput.classList.toggle('incorrect', !isPastCorrect);
        if (!isPastCorrect) allCorrect = false;

        const isParticipleCorrect = currentVerb.pastParticiple.split('/').includes(userPastParticiple);
        this.pastParticipleInput.classList.toggle('correct', isParticipleCorrect);
        this.pastParticipleInput.classList.toggle('incorrect', !isParticipleCorrect);
        if (!isParticipleCorrect) allCorrect = false;
        
        if (allCorrect) {
            return this.handleCorrectAnswer();
        } else {
            return this.handleIncorrectAnswer(currentVerb);
        }
    }

    checkTranslationAnswer(currentVerb, isCorrectionMode) {
        if (isCorrectionMode) {
            return this.handleTranslationCorrection(currentVerb);
        }

        const userTranslation = this.spanishTranslationInput.value.trim();
        const correctTranslation = currentVerb.spanish;
        
        // Usar la nueva función simple
        const isCorrect = isSpanishTranslationCorrect(userTranslation, correctTranslation);
        
        this.spanishTranslationInput.classList.toggle('correct', isCorrect);
        this.spanishTranslationInput.classList.toggle('incorrect', !isCorrect);
        
        if (isCorrect) {
            return this.handleCorrectAnswer();
        } else {
            return this.handleTranslationIncorrectAnswer(currentVerb);
        }
    }

    handleCorrectAnswer() {
        this.feedbackMessageEl.textContent = '¡Correcto!';
        this.feedbackMessageEl.classList.remove('hidden', 'bg-red-100', 'text-red-700', 'bg-blue-100', 'text-blue-700');
        this.feedbackMessageEl.classList.add('bg-green-100', 'text-green-700');
        this.checkBtn.disabled = true;
        this.nextBtn.disabled = false;
        
        // Deshabilitar todos los inputs activos
        [this.infinitiveInput, this.pastSimpleInput, this.pastParticipleInput, this.spanishTranslationInput].forEach(input => {
            if (!input.closest('.hidden')) {
                input.disabled = true;
            }
        });
        
        this.nextBtn.focus();
        
        return { isCorrect: true, isCorrectionMode: false };
    }

    handleIncorrectAnswer(currentVerb) {
        const isCorrectionMode = true;
        this.feedbackMessageEl.textContent = 'Incorrecto. Escribe las formas correctas para continuar.';
        this.feedbackMessageEl.classList.remove('hidden', 'bg-green-100', 'text-green-700');
        this.feedbackMessageEl.classList.add('bg-red-100', 'text-red-700');
        
        this.checkBtn.textContent = 'Confirmar Corrección';
        
        this.correctInfinitiveEl.textContent = `Correcto: ${currentVerb.infinitive}`;
        this.correctPastSimpleEl.textContent = `Correcto: ${currentVerb.pastSimple}`;
        this.correctPastParticipleEl.textContent = `Correcto: ${currentVerb.pastParticiple}`;

        if (!this.infinitiveInput.classList.contains('correct')) {
            this.correctInfinitiveEl.classList.remove('hidden');
            this.infinitiveInput.value = '';
            this.infinitiveInput.classList.add('correction-mode');
            this.infinitiveInput.focus();
        }
        if (!this.pastSimpleInput.classList.contains('correct')) {
            this.correctPastSimpleEl.classList.remove('hidden');
            this.pastSimpleInput.value = '';
            this.pastSimpleInput.classList.add('correction-mode');
        }
        if (!this.pastParticipleInput.classList.contains('correct')) {
            this.correctPastParticipleEl.classList.remove('hidden');
            this.pastParticipleInput.value = '';
            this.pastParticipleInput.classList.add('correction-mode');
        }
        
        return { isCorrect: false, isCorrectionMode };
    }

    handleTranslationIncorrectAnswer(currentVerb) {
        const isCorrectionMode = true;
        this.feedbackMessageEl.textContent = 'Incorrecto. Escribe la traducción correcta para continuar.';
        this.feedbackMessageEl.classList.remove('hidden', 'bg-green-100', 'text-green-700');
        this.feedbackMessageEl.classList.add('bg-red-100', 'text-red-700');
        
        this.checkBtn.textContent = 'Confirmar Corrección';
        
        this.correctTranslationEl.textContent = `Correcto: ${currentVerb.spanish}`;
        this.correctTranslationEl.classList.remove('hidden');
        
        this.spanishTranslationInput.value = '';
        this.spanishTranslationInput.classList.add('correction-mode');
        this.spanishTranslationInput.focus();
        
        return { isCorrect: false, isCorrectionMode };
    }

    handleCorrection(currentVerb) {
        let correctionComplete = true;
        if (this.infinitiveInput.classList.contains('correction-mode') && this.infinitiveInput.value.trim().toLowerCase() !== currentVerb.infinitive) correctionComplete = false;
        
        const correctPastSimples = currentVerb.pastSimple.split('/');
        if (this.pastSimpleInput.classList.contains('correction-mode') && !correctPastSimples.includes(this.pastSimpleInput.value.trim().toLowerCase())) correctionComplete = false;
        
        const correctPastParticiples = currentVerb.pastParticiple.split('/');
        if (this.pastParticipleInput.classList.contains('correction-mode') && !correctPastParticiples.includes(this.pastParticipleInput.value.trim().toLowerCase())) correctionComplete = false;

        if(correctionComplete) {
            this.feedbackMessageEl.textContent = '¡Muy bien! Error corregido.';
            this.feedbackMessageEl.classList.remove('bg-red-100', 'text-red-700');
            this.feedbackMessageEl.classList.add('bg-blue-100', 'text-blue-700');
            this.checkBtn.disabled = true;
            this.checkBtn.textContent = 'Revisar';
            this.nextBtn.disabled = false;
            this.inputs.forEach(input => input.disabled = true);
            this.nextBtn.focus();
            
            return { isCorrect: true, isCorrectionMode: false };
        } else {
             this.feedbackMessageEl.textContent = 'Aún no es correcto. Cópialo exactamente como se muestra.';
             return { isCorrect: false, isCorrectionMode: true };
        }
    }

    handleTranslationCorrection(currentVerb) {
        const userTranslation = this.spanishTranslationInput.value.trim();
        const correctTranslation = currentVerb.spanish;
        
        // Usar la nueva función simple
        const isCorrect = isSpanishTranslationCorrect(userTranslation, correctTranslation);
        
        if (isCorrect) {
            this.feedbackMessageEl.textContent = '¡Muy bien! Error corregido.';
            this.feedbackMessageEl.classList.remove('bg-red-100', 'text-red-700');
            this.feedbackMessageEl.classList.add('bg-blue-100', 'text-blue-700');
            this.checkBtn.disabled = true;
            this.checkBtn.textContent = 'Revisar';
            this.nextBtn.disabled = false;
            this.spanishTranslationInput.disabled = true;
            this.nextBtn.focus();
            
            return { isCorrect: true, isCorrectionMode: false };
        } else {
            this.feedbackMessageEl.textContent = 'Aún no es correcto. Intenta con una palabra principal.';
            return { isCorrect: false, isCorrectionMode: true };
        }
    }

    showReinforcementCompletedMessage() {
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
}