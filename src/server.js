import express from 'express';
import viewsRouter from './routes/views.router.js';
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import colors from 'colors/safe.js';
import { Server } from 'socket.io';
import getLocalIpAndDataOs from './getIp.js';
import { ProductsManager } from './managers/products.manager.js';

const productsManager = new ProductsManager(`${__dirname}/data/products.json`);
console.log(__dirname)
const app = express();

app.set('trust proxy', true);

app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use('/', viewsRouter);

const IP = getLocalIpAndDataOs();
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
    console.log(colors.yellow("Server running on ip + port:"), colors.magenta(`http://${IP}:${PORT}`))
});

 const socketServer = new Server(httpServer);

 const products = [];

 socketServer.on('connection',  async socket => {
     console.log(colors.green('Cliente conectado :) '), colors.magenta(`ID: ${socket.id} >>>`), colors.yellow(`REMOTE ADDRESS: ${socket.client.conn.remoteAddress}`));
     socketServer.emit('products', await productsManager.getProducts());
    
    socket.on('disconnect', () => {
        console.log(colors.red('Cliente desconectado '), colors.red(`ID: ${socket.id} >>>`), colors.red(`REMOTE ADDRESS: ${socket.client.conn.remoteAddress}`));
    })

    socket.on('newProduct', async (product)=> {
            const productVerify = await productsManager.getProductByName(product.title);            
            if(productVerify.title === product.title){
                socket.emit('error', 'El producto ya existe')
            }else{
                await products.push(product);        
                await productsManager.createProduct(product);
                socketServer.emit('products', products);
            }      
    })
    
    socket.on('deleteProduct', async (id) => {
        console.log(id)
        await productsManager.deleteProduct(id);
        socketServer.emit('products', await productsManager.getProducts());
    });

 })

