let spriteSheet;
let leftSprite; // 來自資料夾 (5/0.png )的精靈表
let upSprite; // 來自資料夾 4 的精靈表
let fightSprite; // 【新增】打架遊戲的攻擊動畫 (1-3 資料夾)
let orangeCatSprite; // 【新增】橘貓角色
let catAttackSprite; // 【新增】貓咪攻擊動畫
let xiaoHongSprite; // 【新增】小紅角色 (3-1 資料夾)
let jiuJiuSprite; // 【新增】啾啾角色 (3-2 資料夾)
let ggSprite; // 【新增】死亡動畫 (gg 資料夾)
let spaceSprite; // 來自資料夾 1/all.png（空白鍵使用） <-- 必須在 preload 中載入
let bgImage; // 背景圖片（背景/1.jpg）

// 資料夾 5 的單一幀尺寸：35 x 44
const FRAME_W = 35;
const FRAME_H = 44;
const TOTAL_FRAMES = 1;

// 空白鍵（資料夾 1/all.png）參數：每格 51x47，共 5 幀 (總寬度 255 / 5 幀 = 51)
const SPACE_FRAME_W = 51; // <-- 【修改】配合 255x47 / 5 幀
const SPACE_FRAME_H = 47; // <-- 【確認】配合 255x47
const SPACE_TOTAL_FRAMES = 5; // <-- 【確認】總幀數

// 左向精靈（2/all.png）參數：每格 40x45，共 3 幀
const LEFT_FRAME_W = 40;
const LEFT_FRAME_H = 45;
const LEFT_TOTAL_FRAMES = 3;

// 【新增】打架攻擊精靈 (1-3) 參數：每格 168x237，共 6 幀
const FIGHT_FRAME_W = 168;
const FIGHT_FRAME_H = 237;
const FIGHT_TOTAL_FRAMES = 6;

// 上向精靈（資料夾 4）參數：每格 46x46，共 3 幀
const UP_FRAME_W = 45;
const UP_FRAME_H = 46;
const UP_TOTAL_FRAMES = 3;

// 【新增】橘貓 (2-1) 參數：每格 76x127，共 8 幀
const ORANGE_CAT_FRAME_W = 76;
const ORANGE_CAT_FRAME_H = 127;
const ORANGE_CAT_TOTAL_FRAMES = 8;

// 【新增】小紅 (3-1) 參數：每格 43x54，共 5 幀
const XIAO_HONG_FRAME_W =43
const XIAO_HONG_FRAME_H = 54;
const XIAO_HONG_TOTAL_FRAMES = 5;

// 【新增】啾啾 (3-2) 參數：每格 48x30，共 5 幀
const JIU_JIU_FRAME_W =48;
const JIU_JIU_FRAME_H = 30;
const JIU_JIU_TOTAL_FRAMES = 5;

// 【新增】死亡動畫 (gg) 參數：每格 40x47，共 2 幀
const GG_FRAME_W = 40;
const GG_FRAME_H = 47;
const GG_TOTAL_FRAMES = 2;


// 角色座標與速度
let playerX;
let playerY;
let groundY; // 地面高度
const MOVE_SPEED = 7; // 【修改】加快移動速度
const GRAVITY_SPEED = 8; // 掉落速度

// 記錄玩家最後面向（true = 朝右，false = 朝左）
let playerFlipH = false;

// --- 角色血量 ---
let playerHP = 100;
const PLAYER_MAX_HP = 100;

// 第二個角色 (1-1/1.png) 的變數
let char2ImgDefault; // 貓咪預設圖片
let char2ImgAngry;   // 貓咪靠近時的圖片
let char2X;
let char2Y;
let char2FlipH = false; // 是否水平翻轉
const CHAR2_W = 52;
let char2Direction = 0; // 貓咪移動方向: -1 左, 1 右, 0 停
let char2MoveTimer = 0; // 計時器，決定何時改變方向
const CHAR2_SCALE = 3.5; // 貓咪的縮放比例
let catHP = 100;
const CAT_MAX_HP = 100;

// 【新增】貓咪攻擊相關變數
const CAT_ATTACK_FRAME_W = 65;
const CAT_ATTACK_FRAME_H = 70;
const CAT_ATTACK_TOTAL_FRAMES = 5;
let isCatAttacking = false; // 貓咪是否正在攻擊
let catAttackCooldown = 0; // 貓咪攻擊冷卻計時器
const CAT_ATTACK_COOLDOWN_DURATION = 60; // 貓咪攻擊頻率 (幀)
const CAT_ATTACK_RANGE = 120; // 貓咪的攻擊距離
const CAT_ATTACK_DAMAGE = 30; // 貓咪攻擊傷害

// 【新增】橘貓角色變數
let orangeCatX;
let orangeCatY;
let orangeCatFlipH = false;
let orangeCatDirection = 0;
let orangeCatMoveTimer = 0;
const ORANGE_CAT_SCALE = 1.5; // 【修改】調整橘貓大小，使其與精靈更接近

// 【新增】小紅角色變數
let xiaoHongX;
let xiaoHongY;
let xiaoHongFlipH = false;
let xiaoHongDirection = 0;
let xiaoHongMoveTimer = 0;
const XIAO_HONG_SCALE = 3.0; // 設定小紅的縮放比例
let xiaoHongState = 'idle'; // 'idle', 'asking', 'correct', 'wrong'

// 【新增】啾啾角色變數
let jiuJiuX, jiuJiuY;
let jiuJiuVx = 2; // 水平速度
let jiuJiuVy = 1.5; // 垂直速度
const JIU_JIU_SCALE = 2.5;
let jiuJiuState = 'idle'; // 'idle', 'showing_hint'

let currentXiaoHongQuestion = null;
let xiaoHongQuestionQueue = []; // 【新增】題目佇列，用來存要問的題目
let xiaoHongQuestionIndex = 0; // 【新增】目前問到第幾題
const XIAO_HONG_QUESTIONS = [
  {
    question: "草莓在生物學的分類上，其實「不屬於」莓果類（Berry），\n反而是下列哪種水果才被定義為真正的莓果？",
    options: ["(A) 覆盆子", "(B) 香蕉", "(C) 黑莓", "(D) 櫻桃"],
    correctAnswer: "B",
    hint: "提示：這種水果長在巨大的草本植物上，而且種子在果肉裡面喔！"
  },
  {
    question: "全世界「自動販賣機密度最高」的國家是日本，\n但你知道自動販賣機最初在古埃及發明時，\n是用來販售什麼東西的嗎？",
    options: ["(A) 聖水", "(B) 莎草紙", "(C) 麵包", "(D) 啤酒"],
    correctAnswer: "A",
    hint: "提示：這是在神廟裡使用的裝置，為了防止信徒取走太多神聖的液體。"
  },
  {
    question: "童話故事《小紅帽》中，大野狼最後偽裝成誰躲在床上，\n試圖欺騙小紅帽？",
    options: ["(A) 獵人", "(B) 奶奶", "(C) 媽媽", "(D) 樵夫"],
    correctAnswer: "B",
    hint: "提示：是住在森林小屋裡的親人喔！"
  }
];

const FRAME_DELAY = 7; // 切換間隔（以 draw() 的 frame 計數為單位）

// --- 遊戲模式管理 ---
let gameMode = 'explore'; // 'explore', 'quiz', 'fight', 'quizEnd', 'gameOver', 'victory'
let attackCooldown = 0; // 攻擊冷卻計時器
const ATTACK_RANGE = 200; // 【修改】加大攻擊距離
const ATTACK_DAMAGE = CAT_MAX_HP / 3; // 【修改】精靈的攻擊傷害為貓咪最大血量的1/3

// --- 攻擊特效變數 ---
let isAttackEffectVisible = false; // 特效是否可見
let attackEffectX, attackEffectY; // 特效位置
let attackEffectFlipH = false; // 特效是否翻轉

// 【新增】橘貓回血測驗變數
let healState = 'idle'; // 'idle', 'asking', 'quiz', 'answered', 'declined'
let healResponseText = ''; // 回血測驗的回應文字

// 【新增】神奇芝識起司蒐集變數
let wisdomLights = 0; // 目前蒐集到的燈數 (0-3)
let maxLightsFromCat = 0; // 從黑貓那裡獲得的最大燈數 (0, 1, 2)
let hasCollectedXiaoHongReward = false; // 是否已從小紅那裡獲得燈數

// 【新增】起司精靈與起司雨變數
let cheeseSpiritSprite; // 74.png
let cheeseSpiritX, cheeseSpiritY;
let cheeseSpiritState = 'hidden'; // 'hidden', 'visible', 'collected'
let isCheeseRaining = false;
let cheeseRainDrops = [];

// 【新增】全域狀態變數
let isPlayerNear = false; // 【修改】將紫色貓咪的靠近判斷提升為全域變數
let isPlayerNearOrangeCat = false; // 玩家是否靠近橘貓
let isPlayerNearXiaoHong = false; // 玩家是否靠近小紅
let isPlayerNearJiuJiu = false; // 玩家是否靠近啾啾
let activeCloseButtons = []; // 【修改】改為陣列，支援多個對話框同時存在的關閉判斷
let isPurpleCatDismissed = false; // 【新增】記錄是否已關閉紫色貓咪的提示
let isDying = false; // 【新增】是否正在播放死亡動畫
let deathTimer = 0; // 【新增】死亡動畫計時器


