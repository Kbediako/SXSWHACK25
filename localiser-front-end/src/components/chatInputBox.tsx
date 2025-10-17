import React, { ChangeEvent, useRef, useState, KeyboardEvent } from "react";
import { Box, TextField, Container, IconButton, Typography } from "@mui/material";
import { AttachFile, Search, MenuBook, Mic, Close } from "@mui/icons-material";

type ChatInputBoxProps = {
  onSendMessage: (searchText: string, attachments: File[]) => void;
};

const ChatInputBox: React.FC<ChatInputBoxProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    const stringMessage = message.trim();
    if (stringMessage.length > 0 || attachments.length > 0) {
      onSendMessage(message, attachments);
      setMessage("");
      setAttachments([]);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "contents",
        flexDirection: "column",
        p: 3,
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: "28px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            p: 2.5,
            transition: "box-shadow 0.3s ease",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "pink",
            "&:hover": {
              boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
            },
          }}
        >
          <TextField
            fullWidth
            multiline
            placeholder="Ask anything"
            value={message}
            onKeyDown={handleKeyPress}
            onChange={(e) => setMessage(e.target.value)}
            variant="standard"
            InputProps={{
              disableUnderline: true,
              sx: {
                fontSize: "1.1rem",
                color: "#666",
                "& .MuiInputBase-input": {
                  padding: "8px 0",
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "#999",
                  opacity: 1,
                },
              },
            }}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: 2,
              pt: 2,
            }}
          >
            <Box sx={{ display: "flex", gap: 1 }}>
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
        <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
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

export default ChatInputBox;
