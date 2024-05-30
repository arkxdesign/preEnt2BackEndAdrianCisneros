import {Router} from "express";
import __dirname from '../utils.js';

const router = Router();

import {ProductsManager}  from '../managers/products.manager.js';
const productsManager = new ProductsManager(`${__dirname}/data/products.json`);

router.get('/', async (req, res) => {
    const products = await productsManager.getProducts();
    res.render('products', { products })
})

router.get('/products', async (req, res) => {
    const products = await productsManager.getProducts();
    res.render('products', { products})
})


router.get('/realtimeproducts', async (req, res) =>{
    res.render('realtimeproducts')
})

export default router