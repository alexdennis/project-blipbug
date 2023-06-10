import React from 'react';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

import { Character, Book } from './types';
import books from './books.json';

// Index the books by name
const bookMap: Map<string, number> = books.reduce((acc, book, index) => {
  acc.set(book.name, index);
  return acc;
}, new Map<string, number>());


function App() {
  const [selectedBook, setBook] = React.useState(books[bookMap.get("The Bible") ?? 0].name);
  const [selectedCharacter, setCharacter] = React.useState(books[bookMap.get("The Bible") ?? 0].characters[0].name);
  const [selectedQuestion, setQuestion] = React.useState("");

  React.useEffect(() => {
    setCharacter(books[bookMap.get(selectedBook) ?? 0].characters[0].name);
  }, [selectedBook]);

  function ask () {
    console.log(selectedBook, selectedCharacter, selectedQuestion);
  };

  return (
    <div className="App">
      <Grid component={Paper} elevation={3} sx={{margin: 5, padding: 5}} >
        <Select value={selectedBook} onChange={(ev) => setBook(ev.target.value)}>
          {books.map((book: Book) => (<MenuItem value={book.name}>{book.name}</MenuItem>) )}
        </Select>
        <br />
        <Select value={selectedCharacter} onChange={(ev) => setCharacter(ev.target.value)}>
          {books[bookMap.get(selectedBook) ?? 0].characters.map((character: Character) => (<MenuItem value={character.name} aria-label={character.description}>{character.name}</MenuItem>) )}
        </Select>
        <br />
        <TextField placeholder="Ask a question" rows={5} multiline onChange={(ev) => setQuestion(ev.target.value)} />
        <br />
        <Button variant="contained" onClick={() => ask()}>Ask</Button>
      </Grid>      
      {/* <img src="/images/blipbug.jpg" className="App-logo" alt="logo" />       */}
    </div>
  );
}

export default App;
