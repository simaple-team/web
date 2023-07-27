import { Flex } from "@chakra-ui/react";
import Header from "./components/Header";
import { PreferenceProvider } from "./hooks/usePreference";
import { WorkspaceProvider } from "./hooks/useWorkspace";
import Editor from "./pages/Editor";

function App() {
  return (
    <WorkspaceProvider>
      <PreferenceProvider>
        <Flex h="100vh" flexDirection="column">
          <Header />
          <Editor />
        </Flex>
      </PreferenceProvider>
    </WorkspaceProvider>
  );
}

export default App;
