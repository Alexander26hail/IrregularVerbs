// src/js/components/SummaryManager.js

export class SummaryManager {
    constructor(elements) {
        this.summaryStatsEl = elements.summaryStatsEl;
        this.reinforceBtn = elements.reinforceBtn;
    }

    showSummary(sessionStats) {
        this.summaryStatsEl.innerHTML = '';
        
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
            this.reinforceBtn.classList.remove('hidden');
        } else {
            this.reinforceBtn.classList.add('hidden');
        }

        const title = document.createElement('h2');
        title.className = 'text-xl font-bold text-slate-700 mb-4 border-b pb-2';
        title.textContent = 'Resultados del Examen';
        this.summaryStatsEl.appendChild(title);

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
            this.summaryStatsEl.appendChild(statDiv);
        });
    }
}