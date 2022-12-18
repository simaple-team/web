import { Flex } from "@chakra-ui/react";
import Header from "./components/Header";
import { WorkspaceProvider } from "./hooks/useWorkspace";
import Editor from "./pages/Editor";

function App() {
  return (
    <WorkspaceProvider>
      <Flex h="100vh" flexDirection="column">
        <Header />
        <Editor />
      </Flex>
    </WorkspaceProvider>
  );
}

export default App;
