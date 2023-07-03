const assert = require("assert");

const validate = require("../").validate;

const goodQuery = validate(`
{
  ask(book: "The Bible", character: "Jesus", question: "What is the meaning of life?", "audience": "everyone") {
    answer
  }
}
`);
const badQuery = validate(`
{
  ask {
    answer
  }
}
`);

assert.strict.equal(
  goodQuery[0],
  undefined,
  "goodQuery validation returns no errors"
);
assert.match(
  badQuery[0].message,
  /Field "ask" argument "book" of type "String!" is required, but it was not provided./,
  "badQuery validation returns GraphQLError error"
);
