# オンライン企画支援アプリ README

## プロジェクト概要
Discord等の通話を利用しながら、参加者がスマートフォンからアクセスして遊べる企画支援Webアプリ。

主な目的は以下。

- お題の共有
- 回答受付
- 回答の一斉公開
- 将来的な投票機能
- ポートフォリオとしての活用

技術構成は以下を想定。

- HTML
- CSS
- JavaScript
- GitHub
- GitHub Pages
- Firebase Firestore

---

## サービス構成

VS Code
↓
GitHub
↓
GitHub Pages
↓
参加者がアクセス
↓
Firebase Firestore
（データ共有）

役割

- GitHub: ソースコード管理
- GitHub Pages: Webサイト公開
- Firebase: データ保存・リアルタイム同期

---

## 画面構成（初期案）

### HOME画面

- ユーザー名入力欄
- 司会者として参加ボタン
- 参加者として参加ボタン

イメージ

ユーザー名
[            ]

[司会者として参加]
[参加者として参加]

保存ボタンは設けず、参加ボタン押下時に自動保存する。

---

## ユーザー管理方針

### localStorageを利用

初回アクセス時にユーザー情報を保存。

保存内容

- playerId
- playerName

例

{
  playerId: 'UUID',
  playerName: 'たぬき'
}

### playerId

ブラウザ標準APIを利用して生成。

crypto.randomUUID()

生成後はlocalStorageに保存し、同一ユーザー識別に利用する。

### playerName

HOME画面で入力された内容を保存する。

次回アクセス時は自動入力を行う。

---

## ルーム制

初期段階からルーム機能を実装する。

### 司会者

司会者として参加
↓
ルーム番号入力
↓
Firebase検索
↓
存在しない
↓
ルーム作成

### 参加者

参加者として参加
↓
ルーム番号入力
↓
Firebase検索
↓
存在する
↓
参加

---

## Firestore構成案

rooms
 └ ROOM001
      ├ state
      ├ players
      ├ answers
      ├ question
      └ votes（将来）

---

## state管理

ゲーム全体の状態を管理する。

想定状態

- waiting
- question
- answering
- reveal

### waiting

待機中

### question

お題表示中

### answering

回答受付中

### reveal

回答公開中

状態変更時は全参加者へリアルタイム反映する。

---

## お題機能

初期版はJavaScript配列管理。

例

const themes = [
  '〇から始まる口癖',
  '〇から始まる好きな食べ物',
  '〇から始まる欲しいもの',
  '〇から始まるアニメキャラクター'
];

司会者が文字を入力。

例

あ

ルーレット実行。

結果

あから始まる口癖

---

## Firebase利用方針

### お題共有

司会者が結果を保存すると全員へ反映。

### 回答保存

各参加者が回答を送信。

例

{
  playerId: 'UUID',
  playerName: 'たぬき',
  answer: 'あーそれな！'
}

### 回答公開

司会者が公開ボタン押下。

全員の回答を表示。

---

## MVP（最初に完成させる範囲）

- スマホ専用レイアウト
- HOME画面
- ユーザー名保存
- ルーム作成
- ルーム参加
- お題生成
- ルーレット
- Firebase同期
- カウントダウン
- 回答送信
- 回答一斉公開

---

## 将来追加したい機能

- 投票機能
- MVP機能
- 得点管理
- ランキング
- 履歴表示
- 効果音
- BGM
- Firebase上でのお題管理
- 管理者機能強化
- Googleログイン

---

## 設計方針

- 完成を最優先する
- 最初はスマホ専用で開発する
- Firebaseは必要最小限から導入する
- お題は配列ベタ書きで開始する
- 後から機能拡張しやすい構造にする
- 身内利用を前提にシンプルなUXを目指す