// --- 測驗遊戲變數 ---
let isQuizActive = false; // 測驗是否正在進行
let currentQuestionIndex = 0; // 目前題號
let score = 0; // 分數
let quizState = 'asking'; // 測驗狀態: 'asking', 'answered', 'showingExplanation'
let feedbackText = ''; // 回饋文字 (答對/答錯)
let quizEndText = ''; // 測驗結束文字

// --- 測驗題目資料 ---
const QUIZ_QUESTIONS = [
  {
    question: "Q1. 廚房安全題： 如果在家裡炒菜時，油鍋突然起火了，這時候絕對不能做哪一個動作？",
    options: ["(A) 立刻蓋上鍋蓋", "(B) 直接對火源潑水"],
    correctAnswer: "B",
    explanation: "解析：千萬不能潑水！因為油比水輕，水倒進去會沉到油底下瞬間沸騰汽化，導致熱油炸開噴濺，讓火勢瞬間擴大。正確做法是(A)從側面滑入蓋上鍋蓋（隔絕氧氣）並關火。",
    hint: "提示：油和水是不相容的，水遇到高溫油會瞬間變成水蒸氣爆炸喔！"
  },
  {
    question: "Q2. 健康急救題： 突然流鼻血時，正確的止血姿勢應該是怎麼樣的？",
    options: ["(A) 頭往後仰，防止血流出來", "(B) 頭稍微往前傾，捏住鼻翼兩側"],
    correctAnswer: "B",
    explanation: "解析：頭往後仰是錯誤的舊觀念。往後仰會讓鼻血倒流進喉嚨，容易引起嗆咳或嘔吐。正確做法是頭微前傾，用手指捏住鼻翼兩側加壓止血約 5-10 分鐘。",
    hint: "提示：如果頭往後仰，鼻血會流到喉嚨裡，這樣很不舒服也危險。"
  },
  {
    question: "Q3. 環保回收題： 吃完披薩後，那個「沾滿了油漬和起司殘渣」的紙盒，應該丟到哪一類？",
    options: ["(A) 紙類回收", "(B) 一般垃圾"],
    correctAnswer: "B",
    explanation: "解析：雖然它是紙做的，但紙類回收需要乾淨的紙張。一旦紙張被嚴重的油汙或食物殘渣汙染，就無法在回收廠進行製漿處理，反而會汙染其他乾淨的紙類。",
    hint: "提示：回收的紙張需要是乾淨的，太油的紙沒辦法處理喔。"
  },
  {
    question: "Q4. 食品保存題： 一般來說，煮熟的食物在室溫下放置超過多久，就建議要趕快放進冰箱？",
    options: ["(A) 30 分鐘", "(B) 2 小時", "(C) 半天"],
    correctAnswer: "B",
    explanation: "解析：這在食品安全常識中被稱為「2小時法則」。食物在危險溫度帶（約 7°C ~ 60°C）放置超過 2 小時，細菌就會呈倍數增長，食物中毒的風險大增。",
    hint: "提示：細菌在室溫下繁殖很快，通常不建議超過一部電影的時間（約2小時）。"
  },
  {
    question: "Q5. 數位生活題： 在連接公共場合提供不需要密碼的免費 Wi-Fi 時，進行網路銀行轉帳或輸入信用卡資料購物，是安全的行為嗎？",
    options: ["(A) 安全，有網路就能用", "(B) 不安全，資料容易被攔截"],
    correctAnswer: "B",
    explanation: "解析：公共且未加密的 Wi-Fi 非常容易成為駭客的目標，他們可以攔截你在這個網路上傳輸的資訊，包含你的帳號密碼。涉及敏感個資的操作，建議使用自己的手機行動網路。",
    hint: "提示：不需要密碼的 Wi-Fi 就像沒鎖的門，駭客很容易就能偷看你的資料。"
  }
];

// --- 按鈕變數 ---
let quizButtons = []; // 用於存放各類選項按鈕
let startButton, nextButton, viewExplanationButton, restartQuizButton, startFightButton, restartGameButton, healYesButton, healNoButton, closeButton, xiaoHongOpt1Button, xiaoHongOpt2Button, xiaoHongOpt3Button, xiaoHongOpt4Button;
let replaySymbolButton; // 【新增】重新遊玩按鈕

