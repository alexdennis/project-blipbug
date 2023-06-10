export type Book = {
  name: string;
  characters: Character[];
};

export type Character = {
  name: string;
  description?: string;
};
