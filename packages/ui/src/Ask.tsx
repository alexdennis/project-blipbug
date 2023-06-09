import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { gql, useLazyQuery } from "@apollo/client";

import { Character, Book, Audience } from "./types";
import books from "./books.json";
import audiences from "./audiences.json";

// Index the books by name
const bookMap: Map<string, number> = books.reduce((acc, book, index) => {
  acc.set(book.name, index);
  return acc;
}, new Map<string, number>());

const ASK =
  gql(`query Ask($book: String!, $character: String!, $question: String!, $audience: String) {
  ask(book: $book, character: $character, question: $question, audience: $audience) {
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
  const [selectedAudience, setAudience] = React.useState(audiences[0].name);

  const [ask, { loading, error, data }] = useLazyQuery(ASK);

  // When the book changes, change the character to the first character in the book
  React.useEffect(() => {
    changeCharacter(books[bookMap.get(selectedBook) ?? 0].characters[0].name);
  }, [selectedBook]);

  // When the character changes, clear the question
  function changeCharacter(character: string) {
    setCharacter(character);
    setQuestion("");
  }

  function changeAudience(audience: string) {
    setAudience(audience);
  }

  // When the form is submitted, ask the question to the API
  function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    ask({
      variables: {
        book: selectedBook,
        character: selectedCharacter,
        question: selectedQuestion,
        audience: selectedAudience,
      },
    });
  }

  return (
    <Grid sx={{ padding: 2 }} spacing={2}>
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
          onChange={(ev) => changeCharacter(ev.target.value)}
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
        <Box sx={{ padding: 2 }}>Assume I am:</Box>
        <Select
          value={selectedAudience}
          onChange={(ev) => changeAudience(ev.target.value)}
          fullWidth
        >
          {audiences.map((audience: Audience) => (
            <MenuItem value={audience.name} aria-label={audience.name}>
              {audience.name}
            </MenuItem>
          ))}
        </Select>
        <TextField
          placeholder="Ask a question"
          value={selectedQuestion}
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
