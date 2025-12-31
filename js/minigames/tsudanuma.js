// 津田沼祭 - テント修復ゲーム（並び替えパズル）
const TsudanumaGame = {
    timeLimit: 120,
    timer: null,
    remainingTime: 120,
    steps: [],
    correctOrder: [
        '紐を解いてテントパーツを広げる',
        'テントパーツを組み立てる位置に並べる',
        '骨組みを合体する',
        '三角みたいなパーツを取り付ける',
        '天幕を取り付ける',
        'テントを立てる',
        '斜めのやつを取り付ける',
        '天幕を結ぶ'
    ],
    selectedIndex: null,

    start() {
        this.reset();
        this.render();
        this.startTimer();
    },

    reset() {
        this.remainingTime = this.timeLimit;
        // 正解の順番をコピーしてシャッフル
        this.steps = [...this.correctOrder];
        this.shuffleArray(this.steps);
        this.selectedIndex = null;
    },

    shuffleArray(array) {
        // シャッフル後に正解と同じ順番にならないようにする
        do {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        } while (this.isCorrectOrder(array));
    },

    isCorrectOrder(array) {
        return array.every((step, index) => step === this.correctOrder[index]);
    },

    render() {
        const container = document.getElementById('minigame-container');
        container.innerHTML = `
            <div class="minigame-header">
                <span class="minigame-title">テント修復</span>
                <span class="minigame-timer" id="tsudanuma-timer">${this.remainingTime}秒</span>
            </div>
            <div class="minigame-content" style="display: flex; flex-direction: column; padding: 70px 10px 10px; height: calc(100% - 60px);">
                <div style="text-align: center; margin-bottom: 10px; color: #ffd93d;">
                    テントの組み立て手順を正しい順番に並び替えてください<br>
                    <small style="color: #aaa;">項目をタップして選択 → ボタンで移動</small>
                </div>
                <div id="steps-container" style="flex: 1; display: flex; flex-direction: column; gap: 6px; overflow-y: auto; padding: 5px;">
                </div>
                <div id="move-buttons" style="display: flex; justify-content: center; gap: 20px; margin: 10px 0;">
                    <button id="move-up-btn" class="menu-btn" style="padding: 10px 30px; font-size: 1.2rem;" disabled>▲ 上へ</button>
                    <button id="move-down-btn" class="menu-btn" style="padding: 10px 30px; font-size: 1.2rem;" disabled>▼ 下へ</button>
                </div>
                <div id="tsudanuma-status" style="text-align: center; min-height: 24px; color: #ffd93d;"></div>
                <button id="tsudanuma-submit" class="menu-btn" style="margin-top: 5px;">決定</button>
            </div>
        `;

        this.renderSteps();
        this.bindEvents();
    },

    renderSteps() {
        const container = document.getElementById('steps-container');
        if (!container) return;
        container.innerHTML = '';

        this.steps.forEach((step, index) => {
            const el = this.createStepElement(step, index);
            container.appendChild(el);
        });

        this.updateMoveButtons();
    },

    createStepElement(step, index) {
        const el = document.createElement('div');
        el.className = 'step-item';
        el.dataset.index = index;

        const isSelected = this.selectedIndex === index;

        el.style.cssText = `
            padding: 10px 15px;
            font-size: 0.85rem;
            text-align: left;
            cursor: pointer;
            user-select: none;
            background: ${isSelected ? 'rgba(0, 255, 0, 0.3)' : '#2a2a4a'};
            border: 2px solid ${isSelected ? '#00ff00' : '#fff'};
            margin: 2px 0;
            transition: background 0.2s, border-color 0.2s;
        `;

        el.textContent = step;

        el.addEventListener('click', () => this.selectStep(index));

        return el;
    },

    selectStep(index) {
        if (this.selectedIndex === index) {
            // 同じ項目をクリックしたら選択解除
            this.selectedIndex = null;
        } else {
            this.selectedIndex = index;
        }
        this.renderSteps();
    },

    updateMoveButtons() {
        const upBtn = document.getElementById('move-up-btn');
        const downBtn = document.getElementById('move-down-btn');

        if (!upBtn || !downBtn) return;

        if (this.selectedIndex === null) {
            upBtn.disabled = true;
            downBtn.disabled = true;
            upBtn.style.opacity = '0.5';
            downBtn.style.opacity = '0.5';
        } else {
            upBtn.disabled = this.selectedIndex === 0;
            downBtn.disabled = this.selectedIndex === this.steps.length - 1;
            upBtn.style.opacity = this.selectedIndex === 0 ? '0.5' : '1';
            downBtn.style.opacity = this.selectedIndex === this.steps.length - 1 ? '0.5' : '1';
        }
    },

    moveUp() {
        if (this.selectedIndex === null || this.selectedIndex === 0) return;

        const newIndex = this.selectedIndex - 1;
        [this.steps[this.selectedIndex], this.steps[newIndex]] = [this.steps[newIndex], this.steps[this.selectedIndex]];
        this.selectedIndex = newIndex;
        this.renderSteps();
    },

    moveDown() {
        if (this.selectedIndex === null || this.selectedIndex === this.steps.length - 1) return;

        const newIndex = this.selectedIndex + 1;
        [this.steps[this.selectedIndex], this.steps[newIndex]] = [this.steps[newIndex], this.steps[this.selectedIndex]];
        this.selectedIndex = newIndex;
        this.renderSteps();
    },

    bindEvents() {
        document.getElementById('tsudanuma-submit').addEventListener('click', () => this.submit());
        document.getElementById('move-up-btn').addEventListener('click', () => this.moveUp());
        document.getElementById('move-down-btn').addEventListener('click', () => this.moveDown());
    },

    startTimer() {
        this.timer = setInterval(() => {
            this.remainingTime--;
            const timerEl = document.getElementById('tsudanuma-timer');
            if (timerEl) {
                timerEl.textContent = `${this.remainingTime}秒`;
            }

            if (this.remainingTime <= 0) {
                this.endGame(false);
            }
        }, 1000);
    },

    submit() {
        // 正解チェック
        const isCorrect = this.isCorrectOrder(this.steps);

        if (isCorrect) {
            this.endGame(true);
        } else {
            const statusEl = document.getElementById('tsudanuma-status');
            if (statusEl) {
                statusEl.textContent = '⚠ 順番が違います。もう一度考えてみてください';
                statusEl.style.color = '#ff6b6b';
            }
        }
    },

    endGame(success) {
        clearInterval(this.timer);
        this.timer = null;

        const container = document.getElementById('minigame-container');
        const overlay = document.createElement('div');
        overlay.className = 'result-overlay';

        const resultText = document.createElement('div');
        resultText.className = `result-text ${success ? 'success' : 'failure'}`;
        resultText.textContent = success ? 'テント修復完了！' : '失敗...テントは崩れてしまった';

        const continueBtn = document.createElement('button');
        continueBtn.className = 'menu-btn';
        continueBtn.textContent = '続ける';
        continueBtn.addEventListener('click', () => {
            Game.minigameComplete('tsudanuma', success);
        });

        overlay.appendChild(resultText);
        overlay.appendChild(continueBtn);
        container.appendChild(overlay);
    }
};
