import { useState, useRef, useEffect } from "react";
import { Box, Container, Typography, Paper, IconButton } from "@mui/material";
import { Home } from "@mui/icons-material";
import { ChatMessage, Message } from "../chatMessage/chatMessage";
import  ChatInputBox  from "../chatInputBox";
import { WelcomeScreen } from "./welcomeScreen/welcomeScreen";

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (content: string, attachments: File[]) => {
    setShowWelcome(false);

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    setMessages((prev) => [...prev, newMessage]);

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "This is a simulated response. In a real implementation, this would connect to an AI service.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  const handleReset = () => {
    setMessages([]);
    setShowWelcome(true);
  };

  if (showWelcome) {
    return <WelcomeScreen onSendMessage={handleSendMessage} />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "hsl(var(--background))",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          bgcolor: "hsl(var(--card))",
          borderRadius: 0,
          borderBottom: "1px solid hsl(var(--border))",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: "hsl(var(--foreground))",
              }}
            >
              Chat Interface
            </Typography>
            <IconButton
              onClick={handleReset}
              sx={{
                color: "hsl(var(--foreground))",
                "&:hover": {
                  bgcolor: "hsl(var(--muted))",
                },
              }}
              aria-label="Return to home"
            >
              <Home />
            </IconButton>
          </Box>
        </Container>
      </Paper>

      {/* Messages Area */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: messages.length === 0 ? "center" : "flex-start",
        }}
      >
        <Container maxWidth="md" sx={{ width: "100%", py: 3 }}>
          {messages.length === 0 ? (
            <Box sx={{ textAlign: "center", mb: 8 }}>
              <Typography
                variant="h4"
                sx={{
                  color: "hsl(var(--muted-foreground))",
                  fontWeight: 500,
                  mb: 1,
                }}
              >
                How can I help you today?
              </Typography>
            </Box>
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </Container>
      </Box>

      {/* Input Area */}
      <Box
        sx={{
          borderTop: messages.length > 0 ? "1px solid hsl(var(--border))" : "none",
          bgcolor: "hsl(var(--background))",
          py: 2,
          position: messages.length === 0 ? "relative" : "sticky",
          bottom: 0,
        }}
      >
        <Container maxWidth="md">
          <ChatInputBox onSendMessage={handleSendMessage} />
        </Container>
      </Box>
    </Box>
  );
};
