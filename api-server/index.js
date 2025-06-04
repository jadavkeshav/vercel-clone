const express = require('express');
const { generateSlug } = require("random-word-slugs")

const app = express();
const PORT = 9000;

app.use(express.json());

app.post("/projects", (req, res) => {
    const {gitURL} = req.body;
    const projectSlug = generateSlug();
})

app.listen(PORT, () => console.log(`API SERVER Running On PORT : ${PORT}`));