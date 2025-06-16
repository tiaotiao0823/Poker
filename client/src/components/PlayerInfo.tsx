import React from 'react';
import styled from 'styled-components';
import { Player } from '../types';
import Card from './Card';

interface PlayerInfoProps {
  player: Player;
  isCurrentPlayer: boolean;
  isDealer: boolean;
  isSmallBlind: boolean;
  isBigBlind: boolean;
}

const PlayerContainer = styled.div<{ isCurrentPlayer: boolean }>`
  padding: 15px;
  border-radius: 10px;
  background-color: ${props => props.isCurrentPlayer ? '#e3f2fd' : '#f5f5f5'};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const PlayerName = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const PlayerChips = styled.div`
  font-size: 16px;
  color: #2e7d32;
`;

const PlayerCards = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const PlayerStatus = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 14px;
  color: #666;
`;

const PlayerInfo: React.FC<PlayerInfoProps> = ({
  player,
  isCurrentPlayer,
  isDealer,
  isSmallBlind,
  isBigBlind,
}) => {
  const getStatusText = () => {
    if (isDealer) return '莊家';
    if (isSmallBlind) return '小盲';
    if (isBigBlind) return '大盲';
    return '';
  };

  return (
    <PlayerContainer isCurrentPlayer={isCurrentPlayer}>
      <PlayerName>{player.username}</PlayerName>
      <PlayerChips>籌碼: {player.chips}</PlayerChips>
      {player.currentBet > 0 && (
        <div>下注: {player.currentBet}</div>
      )}
      <PlayerCards>
        {player.cards.map((card, index) => (
          <Card
            key={index}
            card={card}
            faceDown={!isCurrentPlayer}
          />
        ))}
      </PlayerCards>
      <PlayerStatus>{getStatusText()}</PlayerStatus>
    </PlayerContainer>
  );
};

export default PlayerInfo; 