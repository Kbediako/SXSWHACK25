import { ChatInterface } from "../../components/chatInterface/chatInterface"
import { Container } from "@mui/material";

export const Landing = () => {

  console.log(" LANDING ")
  return (
    <Container
      sx={{
        height: "100vh",
        width: "100vw",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ChatInterface />;
    </Container>
  );
};
