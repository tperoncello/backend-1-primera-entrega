const express = require('express');
const { readFile, writeFile } = require('../utils/fileManager');

const router = express.Router();
const CARTS_FILE = 'carts.json';
const PRODUCTS_FILE = 'products.json';

// Función para generar un ID único para el carrito
const generateId = () => `cart_${Date.now()}`;

// Ruta POST /api/carts para crear un nuevo carrito
router.post('/', async (req, res) => {
  const newCart = { id: generateId(), products: [] };
  const carts = await readFile(CARTS_FILE);
  carts.push(newCart);
  await writeFile(CARTS_FILE, carts);
  res.status(201).json(newCart);
});

// Ruta GET /api/carts para obtener todos los carritos
router.get('/', async (req, res) => {
  const carts = await readFile(CARTS_FILE);
  res.json(carts); // Retorna todos los carritos
});

// Ruta GET /api/carts/:cid para obtener un carrito específico por su ID
router.get('/:cid', async (req, res) => {
  const { cid } = req.params;
  const carts = await readFile(CARTS_FILE);
  const cart = carts.find((c) => c.id === cid);
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
  res.json(cart);
});

// Ruta POST /api/carts/:cid/product/:pid para añadir un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;

  const carts = await readFile(CARTS_FILE);
  const products = await readFile(PRODUCTS_FILE);

  const cart = carts.find((c) => c.id === cid);
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

  const productExists = products.find((p) => p.id === pid);
  if (!productExists) return res.status(404).json({ error: 'Producto no encontrado' });

  const productInCart = cart.products.find((p) => p.product === pid);
  if (productInCart) {
    productInCart.quantity += 1; // Si el producto ya está en el carrito, aumenta la cantidad
  } else {
    cart.products.push({ product: pid, quantity: 1 }); // Si no está en el carrito, lo agrega
  }

  await writeFile(CARTS_FILE, carts);
  res.status(201).json(cart);
});

module.exports = router;
