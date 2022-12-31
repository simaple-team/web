import { Flex } from "@chakra-ui/react";
import Header from "./components/Header";

import Editor from "./pages/Editor";

function App() {
  return (
    <Flex h="100vh" flexDirection="column">
      <Header />
      <Editor />
    </Flex>
  );
}

export default App;
