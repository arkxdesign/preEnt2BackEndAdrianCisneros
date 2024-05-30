import {Router} from "express";
import {upload} from '../middlewares/multer.js';
import {middlewareProducts} from '../middlewares/validaProduct.js';
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
    // const products = await productsManager.getProducts();
    res.render('realtimeproducts')
})

router.post('/realtimeproducts', middlewareProducts, upload.single('thumbnails'), async (req, res) => {
    try {
      const productBody = req.body;
      console.log(productBody)
      if (req.file) productBody.thumbnails = req.file.path;
      const product = await productManager.createProduct(productBody);
      console.log(product);
      res.status(201).json({ product });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  })


export default router