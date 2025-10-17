import { Box, Paper, Typography, Avatar } from '@mui/material';
import { Person, SmartToy } from '@mui/icons-material';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: File[];
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === 'user';

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        mb: 3,
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
      }}
    >
      <Avatar
        sx={{
          bgcolor: isUser ? 'hsl(var(--chat-user-bg))' : 'hsl(var(--muted))',
          color: isUser ? 'hsl(var(--chat-user-fg))' : 'hsl(var(--muted-foreground))',
          width: 36,
          height: 36,
        }}
      >
        {isUser ? <Person /> : <SmartToy />}
      </Avatar>
      
      <Box sx={{ maxWidth: '70%', minWidth: 0 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor: isUser ? 'hsl(var(--chat-user-bg))' : 'hsl(var(--chat-assistant-bg))',
            color: isUser ? 'hsl(var(--chat-user-fg))' : 'hsl(var(--chat-assistant-fg))',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow-sm)',
            wordWrap: 'break-word',
            transition: 'var(--transition-smooth)',
            '&:hover': {
              boxShadow: 'var(--shadow-md)',
            },
          }}
        >
          <Typography
            variant="body1"
            sx={{
              whiteSpace: 'pre-wrap',
              lineHeight: 1.6,
            }}
          >
            {message.content}
          </Typography>
          
          {message.attachments && message.attachments.length > 0 && (
            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {message.attachments.map((file, index) => (
                <Typography
                  key={index}
                  variant="caption"
                  sx={{
                    px: 1,
                    py: 0.5,
                    bgcolor: isUser ? 'rgba(0,0,0,0.1)' : 'hsl(var(--muted))',
                    borderRadius: 'calc(var(--radius) * 0.5)',
                    display: 'inline-block',
                  }}
                >
                  📎 {file.name}
                </Typography>
              ))}
            </Box>
          )}
        </Paper>
        
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 0.5,
            px: 1,
            color: 'hsl(var(--muted-foreground))',
            textAlign: isUser ? 'right' : 'left',
          }}
        >
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Typography>
      </Box>
    </Box>
  );
};
