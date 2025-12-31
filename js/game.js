// ゲーム状態管理
const GameState = {
    playerName: "プレイヤー",
    currentScene: "intro",
    currentIndex: 0,
    busHikeClear: false,
    summerEventClear: false,
    tsudanumaFestClear: false,
    skiSnowClear: false,
    takanoHP: 100,
    takanoDefense: 5,
    retireCount: 0,
    playerHP: 20,
    playerMaxHP: 20
};

// ゲームエンジン
const Game = {
    isTyping: false,
    typeSpeed: 30,
    currentText: "",
    currentCharIndex: 0,
    typeInterval: null,

    init() {
        this.loadGame();
        this.bindEvents();
    },

    bindEvents() {
        document.getElementById('start-btn').addEventListener('click', () => this.showNameInput());
        document.getElementById('continue-btn').addEventListener('click', () => this.continueGame());
        document.getElementById('message-window').addEventListener('click', () => this.handleClick());
        document.getElementById('ending-btn').addEventListener('click', () => this.returnToTitle());

        // 名前入力画面のイベント
        document.getElementById('name-confirm-btn').addEventListener('click', () => this.confirmName());
        document.getElementById('name-back-btn').addEventListener('click', () => this.showScreen('title-screen'));
        document.getElementById('player-name-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.confirmName();
        });
    },

    showNameInput() {
        document.getElementById('player-name-input').value = '';
        this.showScreen('name-screen');
        document.getElementById('player-name-input').focus();
    },

    confirmName() {
        const nameInput = document.getElementById('player-name-input');
        const name = nameInput.value.trim();

        if (name.length === 0) {
            alert('名前を入力してください');
            return;
        }

        if (name.length > 10) {
            alert('名前は10文字以内で入力してください');
            return;
        }

        GameState.playerName = name;
        this.startGame();
    },

    startGame() {
        this.resetState();
        this.showScreen('game-screen');
        this.playScene('intro');
    },

    continueGame() {
        this.showScreen('game-screen');
        this.playScene(GameState.currentScene, GameState.currentIndex);
    },

    resetState() {
        const playerName = GameState.playerName; // 名前は保持
        GameState.currentScene = "intro";
        GameState.currentIndex = 0;
        GameState.busHikeClear = false;
        GameState.summerEventClear = false;
        GameState.tsudanumaFestClear = false;
        GameState.skiSnowClear = false;
        GameState.takanoHP = 100;
        GameState.takanoDefense = 5;
        GameState.retireCount = 0;
        GameState.playerHP = 20;
        GameState.playerMaxHP = 20;
        GameState.playerName = playerName;
        this.saveGame();
    },

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
    },

    playScene(sceneId, startIndex = 0) {
        GameState.currentScene = sceneId;
        GameState.currentIndex = startIndex;
        this.saveGame();

        const scene = SCENARIO[sceneId];
        if (!scene) {
            console.error('Scene not found:', sceneId);
            return;
        }

        this.processSceneItem(scene[startIndex]);
    },

    processSceneItem(item) {
        if (!item) return;

        // 背景変更
        if (item.background) {
            this.setBackground(item.background);
        }

        // キャラクター変更（明示的に指定された場合）
        if (item.character !== undefined) {
            this.setCharacter(item.character);
        }

        // 次のシーンへ遷移
        if (item.next) {
            this.playScene(item.next);
            return;
        }

        // フラグチェック
        if (item.checkFlags) {
            const allClear = GameState.busHikeClear &&
                            GameState.summerEventClear &&
                            GameState.tsudanumaFestClear &&
                            GameState.skiSnowClear;
            this.playScene(allClear ? 'finale_allclear' : 'finale_notclear');
            return;
        }

        // ミニゲーム開始
        if (item.minigame) {
            this.startMinigame(item.minigame);
            return;
        }

        // バトル開始
        if (item.battle) {
            this.startBattle();
            return;
        }

        // エンディング
        if (item.ending) {
            this.showEnding(item.ending);
            return;
        }

        // スピーカーに基づいてキャラクター自動表示
        if (item.speaker && item.character === undefined) {
            this.autoSetCharacter(item.speaker);
        }

        // 選択肢
        if (item.choices) {
            this.showMessage(item.speaker, item.text);
            this.showChoices(item.choices);
            return;
        }

        // 通常テキスト
        this.showMessage(item.speaker, item.text);
    },

    showMessage(speaker, text) {
        // プレイヤー名の置換 ({player}を実際の名前に)
        const processedSpeaker = speaker ? speaker.replace(/{player}/g, GameState.playerName) : '';
        const processedText = text ? text.replace(/{player}/g, GameState.playerName) : '';

        document.getElementById('speaker-name').textContent = processedSpeaker;
        document.getElementById('click-indicator').style.display = 'none';
        this.typeText(processedText);
    },

    typeText(text) {
        this.isTyping = true;
        this.currentText = text;
        this.currentCharIndex = 0;
        const messageEl = document.getElementById('message-text');
        messageEl.textContent = '';

        if (this.typeInterval) clearInterval(this.typeInterval);

        this.typeInterval = setInterval(() => {
            if (this.currentCharIndex < this.currentText.length) {
                messageEl.textContent += this.currentText[this.currentCharIndex];
                this.currentCharIndex++;
            } else {
                clearInterval(this.typeInterval);
                this.isTyping = false;
                document.getElementById('click-indicator').style.display = 'block';
            }
        }, this.typeSpeed);
    },

    handleClick() {
        if (this.isTyping) {
            // タイピング中はスキップ
            clearInterval(this.typeInterval);
            document.getElementById('message-text').textContent = this.currentText;
            this.isTyping = false;
            document.getElementById('click-indicator').style.display = 'block';
            return;
        }

        // 選択肢表示中は無視
        if (document.getElementById('choice-container').classList.contains('active')) {
            return;
        }

        this.nextMessage();
    },

    nextMessage() {
        const scene = SCENARIO[GameState.currentScene];
        GameState.currentIndex++;
        this.saveGame();

        if (GameState.currentIndex >= scene.length) {
            console.log('Scene ended');
            return;
        }

        this.processSceneItem(scene[GameState.currentIndex]);
    },

    showChoices(choices) {
        const container = document.getElementById('choice-container');
        container.innerHTML = '';
        container.classList.add('active');

        choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = choice.text;
            btn.addEventListener('click', () => {
                container.classList.remove('active');
                this.playScene(choice.next);
            });
            container.appendChild(btn);
        });
    },

    setBackground(bgId) {
        const bgLayer = document.getElementById('background-layer');
        const backgrounds = {
            kaishitsu: 'assets/images/backgrounds/bg_finale.png',
            bushike: 'assets/images/backgrounds/bg_bushike.png',
            summer: 'assets/images/backgrounds/bg_summer.png',
            tsudanuma: 'assets/images/backgrounds/bg_tsudanuma.png',
            skisno: 'assets/images/backgrounds/bg_skisno.png',
            finale: 'assets/images/backgrounds/bg_finale.png'
        };
        if (backgrounds[bgId]) {
            bgLayer.style.backgroundImage = `url('${backgrounds[bgId]}')`;
            bgLayer.style.backgroundSize = 'cover';
            bgLayer.style.backgroundPosition = 'center';
        } else {
            bgLayer.style.backgroundImage = 'none';
            bgLayer.style.background = '#000';
        }
    },

    setCharacter(charId) {
        const charLayer = document.getElementById('character-layer');
        if (!charLayer) return;

        const characters = {
            takano: 'assets/images/characters/chara_takano.png',
            okisugi: 'assets/images/characters/chara_okisugi.png',
            hashimoto: 'assets/images/characters/chara_hashimoto.png',
            maruyama: 'assets/images/characters/chara_maruyama.png',
            takahashi: 'assets/images/characters/chara_takahashi.png',
            watanabe: 'assets/images/characters/chara_watanabe.png'
        };
        if (charId && characters[charId]) {
            charLayer.innerHTML = `<img src="${characters[charId]}" alt="${charId}" style="max-height: 80%; object-fit: contain;">`;
            charLayer.style.display = 'flex';
        } else {
            charLayer.innerHTML = '';
            charLayer.style.display = 'none';
        }
    },

    autoSetCharacter(speaker) {
        const speakerToChar = {
            '高野': 'takano',
            '沖杉': 'okisugi',
            '橋本': 'hashimoto',
            '丸山': 'maruyama',
            '高橋': 'takahashi',
            '渡邊': 'watanabe'
        };
        const charId = speakerToChar[speaker];
        if (charId) {
            this.setCharacter(charId);
        } else if (speaker === '' || speaker === '???' || !speaker) {
            this.setCharacter(null);
        }
    },

    startMinigame(gameId) {
        this.showScreen('minigame-screen');
        switch(gameId) {
            case 'bushike':
                BushikeGame.start();
                break;
            case 'summer':
                SummerGame.start();
                break;
            case 'tsudanuma':
                TsudanumaGame.start();
                break;
            case 'skisno':
                SkisnoGame.start();
                break;
        }
    },

    minigameComplete(gameId, success) {
        switch(gameId) {
            case 'bushike':
                GameState.busHikeClear = success;
                this.showScreen('game-screen');
                this.playScene(success ? 'bushike_success' : 'bushike_fail');
                break;
            case 'summer':
                GameState.summerEventClear = success;
                this.showScreen('game-screen');
                this.playScene(success ? 'summer_success' : 'summer_fail');
                break;
            case 'tsudanuma':
                GameState.tsudanumaFestClear = success;
                this.showScreen('game-screen');
                this.playScene(success ? 'tsudanuma_success' : 'tsudanuma_fail');
                break;
            case 'skisno':
                GameState.skiSnowClear = success;
                this.showScreen('game-screen');
                this.playScene(success ? 'skisno_success' : 'skisno_fail');
                break;
        }
        this.saveGame();
    },

    startBattle() {
        this.showScreen('battle-screen');
        Battle.start();
    },

    battleComplete(result) {
        this.showScreen('game-screen');
        if (result === 'retire') {
            this.playScene('ending_true');
        } else if (result === 'fight') {
            this.playScene('ending_normal');
        }
    },

    showEnding(type) {
        this.showScreen('ending-screen');
        const ending = ENDINGS[type];
        const titleEl = document.getElementById('ending-title');
        titleEl.textContent = ending.title;
        titleEl.className = type;

        // プレイヤー名を置換してエンディングテキストを表示
        const endingText = ending.text.replace(/{player}/g, GameState.playerName);
        document.getElementById('ending-text').textContent = endingText;

        // セーブデータクリア
        localStorage.removeItem('rpg_save');
    },

    returnToTitle() {
        this.showScreen('title-screen');
        this.checkContinue();
    },

    saveGame() {
        localStorage.setItem('rpg_save', JSON.stringify(GameState));
    },

    loadGame() {
        const saved = localStorage.getItem('rpg_save');
        if (saved) {
            const data = JSON.parse(saved);
            Object.assign(GameState, data);
        }
        this.checkContinue();
    },

    checkContinue() {
        const saved = localStorage.getItem('rpg_save');
        const continueBtn = document.getElementById('continue-btn');
        continueBtn.style.display = saved ? 'block' : 'none';
    }
};
