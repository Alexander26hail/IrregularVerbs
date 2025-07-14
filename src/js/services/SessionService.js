// src/js/services/SessionService.js
import { EXERCISE_TYPES, SESSION_CONFIG, PERFORMANCE_THRESHOLDS } from '../config/constants.js';

class SessionService {
    constructor() {
        this.sessionStats = {};
        this.questionDeck = [];
        this.currentQuestionIndex = 0;
        this.isReinforcementSession = false;
    }

    createMixedQuestionDeck(verbs, attemptsPer) {
        const deck = [];
        verbs.forEach(verb => {
            for (let i = 0; i < attemptsPer; i++) {
                if (i < Math.floor(attemptsPer / 2)) {
                    deck.push({
                        type: EXERCISE_TYPES.WRITE_FORMS,
                        verb: verb
                    });
                } else {
                    deck.push({
                        type: EXERCISE_TYPES.TRANSLATE_TO_SPANISH,
                        verb: verb
                    });
                }
            }
        });
        this.shuffleArray(deck);
        return deck;
    }

    createReinforcementSession(sessionStats) {
        const redZoneVerbs = Object.values(sessionStats).filter(stat => {
            const percentage = stat.attempts > 0 ? 100 - Math.round((stat.errors / stat.attempts) * 100) : 100;
            return percentage <= PERFORMANCE_THRESHOLDS.RED_ZONE;
        });

        const yellowZoneVerbs = Object.values(sessionStats).filter(stat => {
            const percentage = stat.attempts > 0 ? 100 - Math.round((stat.errors / stat.attempts) * 100) : 100;
            return percentage > PERFORMANCE_THRESHOLDS.RED_ZONE && percentage <= PERFORMANCE_THRESHOLDS.YELLOW_ZONE;
        });

        const redDeck = this.createReinforcementDeck(redZoneVerbs, SESSION_CONFIG.REINFORCE_ATTEMPTS_RED);
        const yellowDeck = this.createReinforcementDeck(yellowZoneVerbs, SESSION_CONFIG.REINFORCE_ATTEMPTS_YELLOW);
        
        const questionDeck = [...redDeck, ...yellowDeck];
        this.shuffleArray(questionDeck);

        this.isReinforcementSession = true;
        this.questionDeck = questionDeck;
        this.currentQuestionIndex = 0;

        return {
            questionDeck: this.questionDeck,
            totalQuestions: this.questionDeck.length
        };
    }

    createReinforcementDeck(verbs, attemptsPer) {
        const deck = [];
        verbs.forEach(verbStat => {
            const cleanVerb = {
                infinitive: verbStat.infinitive,
                pastSimple: verbStat.pastSimple,
                pastParticiple: verbStat.pastParticiple,
                spanish: verbStat.spanish,
                explanation: verbStat.explanation,
                imageUrl: verbStat.imageUrl
            };
            
            for (let i = 0; i < attemptsPer; i++) {
                if (i < Math.floor(attemptsPer / 2)) {
                    deck.push({
                        type: EXERCISE_TYPES.WRITE_FORMS,
                        verb: cleanVerb
                    });
                } else {
                    deck.push({
                        type: EXERCISE_TYPES.TRANSLATE_TO_SPANISH,
                        verb: cleanVerb
                    });
                }
            }
        });
        return deck;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    startMainSession(verbs, attemptsPerVerb) {
        this.isReinforcementSession = false;
        this.sessionStats = {};
        
        verbs.forEach(verb => {
            this.sessionStats[verb.infinitive] = { ...verb, errors: 0, attempts: 0 };
        });
        
        this.questionDeck = this.createMixedQuestionDeck(verbs, attemptsPerVerb);
        this.currentQuestionIndex = 0;
        
        return {
            questionDeck: this.questionDeck,
            totalQuestions: this.questionDeck.length
        };
    }

    getCurrentQuestion() {
        if (this.currentQuestionIndex >= this.questionDeck.length) {
            return null;
        }
        return this.questionDeck[this.currentQuestionIndex];
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        return this.getCurrentQuestion();
    }

    updateStats(verbInfinitive, isCorrect) {
        if (!this.isReinforcementSession && this.sessionStats[verbInfinitive]) {
            this.sessionStats[verbInfinitive].attempts++;
            if (!isCorrect) {
                this.sessionStats[verbInfinitive].errors++;
            }
        }
    }

    getSessionStats() {
        return this.sessionStats;
    }

    isSessionComplete() {
        return this.currentQuestionIndex >= this.questionDeck.length;
    }

    reset() {
        this.sessionStats = {};
        this.questionDeck = [];
        this.currentQuestionIndex = 0;
        this.isReinforcementSession = false;
    }
}

export const sessionService = new SessionService();