function preload() {
  spriteSheet = loadImage('5/0.png');
  // 載入位於資料夾 2 的 all.png（按左鍵時使用）
  leftSprite = loadImage('2/all.png');

  // 【新增】載入向上動畫精靈表 (假設為 4/all.png)
  upSprite = loadImage('4/all.png');
  
  // 【新增】載入打架攻擊動畫 (1-3)
  fightSprite = loadImage('1-3/all.png');

  // 【新增】載入橘貓動畫
  orangeCatSprite = loadImage('2-1/all.png');

  // 【新增】載入小紅動畫 (3-1)
  xiaoHongSprite = loadImage('3-1/all.png');

  // 【新增】載入啾啾動畫 (3-2)
  jiuJiuSprite = loadImage('3-2/all.png');

  // 【新增】載入死亡動畫 (gg)
  ggSprite = loadImage('gg/all.png');

  // 【新增】載入貓咪攻擊動畫 (1-4)
  catAttackSprite = loadImage('1-4/all.png');

  // 【新增】載入空白鍵攻擊精靈表 (1/all.png)
  spaceSprite = loadImage('1/all.png');
  
  // 載入背景圖片（背景/1.jpg）
  bgImage = loadImage('背景/1.jpg');

  // 載入第二個角色的圖片
  char2ImgDefault = loadImage('1-1/1.png');
  char2ImgAngry = loadImage('1-1/2.png');

  // 【新增】載入起司精靈圖片
  cheeseSpiritSprite = loadImage('74.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noSmooth();
  // 初始位置置中（水平），下方（垂直）
  groundY = height * 0.7;
  playerX = width / 2;
  playerY = groundY;

  // 設定第二個角色的初始位置
  char2X = width / 2 + 150;
  char2Y = groundY; // 與精靈站在相同的高度

  // 【新增】設定橘貓的初始位置
  orangeCatX = width / 4;
  orangeCatY = groundY;

  // 【新增】設定小紅的初始位置
  xiaoHongX = width * 0.8; // 放在畫面右側
  xiaoHongY = groundY;

  // 【新增】設定啾啾的初始位置 (畫面左上角隨機)
  jiuJiuX = random(width);
  jiuJiuY = random(50, height / 2);

  // 【新增】初始化起司精靈位置
  cheeseSpiritX = width / 2;
  cheeseSpiritY = height / 2 - 100; // 【修改】將起司精靈高度調高

  // --- 初始化按鈕 ---
  // 測驗開始按鈕
  startButton = { x: 0, y: 0, w: 0, h: 0, text: "是的喵喵" };
  // 下一題按鈕
  nextButton = { x: 0, y: 0, w: 0, h: 0, text: "繼續挑戰下一題喵" };
  // 查看解析按鈕
  viewExplanationButton = { x: 0, y: 0, w: 0, h: 0, text: "查看解析" };
  // 【新增】測驗結束後的按鈕
  restartQuizButton = { x: 0, y: 0, w: 0, h: 0, text: "重新作答" };
  startFightButton = { x: 0, y: 0, w: 0, h: 0, text: "跟貓咪玩打架遊戲" };
  // 【新增】遊戲失敗後的按鈕
  restartGameButton = { x: 0, y: 0, w: 0, h: 0, text: "重新開始" };
  // 【新增】橘貓回血對話按鈕
  healYesButton = { x: 0, y: 0, w: 0, h: 0, text: "好呀！" };
  healNoButton = { x: 0, y: 0, w: 0, h: 0, text: "不用了，謝謝！" };
  // 【新增】通用的關閉按鈕
  closeButton = { x: 0, y: 0, w: 0, h: 0, text: "好的喵" };
  // 【新增】小紅的選項按鈕
  xiaoHongOpt1Button = { x: 0, y: 0, w: 0, h: 0, text: "選項 A" };
  xiaoHongOpt2Button = { x: 0, y: 0, w: 0, h: 0, text: "選項 B" };
  xiaoHongOpt3Button = { x: 0, y: 0, w: 0, h: 0, text: "選項 C" };
  xiaoHongOpt4Button = { x: 0, y: 0, w: 0, h: 0, text: "選項 D" };

  // 【新增】蒐集完成後的重新遊玩按鈕
  replaySymbolButton = { x: 0, y: 0, w: 140, h: 40, text: "↻ 重新遊玩" };
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 更新地面高度
  groundY = height * 0.7;
  // 重新計算角色位置，避免角色在畫面外
  playerY = min(playerY, groundY);
}

function draw() {
  // 背景圖片：背景/1.jpg
  // background(bgImage); // 【修改】移除原本的靜態背景
  
  // 【新增】背景隨精靈移動 (視差效果)
  // 根據精靈位置計算背景偏移量 (係數 0.1 代表移動幅度，加大)
  let bgOffsetX = (width / 2 - playerX) * 0.1;
  // 上下不移動，所以移除 bgOffsetY 的計算
  
  // 繪製背景，稍微放大 (width + 200) 並位移 (-100)，確保移動時邊緣不會露出空白
  image(bgImage, bgOffsetX - 100, -50, width + 200, height + 100);
  
  // 【修改】每幀重置關閉按鈕區域陣列
  activeCloseButtons = [];

  // --- 【新增】優先處理勝利與失敗條件 ---
  if (playerHP <= 0 && gameMode !== 'gameOver') {
    if (!isDying) {
      isDying = true; // 開始播放死亡動畫
      deathTimer = millis() + 2000; // 設定 2 秒後切換
    }
  }
  
  if (isDying && millis() > deathTimer) {
    gameMode = 'gameOver'; // 時間到，切換至失敗畫面
    isDying = false;
  }

  if (catHP <= 0 && gameMode !== 'victory') {
    gameMode = 'victory';
  }

  // 繪製血量條
  drawHealthBars();
  drawWisdomFruitUI(); // 【新增】繪製神奇芝識起司蒐集介面
  // 選擇要顯示的精靈表與參數：預設使用 spriteSheet (5/0.png)
  let img = spriteSheet;
  let fw = FRAME_W;
  let fh = FRAME_H;
  let tf = TOTAL_FRAMES;
  let flipH = playerFlipH; // 是否水平反轉（預設為最後面向）

  // --- 決定精靈動畫 ---
  // 優先權 0: 死亡動畫
  if (isDying && ggSprite) {
    img = ggSprite;
    fw = GG_FRAME_W;
    fh = GG_FRAME_H;
    tf = GG_TOTAL_FRAMES;
  }
  // 優先權 1: 按住空白鍵時使用攻擊動畫 (來自 1/all.png) (死亡時不可攻擊)
  else if (keyIsDown(32) && spaceSprite) {
    img = spaceSprite;
    fw = SPACE_FRAME_W;
    fh = SPACE_FRAME_H;
    tf = SPACE_TOTAL_FRAMES;
  }
  // 優先權 2: 如果在空中，使用飛行動畫
  else if (playerY < groundY && upSprite) {
    img = upSprite;
    fw = UP_FRAME_W;
    fh = UP_FRAME_H;
    tf = UP_TOTAL_FRAMES;
    // 在空中時，也根據方向鍵決定是否翻轉
    if (keyIsDown(68)) { // D
      playerFlipH = true;
      flipH = true;
    } else if (keyIsDown(65)) { // A
      playerFlipH = false;
      flipH = false;
    }
  }
  // 優先權 3: 在地面上移動
  else if (keyIsDown(65) && leftSprite) { // A
    img = leftSprite;
    fw = LEFT_FRAME_W;
    fh = LEFT_FRAME_H;
    tf = LEFT_TOTAL_FRAMES;
    playerFlipH = false;
    flipH = false; // 確保向左時不翻轉
  }
  else if (keyIsDown(68) && leftSprite) { // D
    img = leftSprite;
    fw = LEFT_FRAME_W;
    fh = LEFT_FRAME_H;
    tf = LEFT_TOTAL_FRAMES;
    playerFlipH = true;
    flipH = true;
  }

  // 計算目前幀
  const idx = floor(frameCount / FRAME_DELAY) % tf;
  const sx = idx * fw;
  const sy = 0;

  // 放大四倍
  const SCALE = 4;
  const drawW = fw * SCALE;
  const drawH = fh * SCALE;

  // 【修改】只有在特定模式下，才禁止玩家移動
  if (gameMode !== 'quizEnd' && gameMode !== 'gameOver' && gameMode !== 'victory' && !isDying) {
    // 按住左鍵時移動 (A)
    if (keyIsDown(65)) {
      playerX -= MOVE_SPEED;
      playerFlipH = false;
    }
  
    // 按住右鍵時移動 (D)
    if (keyIsDown(68)) {
      playerX += MOVE_SPEED;
      playerFlipH = true;
    }
  
    // 按住上鍵時移動 (W)
    if (keyIsDown(87)) {
      playerY -= MOVE_SPEED;
    }

    // 按住下鍵時移動 (S)
    if (keyIsDown(83)) {
      playerY += MOVE_SPEED;
    }
  
    // 如果沒按上鍵且角色在空中，則往下掉
    if (!keyIsDown(87) && playerY < groundY) {
      playerY += GRAVITY_SPEED; // 使用更快的掉落速度
      playerY = min(playerY, groundY); // 確保不會掉穿地面
    }

    // 【修改】攻擊邏輯與特效觸發
    if (keyIsDown(32) && frameCount > attackCooldown) {
      const facingRight = playerFlipH;
      // 1. 觸發攻擊特效 (任何模式下)
      isAttackEffectVisible = true;
      attackEffectX = playerX; // 【修改】讓特效與精靈重疊
      attackEffectY = playerY;
      attackEffectFlipH = !facingRight;
      
      // 設定冷卻時間
      attackCooldown = frameCount + (FIGHT_TOTAL_FRAMES * FRAME_DELAY);

      // 2. 只有在戰鬥模式下才計算傷害
      if (gameMode === 'fight') {
        // 檢查是否在攻擊範圍內且方向正確
        const catIsOnRight = (char2X > playerX);
        if (dist(playerX, playerY, char2X, char2Y) < ATTACK_RANGE) {
          if ((facingRight && catIsOnRight) || (!facingRight && !catIsOnRight)) {
            catHP = max(0, catHP - ATTACK_DAMAGE); // 貓咪扣血
          }
        }
      }
    }
  }

  // 邊界限制（確保不會移出畫面）
  playerX = constrain(playerX, drawW / 2, width - drawW / 2);
  playerY = constrain(playerY, drawH / 2, height - drawH / 2);

  // --- 提前計算共用變數 ---
  const proximityThreshold = (drawW / 2) + (CHAR2_W * CHAR2_SCALE / 2) + 30;
  isPlayerNear = dist(playerX, playerY, char2X, char2Y) < proximityThreshold; // 【修改】更新全域變數，而非宣告區域變數
  const char2DrawW = CHAR2_W * CHAR2_SCALE;

  // --- 貓咪 AI 與移動邏輯 ---
  // 【修改】在探索或測驗結束模式下，貓咪會隨機移動
  if (gameMode === 'explore' || gameMode === 'quizEnd') {
    // 【修改】只有在測驗結束畫面(正在對話)時才停下，探索模式下即使靠近也自由移動
    // 【新增】如果收集到起司且靠近，也要停下來面向精靈
    if (gameMode === 'quizEnd' || (cheeseSpiritState === 'collected' && isPlayerNear)) {
      char2Direction = 0; // 靠近時停下來
      // 靠近時面向精靈（player 在左邊則朝左）
      char2FlipH = (playerX < char2X);
    } else {
      // 遠離時：隨機閒逛
      if (frameCount > char2MoveTimer) {
        char2Direction = random([-1, 0, 1]);
        char2MoveTimer = frameCount + random(60, 180);
      }
    }

    char2X += char2Direction * (MOVE_SPEED / 3); // 【修改】將黑貓速度調慢，與小紅一致 (原本是 / 2)
    if (char2Direction === -1) char2FlipH = true;
    if (char2Direction === 1) char2FlipH = false;

    char2X = constrain(char2X, char2DrawW / 2, width - char2DrawW / 2);
  } else if (gameMode === 'quiz') {
    // 在測驗模式下，貓咪站著不動並面向精靈
    char2FlipH = (playerX < char2X);
  } else if (gameMode === 'fight') {
    // 在戰鬥模式下，貓咪會追擊並攻擊
    if (!isCatAttacking) { // 攻擊時鎖定方向
      char2FlipH = (playerX < char2X);

      // 【新增】追擊邏輯
      const chaseSpeed = MOVE_SPEED * 0.6; // 貓咪的追擊速度
      if (abs(playerX - char2X) > CAT_ATTACK_RANGE * 0.8) { // 如果不在近戰範圍內，就追
        if (playerX > char2X) {
          char2X += chaseSpeed;
        } else {
          char2X -= chaseSpeed;
        }
      }

      // 攻擊AI
      if (frameCount > catAttackCooldown && dist(playerX, playerY, char2X, char2Y) < CAT_ATTACK_RANGE) {
        isCatAttacking = true; // 開始攻擊
        catAttackCooldown = frameCount + CAT_ATTACK_COOLDOWN_DURATION;
      }
    }
  }

  // 【新增】繪製橘貓 (將其移到最先繪製，使其在最下層)
  if (orangeCatSprite) {
    // 橘貓的移動 AI (只在特定模式下)
    if (gameMode === 'explore' || gameMode === 'quizEnd' || gameMode === 'quiz') { // 【修改】加入 quiz 模式，讓精靈測驗時橘貓也能動
      // 【修改】只有在互動狀態(非 idle)時才停下
      if (healState !== 'idle') {
        orangeCatDirection = 0;
        // 面向玩家
        orangeCatFlipH = (playerX < orangeCatX);
      } else {
        if (frameCount > orangeCatMoveTimer) {
          orangeCatDirection = random([-1, 0, 1]);
          orangeCatMoveTimer = frameCount + random(90, 240);
        }
      }
      orangeCatX += orangeCatDirection * (MOVE_SPEED / 3);
      if (orangeCatDirection === -1) orangeCatFlipH = true;
      if (orangeCatDirection === 1) orangeCatFlipH = false;
    }

    const orangeCatDrawW = ORANGE_CAT_FRAME_W * ORANGE_CAT_SCALE;
    orangeCatX = constrain(orangeCatX, orangeCatDrawW / 2, width - orangeCatDrawW / 2);

    const orangeCatIdx = floor(frameCount / (FRAME_DELAY * 1.5)) % ORANGE_CAT_TOTAL_FRAMES;
    const orangeCatSX = orangeCatIdx * ORANGE_CAT_FRAME_W;
    const orangeCatDrawH = ORANGE_CAT_FRAME_H * ORANGE_CAT_SCALE;
    push();
    translate(orangeCatX, orangeCatY);
    if (orangeCatFlipH) scale(-1, 1);
    image(orangeCatSprite, -orangeCatDrawW / 2, -orangeCatDrawH / 2, orangeCatDrawW, orangeCatDrawH, orangeCatSX, 0, ORANGE_CAT_FRAME_W, ORANGE_CAT_FRAME_H);
    pop();
  }

  // 【新增】繪製小紅 (在橘貓之後，貓咪之前)
  if (xiaoHongSprite) {
    // 小紅的移動 AI (只在特定模式下)
    if (gameMode === 'explore' || gameMode === 'quizEnd' || gameMode === 'quiz') { // 【修改】加入 quiz 模式，讓精靈測驗時小紅也能動
      // 【修改】只要在互動狀態（非 idle 且非 dismissed）就停下
      if (xiaoHongState !== 'idle' && xiaoHongState !== 'dismissed') {
        xiaoHongDirection = 0;
        xiaoHongFlipH = (playerX < xiaoHongX);
      } else {
        if (frameCount > xiaoHongMoveTimer) {
          xiaoHongDirection = random([-1, 0, 1]);
          xiaoHongMoveTimer = frameCount + random(90, 240);
        }
      }

      xiaoHongX += xiaoHongDirection * (MOVE_SPEED / 3);
      if (xiaoHongDirection === -1) xiaoHongFlipH = true;
      if (xiaoHongDirection === 1) xiaoHongFlipH = false;
    }
    const xiaoHongDrawW = XIAO_HONG_FRAME_W * XIAO_HONG_SCALE;
    xiaoHongX = constrain(xiaoHongX, xiaoHongDrawW / 2, width - xiaoHongDrawW / 2);

    const xiaoHongIdx = floor(frameCount / FRAME_DELAY) % XIAO_HONG_TOTAL_FRAMES;
    const xiaoHongSX = xiaoHongIdx * XIAO_HONG_FRAME_W;
    const xiaoHongDrawH = XIAO_HONG_FRAME_H * XIAO_HONG_SCALE;
    push();
    translate(xiaoHongX, xiaoHongY);
    if (xiaoHongFlipH) scale(-1, 1);
    image(xiaoHongSprite, -xiaoHongDrawW / 2, -xiaoHongDrawH / 2, xiaoHongDrawW, xiaoHongDrawH, xiaoHongSX, 0, XIAO_HONG_FRAME_W, XIAO_HONG_FRAME_H);
    pop();
  }

  // 【新增】繪製啾啾 (在空中飛行)
  if (jiuJiuSprite) {
    // 啾啾的飛行邏輯 (碰到邊界反彈)
    jiuJiuX += jiuJiuVx;
    jiuJiuY += jiuJiuVy;

    if (jiuJiuX < 0 || jiuJiuX > width) jiuJiuVx *= -1;
    // 限制在畫面上半部 (0 ~ height/2)
    if (jiuJiuY < 20 || jiuJiuY > height / 2) jiuJiuVy *= -1;

    const jiuJiuDrawW = JIU_JIU_FRAME_W * JIU_JIU_SCALE;
    const jiuJiuDrawH = JIU_JIU_FRAME_H * JIU_JIU_SCALE;
    
    // 決定面向 (往右飛時翻轉，假設原圖朝左)
    let jiuJiuFlipH = (jiuJiuVx > 0);

    const jiuJiuIdx = floor(frameCount / FRAME_DELAY) % JIU_JIU_TOTAL_FRAMES;
    const jiuJiuSX = jiuJiuIdx * JIU_JIU_FRAME_W;

    push();
    translate(jiuJiuX, jiuJiuY);
    if (jiuJiuFlipH) scale(-1, 1);
    image(jiuJiuSprite, -jiuJiuDrawW / 2, -jiuJiuDrawH / 2, jiuJiuDrawW, jiuJiuDrawH, jiuJiuSX, 0, JIU_JIU_FRAME_W, JIU_JIU_FRAME_H);
    pop();
  }

  // 2. 繪製貓咪 (在精靈後面)
  push();
  translate(char2X, char2Y);
  if (char2FlipH) {
    scale(-1, 1);
  }

  if (isCatAttacking) {
    // 計算攻擊動畫的當前幀
    const timeSinceAttackStarted = (catAttackCooldown - frameCount);
    const totalAnimDuration = CAT_ATTACK_TOTAL_FRAMES * FRAME_DELAY;
    const currentAnimTime = CAT_ATTACK_COOLDOWN_DURATION - timeSinceAttackStarted;
    const attackIdx = floor(currentAnimTime / FRAME_DELAY);

    if (attackIdx < CAT_ATTACK_TOTAL_FRAMES) {
      const catSX = attackIdx * CAT_ATTACK_FRAME_W;
      const catDrawW = CAT_ATTACK_FRAME_W * CHAR2_SCALE;
      const catDrawH = CAT_ATTACK_FRAME_H * CHAR2_SCALE;
      image(catAttackSprite, -catDrawW / 2, -catDrawH / 2, catDrawW, catDrawH, catSX, 0, CAT_ATTACK_FRAME_W, CAT_ATTACK_FRAME_H);

      // 【新增】讓貓咪在攻擊時向前移動
      const lungeSpeed = 1.5;
      if (char2FlipH) { // 如果貓咪朝左
        char2X -= lungeSpeed;
      } else { // 如果貓咪朝右
        char2X += lungeSpeed;
      }

      // 在攻擊動畫的第3幀造成傷害
      if (attackIdx === 2 && currentAnimTime % FRAME_DELAY === 0) {
        if (dist(playerX, playerY, char2X, char2Y) < CAT_ATTACK_RANGE) {
          playerHP = max(0, playerHP - CAT_ATTACK_DAMAGE);
        }
      }
    } else {
      isCatAttacking = false; // 動畫播放完畢
    }
  } else {
    // 【修改】決定貓咪要顯示的圖片：只有在探索模式且靠近時才生氣
    let catImgToDraw = (gameMode === 'explore' && isPlayerNear) ? char2ImgAngry : char2ImgDefault;
    const char2DrawH = catImgToDraw.height * CHAR2_SCALE;
    image(catImgToDraw, -char2DrawW / 2, -char2DrawH / 2, char2DrawW, char2DrawH);
  }
  pop();

  // 繪製在 playerX/playerY（靠左下對齊改為置中）
  push();
  translate(playerX, playerY);
  if (flipH) {
    scale(-1, 1);
  }

  // 【新增】死亡時閃爍效果
  if (isDying) {
    if (frameCount % 10 < 5) {
      tint(255, 50); // 每隔幾幀將透明度設為 50 (範圍 0-255)，產生閃爍感
    }
  }

  // 使用 image(img, dx, dy, dWidth, dHeight, sx, sy, sWidth, sHeight)
  image(img, -drawW / 2, -drawH / 2, drawW, drawH, sx, sy, fw, fh);
  pop();

  // 【新增】繪製攻擊特效 (在所有角色之上)
  if (isAttackEffectVisible) {
    // 根據攻擊冷卻時間計算特效的動畫幀
    const timeSinceAttack = (FIGHT_TOTAL_FRAMES * FRAME_DELAY) - (attackCooldown - frameCount);
    const effectIdx = floor(timeSinceAttack / FRAME_DELAY);

    if (effectIdx < FIGHT_TOTAL_FRAMES) {
      const effectSX = effectIdx * FIGHT_FRAME_W;
      const effectSY = 0;
      const effectDrawW = SPACE_FRAME_W * SCALE; // 【修改】讓特效寬度與精靈攻擊動畫寬度一致
      const effectDrawH = SPACE_FRAME_H * SCALE; // 【修改】讓特效高度與精靈攻擊動畫高度一致

      push();
      translate(attackEffectX, attackEffectY); // 【修改】讓特效與精靈Y軸對齊
      if (attackEffectFlipH) {
        scale(-1, 1);
      }
      image(fightSprite, -effectDrawW / 2, -effectDrawH / 2, effectDrawW, effectDrawH, effectSX, effectSY, FIGHT_FRAME_W, FIGHT_FRAME_H);
      pop();
    } else {
      isAttackEffectVisible = false; // 動畫播放完畢，隱藏特效
    }
  }

  // --- 【修改】優先處理測驗結束邏輯 ---
  if (isQuizActive && currentQuestionIndex >= QUIZ_QUESTIONS.length) {
      const finalScore = score;
      // 【修改】移除此處強制停止橘貓的邏輯，讓未互動的角色自由移動

      if (!quizEndText) { // 只設定一次結束文字
        // 【新增】計算智慧之果燈燈獎勵
        let lightsEarnedThisRun = 0;
        if (finalScore >= 4) { // 5題中答對4題以上 (80分)
            lightsEarnedThisRun = 2;
        } else {
            lightsEarnedThisRun = 1;
        }
        
        let newLights = 0;
        if (lightsEarnedThisRun > maxLightsFromCat) {
            newLights = lightsEarnedThisRun - maxLightsFromCat;
            wisdomLights += newLights;
            maxLightsFromCat = lightsEarnedThisRun;
        }

        let rewardMsg = "";
        if (newLights > 0) {
            rewardMsg = `\n恭喜！你獲得了 ${newLights} 個神奇芝識起司燈燈！`;
        } else if (maxLightsFromCat === 2) {
            rewardMsg = `\n你已經拿滿這裡的燈燈囉！`;
        } else {
            rewardMsg = `\n再接再厲，答對 4 題以上可以拿滿 2 個燈燈喔！`;
        }

        quizEndText = `測驗結束! 喵～你總共答對了 ${finalScore} 題。${rewardMsg}`;
        isQuizActive = false; // 標記測驗邏輯結束
        gameMode = 'quizEnd'; // 切換到測驗結束畫面狀態
      }
  }

  // 【修改】計算並更新全域的 isPlayerNearOrangeCat 狀態
  const orangeCatProximityThreshold = (drawW / 2) + (ORANGE_CAT_FRAME_W * ORANGE_CAT_SCALE / 2) + 30;
  isPlayerNearOrangeCat = dist(playerX, playerY, orangeCatX, orangeCatY) < orangeCatProximityThreshold;

  // 【新增】計算並更新全域的 isPlayerNearXiaoHong 狀態
  const xiaoHongProximityThreshold = (drawW / 2) + (XIAO_HONG_FRAME_W * XIAO_HONG_SCALE / 2) + 30;
  isPlayerNearXiaoHong = dist(playerX, playerY, xiaoHongX, xiaoHongY) < xiaoHongProximityThreshold;

  // 【新增】計算並更新全域的 isPlayerNearJiuJiu 狀態 (雖然啾啾在天上，但可以設定一個較大的互動範圍)
  // 這裡主要用於探索模式下的對話，測驗中的提示是透過按鈕觸發
  isPlayerNearJiuJiu = dist(playerX, playerY, jiuJiuX, jiuJiuY) < 200; 

  // --- 【新增】起司精靈與起司雨邏輯 ---
  
  // 1. 檢查是否集滿 3 個燈，且精靈尚未出現過
  if (wisdomLights >= 3 && cheeseSpiritState === 'hidden') {
    cheeseSpiritState = 'visible';
    // 確保位置在畫面中央
    cheeseSpiritX = width / 2;
    cheeseSpiritY = height / 2 - 100; // 【修改】將起司精靈高度調高
  }

  // 2. 繪製起司精靈
  if (cheeseSpiritState === 'visible' && cheeseSpiritSprite) {
    push();
    translate(cheeseSpiritX, cheeseSpiritY);
    // 簡單的懸浮動畫
    let floatY = sin(frameCount * 0.05) * 20; // 【修改】加大懸浮幅度
    translate(0, floatY);
    
    imageMode(CENTER);
    // 設定為精靈的一半大小 (精靈是 4 倍放大)
    const spiritW = (FRAME_W * 4) / 2;
    const spiritH = (FRAME_H * 4) / 2;
    image(cheeseSpiritSprite, 0, 0, spiritW, spiritH);
    pop();

    // 3. 檢查碰撞 (與精靈 playerX, playerY)
    // 簡單距離判斷
    if (dist(playerX, playerY, cheeseSpiritX, cheeseSpiritY) < 100) {
      cheeseSpiritState = 'collected';
      isCheeseRaining = true;
    }
  }

  // 4. 起司雨特效
  if (isCheeseRaining) {
    // 每隔幾幀產生新的起司
    if (frameCount % 5 === 0) {
      cheeseRainDrops.push({
        x: random(width),
        y: -50,
        size: random(20, 40),
        speed: random(4, 8),
        rotation: random(TWO_PI),
        rotSpeed: random(-0.1, 0.1)
      });
    }

    // 更新並繪製起司
    for (let i = cheeseRainDrops.length - 1; i >= 0; i--) {
      let drop = cheeseRainDrops[i];
      drop.y += drop.speed;
      drop.rotation += drop.rotSpeed;

      push();
      translate(drop.x, drop.y);
      rotate(drop.rotation);
      fill(255, 215, 0); // 起司黃
      stroke(255, 165, 0); // 橘色邊框
      strokeWeight(2);
      // 繪製三角形起司
      triangle(0, -drop.size/2, -drop.size/2, drop.size/2, drop.size/2, drop.size/2);
      // 畫個小圓孔
      fill(255, 230, 100);
      noStroke();
      ellipse(0, 5, drop.size/4);
      pop();

      // 移除超出畫面的起司
      if (drop.y > height + 50) {
        cheeseRainDrops.splice(i, 1);
      }
    }
  }

  // 4. 繪製對話/測驗介面 (在最上層)
  // 【修改】將 UI 繪製邏輯分離，允許多個對話框同時判斷

  // 優先權 1: 遊戲結束/勝利畫面 (獨佔)
  if (gameMode === 'gameOver') {
    drawGameOverScreen();
    return; // 結束 draw 函式，不繪製其他 UI
  } else if (gameMode === 'victory') {
    drawVictoryScreen();
    return; // 結束 draw 函式，不繪製其他 UI
  }

  // 優先權 2: 橘貓的對話框
  if (isPlayerNearOrangeCat && (gameMode === 'explore' || gameMode === 'quizEnd' || isQuizActive)) {
    if (healState === 'idle') {
      // 【新增】如果收集到起司，改為誇獎狀態
      if (cheeseSpiritState === 'collected') healState = 'praising';
      else healState = 'asking'; // 如果靠近且閒置，則開始詢問
    }
    // 【修改】如果狀態不是 dismissed (被玩家關閉)，才顯示對話
    if (healState !== 'dismissed') drawOrangeCatDialogue();
  } else {
    healState = 'idle'; // 離開橘貓時重置狀態
  }

  // 優先權 3: 小紅的對話框 (新增)
  // 觸發對話：靠近且閒置
  if (isPlayerNearXiaoHong && xiaoHongState === 'idle' && (gameMode === 'explore' || gameMode === 'quizEnd')) {
    // 【新增】如果收集到起司，改為誇獎狀態
    if (cheeseSpiritState === 'collected') xiaoHongState = 'praising';
    else xiaoHongState = 'request_help';
  }
  
  // 離開時重置：只有在「已關閉」狀態下離開，才重置為 idle (讓玩家可以重新觸發)
  if (!isPlayerNearXiaoHong && xiaoHongState === 'dismissed') {
    xiaoHongState = 'idle';
    currentXiaoHongQuestion = null;
  }

  // 繪製對話：只要狀態是活動中 (非 idle 且 非 dismissed)，就顯示
  if (xiaoHongState !== 'idle' && xiaoHongState !== 'dismissed') {
    drawXiaoHongDialogue();
  }

  // 優先權 3.5: 啾啾的提示對話框 (新增)
  if (isPlayerNearJiuJiu && jiuJiuState !== 'dismissed') {
    // 【新增】如果收集到起司，顯示誇獎
    if (cheeseSpiritState === 'collected') {
      drawJiuJiuPraise();
    } else if (gameMode === 'explore') {
      // 如果小紅正在問問題，顯示小紅的提示，否則顯示閒聊
      if (xiaoHongState === 'asking') drawJiuJiuDialogue();
      else drawJiuJiuIdleDialogue(); 
    } else if (gameMode === 'quiz') {
      drawJiuJiuDialogue(); // 【新增】測驗模式下靠近直接顯示提示
    }
  }

  // 優先權 4: 紫色戰鬥貓的對話框
  if (isPlayerNear && !isQuizActive && !quizEndText && !isPlayerNearXiaoHong && !isPlayerNearJiuJiu) { // 避免重疊
    // 【修改】如果沒有被手動關閉，才顯示提示
    if (!isPurpleCatDismissed) {
      // 【新增】如果收集到起司，顯示誇獎
      if (cheeseSpiritState === 'collected') drawPurpleCatPraise();
      else drawStartPrompt();
    }
  } else if (isQuizActive) {
    if (quizState === 'asking') {
      drawQuestion();
    } else if (quizState === 'answered') {
      drawAnswerResult();
    } else if (quizState === 'showingExplanation') {
      drawExplanation();
    }
  } else if (quizEndText) {
    drawQuizEnd();
  } else {
    // 離開紫色貓咪範圍時，重置關閉狀態
    isPurpleCatDismissed = false;
  }
}

function mousePressed() {
  // 【新增】勝利畫面點擊任意處重整網頁
  if (gameMode === 'victory') {
    window.location.reload();
    return;
  }

  // 【新增】遊戲失敗畫面點擊重新開始 (移到最上方優先處理)
  if (gameMode === 'gameOver') {
    const btnRestart = restartGameButton;
    if (mouseX > btnRestart.x && mouseX < btnRestart.x + btnRestart.w && mouseY > btnRestart.y && mouseY < btnRestart.y + btnRestart.h) {
      window.location.reload();
    }
    return;
  }

  // 【新增】檢查是否點擊了蒐集完成後的重新遊玩按鈕
  if (wisdomLights >= 3) {
    if (mouseX > replaySymbolButton.x && mouseX < replaySymbolButton.x + replaySymbolButton.w &&
        mouseY > replaySymbolButton.y && mouseY < replaySymbolButton.y + replaySymbolButton.h) {
      window.location.reload();
      return;
    }
  }

  // 【修改】檢查是否點擊了任一對話框的關閉按鈕 (X)
  let isCloseClicked = false;
  for (let btn of activeCloseButtons) {
    if (mouseX > btn.x && mouseX < btn.x + btn.w && mouseY > btn.y && mouseY < btn.y + btn.h) {
      isCloseClicked = true;
      break;
    }
  }

  if (isCloseClicked) {
    // 1. 關閉橘貓對話
    if (healState !== 'idle') healState = 'dismissed';
    
    // 2. 關閉小紅對話
    if (xiaoHongState !== 'idle') xiaoHongState = 'dismissed';

    // 3. 關閉啾啾對話
    if (jiuJiuState !== 'idle') jiuJiuState = 'dismissed';

    // 3. 關閉紫色貓咪提示
    if (isPlayerNear) isPurpleCatDismissed = true;

    // 4. 終止測驗或結束畫面，回到探索模式
    if (gameMode === 'quiz' || gameMode === 'quizEnd') {
      gameMode = 'explore';
      isQuizActive = false;
      quizEndText = '';
      quizState = 'asking';
      currentQuestionIndex = 0;
      score = 0;
      playerHP = PLAYER_MAX_HP; // 視需求決定是否回滿血或保持
    }
    return; // 點擊了關閉按鈕後，不再觸發其他按鈕
  }

  // 【修改】將橘貓的對話點擊判斷獨立出來，確保它總能被檢查
  if (isPlayerNearOrangeCat && (gameMode === 'explore' || gameMode === 'quizEnd' || isQuizActive)) {
    if (healState === 'asking') {
      const btnYes = healYesButton;
      if (mouseX > btnYes.x && mouseX < btnYes.x + btnYes.w && mouseY > btnYes.y && mouseY < btnYes.y + btnYes.h) {
        playerHP = min(playerHP + 10, PLAYER_MAX_HP); // 增加 10 點 HP，但不超過最大值
        healResponseText = "幫你回了 10 滴血喵～";
        healState = 'answered';
        return; // 處理完點擊後，提前結束函式，避免觸發其他按鈕
      }
      const btnNo = healNoButton;
      if (mouseX > btnNo.x && mouseX < btnNo.x + btnNo.w && mouseY > btnNo.y && mouseY < btnNo.y + btnNo.h) {
        healResponseText = "好的喵喵";
        healState = 'declined';
        return; // 處理完點擊後，提前結束函式
      }
    } else if (healState === 'answered' || healState === 'declined' || healState === 'praising') { // 【新增】處理誇獎狀態的關閉
      const btnClose = closeButton;
      if (mouseX > btnClose.x && mouseX < btnClose.x + btnClose.w && mouseY > btnClose.y && mouseY < btnClose.y + btnClose.h) {
        healState = 'idle'; // 結束對話
        return; // 處理完點擊後，提前結束函式
      }
    }
  }

  // 【新增】小紅的對話點擊判斷
  // 只要對話框顯示中 (狀態非 idle/dismissed) 或是靠近觸發了，就允許點擊
  if ((isPlayerNearXiaoHong || (xiaoHongState !== 'idle' && xiaoHongState !== 'dismissed')) && (gameMode === 'explore' || gameMode === 'quizEnd')) {
    if (xiaoHongState === 'request_help') { // 【新增】處理請求協助的按鈕
      // 選項 1: 好啊
      const btn1 = xiaoHongOpt1Button;
      if (mouseX > btn1.x && mouseX < btn1.x + btn1.w && mouseY > btn1.y && mouseY < btn1.y + btn1.h) {
        prepareXiaoHongQuestions(); // 【新增】準備隨機題目
        xiaoHongState = 'asking'; // 答應後進入測驗
        return;
      }
      // 選項 2: 不要
      const btn2 = xiaoHongOpt2Button;
      if (mouseX > btn2.x && mouseX < btn2.x + btn2.w && mouseY > btn2.y && mouseY < btn2.y + btn2.h) {
        xiaoHongState = 'emotional_blackmail'; // 拒絕後進入情緒勒索
        return;
      }
    } else if (xiaoHongState === 'asking') {
      // Check 4 buttons
      const buttons = [xiaoHongOpt1Button, xiaoHongOpt2Button, xiaoHongOpt3Button, xiaoHongOpt4Button];
      for (let i = 0; i < buttons.length; i++) {
        const btn = buttons[i];
        if (mouseX > btn.x && mouseX < btn.x + btn.w && mouseY > btn.y && mouseY < btn.y + btn.h) {
           if (currentXiaoHongQuestion && btn.text.includes(`(${currentXiaoHongQuestion.correctAnswer})`)) {
             xiaoHongState = 'correct';
           } else {
             xiaoHongState = 'wrong';
             playerHP = max(0, playerHP - 10);
           }
           return;
        }
      }
    } else if (xiaoHongState === 'correct' || xiaoHongState === 'wrong') {
      const btnClose = closeButton;
      if (mouseX > btnClose.x && mouseX < btnClose.x + btnClose.w && mouseY > btnClose.y && mouseY < btnClose.y + btnClose.h) {
        // 【修改】檢查是否還有下一題
        xiaoHongQuestionIndex++;
        if (xiaoHongQuestionIndex < xiaoHongQuestionQueue.length) {
          currentXiaoHongQuestion = xiaoHongQuestionQueue[xiaoHongQuestionIndex];
          xiaoHongState = 'asking';
        } else {
          xiaoHongState = 'post_quiz'; // 沒有題目了，進入結束狀態
          
          // 【新增】小紅獎勵邏輯 (完成兩題即獲得 1 燈)
          if (!hasCollectedXiaoHongReward) {
              wisdomLights++;
              hasCollectedXiaoHongReward = true;
          }
        }
        return;
      }
    } else if (xiaoHongState === 'praising') { // 【新增】處理誇獎狀態的關閉
      const btnClose = closeButton;
      if (mouseX > btnClose.x && mouseX < btnClose.x + btnClose.w && mouseY > btnClose.y && mouseY < btnClose.y + btnClose.h) {
        xiaoHongState = 'dismissed';
        return;
      }
    } else if (xiaoHongState === 'post_quiz') {
      // 選項 1: 重新作答
      const btn1 = xiaoHongOpt1Button;
      if (mouseX > btn1.x && mouseX < btn1.x + btn1.w && mouseY > btn1.y && mouseY < btn1.y + btn1.h) {
        prepareXiaoHongQuestions(); // 【新增】重新準備題目
        xiaoHongState = 'asking';
        return;
      }
      // 選項 2: 去找別人
      const btn2 = xiaoHongOpt2Button;
      if (mouseX > btn2.x && mouseX < btn2.x + btn2.w && mouseY > btn2.y && mouseY < btn2.y + btn2.h) {
        xiaoHongState = 'emotional_blackmail'; // 觸發情緒勒索
        return;
      }
    } else if (xiaoHongState === 'emotional_blackmail') {
      const btnClose = closeButton;
      if (mouseX > btnClose.x && mouseX < btnClose.x + btnClose.w && mouseY > btnClose.y && mouseY < btnClose.y + btnClose.h) {
        xiaoHongState = 'dismissed'; // 改為 dismissed，避免如果還在附近會立刻重新觸發
        return;
      }
    }
  }

  if (isQuizActive) {
    if (quizState === 'asking') {
      // 檢查是否點擊了選項按鈕
      for (let i = 0; i < quizButtons.length; i++) {
        const btn = quizButtons[i];
        if (mouseX > btn.x && mouseX < btn.x + btn.w && mouseY > btn.y && mouseY < btn.y + btn.h) {
          checkAnswer(btn.answer);
          return;
        }
      }
    } else if (quizState === 'answered') {
      // 檢查是否點擊了「下一題」按鈕
      const btn = viewExplanationButton;
      if (mouseX > btn.x && mouseX < btn.x + btn.w && mouseY > btn.y && mouseY < btn.y + btn.h) {
        quizState = 'showingExplanation';
      }
    } else if (quizState === 'showingExplanation') {
      // 檢查是否點擊了「下一題」按鈕
      const btn = nextButton;
      if (mouseX > btn.x && mouseX < btn.x + btn.w && mouseY > btn.y && mouseY < btn.y + btn.h) {
        currentQuestionIndex++;
        quizState = 'asking'; // 切換回提問狀態
      }
    }
  } else if (!isQuizActive && !quizEndText) { // 【修改】移除 isPlayerNear 條件
    // 檢查是否點擊了「開始測驗」按鈕
    const btn = startButton;
    if (mouseX > btn.x && mouseX < btn.x + btn.w && mouseY > btn.y && mouseY < btn.y + btn.h) {
      // 讓貓咪面向精靈
      char2FlipH = (playerX > char2X);

      isQuizActive = true;
      gameMode = 'quiz';
      quizState = 'asking';
    }
  } else if (quizEndText) { // 【新增】處理測驗結束後的按鈕點擊
    // 檢查是否點擊「重新作答」
    const btnRestart = restartQuizButton;
    if (mouseX > btnRestart.x && mouseX < btnRestart.x + btnRestart.w && mouseY > btnRestart.y && mouseY < btnRestart.y + btnRestart.h) {
      // 重置所有測驗相關變數
      isQuizActive = true;
      currentQuestionIndex = 0;
      score = 0;
      playerHP = PLAYER_MAX_HP; // 血量回滿
      quizState = 'asking';
      quizEndText = ''; // 清除結束文字
      gameMode = 'quiz';
    }

    // 檢查是否點擊「打架遊戲」
    const btnFight = startFightButton;
    if (mouseX > btnFight.x && mouseX < btnFight.x + btnFight.w && mouseY > btnFight.y && mouseY < btnFight.y + btnFight.h) {
      gameMode = 'fight'; // 【修改】切換到打架遊戲模式
      quizEndText = ''; // 清除結束對話框
    }
  }
}

function checkAnswer(selectedOpt) {
  const q = QUIZ_QUESTIONS[currentQuestionIndex];
  const correctAnswer = q.options.find(opt => opt.includes(`(${q.correctAnswer})`));

  if (selectedOpt.includes(`(${q.correctAnswer})`)) {
    feedbackText = `答對了喵！真厲害！`;
    score++;
  } else {
    feedbackText = `答錯了喵... 正確答案是 ${correctAnswer}`;
    playerHP = max(0, playerHP - 20); // 確保血量不會變成負數
  }
  quizState = 'answered';
}

// --- 繪圖輔助函式 ---

function drawStartPrompt() {
  const owner = { x: char2X, y: char2Y, drawH: char2ImgDefault.height * CHAR2_SCALE };
  const bubbleText = "想挑戰【日常常識小測驗】嗎?";
  drawBubble(owner, bubbleText, [startButton]);
}

function drawXiaoHongDialogue() {
  const owner = { x: xiaoHongX, y: xiaoHongY, drawH: XIAO_HONG_FRAME_H * XIAO_HONG_SCALE };
  
  if (xiaoHongState === 'praising') { // 【新增】誇獎對話
    closeButton.text = "謝謝！";
    drawBubble(owner, "天啊！這就是傳說中的起司！\n你真棒！", [closeButton]);
  } else if (xiaoHongState === 'request_help') { // 【新增】請求協助對話
    const text = "精靈...拜託...我真的好無助...\n你能幫幫我嗎？";
    xiaoHongOpt1Button.text = "好啊";
    xiaoHongOpt2Button.text = "不要";
    drawBubble(owner, text, [xiaoHongOpt1Button, xiaoHongOpt2Button]);
  } else if (xiaoHongState === 'asking') {
    // 【修改】顯示目前題數
    const questionText = `小紅問 (${xiaoHongQuestionIndex + 1}/${xiaoHongQuestionQueue.length})：\n` + currentXiaoHongQuestion.question;
    xiaoHongOpt1Button.text = currentXiaoHongQuestion.options[0];
    xiaoHongOpt2Button.text = currentXiaoHongQuestion.options[1];
    xiaoHongOpt3Button.text = currentXiaoHongQuestion.options[2];
    xiaoHongOpt4Button.text = currentXiaoHongQuestion.options[3];
    drawBubble(owner, questionText, [xiaoHongOpt1Button, xiaoHongOpt2Button, xiaoHongOpt3Button, xiaoHongOpt4Button]);
  } else if (xiaoHongState === 'correct') {
    closeButton.text = "下一步";
    drawBubble(owner, "答對了！你真聰明！", [closeButton]);
  } else if (xiaoHongState === 'wrong') {
    closeButton.text = "下一步";
    drawBubble(owner, "答錯囉... 扣 10 滴血！", [closeButton]);
  } else if (xiaoHongState === 'post_quiz') {
    let text = "你要重新做答還是去找別人？";
    // 【新增】顯示獲得獎勵的提示
    if (hasCollectedXiaoHongReward) {
        text = "恭喜完成！獲得神奇芝識起司燈燈！\n" + text;
    }
    xiaoHongOpt1Button.text = "重新做答";
    xiaoHongOpt2Button.text = "去找別人";
    drawBubble(owner, text, [xiaoHongOpt1Button, xiaoHongOpt2Button]);
  } else if (xiaoHongState === 'emotional_blackmail') {
    closeButton.text = "好啦對不起...";
    drawBubble(owner, "嗚嗚...你竟然要丟下我...\n難道我對你來說一點都不重要嗎？\n我會一直這在這裡等你的...", [closeButton]);
  }
}

function drawJiuJiuDialogue() {
  const owner = { x: jiuJiuX, y: jiuJiuY, drawH: JIU_JIU_FRAME_H * JIU_JIU_SCALE };
  let hintText = "這題我也不太確定，加油！";

  if (gameMode === 'quiz') {
    const q = QUIZ_QUESTIONS[currentQuestionIndex];
    if (q && q.hint) hintText = q.hint;
  } else if (xiaoHongState === 'asking' && currentXiaoHongQuestion) {
    // 如果是小紅正在問問題
    if (currentXiaoHongQuestion.hint) hintText = currentXiaoHongQuestion.hint;
  }

  drawBubble(owner, hintText, [], false, color(255, 255, 200, 230)); // 【修改】設定背景為淡黃色
}

function drawJiuJiuIdleDialogue() {
  const owner = { x: jiuJiuX, y: jiuJiuY, drawH: JIU_JIU_FRAME_H * JIU_JIU_SCALE };
  const text = "我是啾啾！\n如果在測驗中遇到困難，\n可以點擊按鈕找我幫忙喔！";
  drawBubble(owner, text, [], false, color(255, 255, 200, 230)); // 【修改】設定背景為淡黃色
}

// 【新增】啾啾的誇獎對話
function drawJiuJiuPraise() {
  const owner = { x: jiuJiuX, y: jiuJiuY, drawH: JIU_JIU_FRAME_H * JIU_JIU_SCALE };
  drawBubble(owner, "啾啾！起司看起來好好吃！\n你做到了！", [closeButton], true, color(255, 255, 200, 230));
}

function drawOrangeCatDialogue() {
  const owner = { x: orangeCatX, y: orangeCatY, drawH: ORANGE_CAT_FRAME_H * ORANGE_CAT_SCALE };
  if (healState === 'praising') { // 【新增】誇獎對話
    closeButton.text = "謝謝喵！";
    drawBubble(owner, "哇！你真的找到神奇芝識起司了！\n太厲害了喵！", [closeButton]);
  } else if (healState === 'asking') {
    const bubbleText = "喵～看起來你有點累了，需要回血嗎？";
    drawBubble(owner, bubbleText, [healYesButton, healNoButton]);
  } else if (healState === 'answered' || healState === 'declined') {
    closeButton.text = (healState === 'answered') ? "謝謝你喵！" : "好的喵";
    drawBubble(owner, healResponseText, [closeButton]);
  }
}

// 【新增】黑喵的誇獎對話
function drawPurpleCatPraise() {
  const owner = { x: char2X, y: char2Y, drawH: char2ImgDefault.height * CHAR2_SCALE };
  closeButton.text = "哼...";
  drawBubble(owner, "哼... 沒想到你真的找到了...\n算你厲害。", [closeButton]);
}

function drawQuestion() {
  const q = QUIZ_QUESTIONS[currentQuestionIndex];
  quizButtons = [];
  for(let i = 0; i < q.options.length; i++) {
    quizButtons.push({ x: 0, y: 0, w: 0, h: 0, text: q.options[i], answer: q.options[i] });
  }

  const owner = { x: char2X, y: char2Y, drawH: char2ImgDefault.height * CHAR2_SCALE };
  drawBubble(owner, q.question, quizButtons);
}

function drawAnswerResult() {
  const owner = { x: char2X, y: char2Y, drawH: char2ImgDefault.height * CHAR2_SCALE };
  drawBubble(owner, feedbackText, [viewExplanationButton]);
}

function drawExplanation() {
  const q = QUIZ_QUESTIONS[currentQuestionIndex];
  const owner = { x: char2X, y: char2Y, drawH: char2ImgDefault.height * CHAR2_SCALE };
  drawBubble(owner, `${feedbackText}\n\n${q.explanation}`, [nextButton]);
}

function drawQuizEnd() {
    const finalText = `${quizEndText}\n\n接下來要做什麼喵？`;
    const owner = { x: char2X, y: char2Y, drawH: char2ImgDefault.height * CHAR2_SCALE };
    drawBubble(owner, finalText, [restartQuizButton, startFightButton]);
}

function drawGameOverScreen() {
  // 繪製半透明黑色背景
  fill(0, 0, 0, 150);
  rect(0, 0, width, height);

  // 繪製文字和按鈕
  const owner = { x: width / 2, y: height / 2, drawH: 0 }; // 讓泡泡在畫面中央
  drawBubble(owner, "遊戲失敗...", [restartGameButton]);
}

function drawVictoryScreen() {
  // 繪製半透明金色背景
  fill(255, 215, 0, 150);
  rect(0, 0, width, height);

  // 繪製勝利文字
  push();
  fill(255);
  stroke(0);
  strokeWeight(5);
  textSize(80);
  textAlign(CENTER, CENTER);
  text("你贏了！", width / 2, height / 2);

  textSize(30);
  strokeWeight(3);
  text("點擊任意處重新開始", width / 2, height / 2 + 80);
  pop();
}

function resetGame() {
  playerHP = PLAYER_MAX_HP;
  catHP = CAT_MAX_HP;
  gameMode = 'explore';
  quizEndText = '';
  isQuizActive = false;
}

function drawBubble(owner, mainText, buttons = [], showCloseButton = true, bgColor = null) {
  const bubblePadding = 20;
  const bubbleYOffset = 120;
  const bubbleTailSize = 15;
  const buttonH = 35;
  const buttonGap = 10;
  const lineSpacing = 28;

  push();
  textSize(18);
  textAlign(CENTER, TOP);

  // --- 計算尺寸 ---
  let maxTextWidth = textWidth(mainText.split('\n')[0]);
  for (const line of mainText.split('\n')) {
    maxTextWidth = max(maxTextWidth, textWidth(line));
  }
  for (const btn of buttons) {
    maxTextWidth = max(maxTextWidth, textWidth(btn.text) + 2 * bubblePadding);
  }

  const textHeight = mainText.split('\n').length * lineSpacing;
  const buttonsHeight = buttons.length * (buttonH + buttonGap);
  const bubbleWidth = maxTextWidth + bubblePadding * 2;
  const bubbleHeight = textHeight + buttonsHeight + bubblePadding * 2.5;
  
  // 定義關閉按鈕尺寸與間距
  const closeBtnSize = 30;
  const closeBtnGap = 5;

  // 【修改】讓遊戲結束的對話框顯示在畫面中央
  let bubbleX, bubbleY;
  if (gameMode === 'gameOver') {
    bubbleX = width / 2 - bubbleWidth / 2;
    bubbleY = height / 2 - bubbleHeight / 2;
  } else {
    bubbleX = owner.x - bubbleWidth / 2;
    bubbleY = owner.y - bubbleYOffset - owner.drawH / 2 - bubbleHeight / 2;

    // 【新增】防止對話框超出畫面邊界
    const screenPadding = 10; // 畫面邊緣保留 10px 的距離
    // 【修改】考慮外部按鈕的寬度，調整 X 軸限制，避免按鈕跑出畫面
    let rightBound = width - bubbleWidth - screenPadding;
    if (showCloseButton) {
      rightBound -= (closeBtnSize + closeBtnGap);
    }
    bubbleX = constrain(bubbleX, screenPadding, rightBound);
    bubbleY = constrain(bubbleY, screenPadding, height - bubbleHeight - screenPadding);
  }

  // --- 繪製泡泡主體 ---
  if (bgColor) {
    fill(bgColor);
  } else {
    fill(255, 255, 255, 230); // 預設為半透明白色
  }
  stroke(50, 50, 70);
  strokeWeight(3);
  rect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, 25);
  // 只有非遊戲結束時才畫尾巴
  if (gameMode !== 'gameOver') {
    triangle(
      owner.x - bubbleTailSize, bubbleY + bubbleHeight - 2,
      owner.x + bubbleTailSize, bubbleY + bubbleHeight - 2,
      owner.x, bubbleY + bubbleHeight + bubbleTailSize
    );
  }

  // --- 繪製文字 ---
  fill(0);
  noStroke();
  text(mainText, bubbleX + bubbleWidth / 2, bubbleY + bubblePadding);

  // --- 【修改】繪製關閉按鈕 (X) ---
  // 改為繪製在對話框外部 (右側)
  // 只有非遊戲失敗時才畫關閉按鈕
  if (gameMode !== 'gameOver' && showCloseButton) {
    const closeBtnX = bubbleX + bubbleWidth + closeBtnGap;
    const closeBtnY = bubbleY;
    
    push(); // 使用 push/pop 避免影響後續文字樣式
    fill(255, 100, 100); // 紅色背景
    stroke(200, 50, 50);
    rect(closeBtnX, closeBtnY, closeBtnSize, closeBtnSize, 5);
    fill(255);
    noStroke();
    textSize(20);
    textAlign(CENTER, CENTER);
    text("✕", closeBtnX + closeBtnSize / 2, closeBtnY + closeBtnSize / 2); 
    pop();
    
    // 記錄關閉按鈕區域供 mousePressed 使用 (加入陣列)
    activeCloseButtons.push({ x: closeBtnX, y: closeBtnY, w: closeBtnSize, h: closeBtnSize });

    // 加入滑鼠懸停效果
    if (mouseX > closeBtnX && mouseX < closeBtnX + closeBtnSize && mouseY > closeBtnY && mouseY < closeBtnY + closeBtnSize) {
      cursor(HAND);
    }
  }

  // 如果沒有按鈕，就不用繼續繪製
  if (buttons.length === 0) {
    pop();
    return;
  }
  // --- 繪製按鈕 ---
  let currentButtonY = bubbleY + textHeight + bubblePadding * 1.5;
  for (let i = 0; i < buttons.length; i++) {
    const btn = buttons[i];
    btn.w = textWidth(btn.text) + bubblePadding;
    btn.h = buttonH;
    btn.x = bubbleX + bubbleWidth / 2 - btn.w / 2;
    btn.y = currentButtonY;

    let isHovering = (mouseX > btn.x && mouseX < btn.x + btn.w && mouseY > btn.y && mouseY < btn.y + btn.h);
    if (isHovering) {
      fill(220, 240, 255);
      stroke(0, 100, 200);
      cursor(HAND);
    } else {
      fill(255);
      stroke(100);
    }
    strokeWeight(1.5);
    rect(btn.x, btn.y, btn.w, btn.h, 10);

    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    text(btn.text, btn.x + btn.w / 2, btn.y + btn.h / 2);

    currentButtonY += buttonH + buttonGap;
  }
  if (!buttons.some(b => mouseX > b.x && mouseX < b.x + b.w && mouseY > b.y && mouseY < b.y + b.h)) {
      cursor(ARROW);
  }
  pop();
}

