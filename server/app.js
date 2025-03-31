const path = require('node:path');
const fs = require('node:fs');
const express = require('express');
// const cors = require('cors');

const cors = require('cors');


const { v4: uuidv4 } = require('uuid');
const morgan = require('morgan');

const PORT = process.env.SECONDARY_PUBLIC_PORT || 8000;
const app = express();

app.use(cors({ origin: '*' }));
app.use(morgan('dev')); // Logs requests
// app.use(cors());
app.use(express.json());

const dbPath = path.resolve(__dirname, 'db.json');

const loadData = (key) => {
    try {
        if (!fs.existsSync(dbPath)) return {};
        const dataBuffer = fs.readFileSync(dbPath);
        const dataJSON = dataBuffer.toString();
        const data = JSON.parse(dataJSON);
        return key ? data[key] || [] : data;
    } catch (e) {
        console.error("Error loading data:", e.message);
        return [];
    }
};

const saveData = (key, data) => {
    try {
        const existingData = loadData();
        const newData = { ...existingData, [key]: data };
        fs.writeFileSync(dbPath, JSON.stringify(newData, null, 2));
    } catch (e) {
        console.error("Error saving data:", e.message);
    }
};

app.get('/doors', (_, res) => {
    res.json(loadData('doors'));
});

app.get('/doors/:id', (req, res) => {
    const doorsData = loadData('doors');
    const door = doorsData.find((door) => door.id == req.params.id);
    door ? res.json(door) : res.status(404).json({ message: 'Door not found' });
});

app.post('/doors', (req, res) => {
    const doorsData = loadData('doors');
    const newDoor = { id: uuidv4(), ...req.body };
    doorsData.push(newDoor);
    saveData('doors', doorsData);
    res.status(201).json(newDoor);
});

app.put('/doors/:id', (req, res) => {
    const doorsData = loadData('doors');
    const doorIndex = doorsData.findIndex((door) => door.id == req.params.id);

    delete req.body.id; // Prevent updating ID

    if (doorIndex !== -1) {
        doorsData[doorIndex] = { ...doorsData[doorIndex], ...req.body };
        saveData('doors', doorsData);
        return res.status(200).json(doorsData[doorIndex]);
    }

    res.status(404).json({ message: 'Door not found' });
});

app.delete('/doors/:id', (req, res) => {
    let doorsData = loadData('doors');
    const doorIndex = doorsData.findIndex((door) => door.id == req.params.id);

    if (doorIndex !== -1) {
        const [deletedDoor] = doorsData.splice(doorIndex, 1);
        saveData('doors', doorsData);
        return res.status(200).json(deletedDoor);
    }

    res.status(404).json({ message: 'Door not found' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});