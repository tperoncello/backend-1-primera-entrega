const express = require('express');
const { readFile, writeFile } = require('../utils/fileManager');

const router = express.Router();
const PRODUCTS_FILE = 'products.json';

const generateId = () => `prod_${Date.now()}`;

router.get('/', async (req, res) => {
  const { limit } = req.query;
  const products = await readFile(PRODUCTS_FILE);
  if (limit) return res.json(products.slice(0, limit));
  res.json(products);
});

router.get('/:pid', async (req, res) => {
  const { pid } = req.params;
  const products = await readFile(PRODUCTS_FILE);
  const product = products.find((p) => p.id === pid);
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(product);
});

router.post('/', async (req, res) => {
  const { title, description, code, price, stock, category, thumbnails = [] } = req.body;
  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios, excepto thumbnails' });
  }

  const newProduct = {
    id: generateId(),
    title,
    description,
    code,
    price,
    status: true,
    stock,
    category,
    thumbnails,
  };

  const products = await readFile(PRODUCTS_FILE);
  products.push(newProduct);
  await writeFile(PRODUCTS_FILE, products);
  res.status(201).json(newProduct);
});

router.put('/:pid', async (req, res) => {
  const { pid } = req.params;
  const updates = req.body;

  const products = await readFile(PRODUCTS_FILE);
  const productIndex = products.findIndex((p) => p.id === pid);
  if (productIndex === -1) return res.status(404).json({ error: 'Producto no encontrado' });

  const updatedProduct = { ...products[productIndex], ...updates, id: products[productIndex].id };
  products[productIndex] = updatedProduct;
  await writeFile(PRODUCTS_FILE, products);
  res.json(updatedProduct);
});

router.delete('/:pid', async (req, res) => {
  const { pid } = req.params;
  const products = await readFile(PRODUCTS_FILE);
  const filteredProducts = products.filter((p) => p.id !== pid);
  if (products.length === filteredProducts.length) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  await writeFile(PRODUCTS_FILE, filteredProducts);
  res.status(204).send();
});

module.exports = router;