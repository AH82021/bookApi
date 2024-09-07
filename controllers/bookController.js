import Book from "../models/Book.js";

//Get all books 

 export const getAllBook = async (req,res)=>{
  try {
    const books = await Book.find();
    res.status(200).json(books)
  } catch (error) {
    res.status(500).json({message:error.message})
  }
}


export const getBookById = async(req,res)=>{
  try {
    const id = req.params.id;
    const book = await Book.findById(id)
    if(!book){
      return res.status(404).json({message:`Book with ${id} not found`});
    }
    res.status(200).json(book)
  } catch (error) {
    res.status(500).json({message:error.message})
  }
}

// Create a new Book 

export const createBook = async (req,res)=>{
  try {
    const newBook = new Book(req.body);
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({message:error.message});
  }
}


// update a book 

export const updateBookById = async (req,res)=>{
  try {
    const {id} = req.params
    const book = await Book.findByIdAndUpdate(id,req.body,{new:true});
    if(!book) {
     return res.status(404).json({message:`Book with ${id} not found`});
    }
    res.status(201).json(book)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


export const deleteBookById = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findByIdAndDelete(id);
    if (!book) {
      return res.status(404).json({ message: `Book with ${id} not found` });
    }

    return res.status(200).json({ message: `Book with id: ${id} successfully deleted!` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};









