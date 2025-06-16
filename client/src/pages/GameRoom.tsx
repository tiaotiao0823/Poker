import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
} from '@mui/material';
import styled from 'styled-components';
import { wsService } from '../services/websocket';
import { game } from '../services/api';
import { GameState, Player, GameAction } from '../types';
import PlayerInfo from '../components/PlayerInfo';
import GameControls from '../components/GameControls';
import Card from '../components/Card';

const GameTable = styled(Paper)`
  padding: 20px;
  background-color: #1b5e20;
  min-height: 600px;
  position: relative;
`;

const CommunityCards = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
`;

const Pot = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
`;

const GameRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) return;

    // 連接 WebSocket
    wsService.connect();

    // 加入房間
    wsService.send({
      type: 'join_room',
      data: { roomId }
    });

    // 監聽遊戲狀態更新
    const handleGameState = (message: any) => {
      if (message.type === 'game_state_update') {
        setGameState(message.data);
      }
    };

    wsService.addMessageHandler(handleGameState);

    return () => {
      wsService.removeMessageHandler(handleGameState);
      wsService.send({
        type: 'leave_room',
        data: { roomId }
      });
      wsService.disconnect();
    };
  }, [roomId]);

  const handleGameAction = async (action: GameAction) => {
    if (!roomId) return;

    try {
      await game.action(roomId, action.type, action.amount);
    } catch (error) {
      console.error('遊戲動作失敗:', error);
    }
  };

  if (!gameState) {
    return (
      <Container>
        <Typography>載入中...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h1" gutterBottom>
            遊戲房間: {roomId}
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate('/lobby')}
          >
            返回大廳
          </Button>
        </Grid>

        <Grid item xs={12}>
          <GameTable>
            <CommunityCards>
              {gameState.communityCards.map((card, index) => (
                <Card key={index} card={card} />
              ))}
            </CommunityCards>

            <Pot>
              <Typography variant="h6">
                獎池: {gameState.pot}
              </Typography>
            </Pot>

            <Grid container spacing={2}>
              {Array.from(gameState.players.values()).map((player) => (
                <Grid item xs={12} sm={6} md={4} key={player.userId}>
                  <PlayerInfo
                    player={player}
                    isCurrentPlayer={player.userId === currentPlayer}
                    isDealer={player.position === gameState.dealerPosition}
                    isSmallBlind={player.position === (gameState.dealerPosition + 1) % gameState.players.size}
                    isBigBlind={player.position === (gameState.dealerPosition + 2) % gameState.players.size}
                  />
                </Grid>
              ))}
            </Grid>

            {currentPlayer && (
              <GameControls
                onAction={handleGameAction}
                currentBet={gameState.currentBet}
                minRaise={gameState.currentBet * 2}
                playerChips={gameState.players.get(currentPlayer)?.chips || 0}
                disabled={gameState.gamePhase === 'ended'}
              />
            )}
          </GameTable>
        </Grid>
      </Grid>
    </Container>
  );
};

export default GameRoom; 