#!/bin/bash

# 画像最適化スクリプト for GitHub Pages
# macOS sips コマンドを使用

ASSETS_DIR="/Users/shungo/workspace/rpg/assets/images"

# 最大サイズ設定 (GitHub Pages向けに最適化)
BG_MAX_WIDTH=1280      # 背景画像の最大幅
CHARA_MAX_WIDTH=800    # キャラクター画像の最大幅
MG_MAX_WIDTH=1024      # ミニゲーム画像の最大幅

echo "=== 画像最適化スクリプト ==="
echo "GitHub Pages向けに画像サイズを最適化します"
echo ""

# バックアップディレクトリ作成
BACKUP_DIR="${ASSETS_DIR}/backup_original"
mkdir -p "$BACKUP_DIR"

# 圧縮前の合計サイズを取得
BEFORE_SIZE=$(du -sh "$ASSETS_DIR" 2>/dev/null | cut -f1)
echo "圧縮前の合計サイズ: $BEFORE_SIZE"
echo ""

# 関数: 画像をリサイズ
resize_image() {
    local file="$1"
    local max_width="$2"
    local filename=$(basename "$file")

    # 現在のサイズを取得
    local current_width=$(sips -g pixelWidth "$file" 2>/dev/null | grep pixelWidth | awk '{print $2}')
    local current_height=$(sips -g pixelHeight "$file" 2>/dev/null | grep pixelHeight | awk '{print $2}')
    local current_size=$(ls -lh "$file" | awk '{print $5}')

    # 幅が最大値を超えている場合のみリサイズ
    if [ "$current_width" -gt "$max_width" ]; then
        echo "処理中: $filename"
        echo "  元サイズ: ${current_width}x${current_height} ($current_size)"

        # バックアップ (まだない場合)
        if [ ! -f "${BACKUP_DIR}/${filename}" ]; then
            cp "$file" "${BACKUP_DIR}/${filename}"
        fi

        # リサイズ
        sips --resampleWidth "$max_width" "$file" >/dev/null 2>&1

        # 新しいサイズを取得
        local new_width=$(sips -g pixelWidth "$file" 2>/dev/null | grep pixelWidth | awk '{print $2}')
        local new_height=$(sips -g pixelHeight "$file" 2>/dev/null | grep pixelHeight | awk '{print $2}')
        local new_size=$(ls -lh "$file" | awk '{print $5}')

        echo "  新サイズ: ${new_width}x${new_height} ($new_size)"
        echo ""
    else
        echo "スキップ: $filename (幅 ${current_width}px は ${max_width}px 以下)"
    fi
}

# 背景画像を処理
echo "=== 背景画像 (最大幅: ${BG_MAX_WIDTH}px) ==="
for file in "${ASSETS_DIR}/backgrounds/"*.png; do
    if [ -f "$file" ]; then
        resize_image "$file" "$BG_MAX_WIDTH"
    fi
done

echo ""
echo "=== キャラクター画像 (最大幅: ${CHARA_MAX_WIDTH}px) ==="
for file in "${ASSETS_DIR}/characters/"*.png; do
    if [ -f "$file" ]; then
        resize_image "$file" "$CHARA_MAX_WIDTH"
    fi
done

echo ""
echo "=== ミニゲーム画像 (最大幅: ${MG_MAX_WIDTH}px) ==="
for file in "${ASSETS_DIR}/minigames/"*.png; do
    if [ -f "$file" ]; then
        resize_image "$file" "$MG_MAX_WIDTH"
    fi
done

# 圧縮後の合計サイズを取得
echo ""
echo "=== 完了 ==="
AFTER_SIZE=$(du -sh "$ASSETS_DIR" 2>/dev/null | cut -f1)
echo "圧縮前の合計サイズ: $BEFORE_SIZE"
echo "圧縮後の合計サイズ: $AFTER_SIZE"
echo ""
echo "オリジナル画像は ${BACKUP_DIR} にバックアップされています"
