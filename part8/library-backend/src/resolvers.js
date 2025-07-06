const { GraphQLError } = require("graphql");
const Book = require("./models/book");
const Author = require("./models/author");
const User = require("./models/user");
const jwt = require("jsonwebtoken");
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

const getBookCounts = async () => {
  const result = await Book.aggregate([
    { $group: { _id: "$author", count: { $sum: 1 } } }
  ]);

  const countsMap = {};
  result.forEach((entry) => {
    countsMap[entry._id.toString()] = entry.count;
  });
  return countsMap;
};

const resolvers = {
  Query: {
    authorCount: async () => await Author.find().count(),
    bookCount: async () => await Book.find().count(),
    allBooks: async (root, args) => {
      const { author, genre } = args;

      let filter = {};

      if (author) {
        const foundAuthor = await Author.findOne({ name: author });
        if (!foundAuthor) {
          return [];
        }
        filter.author = foundAuthor._id;
      }

      if (genre) {
        filter.genres = { $in: [genre] };
      }

      const books = await Book.find(filter);
      return books;
    },
    allAuthors: async () => {
      const authors = await Author.find();
      return authors;
    },
    me: (root, args, context) => {
      return context.currentUser;
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT"
          }
        });
      }
      try {
        let existingBook = await Book.findOne({ title: args.title });

        if (existingBook) {
          throw new GraphQLError("Title must be unique", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.title
            }
          });
        }

        let author = await Author.findOne({ name: args.author });
        if (!author) {
          author = new Author({ name: args.author });
          await author.save();
        }
        const newBook = new Book({ ...args, author: author._id });

        await newBook.save();

        pubsub.publish("BOOK_ADDED", { bookAdded: newBook });

        return newBook;
      } catch (e) {
        if (e.name === "ValidationError") {
          throw new GraphQLError("Invalid input", {
            extensions: {
              code: "BAD_USER_INPUT",
              error: e.errors
            }
          });
        }
        throw e;
      }
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT"
          }
        });
      }

      try {
        const author = await Author.findOne({ name: args.name });

        if (!author) {
          throw new GraphQLError("Author not found", {
            extensions: { code: "BAD_USER_INPUT" }
          });
        }

        author.born = args.setBornTo;

        const updatedAuthor = await author.save();

        return updatedAuthor;
      } catch (e) {
        throw new GraphQLError("Editing author failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            e
          }
        });
      }
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre
      });

      return user.save().catch((error) => {
        throw new GraphQLError("Creating the user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error
          }
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT"
          }
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator("BOOK_ADDED")
    }
  },
  Book: {
    author: async (root) => {
      return await Author.findById(root.author);
    }
  },
  Author: {
    bookCount: async (author, args, context) => {
      if (!context.bookCounts) {
        context.bookCounts = await getBookCounts();
      }
      return context.bookCounts[author._id.toString()] || 0;
    }
  }
};

module.exports = resolvers;
