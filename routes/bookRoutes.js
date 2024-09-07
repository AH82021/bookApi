import express from 'express'

import { getAllBook ,createBook,getBookById,updateBookById,deleteBookById} from '../controllers/bookController.js'

const router = express.Router();


router.get('/',getAllBook);
router.post('/add',createBook)
router.get('/:id',getBookById)
router.put('/:id',updateBookById)
router.delete('/:id',deleteBookById)







export default router;