import React from 'react';
import styled from 'styled-components';
import { Card as CardType } from '../types';

interface CardProps {
  card: CardType;
  faceDown?: boolean;
}

const CardContainer = styled.div<{ faceDown: boolean }>`
  width: 100px;
  height: 140px;
  border-radius: 10px;
  background-color: ${props => props.faceDown ? '#2c3e50' : 'white'};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: ${props => {
    if (props.faceDown) return 'white';
    return props.card.suit === '♥' || props.card.suit === '♦' ? 'red' : 'black';
  }};
  position: relative;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CardValue = styled.div`
  font-weight: bold;
  font-size: 28px;
`;

const CardSuit = styled.div`
  font-size: 36px;
`;

const Card: React.FC<CardProps> = ({ card, faceDown = false }) => {
  if (faceDown) {
    return (
      <CardContainer faceDown={true}>
        <div>🂠</div>
      </CardContainer>
    );
  }

  return (
    <CardContainer faceDown={false}>
      <CardValue>{card.value}</CardValue>
      <CardSuit>{card.suit}</CardSuit>
    </CardContainer>
  );
};

export default Card; 