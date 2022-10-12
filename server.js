const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const indexRouter = require('./routes/index');

const app = express();
const port = process.env.PORT || 8080;

app.use(expressLayouts);
app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');

app.use(express.static(`${__dirname}/public`));

app.use('/', indexRouter);

app.use((req, res, next) => {
    res.status(404).render('404', { page: 'Page not found' });
});

app.listen(port, console.log(`Le serveur est en marche sur le port ${port}.`));
