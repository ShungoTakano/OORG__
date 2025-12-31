// 戦闘システム（アンダーテール風）
const Battle = {
    phase: 'command', // command, dodge, intro
    projectiles: [],
    heartPos: { x: 0, y: 0 },
    heartSpeed: 5,
    keys: {},
    animationFrame: null,
    dodgeTimer: null,
    dodgeDuration: 5000,
    takanoDialogues: [
        '俺は引退なんかしない！',
        '学友会は俺のものだ！',
        'お前に何がわかる！',
        '思い出が...思い出が消えてしまう...',
        '...本当は、怖いんだ'
    ],
    currentDialogue: 0,
    attackPatterns: ['rain', 'spiral', 'wave'],
    currentPattern: 0,
    isHashimoto: false,
    bulletDebuff: 1.0, // 1.0 = 通常, 低いほど弱体化

    start() {
        this.reset();
        this.checkSpecialPlayer();
    },

    checkSpecialPlayer() {
        // はしもとチェック
        if (GameState.playerName === 'はしもと' || GameState.playerName === '橋本') {
            this.isHashimoto = true;
            this.bulletDebuff = 0.5; // 弾幕を50%に弱体化
            this.showHashimotoIntro();
        } else {
            this.isHashimoto = false;
            this.bulletDebuff = 1.0;
            this.render();
            this.bindEvents();
        }
    },

    showHashimotoIntro() {
        this.phase = 'intro';
        this.render();
        this.bindEvents();

        // 特別イントロ表示
        const dialogueEl = document.getElementById('enemy-dialogue');
        const commandsEl = document.getElementById('battle-commands');

        // コマンドを一時的に非表示
        commandsEl.style.display = 'none';

        // 橋本のメッセージを表示
        dialogueEl.innerHTML = `<span style="color: #00ffff;">橋本「後輩を困らせるな！」</span>`;
        dialogueEl.style.fontSize = '1.2rem';

        // 高野の反応
        setTimeout(() => {
            dialogueEl.innerHTML = `<span style="color: #ff6b6b;">高野「な、なんだと...!? 橋本...!」</span>`;
        }, 2000);

        // 弱体化エフェクト
        setTimeout(() => {
            dialogueEl.innerHTML = `<span style="color: #ffd93d;">高野の弾幕が弱体化した！</span>`;
            const sprite = document.getElementById('enemy-sprite');
            sprite.style.filter = 'brightness(0.7) hue-rotate(30deg)';
            setTimeout(() => {
                sprite.style.filter = 'none';
            }, 500);
        }, 3500);

        // バトル開始
        setTimeout(() => {
            dialogueEl.style.fontSize = '1rem';
            commandsEl.style.display = 'flex';
            this.phase = 'command';
            this.updateUI();
        }, 5000);
    },

    reset() {
        this.phase = 'command';
        this.projectiles = [];
        this.currentDialogue = 0;
        this.currentPattern = 0;
        GameState.takanoHP = 100;
        GameState.takanoDefense = 5;
        GameState.retireCount = 0;
        GameState.playerHP = GameState.playerMaxHP;
    },

    render() {
        this.updateUI();
    },

    updateUI() {
        // 敵HP
        const hpPercent = (GameState.takanoHP / 100) * 100;
        document.getElementById('enemy-hp-fill').style.width = `${hpPercent}%`;

        // プレイヤーHP
        const playerHpPercent = (GameState.playerHP / GameState.playerMaxHP) * 100;
        document.getElementById('player-hp-fill').style.width = `${playerHpPercent}%`;
        document.getElementById('player-hp-text').textContent = `${GameState.playerHP}/${GameState.playerMaxHP}`;

        // 敵のセリフ
        document.getElementById('enemy-dialogue').textContent = this.takanoDialogues[Math.min(this.currentDialogue, this.takanoDialogues.length - 1)];

        // 敵スプライト（高野の画像を使用）
        const sprite = document.getElementById('enemy-sprite');
        sprite.style.background = 'transparent';
        sprite.style.borderRadius = '0';
        sprite.innerHTML = `<img src="assets/images/characters/chara_takano_battle.png" alt="高野" style="width: 100%; height: 100%; object-fit: contain;">`;

        // 引退カウントに応じてフィルター効果
        if (GameState.retireCount >= 4) {
            sprite.style.filter = 'grayscale(80%) brightness(0.7)';
        } else if (GameState.retireCount >= 2) {
            sprite.style.filter = 'grayscale(40%) brightness(0.85)';
        } else {
            sprite.style.filter = 'none';
        }
    },

    bindEvents() {
        // コマンドボタン
        document.querySelectorAll('.battle-cmd').forEach(btn => {
            btn.addEventListener('click', () => this.executeCommand(btn.dataset.cmd));
        });

        // キーボード操作
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
        });
        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    },

    executeCommand(cmd) {
        if (this.phase !== 'command') return;

        switch (cmd) {
            case 'fight':
                this.attackEnemy();
                break;
            case 'retire':
                this.useRetire();
                break;
            case 'run':
                this.tryRun();
                break;
        }
    },

    attackEnemy() {
        const damage = 20 - GameState.takanoDefense;
        GameState.takanoHP -= Math.max(damage, 5);

        if (GameState.takanoHP <= 0) {
            GameState.takanoHP = 0;
            this.updateUI();
            setTimeout(() => {
                Game.battleComplete('fight');
            }, 1000);
            return;
        }

        this.updateUI();
        this.startDodgePhase();
    },

    useRetire() {
        GameState.retireCount++;
        GameState.takanoDefense = Math.max(0, GameState.takanoDefense - 1);
        this.currentDialogue = Math.min(this.currentDialogue + 1, this.takanoDialogues.length - 1);

        // 引退を5回選ぶとTRUEエンディング
        if (GameState.retireCount >= 5) {
            this.updateUI();
            document.getElementById('enemy-dialogue').textContent = '...わかった。お前の勝ちだ。';
            setTimeout(() => {
                Game.battleComplete('retire');
            }, 2000);
            return;
        }

        this.updateUI();
        this.startDodgePhase();
    },

    tryRun() {
        document.getElementById('enemy-dialogue').textContent = '逃がさん！';
        setTimeout(() => {
            this.startDodgePhase();
        }, 500);
    },

    startDodgePhase() {
        this.phase = 'dodge';
        this.projectiles = [];

        // コマンドボタンを無効化
        document.querySelectorAll('.battle-cmd').forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.5';
        });

        // ハートを中央に配置
        const battleBox = document.getElementById('battle-box');
        this.heartPos = {
            x: battleBox.clientWidth / 2 - 10,
            y: battleBox.clientHeight / 2 - 10
        };
        this.updateHeartPosition();

        // 攻撃パターン開始
        this.startAttackPattern();

        // 回避フェーズ開始
        this.animationFrame = requestAnimationFrame(() => this.dodgeLoop());

        // 一定時間後にコマンドフェーズに戻る
        this.dodgeTimer = setTimeout(() => {
            this.endDodgePhase();
        }, this.dodgeDuration);
    },

    startAttackPattern() {
        const pattern = this.attackPatterns[this.currentPattern % this.attackPatterns.length];
        this.currentPattern++;

        switch (pattern) {
            case 'rain':
                this.patternRain();
                break;
            case 'spiral':
                this.patternSpiral();
                break;
            case 'wave':
                this.patternWave();
                break;
        }
    },

    patternRain() {
        const battleBox = document.getElementById('battle-box');
        let count = 0;
        const maxCount = Math.floor(15 * this.bulletDebuff); // 弱体化時は弾数減少
        const intervalTime = 300 / this.bulletDebuff; // 弱体化時は間隔が長くなる

        const interval = setInterval(() => {
            if (this.phase !== 'dodge' || count >= maxCount) {
                clearInterval(interval);
                return;
            }
            const speed = (3 + Math.random() * 2) * this.bulletDebuff; // 弱体化時は速度低下
            this.spawnProjectile(
                Math.random() * (battleBox.clientWidth - 10),
                -10,
                0,
                speed
            );
            count++;
        }, intervalTime);
    },

    patternSpiral() {
        const battleBox = document.getElementById('battle-box');
        const centerX = battleBox.clientWidth / 2;
        const centerY = battleBox.clientHeight / 2;
        let angle = 0;
        let count = 0;
        const maxCount = Math.floor(20 * this.bulletDebuff); // 弱体化時は弾数減少
        const intervalTime = 200 / this.bulletDebuff; // 弱体化時は間隔が長くなる

        const interval = setInterval(() => {
            if (this.phase !== 'dodge' || count >= maxCount) {
                clearInterval(interval);
                return;
            }
            const speed = 2 * this.bulletDebuff; // 弱体化時は速度低下
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            this.spawnProjectile(centerX, centerY, vx, vy);
            angle += 0.5;
            count++;
        }, intervalTime);
    },

    patternWave() {
        const battleBox = document.getElementById('battle-box');
        let count = 0;
        const maxCount = Math.floor(10 * this.bulletDebuff); // 弱体化時は弾数減少
        const intervalTime = 400 / this.bulletDebuff; // 弱体化時は間隔が長くなる
        const waveCount = this.isHashimoto ? 2 : 3; // 弱体化時は波の数も減少

        const interval = setInterval(() => {
            if (this.phase !== 'dodge' || count >= maxCount) {
                clearInterval(interval);
                return;
            }
            // 左から右への波
            for (let i = 0; i < waveCount; i++) {
                const speed = 4 * this.bulletDebuff; // 弱体化時は速度低下
                this.spawnProjectile(
                    -10,
                    30 + i * 40,
                    speed,
                    Math.sin(count + i) * 0.5 * this.bulletDebuff
                );
            }
            count++;
        }, intervalTime);
    },

    spawnProjectile(x, y, vx, vy) {
        const battleBox = document.getElementById('battle-box');
        const projectile = document.createElement('div');
        projectile.className = 'projectile';
        projectile.style.width = '10px';
        projectile.style.height = '10px';
        projectile.style.left = `${x}px`;
        projectile.style.top = `${y}px`;
        battleBox.appendChild(projectile);

        this.projectiles.push({
            element: projectile,
            x: x,
            y: y,
            vx: vx,
            vy: vy
        });
    },

    dodgeLoop() {
        if (this.phase !== 'dodge') return;

        const battleBox = document.getElementById('battle-box');
        const boxWidth = battleBox.clientWidth;
        const boxHeight = battleBox.clientHeight;

        // ハートの移動（キーボード）
        if (this.keys['ArrowLeft'] || this.keys['a']) {
            this.heartPos.x -= this.heartSpeed;
        }
        if (this.keys['ArrowRight'] || this.keys['d']) {
            this.heartPos.x += this.heartSpeed;
        }
        if (this.keys['ArrowUp'] || this.keys['w']) {
            this.heartPos.y -= this.heartSpeed;
        }
        if (this.keys['ArrowDown'] || this.keys['s']) {
            this.heartPos.y += this.heartSpeed;
        }

        // 境界制限
        this.heartPos.x = Math.max(0, Math.min(boxWidth - 20, this.heartPos.x));
        this.heartPos.y = Math.max(0, Math.min(boxHeight - 20, this.heartPos.y));

        this.updateHeartPosition();

        // 弾の移動と当たり判定
        this.projectiles = this.projectiles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.element.style.left = `${p.x}px`;
            p.element.style.top = `${p.y}px`;

            // 画面外チェック
            if (p.x < -20 || p.x > boxWidth + 20 || p.y < -20 || p.y > boxHeight + 20) {
                p.element.remove();
                return false;
            }

            // 当たり判定
            if (this.checkCollision(p)) {
                this.takeDamage();
                p.element.remove();
                return false;
            }

            return true;
        });

        this.animationFrame = requestAnimationFrame(() => this.dodgeLoop());
    },

    checkCollision(projectile) {
        const heartSize = 20;
        const projectileSize = 10;

        return !(
            this.heartPos.x + heartSize < projectile.x ||
            this.heartPos.x > projectile.x + projectileSize ||
            this.heartPos.y + heartSize < projectile.y ||
            this.heartPos.y > projectile.y + projectileSize
        );
    },

    takeDamage() {
        GameState.playerHP -= 3;
        this.updateUI();

        // ダメージエフェクト
        const heart = document.getElementById('player-heart');
        heart.style.color = '#fff';
        setTimeout(() => {
            heart.style.color = '#ff0000';
        }, 100);

        if (GameState.playerHP <= 0) {
            GameState.playerHP = 0;
            this.updateUI();
            this.endBattle(false);
        }
    },

    updateHeartPosition() {
        const heart = document.getElementById('player-heart');
        heart.style.left = `${this.heartPos.x}px`;
        heart.style.top = `${this.heartPos.y}px`;
    },

    endDodgePhase() {
        this.phase = 'command';
        cancelAnimationFrame(this.animationFrame);

        // 弾を全て削除
        this.projectiles.forEach(p => p.element.remove());
        this.projectiles = [];

        // コマンドボタンを有効化
        document.querySelectorAll('.battle-cmd').forEach(btn => {
            btn.disabled = false;
            btn.style.opacity = '1';
        });
    },

    endBattle(playerWon) {
        this.phase = 'end';
        cancelAnimationFrame(this.animationFrame);
        clearTimeout(this.dodgeTimer);

        this.projectiles.forEach(p => p.element.remove());
        this.projectiles = [];

        if (!playerWon) {
            // プレイヤー敗北（BADエンドへ）
            document.getElementById('enemy-dialogue').textContent = 'ふはは！俺の勝ちだ！';
            setTimeout(() => {
                Game.showEnding('bad');
            }, 2000);
        }
    },

    // タッチ操作用（モバイル対応）
    enableTouchControls() {
        const battleBox = document.getElementById('battle-box');
        let touchStartPos = null;

        battleBox.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchStartPos = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
        });

        battleBox.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (!touchStartPos || this.phase !== 'dodge') return;

            const touch = e.touches[0];
            const deltaX = touch.clientX - touchStartPos.x;
            const deltaY = touch.clientY - touchStartPos.y;

            this.heartPos.x += deltaX * 0.5;
            this.heartPos.y += deltaY * 0.5;

            const boxWidth = battleBox.clientWidth;
            const boxHeight = battleBox.clientHeight;
            this.heartPos.x = Math.max(0, Math.min(boxWidth - 20, this.heartPos.x));
            this.heartPos.y = Math.max(0, Math.min(boxHeight - 20, this.heartPos.y));

            this.updateHeartPosition();

            touchStartPos = {
                x: touch.clientX,
                y: touch.clientY
            };
        });
    }
};

// タッチ操作有効化
document.addEventListener('DOMContentLoaded', () => {
    Battle.enableTouchControls();
});
