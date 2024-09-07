import mongoose from "mongoose";


const BookSchema = new mongoose.Schema({
  title:{
    type : String,
    required : true
  },
  author:{
    type : String,
    required : true
  },
  publishedDate:{
    type : Date,
    required : true
  },

  genre :{ 
    type :String,
    required : true
  }
  
})


const Book = mongoose.model('Book',BookSchema)

export default Book;