// 【新增】繪製神奇芝識起司蒐集介面
function drawWisdomFruitUI() {
  push();
  textAlign(CENTER, TOP);
  textSize(20);
  fill(255);
  stroke(0);
  strokeWeight(3);
  text("神奇芝識起司蒐集", width / 2, 10);

  const startX = width / 2 - 40;
  const y = 55; // 【修改】將燈號位置稍微往下移，增加與標題的間距
  const gap = 40;
  const size = 30;

  for (let i = 0; i < 3; i++) {
    stroke(255);
    strokeWeight(2);
    if (i < wisdomLights) {
      // 燈亮 (金黃色 + 發光效果)
      fill(255, 215, 0);
      drawingContext.shadowBlur = 15;
      drawingContext.shadowColor = 'yellow';
    } else {
      // 燈暗 (半透明黑)
      fill(0, 0, 0, 100);
      drawingContext.shadowBlur = 0;
    }
    ellipse(startX + i * gap, y, size);
  }
  
  drawingContext.shadowBlur = 0; // 重置陰影，避免影響其他繪圖

  // 如果集滿 3 個
  if (wisdomLights >= 3) {
     textSize(28); // 【修改】字體變大
     let msg = "已獲得神奇芝識起司！";
     let txtW = textWidth(msg);

     // 【修改】白底
     rectMode(CENTER);
     fill(255);
     noStroke();
     rect(width / 2, y + 35 + 14, txtW + 30, 50, 10);

     // 【修改】紅字
     fill(255, 0, 0);
     text(msg, width / 2, y + 35);

     // 【新增】繪製重新遊玩按鈕
     let btnY = y + 35 + 14 + 25 + 10; // 文字框下方 10px
     replaySymbolButton.x = width / 2 - replaySymbolButton.w / 2;
     replaySymbolButton.y = btnY;

     rectMode(CORNER); // 切換回 CORNER 模式以繪製按鈕
     fill(255);
     stroke(0);
     strokeWeight(2);
     rect(replaySymbolButton.x, replaySymbolButton.y, replaySymbolButton.w, replaySymbolButton.h, 10);

     fill(0);
     noStroke();
     textSize(20);
     textAlign(CENTER, CENTER);
     text(replaySymbolButton.text, replaySymbolButton.x + replaySymbolButton.w / 2, replaySymbolButton.y + replaySymbolButton.h / 2);
  }
  pop();
}

