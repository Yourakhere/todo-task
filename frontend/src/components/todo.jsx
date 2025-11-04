import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  TextField,
  Button,
  CircularProgress,
  Paper
} from '@mui/material';
import axios from 'axios';

const TodoPage = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/todos?_limit=10');
      setTodos(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching todos:', error);
      setLoading(false);
    }
  };

  const handleAddTodo = async () => {
    if (!newTodo.trim()) return;

    try {
      const response = await axios.post('https://jsonplaceholder.typicode.com/todos', {
        title: newTodo,
        completed: false,
        userId: 1
      });

      setTodos([response.data, ...todos]);
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleToggleTodo = async (todoId) => {
    try {
      const todoToUpdate = todos.find(todo => todo.id === todoId);
      const response = await axios.patch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
        completed: !todoToUpdate.completed
      });

      setTodos(todos.map(todo =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      ));
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Todo List
        </Typography>
        
        <Paper sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add new todo"
              variant="outlined"
            />
            <Button
              variant="contained"
              onClick={handleAddTodo}
              sx={{ minWidth: '100px' }}
            >
              Add
            </Button>
          </Box>
        </Paper>

        <List>
          {todos.map((todo) => (
            <ListItem
              key={todo.id}
              dense
              button
              onClick={() => handleToggleTodo(todo.id)}
              sx={{
                bgcolor: 'background.paper',
                mb: 1,
                borderRadius: 1,
                boxShadow: 1
              }}
            >
              <Checkbox
                edge="start"
                checked={todo.completed}
                tabIndex={-1}
                disableRipple
              />
              <ListItemText
                primary={todo.title}
                sx={{
                  textDecoration: todo.completed ? 'line-through' : 'none',
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default TodoPage;
