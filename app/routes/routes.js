const app = require('../../config/server');
const Books = require('../controllers/booksController');
const authMidleware = require('../midlewares/auth');


module.exports = {
    getAllBooks: (app) => {
        app.get('/api/books', Books.apiGetAllBooks);
    },
    getBook: (app) => {
        app.get('/api/books/:id', Books.getBook);
    },
    addBook: (app) => {
        app.post('/api/books', authMidleware, Books.addBook);
    },
    deleteBook: (app) => {
        app.delete('/api/books/:id', authMidleware ,  Books.deleteBook);
    },
    removeRequisityBook: (app) =>{
        app.delete('/api/books/loan/requisity/remove/:id', authMidleware, Books.removeRequisityBook);
    },
    loanBook: (app) =>{
        app.put('/api/books/loan/:id', authMidleware , Books.loanBook);
    },
    devolutionBook: (app) =>{
        app.put('/api/books/devolution/:id', authMidleware , Books.devolutionBook);
    },
    loanRequisityBook: () =>{
        app.put('/api/books/loan/requisity/:id', authMidleware, Books.loanRequisityBook);
    },
    authUser: (app) => {
        app.post('/api/books/auth', Books.authUser);
    },
}