const express = require("express");
const app = express();
const port = 3001;

app.use(express.json());
app.use(function (_req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

let items = require("./book.json");

app.get("/", (_req, res) => {
  res.send("API is ready!, Try adding /books to the end of the URL.");
});

// GET all items
app.get("/books", (_req, res) => {
  if (items.length === 0) {
    return res.status(404).json({ message: "No items found" });
  }
  res.json(items);
});

// GET item by id
app.get("/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const item = items.find((i) => i.id === id);
  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }
  res.json(item);
});

// POST create new item
app.post("/books", (req, res) => {
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
app.put("/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const { title, price, genre } = req.body;
  const item = items.find((i) => i.id === id);
  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }
  if (!title) {
    return res.status(400).json({ message: "Name is required" });
  }
  item.title = title;
  item.price = price || "";
  item.genre = genre || "";
  res.json(item);
});

// DELETE item by id
app.delete("/books/:id", (req, res) => {
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
