# vss_signage

## 概要
掲示物に使用する画像をアトラス化するツールです。  
GitHub Actionsにより、画像を自動でアトラス化してGitHub Pagesに公開します。  
自動でリサイズして、4枚組の場合はZの形でABCDの順で、2枚組の場合は左右でA,Bの順に結合されます。  

## 使い方
※基礎的なGit(hub)の操作知識を要します。gitが分からない、初めて使う場合はワールド班にお問い合わせください。
### スライドショー
スライドショーは2枚組のアトラス化に固定されます。A,Bは`Set01`, C,Dは`Set02`のA,Bに配置してください。
1. `slideshow/set01/A/` に画像を配置します。  
   このとき、画像ファイル名は `slide（連番）.png` の形にしてください。大文字小文字も区別されるので注意。  
   ※例： `slide01.png`, `slide02.png`, `slide03.png`, ...
2. `B`フォルダにも同様に画像を配置します。この時、`A,B`間の画像の枚数は必ず揃えるようにし、想定枚数が揃わない場合は
   デフォルト柄、または同じ画像を別の番号で追加するなどしてください。  
   ※例：`A`が10枚、`B`が8枚なら`B`の`slide09`,`slide10`にはデフォルト柄を使うか、2回表示するポスターを「もう1枚」、正しく名前をつけてアップロード
3. `slideshow/set02/`にも手順1,2の要領でC,Dの画像を配置します。
4. Git push します。
5. GitHub Actionsが自動で処理します。
6. 以下のURLに公開されます。  
   Set1: https://virtualaviationjapan.github.io/vss_signage/slideshow/set01/slide01.png  
   Set1: https://virtualaviationjapan.github.io/vss_signage/slideshow/set02/slide01.png  
   02, 03, ... についても同様です。

**補足：画像のフォルダ連番が欠けた時の挙動**  
   `A`フォルダにある画像の連番で処理をするので、歯抜けになると他のフォルダのその番号も無視されます。  
   ただし、歯抜けでも他のファイルは処理されます。成果物についてはその番号のファイルは生成されません。  
   ……分かりづらい挙動なので、`A,B`間で枚数を揃えるように努めてください。
   
### 固定掲示
1. `fixed/` に画像を配置します。  
   画像の内容ごとに、以下のファイル命名に沿って名前を設定、配置してください。大文字小文字も区別されるので注意。   
- 注意事項日本語：caution_jp.png
- 注意事項英語：caution_en.png
- 推奨パフォーマンス設定：performanceSettings.png
- 出発案内：departuresBoard.png
- 広報固定表示ポスターA：poster_A.png
- 広報固定表示ポスターB：poster_B.png
- 広報固定表示ポスターC：poster_C.png
- 広報固定表示ポスターD：poster_D.png
2. Git push します。
3. GitHub Actionsが自動で処理します。
4. 以下のURLに公開されます。
- 注意事項、出発案内：https://virtualaviationjapan.github.io/vss_signage/fixed/signage1.png
- 広報固定表示ポスターのA,B：https://virtualaviationjapan.github.io/vss_signage/fixed/signage3.png
- 広報固定表示ポスターのC,D：https://virtualaviationjapan.github.io/vss_signage/fixed/signage4.png
### 固定表示のコンフィグ（枚数、ファイルパス）変更  
  **注意：通常はこの操作を行わないでください。**  
  ここを触る場合、おそらくワールドビルドを必要とします。ワールド班にお問い合わせください。  
  
  1.  `const.js`を編集します。  
  2.  `FIXED_SIGNAGES`は固定掲示する画像に関するオブジェクトの配列です。  
  3.  `name`は生成される画像のファイル名です。`pieces`は画像に結合するテクスチャ枚数を1,2,4(枚)から選択します。`images`はリポジトリルートからのファイルパスの配列です。
  4.  `pieces`は1,2,4から選択しますが、万が一それ以外の値またはnullだった場合、4が選択されます。
   ```json
   {
     "name": "sample.png",
     "pieces": 4,
     "images": [
       "fixed/sample1.png",
       "fixed/sample2.png",
       "fixed/sample3.png",
       "fixed/example.png"
     ]
   }
   {
       "name": "sample2.png",
       "pieces": 2,
       "images": [
        "fixed/sample1.png",
        "fixed/sample2.png",
     ]
   }
   {
       "name": "sample3.png",
       "pieces": 1,
       "images": [
        "fixed/sample1.png",
     ]
   }
   ```
