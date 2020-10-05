let modalQt = 1;
let cart = [];
let modalKey;

const c = (el) => document.querySelector(el);

// Listagem das pizzas
pizzaJson.map((item, index)=>{
    let pizzaItem = document.querySelector('.models .pizza-item').cloneNode(true);
    
    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img; // Usado para pegar as imagens (src)
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    pizzaItem.querySelector('a').addEventListener('click', (e)=>{ // Evento de clique do modal/ trecho onde adiciona um evento ao "a"
        e.preventDefault(); // Cancela o evento padrão que ocorre quando clica no "a"
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;

        document.querySelector('.pizzaBig img').src = pizzaJson[key].img;
        document.querySelector('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        document.querySelector('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        document.querySelector('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        document.querySelector('.pizzaInfo--size.selected').classList.remove('selected');
        document.querySelectorAll('.pizzaInfo--size').forEach((size, sizeIndex) =>{
            if(sizeIndex == 2){
                size.classList.add('selected');
            }

            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        document.querySelector('.pizzaInfo--qt').innerHTML = modalQt;


        /*Animação do modal*/ 
        document.querySelector('.pizzaWindowArea').style.opacity = '0';
        document.querySelector('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => { // função usada para de fato mostrar a transição da opacity 0-1
            document.querySelector('.pizzaWindowArea').style.opacity = '1';
        }, 200);
    });

    document.querySelector('.pizza-area').append(pizzaItem);
});

// Eventos do modal

function closeModal(){
    document.querySelector('.pizzaWindowArea').style.opacity = '0';
    setTimeout(()=>{
        document.querySelector('.pizzaWindowArea').style.display = 'none';
    },200);
}

document.querySelectorAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});

document.querySelector('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1){
        modalQt--;
        document.querySelector('.pizzaInfo--qt').innerHTML = modalQt;
    }

});

document.querySelector('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    document.querySelector('.pizzaInfo--qt').innerHTML = modalQt;
});

document.querySelectorAll('.pizzaInfo--size').forEach((size) =>{
    size.addEventListener('click',()=>{
        document.querySelector('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

// Enviando dados para o carrinho
document.querySelector('.pizzaInfo--addButton').addEventListener('click', ()=>{
/*  // Qual a pizza?
    console.log('Pizza: ' + modalKey);
    // Qual o tamanho?
    let size = document.querySelector('.pizzaInfo--size.selected').getAttribute('data-key');
    console.log('Tamanho: ' + size);
    // Quantas pizzas?
    console.log('Quantidade' + modalQt);
*/
    let size = parseInt(document.querySelector('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = pizzaJson[modalKey].id + '@' + size; // Cria um identificador
    let info = cart.findIndex((item)=>{ // Verifica se existe identificadores iguais no array cart
        return item.identifier == identifier; //(if)
    });

    if(info > -1){ // Se tiver identificadores iguais, adiciona as quantidades soma elas
        cart[info].qt += modalQt;
    } else{ // Se não, adiciona uma nova pizza ao carrinho
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size:size,
            qt: modalQt
        });
    }
    updateCart();
    closeModal();
});

document.querySelector('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0){
        document.querySelector('aside').style.left = '0';
    }
});

document.querySelector('.menu-closer').addEventListener('click', ()=>{
    document.querySelector('aside').style.left = '100vw';
});

function updateCart(){
    document.querySelector('.menu-openner span').innerHTML = cart.length; // mobile

    if(cart.length > 0){ // Se tiver itens no carrinho, ele será exbido
        document.querySelector('aside').classList.add('show');
        document.querySelector('.cart').innerHTML = '';
        let subTotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart){
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
            subTotal += pizzaItem.price * cart[i].qt;

            let cartItem = document.querySelector('.models .cart--item').cloneNode(true);
            
            let pizzaSizeName;
            if(cart[i].size == 0)
                pizzaSizeName = 'P';
            if(cart[i].size == 1)
                pizzaSizeName = 'M';
            if(cart[i].size == 2)
                pizzaSizeName = 'G';
            
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1){
                    cart[i].qt--;
                } else{
                    cart.splice(i, 1); // Exclui o item em questão ([i])
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
            });


            document.querySelector('.cart').append(cartItem);
        }
        desconto = subTotal * 0.1;
        total = subTotal - desconto;

        document.querySelector('.subtotal span:last-child').innerHTML = `R$ ${subTotal.toFixed(2)}`;
        document.querySelector('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        document.querySelector('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else{
        document.querySelector('aside').classList.remove('show');
        document.querySelector('aside').style.left = '100vw';
    }
}
