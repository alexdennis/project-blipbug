import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { useLazyQuery } from "@apollo/client";

import { Character, Book, gql } from "./types";
import books from "./books.json";

// Index the books by name
const bookMap: Map<string, number> = books.reduce((acc, book, index) => {
  acc.set(book.name, index);
  return acc;
}, new Map<string, number>());

const ASK =
  gql(`query Ask($book: String!, $character: String!, $question: String!) {
  ask(book: $book, character: $character, question: $question) {
    answer
  }
}`);

const AskQuestion: React.FC = () => {
  const [selectedBook, setBook] = React.useState(
    books[bookMap.get("The Bible") ?? 0].name
  );
  const [selectedCharacter, setCharacter] = React.useState(
    books[bookMap.get("The Bible") ?? 0].characters[0].name
  );
  const [selectedQuestion, setQuestion] = React.useState("");

  const [ask, { loading, error, data }] = useLazyQuery(ASK, {
    variables: {
      book: selectedBook,
      character: selectedCharacter,
      question: selectedQuestion,
    },
  });

  React.useEffect(() => {
    setCharacter(books[bookMap.get(selectedBook) ?? 0].characters[0].name);
  }, [selectedBook]);

  function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    ask();
  }

  return (
    <Grid sx={{ margin: 2, padding: 2 }} spacing={2}>
      <Box component={"form"} onSubmit={handleSubmit}>
        <Select
          value={selectedBook}
          onChange={(ev) => setBook(ev.target.value)}
          fullWidth
        >
          {books.map((book: Book) => (
            <MenuItem value={book.name}>{book.name}</MenuItem>
          ))}
        </Select>
        <Select
          value={selectedCharacter}
          onChange={(ev) => setCharacter(ev.target.value)}
          fullWidth
        >
          {books[bookMap.get(selectedBook) ?? 0].characters.map(
            (character: Character) => (
              <MenuItem
                value={character.name}
                aria-label={character.description}
              >
                {character.name}
              </MenuItem>
            )
          )}
        </Select>
        <TextField
          placeholder="Ask a question"
          rows={5}
          multiline
          onChange={(ev) => setQuestion(ev.target.value)}
          fullWidth
          autoFocus
        />
        <Button type="submit" variant="contained" fullWidth disabled={loading}>
          Ask
        </Button>
      </Box>
      <Box sx={{ marginTop: 2, padding: 2 }}>
        {loading && "Thinking..."}
        {error && error.message}
        {data && data?.ask && data?.ask?.answer}
      </Box>
    </Grid>
  );
};

export default AskQuestion;
