// src/js/config/constants.js

export const SESSION_CONFIG = {
    ATTEMPTS_PER_VERB_DEFAULT: 4,
    REINFORCE_ATTEMPTS_RED: 3,
    REINFORCE_ATTEMPTS_YELLOW: 2,
    MIN_ATTEMPTS: 2,
    MAX_ATTEMPTS: 8,
    AUTO_CHECK_INTERVAL: 5 * 60 * 1000, // 5 minutos
    NOTIFICATION_DURATION: 3000, // 3 segundos
    ATTEMPTS_NOTIFICATION_DURATION: 2000 // 2 segundos
};

export const EXERCISE_TYPES = {
    WRITE_FORMS: 'write_forms',
    TRANSLATE_TO_SPANISH: 'translate_to_spanish',
    MATCH_TRANSLATION: 'match_translation' 
};

export const DIFFICULTY_LEVELS = {
    EASY: 'Fácil',
    NORMAL: 'Normal', 
    DIFFICULT: 'Difícil',
    EXPERT: 'Experto'
};

export const PERFORMANCE_THRESHOLDS = {
    RED_ZONE: 50,      // <= 50% - Mal rendimiento
    YELLOW_ZONE: 80    // <= 80% - Rendimiento regular
};

export const LOCAL_STORAGE_KEYS = {
    USER_ATTEMPTS: 'userAttemptsPerVerb',
    VERB_DAY: 'verbDay',
    LAST_CHECK: 'lastDailyCheck',
    DAILY_VERBS: 'dailyVerbs'
};

export const UI_CONFIG = {
    DAILY_VERBS_COUNT: 8,
    IMAGE_FALLBACK: 'https://placehold.co/400x400/e2e8f0/475569?text=Imagen+no+disponible',
    ANIMATION_DURATION: 500
};

export const MESSAGES = {
    CORRECT_ANSWER: '¡Correcto!',
    INCORRECT_FORMS: 'Incorrecto. Escribe las formas correctas para continuar.',
    INCORRECT_TRANSLATION: 'Incorrecto. Escribe la traducción correcta para continuar.',
    CORRECTION_COMPLETE: '¡Muy bien! Error corregido.',
    CORRECTION_INCOMPLETE_FORMS: 'Aún no es correcto. Cópialo exactamente como se muestra.',
    CORRECTION_INCOMPLETE_TRANSLATION: 'Aún no es correcto. Intenta con una palabra principal.',
    REINFORCEMENT_COMPLETE: '¡Refuerzo completado! Muy buen trabajo.',
    NEW_VERBS_GENERATED: '¡Nuevos verbos del día generados!',
    NO_REINFORCEMENT_NEEDED: '¡Excelente! No hay verbos que necesiten refuerzo.',
    CONFIRM_REFRESH_VERBS: '¿Estás seguro de que quieres generar nuevos verbos del día?',
    CONFIRM_EXIT_SESSION: '¿Salir de la sesión? Tu progreso se perderá.',
    ERROR_LOADING_APP: 'Error cargando la aplicación. Recarga la página.',
    LOADING_VERBS: 'Cargando verbos...',
    PREPARING_SESSION: 'Preparando tu sesión de entrenamiento'
};

export const CSS_CLASSES = {
    HIDDEN: 'hidden',
    CORRECT: 'correct',
    INCORRECT: 'incorrect',
    CORRECTION_MODE: 'correction-mode',
    NOTIFICATION: 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce',
    ATTEMPTS_NOTIFICATION: 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm',
    REINFORCEMENT_NOTIFICATION: 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50'
};