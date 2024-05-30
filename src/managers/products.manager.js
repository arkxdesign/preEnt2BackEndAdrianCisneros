import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import colors from 'colors/safe.js';

export class ProductsManager {
    constructor(path) {
        this.path = path;
    }

    async getProducts(limit) {
        try {
            if (fs.existsSync(this.path)) {
                const products = await fs.promises.readFile(this.path, 'utf-8');
                const parsedProducts = JSON.parse(products)
                if(limit){
                    return parsedProducts.slice(0, limit);
                }
                return parsedProducts;
            } else return [];
        } catch (error) {
            console.log(error);
        }
    }
    async createProduct(obj) {
        try {
            const product = { 
                id: uuidv4(), 
                status: true, 
                ...obj 
            };
            const products = await this.getProducts();
            const productExist = products.find((u) => u.title === product.title || u.id === product.id);
            if (productExist) 
                return console.log(colors.red("Error: El producto ya existe")),'El producto ya existe';
            
            if (product.title === "" || product.description === "" || product.price <= 0 || product.code === "" ||  product.stock <= 0 || product.category === "" )
                return console.log(colors.red("Error: title, description, price, code, stock, category) Todos los campos son obligatorios")), null;
            else products.push(product);            
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));            
            return product;
        } catch (error) {
            console.log(error);
        }
    }

    async updateProduct(id, obj) {
        try {
            const productFile = await this.getProducts();
            let productExist = await this.getProductById(id);
            console.log(productExist)
            if (!productExist) return null;
            productExist = { ...productExist, ...obj };
            const newArray = productFile.filter((u) => u.id !== id);
            newArray.push(productExist);
            await fs.promises.writeFile(this.path, JSON.stringify(newArray));
            return productExist;
        } catch (error) {
            console.log(error);
        }
    }

    async getProductById(id) {
        try {
            const productsFile = await this.getProducts();
            const productExist = productsFile.find((u) => u.id === id);
            if (!productExist) return "Product not found";
            return productExist;
        } catch (error) {
            console.log(error);
        }
    }

    async getProductByName(title) {
        try {
            const productsFile = await this.getProducts();
            const productExist = productsFile.find((u) => u.title === title);
            if (!productExist) return "Product not found";
            return productExist;
        } catch (error) {
            console.log(error);
        }
    }


    async deleteProduct(id) {
        try {
            const productsFile = await this.getProducts();
            if (productsFile.length > 0) {
                const productExist = await this.getProductById(id);
                if (!productExist) return null;
                const newArray = productsFile.filter((u) => u.id !== id);
                await fs.promises.writeFile(this.path, JSON.stringify(newArray));
                return productExist;
            } else return "Product not found";
        } catch (error) {
            console.log(error);
        }
    }
}