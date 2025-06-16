import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, TextField } from '@mui/material';
import { GameAction } from '../types';

interface GameControlsProps {
  onAction: (action: GameAction) => void;
  currentBet: number;
  minRaise: number;
  playerChips: number;
  disabled?: boolean;
}

const ControlsContainer = styled.div`
  display: flex;
  gap: 10px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 10px;
  margin-top: 20px;
`;

const RaiseContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const GameControls: React.FC<GameControlsProps> = ({
  onAction,
  currentBet,
  minRaise,
  playerChips,
  disabled = false,
}) => {
  const [raiseAmount, setRaiseAmount] = useState(minRaise);

  const handleRaise = () => {
    if (raiseAmount >= minRaise && raiseAmount <= playerChips) {
      onAction({ type: 'raise', amount: raiseAmount });
    }
  };

  return (
    <ControlsContainer>
      <Button
        variant="contained"
        color="error"
        onClick={() => onAction({ type: 'fold' })}
        disabled={disabled}
      >
        棄牌
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => onAction({ type: 'call' })}
        disabled={disabled || currentBet === 0}
      >
        跟注
      </Button>
      <RaiseContainer>
        <TextField
          type="number"
          label="加注金額"
          value={raiseAmount}
          onChange={(e) => setRaiseAmount(Number(e.target.value))}
          disabled={disabled}
          inputProps={{
            min: minRaise,
            max: playerChips,
          }}
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={handleRaise}
          disabled={disabled || raiseAmount < minRaise || raiseAmount > playerChips}
        >
          加注
        </Button>
      </RaiseContainer>
    </ControlsContainer>
  );
};

export default GameControls; 