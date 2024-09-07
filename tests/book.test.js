import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../server.js';
import Book from '../models/Book.js'; // Adjust the path to your Book model

let mongoServer;

// Setup MongoDB in-memory server before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  // Ensure mongoose is not already connected
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  }
});

// Clean up and close the connection after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clean up database before each test
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
      .post('/api/books/add')
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
      .expect(201);

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
