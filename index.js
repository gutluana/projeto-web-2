const app = require("./config/server");
const routes = require("./app/routes/routes");

routes.getAllBooks(app);
routes.addBook(app);
routes.getBook(app);
routes.deleteBook(app);
routes.loanBook(app);
routes.devolutionBook(app);
routes.loanRequisityBook(app);
routes.authUser(app);
routes.removeRequisityBook(app);