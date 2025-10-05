const express = require('express');
const path = require('path');
const cons = require('consolidate');
const fs = require('fs'); 
const app = express();

app.engine('mustache', cons.mustache);
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'data', 'cars.json');
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the cars.json file:', err);
            res.status(500).send('Error reading the inventory data');
            return;
        }

        const cars = JSON.parse(data);
        res.render('inventory', { cars: cars });
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
