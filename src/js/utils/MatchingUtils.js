export function createMatchingPairs(verb) {
    const englishWords = [
        { text: verb.infinitive, type: 'infinitive', match: 'spanish' },
        { text: verb.pastSimple, type: 'pastSimple', match: 'spanishPast' },
        { text: verb.pastParticiple, type: 'pastParticiple', match: 'spanishPastParticiple' }
    ];
    
    const spanishWords = [
        { text: verb.spanish, type: 'spanish', match: 'infinitive' },
        { text: verb.SpanishPast, type: 'spanishPast', match: 'pastSimple' },
        { text: verb.SpanishPastParticiple, type: 'spanishPastParticiple', match: 'pastParticiple' }
    ];
    
    return { englishWords, spanishWords };
}

export function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export function checkMatch(selectedEnglish, selectedSpanish) {
    if (!selectedEnglish || !selectedSpanish) return false;
    return selectedEnglish.match === selectedSpanish.type;
}