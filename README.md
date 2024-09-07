
# Book API

A RESTful API for managing books using Node.js, Express, and MongoDB. This API supports CRUD operations on book records and uses an in-memory MongoDB server for testing.

## Table of Contents

- [Book API](#book-api)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Technologies](#technologies)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Testing](#testing)
  - [Contributing](#contributing)
  - [License](#license)

## Features

- Create a new book
- Retrieve all books
- Retrieve a book by ID
- Update a book
- Delete a book

## Technologies

- Node.js
- Express
- MongoDB
- Mongoose
- MongoMemoryServer (for in-memory testing)
- Jest (for testing)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/AH82021/bookApi.git
   cd book-api
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

## Usage

1. **Start the server:**

   ```bash
   npm start
   ```

   The server will start and listen on port `3000` by default.

2. **Access the API:**

   - **POST /api/books/add** - Add a new book
   - **GET /api/books** - Get all books
   - **GET /api/books/:id** - Get a book by ID
   - **PUT /api/books/:id** - Update a book
   - **DELETE /api/books/:id** - Delete a book

## Testing

1. **Set up the testing environment:**

   - Make sure you have Jest and MongoMemoryServer installed. They are included as dev dependencies in your project.

2. **Create test cases:**

   Create a file named `book.test.js` in your `tests` directory (or another suitable location) with the following content:

   ```javascript
   import mongoose from 'mongoose';
   import request from 'supertest';
   import { MongoMemoryServer } from 'mongodb-memory-server';
   import app from '../server.js'; // Adjust the path as needed
   import Book from '../models/Book.js'; // Adjust the path as needed

   let mongoServer;

   beforeAll(async () => {
     mongoServer = await MongoMemoryServer.create();
     const uri = mongoServer.getUri();
     await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
   });

   afterAll(async () => {
     await mongoose.disconnect();
     await mongoServer.stop();
   });

   beforeEach(async () => {
     await Book.deleteMany({});
   });

   describe('Book API', () => {
     
     // Test POST /api/books (Add a new book)
     it('should create a new book', async () => {
       const newBook = {
         title: 'The Alchemist',
         author: 'Paulo Coelho',
         publishedDate: '1988-01-01',
         genre: 'Adventure',
       };

       const response = await request(app)
         .post('/api/books')
         .send(newBook)
         .expect(201);

       expect(response.body).toHaveProperty('_id');
       expect(response.body.title).toBe(newBook.title);
     });

     // Test GET /api/books (Get all books)
     it('should return all books', async () => {
       const books = [
         { title: 'Book 1', author: 'Author 1', publishedDate: '2001-01-01', genre: 'Fiction' },
         { title: 'Book 2', author: 'Author 2', publishedDate: '2002-02-02', genre: 'Sci-fi' },
       ];

       await Book.insertMany(books);

       const response = await request(app).get('/api/books').expect(200);

       expect(response.body.length).toBe(2);
       expect(response.body[0].title).toBe('Book 1');
     });

     // Test GET /api/books/:id (Get book by ID)
     it('should return a book by id', async () => {
       const book = new Book({
         title: 'Test Book',
         author: 'Test Author',
         publishedDate: '2000-01-01',
         genre: 'Test Genre',
       });
       await book.save();

       const response = await request(app).get(`/api/books/${book._id}`).expect(200);

       expect(response.body).toHaveProperty('_id');
       expect(response.body.title).toBe(book.title);
     });

     // Test PUT /api/books/:id (Update a book)
     it('should update an existing book', async () => {
       const book = new Book({
         title: 'Old Title',
         author: 'Old Author',
         publishedDate: '2000-01-01',
         genre: 'Old Genre',
       });
       await book.save();

       const updatedBook = {
         title: 'New Title',
         author: 'New Author',
         publishedDate: '2000-01-01',
         genre: 'New Genre',
       };

       const response = await request(app)
         .put(`/api/books/${book._id}`)
         .send(updatedBook)
         .expect(200);

       expect(response.body.title).toBe(updatedBook.title);
     });

     // Test DELETE /api/books/:id (Delete a book)
     it('should delete an existing book', async () => {
       const book = new Book({
         title: 'To be deleted',
         author: 'Unknown',
         publishedDate: '2000-01-01',
         genre: 'Mystery',
       });
       await book.save();

       await request(app).delete(`/api/books/${book._id}`).expect(200);

       const foundBook = await Book.findById(book._id);
       expect(foundBook).toBeNull();
     });

     // Test 404 response when trying to get a non-existent book
     it('should return 404 if the book is not found', async () => {
       const nonExistentId = new mongoose.Types.ObjectId();
       const response = await request(app).get(`/api/books/${nonExistentId}`).expect(404);

       expect(response.body.message).toBe(`Book with ${nonExistentId} not found`);
     });
   });
   ```

3. **Run the tests:**

   ```bash
   npm test
   ```

   This will execute the test suite using Jest and MongoMemoryServer. The in-memory MongoDB server is used to ensure tests run in isolation and do not affect the actual database.

## Contributing

If you'd like to contribute to this project, please follow these steps:

1. **Fork the repository.**
2. **Create a new branch:**

   ```bash
   git checkout -b feature-branch
   ```

3. **Make your changes and commit them:**

   ```bash
   git commit -am 'Add new feature'
   ```

4. **Push to the branch:**

   ```bash
   git push origin feature-branch
   ```

5. **Create a new Pull Request.**

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```css
This `README.md` file includes installation instructions, usage information, testing details, and contribution guidelines for your Book API project.
```

