import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { rooms } from '../services/api';
import { Room } from '../types';

const Lobby: React.FC = () => {
  const navigate = useNavigate();
  const [roomList, setRoomList] = useState<Room[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newRoom, setNewRoom] = useState({
    name: '',
    smallBlind: 5,
    bigBlind: 10,
  });

  useEffect(() => {
    fetchRooms();
    const interval = setInterval(fetchRooms, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await rooms.list();
      setRoomList(response);
    } catch (error) {
      console.error('獲取房間列表失敗:', error);
    }
  };

  const handleCreateRoom = async () => {
    try {
      const response = await rooms.create(
        newRoom.name,
        newRoom.smallBlind,
        newRoom.bigBlind
      );
      setOpenDialog(false);
      navigate(`/room/${response.id}`);
    } catch (error) {
      console.error('創建房間失敗:', error);
    }
  };

  const handleJoinRoom = async (roomId: string) => {
    try {
      await rooms.join(roomId);
      navigate(`/room/${roomId}`);
    } catch (error) {
      console.error('加入房間失敗:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h1" gutterBottom>
            遊戲大廳
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenDialog(true)}
          >
            創建房間
          </Button>
        </Grid>

        {roomList.map((room) => (
          <Grid item xs={12} sm={6} md={4} key={room.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{room.name}</Typography>
                <Typography color="textSecondary">
                  玩家: {room.players}/{room.maxPlayers}
                </Typography>
                <Typography color="textSecondary">
                  盲注: {room.smallBlind}/{room.bigBlind}
                </Typography>
                <Typography color="textSecondary">
                  狀態: {room.status === 'waiting' ? '等待中' : '遊戲中'}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => handleJoinRoom(room.id)}
                  disabled={room.players >= room.maxPlayers || room.status === 'playing'}
                >
                  加入房間
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>創建新房間</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="房間名稱"
            value={newRoom.name}
            onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="小盲注"
            type="number"
            value={newRoom.smallBlind}
            onChange={(e) => setNewRoom({ ...newRoom, smallBlind: Number(e.target.value) })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="大盲注"
            type="number"
            value={newRoom.bigBlind}
            onChange={(e) => setNewRoom({ ...newRoom, bigBlind: Number(e.target.value) })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>取消</Button>
          <Button onClick={handleCreateRoom} variant="contained" color="primary">
            創建
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Lobby; 