class PokerGame {
  constructor(roomId) {
    this.roomId = roomId;
    this.players = new Map(); // 玩家列表
    this.deck = []; // 牌組
    this.communityCards = []; // 公共牌
    this.pot = 0; // 獎池
    this.currentBet = 0; // 當前下注額
    this.dealerPosition = 0; // 莊家位置
    this.currentPlayer = 0; // 當前玩家位置
    this.gamePhase = 'waiting'; // 遊戲階段：waiting, preflop, flop, turn, river, showdown
    this.smallBlind = 5;
    this.bigBlind = 10;
  }

  // 初始化牌組
  initializeDeck() {
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    this.deck = [];
    
    for (let suit of suits) {
      for (let value of values) {
        this.deck.push({ suit, value });
      }
    }
    
    // 洗牌
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  // 添加玩家
  addPlayer(userId, username, chips) {
    if (this.players.size >= 9) {
      throw new Error('房間已滿');
    }
    
    this.players.set(userId, {
      username,
      chips,
      cards: [],
      isActive: true,
      hasFolded: false,
      currentBet: 0
    });
  }

  // 移除玩家
  removePlayer(userId) {
    this.players.delete(userId);
  }

  // 開始新的一局
  startNewHand() {
    if (this.players.size < 2) {
      throw new Error('需要至少兩名玩家才能開始遊戲');
    }

    this.initializeDeck();
    this.communityCards = [];
    this.pot = 0;
    this.currentBet = 0;
    this.gamePhase = 'preflop';

    // 發手牌
    for (let player of this.players.values()) {
      player.cards = [this.deck.pop(), this.deck.pop()];
      player.hasFolded = false;
      player.currentBet = 0;
    }

    // 收取盲注
    this.collectBlinds();
  }

  // 收取盲注
  collectBlinds() {
    const playerArray = Array.from(this.players.values());
    const smallBlindPos = (this.dealerPosition + 1) % playerArray.length;
    const bigBlindPos = (this.dealerPosition + 2) % playerArray.length;

    // 收取小盲注
    const smallBlindPlayer = playerArray[smallBlindPos];
    smallBlindPlayer.chips -= this.smallBlind;
    smallBlindPlayer.currentBet = this.smallBlind;
    this.pot += this.smallBlind;

    // 收取大盲注
    const bigBlindPlayer = playerArray[bigBlindPos];
    bigBlindPlayer.chips -= this.bigBlind;
    bigBlindPlayer.currentBet = this.bigBlind;
    this.pot += this.bigBlind;

    this.currentBet = this.bigBlind;
  }

  // 玩家行動
  playerAction(userId, action, amount = 0) {
    const player = this.players.get(userId);
    if (!player || !player.isActive || player.hasFolded) {
      throw new Error('無效的玩家行動');
    }

    switch (action) {
      case 'fold':
        player.hasFolded = true;
        break;
      case 'call':
        const callAmount = this.currentBet - player.currentBet;
        player.chips -= callAmount;
        player.currentBet = this.currentBet;
        this.pot += callAmount;
        break;
      case 'raise':
        if (amount <= this.currentBet) {
          throw new Error('加注金額必須大於當前下注額');
        }
        const raiseAmount = amount - player.currentBet;
        player.chips -= raiseAmount;
        player.currentBet = amount;
        this.pot += raiseAmount;
        this.currentBet = amount;
        break;
      default:
        throw new Error('無效的動作');
    }

    return this.checkGamePhase();
  }

  // 檢查遊戲階段
  checkGamePhase() {
    const activePlayers = Array.from(this.players.values()).filter(p => !p.hasFolded);
    
    if (activePlayers.length === 1) {
      // 只剩一名玩家，遊戲結束
      this.gamePhase = 'showdown';
      return this.endHand(activePlayers[0]);
    }

    // 檢查是否需要進入下一階段
    const allBetsEqual = activePlayers.every(p => p.currentBet === this.currentBet);
    if (allBetsEqual) {
      switch (this.gamePhase) {
        case 'preflop':
          this.gamePhase = 'flop';
          this.dealCommunityCards(3);
          break;
        case 'flop':
          this.gamePhase = 'turn';
          this.dealCommunityCards(1);
          break;
        case 'turn':
          this.gamePhase = 'river';
          this.dealCommunityCards(1);
          break;
        case 'river':
          this.gamePhase = 'showdown';
          return this.endHand();
      }
    }

    return {
      gamePhase: this.gamePhase,
      pot: this.pot,
      communityCards: this.communityCards
    };
  }

  // 發公共牌
  dealCommunityCards(count) {
    for (let i = 0; i < count; i++) {
      this.communityCards.push(this.deck.pop());
    }
  }

  // 結束當前局
  endHand(winner = null) {
    if (winner) {
      winner.chips += this.pot;
      return {
        winner: winner.username,
        pot: this.pot,
        gamePhase: 'ended'
      };
    }

    // TODO: 實現牌型比較邏輯
    return {
      gamePhase: 'ended',
      pot: this.pot
    };
  }
}

module.exports = PokerGame; 