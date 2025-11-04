import React, { useState } from 'react';
import { Container, Box, TextField, Button, List, ListItem, ListItemText, Typography, CircularProgress, Paper } from '@mui/material';
import axios from 'axios';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    try { 
      const res = await axios.get(
        `https://jsonplaceholder.typicode.com/todos?title_like=${encodeURIComponent(query)}&_limit=50`
      );
      setResults(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Search Todos
        </Typography>

        <Paper sx={{ p: 2, mb: 2 }}>
          <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              placeholder="Search todos by title"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button variant="contained" onClick={handleSearch} disabled={loading}>
              Search
            </Button>
          </Box>
        </Paper>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        {!loading && results.length === 0 && query.trim() !== '' && (
          <Typography sx={{ mt: 2 }}>No results found.</Typography>
        )}

        <List sx={{ mt: 2 }}>
          {results.map((todo) => (
            <ListItem key={todo.id} sx={{ bgcolor: 'background.paper', mb: 1, borderRadius: 1 }}>
              <ListItemText
                primary={todo.title}
                secondary={todo.completed ? 'Completed' : 'Pending'}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default SearchPage;
