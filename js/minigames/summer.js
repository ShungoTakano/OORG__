// 夏企画 - 推理捜索ゲーム
const SummerGame = {
    mistakes: 0,
    maxMistakes: 3,
    cluesFound: [],
    currentPhase: 'investigate', // investigate or accuse
    suspects: [],
    locations: [],
    correctAnswer: null,

    start() {
        this.reset();
        this.render();
    },

    reset() {
        this.mistakes = 0;
        this.cluesFound = [];
        this.currentPhase = 'investigate';

        this.suspects = [
            { id: 'dog', name: '野良犬', description: '会場の近くをうろついていた' },
            { id: 'wind', name: '強風', description: '午前中に突風が吹いた' },
            { id: 'child', name: '迷子の子供', description: '会場を走り回っていた' }
        ];

        this.locations = [
            { id: 'tent', name: 'テント裏', clue: '足跡がある...犬の足跡だ！', found: false },
            { id: 'tree', name: '木の下', clue: '尻尾の一部が引っかかっている！', found: false },
            { id: 'bench', name: 'ベンチ付近', clue: '目撃情報：犬が何かをくわえて走っていった', found: false }
        ];

        this.correctAnswer = 'dog';
    },

    render() {
        const container = document.getElementById('minigame-container');
        container.innerHTML = `
            <div class="minigame-header">
                <span class="minigame-title">尻尾を探せ！</span>
                <span class="minigame-timer" style="color: #ff6b6b;">残りミス: ${this.maxMistakes - this.mistakes}回</span>
            </div>
            <div class="minigame-content" id="summer-content" style="padding: 70px 10px 10px; overflow-y: auto;">
            </div>
        `;

        this.renderPhase();
    },

    renderPhase() {
        const content = document.getElementById('summer-content');

        if (this.currentPhase === 'investigate') {
            content.innerHTML = `
                <div style="text-align: center; color: #ffd93d; margin-bottom: 15px;">
                    現場を調査して手がかりを集めよう
                </div>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    ${this.locations.map(loc => `
                        <button class="menu-btn location-btn ${loc.found ? 'found' : ''}"
                                data-id="${loc.id}"
                                ${loc.found ? 'disabled' : ''}>
                            ${loc.name} ${loc.found ? '(調査済み)' : ''}
                        </button>
                    `).join('')}
                </div>
                <div id="clue-display" style="margin-top: 20px; padding: 10px; min-height: 60px; background: rgba(255,255,255,0.1); border-radius: 8px;">
                    <div style="color: #888;">調査結果がここに表示されます</div>
                </div>
                <div style="margin-top: 15px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 8px;">
                    <div style="color: #ffd93d; margin-bottom: 10px;">発見した手がかり:</div>
                    <div id="clues-list">
                        ${this.cluesFound.length === 0 ? '<span style="color: #888;">まだ手がかりがありません</span>' :
                          this.cluesFound.map(c => `<div style="color: #00ff00; margin: 5px 0;">・${c}</div>`).join('')}
                    </div>
                </div>
                ${this.cluesFound.length >= 2 ? `
                    <button class="menu-btn" id="goto-accuse" style="margin-top: 15px; background: #ff6600; border-color: #ff6600;">
                        犯人を指摘する
                    </button>
                ` : ''}
            `;

            document.querySelectorAll('.location-btn:not([disabled])').forEach(btn => {
                btn.addEventListener('click', () => this.investigate(btn.dataset.id));
            });

            const accuseBtn = document.getElementById('goto-accuse');
            if (accuseBtn) {
                accuseBtn.addEventListener('click', () => {
                    this.currentPhase = 'accuse';
                    this.renderPhase();
                });
            }
        } else {
            // 指摘フェーズ
            content.innerHTML = `
                <div style="text-align: center; color: #ffd93d; margin-bottom: 15px;">
                    尻尾を持っていったのは誰だ？
                </div>
                <div style="display: flex; flex-direction: column; gap: 15px;">
                    ${this.suspects.map(sus => `
                        <button class="menu-btn suspect-btn" data-id="${sus.id}">
                            <div style="font-weight: bold;">${sus.name}</div>
                            <div style="font-size: 0.8rem; color: #aaa;">${sus.description}</div>
                        </button>
                    `).join('')}
                </div>
                <button class="menu-btn" id="back-investigate" style="margin-top: 20px; border-color: #888; color: #888;">
                    調査に戻る
                </button>
            `;

            document.querySelectorAll('.suspect-btn').forEach(btn => {
                btn.addEventListener('click', () => this.accuse(btn.dataset.id));
            });

            document.getElementById('back-investigate').addEventListener('click', () => {
                this.currentPhase = 'investigate';
                this.renderPhase();
            });
        }
    },

    investigate(locationId) {
        const location = this.locations.find(l => l.id === locationId);
        if (!location || location.found) return;

        location.found = true;
        this.cluesFound.push(location.clue);

        const clueDisplay = document.getElementById('clue-display');
        clueDisplay.innerHTML = `
            <div style="color: #00ff00; animation: fadeIn 0.5s;">
                【${location.name}を調査】<br>
                ${location.clue}
            </div>
        `;

        this.renderPhase();
    },

    accuse(suspectId) {
        if (suspectId === this.correctAnswer) {
            this.endGame(true);
        } else {
            this.mistakes++;
            if (this.mistakes >= this.maxMistakes) {
                this.endGame(false);
            } else {
                alert(`違うようだ...（残り${this.maxMistakes - this.mistakes}回）`);
                this.render();
            }
        }
    },

    endGame(success) {
        const container = document.getElementById('minigame-container');
        const overlay = document.createElement('div');
        overlay.className = 'result-overlay';

        const resultText = document.createElement('div');
        resultText.className = `result-text ${success ? 'success' : 'failure'}`;
        resultText.textContent = success ? '正解！野良犬が尻尾を持っていった！' : '失敗...真相にたどり着けなかった';
        overlay.appendChild(resultText);

        if (success) {
            const subText = document.createElement('div');
            subText.style.cssText = 'margin: 10px; color: #aaa;';
            subText.textContent = '木の下から尻尾を回収した！';
            overlay.appendChild(subText);
        }

        const continueBtn = document.createElement('button');
        continueBtn.className = 'menu-btn';
        continueBtn.textContent = '続ける';
        continueBtn.addEventListener('click', () => {
            Game.minigameComplete('summer', success);
        });
        overlay.appendChild(continueBtn);

        container.appendChild(overlay);
    }
};
