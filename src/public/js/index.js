const socket = io();

const form = document.getElementById('form')
const inputTitle = document.getElementById('title')
const inputCode = document.getElementById('code')
const inputDescription = document.getElementById('description')
const inputPrice = document.getElementById('price')
// const inputThumbnails = document.getElementById('thumbnails')	
const inputStock = document.getElementById('stock')
const inputCategory = document.getElementById('category')
const productsList = document.getElementById('products')

form.onsubmit = (e) => {
    e.preventDefault();
    const title = inputTitle.value;
    const code = inputCode.value;
    const description = inputDescription.value;
    const price = inputPrice.value;
    // const thumbnails = $(inputThumbnails).val();
    const stock = inputStock.value;
    const category = inputCategory.value;


    if (!title || !code || !description || !price || !stock || !category) {
        alert("Todos los campos son obligatorios");
        return;
    }

    const product = {
        title,
        code,
        description,
        price,
        // thumbnails,
        stock,
        category
    };

    socket.emit('newProduct', product);
}





socket.on('products', (products) =>{
    let infoProducts = '';
    products.forEach((prod)=>{
        infoProducts += `
        <div class="card2">      
              <div class="card-image">              
              <button class="delete-button" onclick="deleteProduct('${prod.id}')">Eliminar</button>
              </div>  
              <div class="card-body">
                <h1> ${prod.title}</h1>
                <p>CODE: ${prod.code}</p>
                <p>PRICE: $${prod.price} MXN</p>
                <p>STOCK: ${prod.stock}</p>
                <p class="description">**${prod.description}</p>
              </div>
        </div>
        `;
    })
        productsList.innerHTML = infoProducts
})

socket.on('error', (error) => {
  let errorMessage = `<h1>${error}</h1>`
  productsList.innerHTML = errorMessage
})

function deleteProduct(id) {
  socket.emit('deleteProduct', id);
}

