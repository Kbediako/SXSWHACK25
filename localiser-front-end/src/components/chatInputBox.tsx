import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Container,
  Typography,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  AttachFile,
  Search,
  MenuBook,
  Mic
} from '@mui/icons-material';

const SearchInterface: React.FC = () => {
  const [searchText, setSearchText] = useState('');

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f5f5',
        p: 3
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h2"
          component="h1"
          sx={{
            textAlign: 'center',
            fontWeight: 600,
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            color: '#1a1a1a',
            mb: 6
          }}
        >
          What can I help with?
        </Typography>

        <Box
          sx={{
            bgcolor: 'white',
            borderRadius: '28px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            p: 2.5,
            transition: 'box-shadow 0.3s ease',
            '&:hover': {
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)'
            }
          }}
        >
          <TextField
            fullWidth
            multiline
            placeholder="Ask anything"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            variant="standard"
            InputProps={{
              disableUnderline: true,
              sx: {
                fontSize: '1.1rem',
                color: '#666',
                '& .MuiInputBase-input': {
                  padding: '8px 0'
                },
                '& .MuiInputBase-input::placeholder': {
                  color: '#999',
                  opacity: 1
                }
              }
            }}
          />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mt: 2,
              pt: 2
            }}
          >
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                startIcon={<AttachFile />}
                sx={{
                  textTransform: 'none',
                  color: '#1a1a1a',
                  bgcolor: 'transparent',
                  borderRadius: '20px',
                  px: 2,
                  py: 1,
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  '&:hover': {
                    bgcolor: '#f5f5f5'
                  }
                }}
              >
                Attach
              </Button>

              <Button
                startIcon={<Search />}
                sx={{
                  textTransform: 'none',
                  color: '#1a1a1a',
                  bgcolor: 'transparent',
                  borderRadius: '20px',
                  px: 2,
                  py: 1,
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  '&:hover': {
                    bgcolor: '#f5f5f5'
                  }
                }}
              >
                Search
              </Button>

              <Button
                startIcon={<MenuBook />}
                sx={{
                  textTransform: 'none',
                  color: '#1a1a1a',
                  bgcolor: 'transparent',
                  borderRadius: '20px',
                  px: 2,
                  py: 1,
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  '&:hover': {
                    bgcolor: '#f5f5f5'
                  }
                }}
              >
                Study
              </Button>
            </Box>

            <IconButton
              sx={{
                bgcolor: '#f5f5f5',
                borderRadius: '12px',
                p: 1.5,
                '&:hover': {
                  bgcolor: '#e8e8e8'
                }
              }}
            >
              <Mic sx={{ color: '#1a1a1a' }} />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default SearchInterface;