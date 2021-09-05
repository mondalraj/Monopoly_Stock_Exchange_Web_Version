const express = require('express');
// const expressLayouts = require('express-ejs-layouts');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
// app.use(expressLayouts);

app.get('/', (req, res) => {
    res.render('index');
});




app.listen(3000, () => {
    console.log(`Server is running on port: 3000`);
});