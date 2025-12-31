// シナリオデータ
const SCENARIO = {
    // 導入パート
    intro: [
        { speaker: "", text: "ここは、431教室..." },
        { speaker: "", text: "引退の日が迫っていた。" },
        { speaker: "???", text: "ふっふっふ..." },
        { speaker: "高野", text: "俺は引退なんかしないぞ！\n学友会は俺のものだ！" },
        { speaker: "", text: "邪智暴虐の委員長・高野は、引退を拒み続けていた。" },
        { speaker: "高野", text: "沖杉！お前を人質にとった！\n俺が引退しない限り、お前は解放されない！" },
        { speaker: "沖杉", text: "た、助けて...！" },
        { speaker: "", text: "そこへ、一人の勇者が現れた。" },
        { speaker: "", text: "そう、{player}...あなただ。" },
        { speaker: "高野", text: "ほう...{player}か。俺を引退させる気か？" },
        { speaker: "高野", text: "いいだろう。条件を出してやる。" },
        { speaker: "高野", text: "1年前にタイムスリップし、\n企画で起きた問題を全て解決してこい。" },
        { speaker: "高野", text: "それができたら...考えてやってもいい。" },
        { speaker: "", text: "こうして、{player}は過去への旅に出ることになった..." },
        { speaker: "", text: "目指すは4つの企画。\nバスハイク、夏企画、津田沼祭、スキスノ。" },
        { speaker: "", text: "それぞれの責任者が抱える問題を解決せよ！" },
        { next: "bushike_intro" }
    ],

    // バスハイク編
    bushike_intro: [
        { speaker: "", text: "【バスハイク編】", background: "bushike" },
        { speaker: "", text: "あなたはバスハイクの集合場所にやってきた。" },
        { speaker: "橋本", text: "うわぁ、どうしよう...！" },
        { speaker: "橋本", text: "急に参加者のキャンセルが出て、\n班を組み直さないといけないんだ！" },
        { speaker: "橋本", text: "このままじゃ受付がめちゃくちゃだ..." },
        { speaker: "", text: "橋本は困り果てている。" },
        {
            speaker: "",
            text: "助けてあげよう。",
            choices: [
                { text: "班分けを手伝う", next: "bushike_game" },
                { text: "見なかったことにする", next: "bushike_skip" }
            ]
        }
    ],
    bushike_game: [
        { speaker: "橋本", text: "本当に!? ありがとう！" },
        { speaker: "橋本", text: "参加者を適切な班に振り分けてくれ！" },
        { minigame: "bushike" }
    ],
    bushike_success: [
        { speaker: "橋本", text: "すごい！完璧な班分けだ！" },
        { speaker: "橋本", text: "これでバスハイクは大成功間違いなし！" },
        { speaker: "", text: "バスハイクの問題を解決した！" },
        { next: "summer_intro" }
    ],
    bushike_fail: [
        { speaker: "橋本", text: "うーん、うまくいかなかったね..." },
        { speaker: "橋本", text: "でも、手伝ってくれてありがとう。" },
        { speaker: "", text: "バスハイクの問題は解決できなかった..." },
        { next: "summer_intro" }
    ],
    bushike_skip: [
        { speaker: "", text: "あなたは橋本を見て見ぬふりをした..." },
        { speaker: "橋本", text: "はぁ...どうしよう..." },
        { speaker: "", text: "バスハイクの問題は解決できなかった..." },
        { next: "summer_intro" }
    ],

    // 夏企画編
    summer_intro: [
        { speaker: "", text: "【夏企画編】", background: "summer" },
        { speaker: "", text: "季節は夏。夏企画の会場に到着した。" },
        { speaker: "丸山", text: "大変だ！尻尾取りの尻尾がない！" },
        { speaker: "丸山", text: "誰かさんが作った尻尾2,000本がさっきまでここにあったのに..." },
        { speaker: "", text: "丸山は頭を抱えている。" },
        {
            speaker: "",
            text: "調査してみよう。",
            choices: [
                { text: "尻尾を探す", next: "summer_game" },
                { text: "諦める", next: "summer_skip" }
            ]
        }
    ],
    summer_game: [
        { speaker: "丸山", text: "頼む！尻尾を見つけてくれ！" },
        { speaker: "", text: "現場を調査して、尻尾の行方を突き止めよう。" },
        { minigame: "summer" }
    ],
    summer_success: [
        { speaker: "丸山", text: "見つかった！ありがとう！" },
        { speaker: "丸山", text: "これで夏企画ができるよ！" },
        { speaker: "", text: "夏企画の問題を解決した！" },
        { next: "tsudanuma_intro" }
    ],
    summer_fail: [
        { speaker: "丸山", text: "結局見つからなかったか..." },
        { speaker: "丸山", text: "急いで代わりを作らないと..." },
        { speaker: "", text: "夏企画の問題は解決できなかった..." },
        { next: "tsudanuma_intro" }
    ],
    summer_skip: [
        { speaker: "", text: "尻尾くらいなくても大丈夫だろう..." },
        { speaker: "丸山", text: "うう、どうしよう..." },
        { speaker: "", text: "夏企画の問題は解決できなかった..." },
        { next: "tsudanuma_intro" }
    ],

    // 津田沼祭編
    tsudanuma_intro: [
        { speaker: "", text: "【津田沼祭編】", background: "tsudanuma" },
        { speaker: "", text: "秋。津田沼祭の会場に到着した。" },
        { speaker: "", text: "すると、強風が吹き荒れ..." },
        { speaker: "高橋", text: "うわあああ！テントが！" },
        { speaker: "", text: "テントが風に飛ばされてバラバラになってしまった！" },
        { speaker: "高橋", text: "これじゃ出店できない...！" },
        {
            speaker: "",
            text: "テントを直そう。",
            choices: [
                { text: "修復を手伝う", next: "tsudanuma_game" },
                { text: "風が止むのを待つ", next: "tsudanuma_skip" }
            ]
        }
    ],
    tsudanuma_game: [
        { speaker: "高橋", text: "助かる！一緒に直してちょ！" },
        { speaker: "", text: "テントのパーツを正しく組み立てよう。" },
        { minigame: "tsudanuma" }
    ],
    tsudanuma_success: [
        { speaker: "高橋", text: "やった！テントが直った！" },
        { speaker: "高橋", text: "これで外団体も出店できる！" },
        { speaker: "", text: "津田沼祭の問題を解決した！" },
        { next: "skisno_intro" }
    ],
    tsudanuma_fail: [
        { speaker: "高橋", text: "うーん、うまく組み立てられなかった..." },
        { speaker: "高橋", text: "予備のテントを探してくるよ..." },
        { speaker: "", text: "津田沼祭の問題は解決できなかった..." },
        { next: "skisno_intro" }
    ],
    tsudanuma_skip: [
        { speaker: "", text: "風が止むのを待っていたが..." },
        { speaker: "", text: "時間切れになってしまった。" },
        { speaker: "", text: "津田沼祭の問題は解決できなかった..." },
        { next: "skisno_intro" }
    ],

    // スキスノ編
    skisno_intro: [
        { speaker: "", text: "【スキスノ編】", background: "skisno" },
        { speaker: "", text: "冬。スキー場に到着した。" },
        { speaker: "渡邊", text: "やばい！スマホがない！" },
        { speaker: "渡邊", text: "ゲレンデのどこかで落としたみたいなんだ..." },
        { speaker: "渡邊", text: "大事な連絡先が全部入ってるのに..." },
        {
            speaker: "",
            text: "探してあげよう。",
            choices: [
                { text: "スマホを探す", next: "skisno_game" },
                { text: "新しいの買えば？", next: "skisno_skip" }
            ]
        }
    ],
    skisno_game: [
        { speaker: "渡邊", text: "お願い！見つけてくれ！" },
        { speaker: "", text: "広いゲレンデからスマホを探し出そう。" },
        { minigame: "skisno" }
    ],
    skisno_success: [
        { speaker: "渡邊", text: "あった！ありがとう！" },
        { speaker: "渡邊", text: "本当に助かったよ！" },
        { speaker: "", text: "スキスノの問題を解決した！" },
        { next: "finale_intro" }
    ],
    skisno_fail: [
        { speaker: "渡邊", text: "見つからなかったか..." },
        { speaker: "渡邊", text: "諦めて新しいの買うしかないか..." },
        { speaker: "", text: "スキスノの問題は解決できなかった..." },
        { next: "finale_intro" }
    ],
    skisno_skip: [
        { speaker: "渡邊", text: "そ、そうだよね...でも..." },
        { speaker: "", text: "渡邊は悲しそうだ。" },
        { speaker: "", text: "スキスノの問題は解決できなかった..." },
        { next: "finale_intro" }
    ],

    // 結末編
    finale_intro: [
        { speaker: "", text: "..." },
        { speaker: "", text: "{player}は全ての企画を巡り、現代に戻ってきた。" },
        { speaker: "", text: "高野の元へ向かう時が来た。" },
        { background: "finale" },
        { speaker: "高野", text: "ほう...{player}、戻ってきたか。" },
        { checkFlags: true }
    ],
    finale_allclear: [
        { speaker: "高野", text: "なんだと...全ての問題を解決しただと...!?" },
        { speaker: "高野", text: "認めん！認めんぞ！" },
        { speaker: "高野", text: "俺は...俺は引退なんかしない！" },
        { speaker: "", text: "高野は戦闘態勢に入った！" },
        { battle: true }
    ],
    finale_notclear: [
        { speaker: "高野", text: "ふん、やはりダメだったか。" },
        { speaker: "高野", text: "{player}には無理だったんだ。" },
        { speaker: "高野", text: "これで俺の勝ちだ！\n永遠に学友会に居座ってやる！" },
        { speaker: "沖杉", text: "そんな..." },
        { ending: "bad" }
    ],

    // エンディング
    ending_true: [
        { speaker: "", text: "{player}は最後まで「引退」を選び続けた。" },
        { speaker: "高野", text: "..." },
        { speaker: "高野", text: "...わかった。" },
        { speaker: "高野", text: "{player}...お前の想いは伝わった。" },
        { speaker: "高野", text: "俺は...引退する。" },
        { speaker: "沖杉", text: "高野...！" },
        { speaker: "高野", text: "後輩たち、後は任せたぞ。" },
        { speaker: "高野", text: "学友会を...頼んだ。" },
        { speaker: "", text: "こうして、高野は無事に引退を受け入れた。" },
        { speaker: "", text: "学友会に平和が訪れた..." },
        { speaker: "", text: "{player}、ありがとう。" },
        { ending: "true" }
    ],
    ending_normal: [
        { speaker: "", text: "{player}は高野を倒してしまった..." },
        { speaker: "高野", text: "ぐふっ...やるじゃないか、{player}..." },
        { speaker: "高野", text: "俺の負けだ...引退してやるよ..." },
        { speaker: "沖杉", text: "高野...こんな終わり方..." },
        { speaker: "", text: "高野は引退した。" },
        { speaker: "", text: "しかし、どこかにわだかまりが残った..." },
        { ending: "normal" }
    ]
};

// エンディングテキスト
const ENDINGS = {
    true: {
        title: "TRUE END",
        text: `おめでとうございます、{player}！

あなたは全ての問題を解決し、
高野を説得することに成功しました。

暴力ではなく、対話によって
心を通わせることができたのです。

これからも学友会は続いていく...
先輩たちの想いを胸に。

{player}、ありがとう。
そしてお疲れ様でした。`
    },
    normal: {
        title: "NORMAL END",
        text: `高野は引退しました。

しかし、力で解決したことに
どこか後味の悪さが残ります。

{player}、もう一度やり直して、
別の結末を目指してみませんか？

...本当の結末は、まだ見ぬ先に。`
    },
    bad: {
        title: "BAD END",
        text: `高野の引退を阻止できませんでした...

過去の問題を全て解決できなかったため、
高野を説得する力がありませんでした。

{player}、もう一度挑戦して、
全ての企画を成功させてみてください。

きっと、道は開けるはずです。`
    }
};
