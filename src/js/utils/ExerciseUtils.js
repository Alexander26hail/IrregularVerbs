// src/js/utils/ExerciseUtils.js

export const EXERCISE_TYPES = {
    WRITE_FORMS: 'write_forms',
    TRANSLATE_TO_SPANISH: 'translate_to_spanish'
};

export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export function createMixedQuestionDeck(verbs, attemptsPer) {
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

export function createMixedReinforcementDeck(verbs, attemptsPer) {
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

// Función simple y flexible para comparar español
export function isSpanishTranslationCorrect(userInput, correctSpanish) {
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