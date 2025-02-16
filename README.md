# vss_signage

## 概要
掲示物に使用する画像をアトラス化するツールです。
GitHub Actionsにより、画像を自動でアトラス化してGitHub Pagesに公開します。
自動で正方形にリサイズして、Zの形でABCDの順で結合されます。

## 使い方
### スライドショー
1. `slideshow/set01/A/` に画像を配置します。
   このとき、画像は `slide01.jpg`, `slide02.jpg`, ... のように連番で配置してください。
   ファイル名は必ず `slide` で始まるようにしてください。
   `A`フォルダにある画像の連番で処理をするので、歯抜けになると他のフォルダのその番号も無視されます。
   ただし、歯抜けでも他のファイルは処理されます。成果物についてはその番号のファイルは生成されません。
2. `B`、`C`、`D` フォルダにも同様に画像を配置します。
3. Git push します。
4. GitHub Actionsが自動で処理します。
4. https://virtualaviationjapan.github.io/vss_signage/slideshow/set01/slide01.png に公開されます。
   02, 03, ... についても同様です。

### 固定掲示
1. `fixed/` に画像を配置します。
   このとき、画像のファイル名に制約はありません。
2. `const.js`を編集します。
   `FIXED_SIGNAGES`は固定掲示する画像に関するオブジェクトの配列です。
   `name`は生成される画像のファイル名です。`images`はリポジトリルートからのファイルパスの配列です。
   ```json
   {
     "name": "sample.png",
     "images": [
       "fixed/sample1.png",
       "fixed/sample2.png",
       "fixed/sample3.png",
       "fixed/example.png"
     ]
   }
   ```
3. Git push します。
4. GitHub Actionsが自動で処理します。
4. https://virtualaviationjapan.github.io/vss_signage/fixed/sample.png に公開されます。