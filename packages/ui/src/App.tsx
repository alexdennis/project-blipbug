import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import React from "react";

import AskQuestion from "./Ask";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <AskQuestion />
      </div>
    </ApolloProvider>
  );
}

export default App;
