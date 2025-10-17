import { Box, Container, Typography, TextField, IconButton, Chip } from '@mui/material';
import { AttachFile, Search, MenuBook, Mic, Close } from '@mui/icons-material';
import { useState, KeyboardEvent, ChangeEvent, useRef } from 'react';

interface WelcomeScreenProps {
  onSendMessage: (content: string, attachments: File[]) => void;
}

export const WelcomeScreen = ({ onSendMessage }: WelcomeScreenProps) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (message.trim() || attachments.length > 0) {
      onSendMessage(message, attachments);
      setMessage('');
      setAttachments([]);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'hsl(var(--background))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              color: 'hsl(var(--foreground))',
              fontWeight: 400,
              fontSize: { xs: '2rem', md: '2.5rem' },
            }}
          >
            What can I help with?
          </Typography>
        </Box>

        <Box
          sx={{
            bgcolor: 'hsl(var(--card))',
            borderRadius: '24px',
            p: 2,
            boxShadow: 'var(--shadow-lg)',
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "pink",
          }}
        >
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask anything"
            variant="standard"
            InputProps={{
              disableUnderline: true,
              sx: {
                color: 'hsl(var(--foreground))',
                fontSize: '1rem',
                px: 2,
                py: 1,
                '& input::placeholder': {
                  color: 'hsl(var(--muted-foreground))',
                  opacity: 1,
                },
                '& textarea::placeholder': {
                  color: 'hsl(var(--muted-foreground))',
                  opacity: 1,
                },
              },
            }}
          />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              px: 1,
              pt: 1,
            }}
          >
            <Box sx={{ display: 'flex', gap: 1 }}>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                hidden
                onChange={handleFileSelect}
                aria-label="Attach files"
              />
              
              <IconButton
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  color: "hsl(var(--muted-foreground))",
                  "&:hover": {
                    bgcolor: "hsl(var(--muted))",
                    color: "hsl(var(--primary))",
                  },
                  transition: "var(--transition-smooth)",
                }}
                aria-label="Attach file"
              >
                <AttachFile />
              </IconButton>
            </Box>

            <IconButton
              onClick={handleSend}
              sx={{
                textTransform: "none",
                color: "#1a1a1a",
                borderRadius: "20px",
                bgcolor: "#f5f5f5",
                px: 2,
                py: 1,
                p: 1.5,
                fontSize: "0.95rem",
                fontWeight: 500,
                "&:hover": {
                  bgcolor: "#e8e8e8",
                },
              }}
            >
              <Search />
            </IconButton>
          </Box>

          {attachments.length > 0 && (
            <Box sx={{ mt: 2, px: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {attachments.map((file, index) => (
                <IconButton
                key={index}
                onClick={() => removeAttachment(index)}
                size="small"
                sx={{
                  bgcolor: "hsl(var(--muted))",
                  color: "hsl(var(--muted-foreground))",
                  "& .MuiChip-deleteIcon": {
                    color: "hsl(var(--muted-foreground))",
                  },
                }}
              >
                <Typography variant='subtitle2'>{file.name}</Typography>
                <Close />
              </IconButton>
              ))}
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};
