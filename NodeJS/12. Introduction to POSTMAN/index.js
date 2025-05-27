const express = require('express');
const users = require('./MOCK_DATA.json');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({extended: false}));

// Routes =>
app.get('/users', (req, res) => {
    const html = `<ul>${users.map((user) => `<li>${user.first_name}</li>`).join("")}</ul>`
    res.send(html);
});

// REST API Routes =>
app.get('/api/users', (req, res) => {
    return res.json(users);
});


app.get('/api/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const user = users.find(user => user.id === id);
    return res.json(user);
});

app.route('/api/users/:id')
    .get((req, res) => {
        const id = Number(req.params.id);
        const user = users.find(user => user.id === id);
        return res.json(user);
    })
/*
.patch((req, res) => {
    // Edit the user with ID
    return res.json({status: 'pending'});
})
.delete((req, res) => {
    // delete the user with ID
    return res.json({status: 'pending'});
})
*/

app.post('/api/users/', (req, res) => {
    // create a new user
    const body = req.body;
    users.push({id: users.length + 1, ...body});
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err) => {
        if (err) throw err;
    });
    return res.json({status: 'success', id: users.length});
});

app.patch('/api/users/patch', (req, res) => {
    const queryParams = req.query; // Extract query parameters from the request
    const userId = parseInt(queryParams.id); // Assuming 'id' is provided in the query parameters
    if (!userId) {
        return res.status(400).json({error: 'User ID is required in the query parameters'});
    }

    // Find the index of the user with the given ID
    const userIndex = users.findIndex(user => user.id === userId);

    // If user not found, return error
    if (userIndex === -1) {
        return res.status(404).json({error: 'User not found'});
    }

    // Update user data with the new information from query parameters
    users[userIndex] = {...users[userIndex], ...queryParams};

    // Write updated user data to file
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            return res.status(500).json({error: 'Internal Server Error'});
        }
        return res.json({status: 'success', id: userId});
    });
});


app.delete('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id); // Parse ID from request params

    // Find the index of the user with the given ID
    const userIndex = users.findIndex(user => user.id === userId);

    // If user not found, return error
    if (userIndex === -1) {
        return res.status(404).json({error: 'User not found'});
    }

    // Remove the user with the specified ID from the array
    users.splice(userIndex, 1);

    // Write updated user data to file
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            return res.status(500).json({error: 'Internal Server Error'});
        }
        return res.json({status: 'success', id: userId});
    });
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
