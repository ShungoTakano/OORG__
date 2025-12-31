// バスハイク - 班分けパズルゲーム
const BushikeGame = {
    timeLimit: 90,
    timer: null,
    remainingTime: 90,
    members: [],
    groups: { A: [], B: [], C: [] },
    draggedItem: null,

    // 学部マッピング（プレイヤーには見せない）
    facultyMap: {
        '機械工学科': '機械工学部',
        '応用科学科': '機械工学部',
        '宇宙・半導体工学科': '機械工学部',
        'デザイン科学科': '創造工学部',
        '建築学科': '創造工学部',
        '知能メディア工学科': '先進工学部',
        '未来ロボティクス学科': '先進工学部',
        '認知情報科学科': '情報変革科学部',
        '情報工学科': '情報変革科学部'
    },

    start() {
        this.reset();
        this.render();
        this.startTimer();
    },

    reset() {
        this.remainingTime = this.timeLimit;
        this.members = [
            { id: 1, name: '機械工学科' },
            { id: 2, name: '認知情報科学科' },
            { id: 3, name: '応用科学科' },
            { id: 4, name: '宇宙・半導体工学科' },
            { id: 5, name: 'デザイン科学科' },
            { id: 6, name: '建築学科' },
            { id: 7, name: '知能メディア工学科' },
            { id: 8, name: '未来ロボティクス学科' },
            { id: 9, name: '情報工学科' }
        ];
        this.groups = { A: [], B: [], C: [] };
        this.draggedItem = null;
    },

    // 同じ学部かチェック
    isSameFaculty(member1, member2) {
        return this.facultyMap[member1.name] === this.facultyMap[member2.name];
    },

    // グループ内に相性の悪いペアがあるかチェック
    hasConflictInGroup(groupMembers) {
        for (let i = 0; i < groupMembers.length; i++) {
            for (let j = i + 1; j < groupMembers.length; j++) {
                if (this.isSameFaculty(groupMembers[i], groupMembers[j])) {
                    return true;
                }
            }
        }
        return false;
    },

    // 全グループの相性チェック
    checkAllConflicts() {
        for (const groupId of ['A', 'B', 'C']) {
            if (this.hasConflictInGroup(this.groups[groupId])) {
                return true;
            }
        }
        return false;
    },

    render() {
        const container = document.getElementById('minigame-container');
        container.innerHTML = `
            <div class="minigame-header">
                <span class="minigame-title">班分けパズル</span>
                <span class="minigame-timer" id="bushike-timer">${this.remainingTime}秒</span>
            </div>
            <div class="minigame-content" style="display: flex; flex-direction: column; padding: 70px 10px 10px;">
                <div style="text-align: center; margin-bottom: 10px; color: #ffd93d;">
                    参加者を3つの班に分けてください<br>
                    <small style="color: #ff6b6b;">※相性の悪い組み合わせは同じ班に入れないこと</small>
                </div>
                <div id="member-pool" class="drop-zone" style="min-height: 80px; margin-bottom: 10px;">
                    <div style="color: #888; font-size: 0.8rem; margin-bottom: 5px;">未配置メンバー</div>
                    <div id="pool-members" style="display: flex; flex-wrap: wrap; justify-content: center;"></div>
                </div>
                <div style="display: flex; gap: 10px; flex: 1;">
                    <div class="drop-zone" data-group="A" style="flex: 1;">
                        <div style="color: #00ff00; font-weight: bold;">A班</div>
                        <div class="group-members" data-group="A"></div>
                    </div>
                    <div class="drop-zone" data-group="B" style="flex: 1;">
                        <div style="color: #00ffff; font-weight: bold;">B班</div>
                        <div class="group-members" data-group="B"></div>
                    </div>
                    <div class="drop-zone" data-group="C" style="flex: 1;">
                        <div style="color: #ff00ff; font-weight: bold;">C班</div>
                        <div class="group-members" data-group="C"></div>
                    </div>
                </div>
                <div id="bushike-status" style="text-align: center; margin-top: 10px; min-height: 24px; color: #ff6b6b;"></div>
                <button id="bushike-submit" class="menu-btn" style="margin-top: 10px;">決定</button>
            </div>
        `;

        this.renderMembers();
        this.bindEvents();
        this.updateStatus();
    },

    renderMembers() {
        const poolEl = document.getElementById('pool-members');
        if (!poolEl) return;
        poolEl.innerHTML = '';

        this.members.forEach(member => {
            const el = this.createMemberElement(member);
            poolEl.appendChild(el);
        });

        // グループのメンバー表示
        ['A', 'B', 'C'].forEach(groupId => {
            const groupEl = document.querySelector(`.group-members[data-group="${groupId}"]`);
            if (!groupEl) return;
            groupEl.innerHTML = '';
            this.groups[groupId].forEach(member => {
                const el = this.createMemberElement(member);
                // 相性が悪い場合は警告色にする
                if (this.hasConflictInGroup(this.groups[groupId])) {
                    el.style.borderColor = '#ff6b6b';
                    el.style.background = 'rgba(255, 107, 107, 0.2)';
                }
                groupEl.appendChild(el);
            });
        });
    },

    createMemberElement(member) {
        const el = document.createElement('div');
        el.className = 'drag-item';
        el.textContent = member.name;
        el.style.fontSize = '0.75rem';
        el.style.padding = '0.4rem 0.6rem';
        el.draggable = true;
        el.dataset.id = member.id;
        el.addEventListener('dragstart', (e) => this.handleDragStart(e, member));
        el.addEventListener('dragend', () => this.handleDragEnd());
        // タッチ対応
        el.addEventListener('touchstart', (e) => this.handleTouchStart(e, member), { passive: false });
        el.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        el.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        return el;
    },

    updateStatus() {
        const statusEl = document.getElementById('bushike-status');
        if (!statusEl) return;

        if (this.checkAllConflicts()) {
            statusEl.textContent = '⚠ 相性の悪い組み合わせがあります';
            statusEl.style.color = '#ff6b6b';
        } else if (this.members.length > 0) {
            statusEl.textContent = `残り ${this.members.length} 人を配置してください`;
            statusEl.style.color = '#ffd93d';
        } else {
            statusEl.textContent = '✓ 配置完了！決定ボタンを押してください';
            statusEl.style.color = '#00ff00';
        }
    },

    bindEvents() {
        const dropZones = document.querySelectorAll('.drop-zone');
        dropZones.forEach(zone => {
            zone.addEventListener('dragover', (e) => this.handleDragOver(e));
            zone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            zone.addEventListener('drop', (e) => this.handleDrop(e));
        });

        document.getElementById('bushike-submit').addEventListener('click', () => this.submit());
    },

    handleDragStart(e, member) {
        this.draggedItem = member;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    },

    handleDragEnd() {
        document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
    },

    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    },

    handleDragLeave(e) {
        e.currentTarget.classList.remove('drag-over');
    },

    handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');

        if (!this.draggedItem) return;

        const targetGroup = e.currentTarget.dataset.group;
        this.moveMember(this.draggedItem, targetGroup);

        this.draggedItem = null;
        this.renderMembers();
        this.bindEvents();
        this.updateStatus();
    },

    moveMember(member, targetGroup) {
        // 現在のグループから削除
        this.members = this.members.filter(m => m.id !== member.id);
        ['A', 'B', 'C'].forEach(g => {
            this.groups[g] = this.groups[g].filter(m => m.id !== member.id);
        });

        // 新しい場所に追加
        if (targetGroup) {
            this.groups[targetGroup].push(member);
        } else {
            this.members.push(member);
        }
    },

    // タッチ操作対応
    handleTouchStart(e, member) {
        e.preventDefault();
        this.draggedItem = member;
        e.target.classList.add('dragging');
    },

    handleTouchMove(e) {
        e.preventDefault();
    },

    handleTouchEnd(e) {
        if (!this.draggedItem) return;

        const touch = e.changedTouches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        const dropZone = element?.closest('.drop-zone');

        if (dropZone) {
            const targetGroup = dropZone.dataset.group;
            this.moveMember(this.draggedItem, targetGroup);
        }

        document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
        this.draggedItem = null;
        this.renderMembers();
        this.bindEvents();
        this.updateStatus();
    },

    startTimer() {
        this.timer = setInterval(() => {
            this.remainingTime--;
            const timerEl = document.getElementById('bushike-timer');
            if (timerEl) {
                timerEl.textContent = `${this.remainingTime}秒`;
            }

            if (this.remainingTime <= 0) {
                this.endGame(false);
            }
        }, 1000);
    },

    submit() {
        // 全員配置されているかチェック
        if (this.members.length > 0) {
            // ステータス表示で通知（アラートは使わない）
            const statusEl = document.getElementById('bushike-status');
            if (statusEl) {
                statusEl.textContent = '⚠ 全員を班に配置してください！';
                statusEl.style.color = '#ff6b6b';
            }
            return;
        }

        // 相性チェック
        if (this.checkAllConflicts()) {
            const statusEl = document.getElementById('bushike-status');
            if (statusEl) {
                statusEl.textContent = '⚠ 相性の悪い組み合わせを解消してください！';
                statusEl.style.color = '#ff6b6b';
            }
            return;
        }

        // 各班に最低1人いるかチェック
        const allGroupsHaveMembers = ['A', 'B', 'C'].every(g => this.groups[g].length > 0);

        if (!allGroupsHaveMembers) {
            const statusEl = document.getElementById('bushike-status');
            if (statusEl) {
                statusEl.textContent = '⚠ 全ての班に最低1人は配置してください！';
                statusEl.style.color = '#ff6b6b';
            }
            return;
        }

        this.endGame(true);
    },

    endGame(success) {
        clearInterval(this.timer);
        this.timer = null;

        const container = document.getElementById('minigame-container');
        const overlay = document.createElement('div');
        overlay.className = 'result-overlay';

        const resultText = document.createElement('div');
        resultText.className = `result-text ${success ? 'success' : 'failure'}`;
        resultText.textContent = success ? '成功！' : '失敗...';

        const continueBtn = document.createElement('button');
        continueBtn.className = 'menu-btn';
        continueBtn.textContent = '続ける';
        continueBtn.addEventListener('click', () => {
            Game.minigameComplete('bushike', success);
        });

        overlay.appendChild(resultText);
        overlay.appendChild(continueBtn);
        container.appendChild(overlay);
    }
};
