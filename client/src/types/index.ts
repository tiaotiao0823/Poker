export interface User {
  username: string;
  chips: number;
}

export interface Card {
  suit: '♠' | '♥' | '♦' | '♣';
  value: string;
}

export interface Player {
  userId: string;
  username: string;
  chips: number;
  cards: Card[];
  isActive: boolean;
  hasFolded: boolean;
  currentBet: number;
  position: number;
}

export interface GameState {
  roomId: string;
  players: Map<string, Player>;
  communityCards: Card[];
  pot: number;
  currentBet: number;
  dealerPosition: number;
  currentPlayer: number;
  gamePhase: 'waiting' | 'preflop' | 'flop' | 'turn' | 'river' | 'showdown' | 'ended';
  smallBlind: number;
  bigBlind: number;
}

export interface Room {
  id: string;
  name: string;
  players: number;
  maxPlayers: number;
  smallBlind: number;
  bigBlind: number;
  status: 'waiting' | 'playing';
}

export interface GameAction {
  type: 'fold' | 'call' | 'raise';
  amount?: number;
}

export interface WebSocketMessage {
  type: 'join_room' | 'leave_room' | 'game_action' | 'player_joined' | 'player_left' | 'game_state_update';
  data: any;
} 