// 【新增】準備小紅的隨機題目
function prepareXiaoHongQuestions() {
  // 隨機打亂並選取 2 題
  let shuffled = XIAO_HONG_QUESTIONS.slice().sort(() => 0.5 - Math.random());
  xiaoHongQuestionQueue = shuffled.slice(0, 2);
  xiaoHongQuestionIndex = 0;
  currentXiaoHongQuestion = xiaoHongQuestionQueue[xiaoHongQuestionIndex];
}

function drawHealthBars() {
  const barWidth = 250;
  const barHeight = 25;
  const margin = 20;
  const nameYOffset = 22;
  const barYOffset = 30;

  push();
  // --- 精靈血量條 (左上角) ---
  // 名字
  fill(255);
  stroke(0);
  strokeWeight(3);
  textSize(18);
  textAlign(LEFT, BOTTOM);
  text("精靈", margin, margin + nameYOffset);

  // 血條背景
  fill(100, 0, 0); // 深紅色
  noStroke();
  rect(margin, margin + barYOffset, barWidth, barHeight, 5);

  // 當前血量
  const playerHPRatio = playerHP / PLAYER_MAX_HP;
  fill(100, 255, 100); // 亮綠色
  rect(margin, margin + barYOffset, barWidth * playerHPRatio, barHeight, 5);

  // 血量文字
  fill(255);
  textSize(16);
  textAlign(CENTER, CENTER);
  text(`${playerHP} / ${PLAYER_MAX_HP}`, margin + barWidth / 2, margin + barYOffset + barHeight / 2);

  // --- 貓咪血量條 (右上角) ---
  // 【修改】只有在戰鬥模式下才顯示黑喵血量條
  if (gameMode === 'fight') {
    // 名字
    fill(255);
    stroke(0);
    strokeWeight(3);
    textSize(18);
    textAlign(RIGHT, BOTTOM);
    text("黑喵", width - margin, margin + nameYOffset); // 【修改】名稱改為黑喵

    // 血條背景
    fill(100, 0, 0);
    noStroke();
    rect(width - margin - barWidth, margin + barYOffset, barWidth, barHeight, 5);

    // 當前血量
    const catHPRatio = catHP / CAT_MAX_HP;
    fill(100, 255, 100);
    rect(width - margin - barWidth, margin + barYOffset, barWidth * catHPRatio, barHeight, 5);
  }
  pop();
}