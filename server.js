const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

let items = require("./book.json");

app.get("/", (_req, res) => {
  res.send("API is ready!, Try adding /items to the end of the URL.");
});

// GET all items
app.get("/items", (_req, res) => {
  if (items.length === 0) {
    return res.status(404).json({ message: "No items found" });
  }
  res.json(items);
});

// GET item by id
app.get("/items/:id", (req, res) => {
  const id = Number(req.params.id);
  const item = items.find((i) => i.id === id);
  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }
  res.json(item);
});

// POST create new item
app.post("/items", (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const newItem = {
    ...{ id: Math.max(...items.map((o) => o.id)) + 1 },
    ...req.body,
  };
  items.push(newItem);
  res.status(201).json(newItem);
});

// PUT update item by id
app.put("/items/:id", (req, res) => {
  const id = Number(req.params.id);
  const { title, author, genre } = req.body;
  const item = items.find((i) => i.id === id);
  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }
  if (!title) {
    return res.status(400).json({ message: "Name is required" });
  }
  item.title = title;
  item.author = author || "";
  item.genre = genre || "";
  res.json(item);
});

// DELETE item by id
app.delete("/items/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Item not found" });
  }
  items.splice(index, 1);
  res.json({ message: "Item deleted successfully" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
