// スキスノ - スマホ捜索ゲーム
const SkisnoGame = {
    timeLimit: 90,
    timer: null,
    remainingTime: 90,
    phonePosition: { x: 0, y: 0 },
    mapSize: { width: 1000, height: 800 },
    viewPosition: { x: 0, y: 0 },
    hints: [],
    currentHint: 0,
    found: false,

    start() {
        this.reset();
        this.render();
        this.startTimer();
    },

    reset() {
        this.remainingTime = this.timeLimit;
        this.found = false;
        this.currentHint = 0;

        // スマホの位置をランダムに設定
        this.phonePosition = {
            x: 600 + Math.random() * 300,
            y: 500 + Math.random() * 200
        };

        this.viewPosition = { x: 0, y: 0 };

        // ヒント
        this.hints = [
            'スマホはゲレンデの下の方にあるらしい...',
            '右側のエリアで光っているものを見たという目撃情報が...',
            'リフト降り場の近くかもしれない'
        ];
    },

    render() {
        const container = document.getElementById('minigame-container');
        container.innerHTML = `
            <div class="minigame-header">
                <span class="minigame-title">スマホを探せ！</span>
                <span class="minigame-timer" id="skisno-timer">${this.remainingTime}秒</span>
            </div>
            <div class="minigame-content" style="padding: 60px 0 0; height: calc(100% - 60px); overflow: hidden; position: relative;">
                <div id="map-viewport" style="width: 100%; height: calc(100% - 100px); overflow: hidden; position: relative; background: linear-gradient(180deg, #87ceeb 0%, #e0f0ff 50%, #fff 100%);">
                    <div id="game-map" style="position: absolute; width: ${this.mapSize.width}px; height: ${this.mapSize.height}px; cursor: grab;">
                        <!-- ゲレンデの要素 -->
                        <div style="position: absolute; top: 50px; left: 100px; font-size: 3rem;">🏔️</div>
                        <div style="position: absolute; top: 80px; left: 300px; font-size: 2rem;">🌲</div>
                        <div style="position: absolute; top: 150px; left: 500px; font-size: 2rem;">🌲</div>
                        <div style="position: absolute; top: 100px; left: 700px; font-size: 2rem;">🚡</div>
                        <div style="position: absolute; top: 200px; left: 200px; font-size: 2rem;">⛷️</div>
                        <div style="position: absolute; top: 300px; left: 400px; font-size: 2rem;">🎿</div>
                        <div style="position: absolute; top: 250px; left: 600px; font-size: 2rem;">🌲</div>
                        <div style="position: absolute; top: 350px; left: 150px; font-size: 2rem;">🌲</div>
                        <div style="position: absolute; top: 400px; left: 350px; font-size: 2rem;">⛷️</div>
                        <div style="position: absolute; top: 450px; left: 550px; font-size: 2rem;">🌲</div>
                        <div style="position: absolute; top: 500px; left: 750px; font-size: 2rem;">🏠</div>
                        <div style="position: absolute; top: 550px; left: 200px; font-size: 2rem;">🌲</div>
                        <div style="position: absolute; top: 600px; left: 400px; font-size: 2rem;">⛷️</div>
                        <div style="position: absolute; top: 650px; left: 650px; font-size: 2rem;">🌲</div>

                        <!-- スマホ（雪に埋もれている） -->
                        <div id="phone-target" style="position: absolute; left: ${this.phonePosition.x}px; top: ${this.phonePosition.y}px; width: 40px; height: 40px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                            <span style="font-size: 0.8rem; opacity: 0.6;">❄️</span>
                        </div>
                    </div>
                </div>
                <div style="padding: 10px; background: rgba(0,0,0,0.8);">
                    <div id="hint-text" style="color: #ffd93d; text-align: center; margin-bottom: 10px;">
                        ${this.hints[this.currentHint]}
                    </div>
                    <div style="display: flex; gap: 10px; justify-content: center;">
                        <button class="menu-btn" id="hint-btn" style="padding: 5px 15px; font-size: 0.9rem;">
                            次のヒント (${this.hints.length - this.currentHint - 1}残り)
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.bindEvents();
    },

    bindEvents() {
        const map = document.getElementById('game-map');
        const viewport = document.getElementById('map-viewport');
        let isDragging = false;
        let startX, startY;

        // マップのドラッグ
        map.addEventListener('mousedown', (e) => {
            if (e.target.id === 'phone-target' || e.target.closest('#phone-target')) return;
            isDragging = true;
            startX = e.clientX - this.viewPosition.x;
            startY = e.clientY - this.viewPosition.y;
            map.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            this.viewPosition.x = e.clientX - startX;
            this.viewPosition.y = e.clientY - startY;

            // 境界制限
            const maxX = 0;
            const minX = viewport.clientWidth - this.mapSize.width;
            const maxY = 0;
            const minY = viewport.clientHeight - this.mapSize.height;

            this.viewPosition.x = Math.min(maxX, Math.max(minX, this.viewPosition.x));
            this.viewPosition.y = Math.min(maxY, Math.max(minY, this.viewPosition.y));

            map.style.transform = `translate(${this.viewPosition.x}px, ${this.viewPosition.y}px)`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            map.style.cursor = 'grab';
        });

        // タッチ対応
        map.addEventListener('touchstart', (e) => {
            if (e.target.id === 'phone-target' || e.target.closest('#phone-target')) return;
            isDragging = true;
            startX = e.touches[0].clientX - this.viewPosition.x;
            startY = e.touches[0].clientY - this.viewPosition.y;
        });

        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            this.viewPosition.x = e.touches[0].clientX - startX;
            this.viewPosition.y = e.touches[0].clientY - startY;

            const maxX = 0;
            const minX = viewport.clientWidth - this.mapSize.width;
            const maxY = 0;
            const minY = viewport.clientHeight - this.mapSize.height;

            this.viewPosition.x = Math.min(maxX, Math.max(minX, this.viewPosition.x));
            this.viewPosition.y = Math.min(maxY, Math.max(minY, this.viewPosition.y));

            map.style.transform = `translate(${this.viewPosition.x}px, ${this.viewPosition.y}px)`;
        });

        document.addEventListener('touchend', () => {
            isDragging = false;
        });

        // スマホをクリック
        document.getElementById('phone-target').addEventListener('click', () => this.findPhone());
        document.getElementById('phone-target').addEventListener('touchend', (e) => {
            e.preventDefault();
            this.findPhone();
        });

        // ヒントボタン
        document.getElementById('hint-btn').addEventListener('click', () => this.nextHint());
    },

    nextHint() {
        if (this.currentHint < this.hints.length - 1) {
            this.currentHint++;
            document.getElementById('hint-text').textContent = this.hints[this.currentHint];
            document.getElementById('hint-btn').textContent = `次のヒント (${this.hints.length - this.currentHint - 1}残り)`;

            if (this.currentHint >= this.hints.length - 1) {
                document.getElementById('hint-btn').disabled = true;
                document.getElementById('hint-btn').style.opacity = '0.5';
            }
        }
    },

    findPhone() {
        if (this.found) return;
        this.found = true;
        clearInterval(this.timer);

        const phoneEl = document.getElementById('phone-target');
        phoneEl.innerHTML = '<span style="font-size: 1.5rem;">📱</span>';
        phoneEl.style.animation = 'pulse 0.5s infinite';

        setTimeout(() => {
            this.endGame(true);
        }, 1000);
    },

    startTimer() {
        this.timer = setInterval(() => {
            this.remainingTime--;
            const timerEl = document.getElementById('skisno-timer');
            if (timerEl) {
                timerEl.textContent = `${this.remainingTime}秒`;
            }

            if (this.remainingTime <= 0) {
                this.endGame(false);
            }
        }, 1000);
    },

    endGame(success) {
        clearInterval(this.timer);

        const container = document.getElementById('minigame-container');
        const overlay = document.createElement('div');
        overlay.className = 'result-overlay';

        const resultText = document.createElement('div');
        resultText.className = `result-text ${success ? 'success' : 'failure'}`;
        resultText.textContent = success ? 'スマホ発見！' : '時間切れ...見つからなかった';

        const continueBtn = document.createElement('button');
        continueBtn.className = 'menu-btn';
        continueBtn.textContent = '続ける';
        continueBtn.addEventListener('click', () => {
            Game.minigameComplete('skisno', success);
        });

        overlay.appendChild(resultText);
        overlay.appendChild(continueBtn);
        container.appendChild(overlay);
    }
};
