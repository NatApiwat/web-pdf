const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'src')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.get('/test2', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index2.html'));
});

app.get('/test3', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index3.html'));
});

app.get('/test4', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index4.html'));
});

app.get('/test5', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index5.html'));
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});