let produits=JSON.parse(localStorage.getItem('produits'))||[];
let categories=JSON.parse(localStorage.getItem('categories'))||[];
let indexmodifier=-1;

const productModal=document.getElementById('product-modal');
const categoryModal=document.getElementById('category-modal');
const productForm=document.getElementById('product-form');
const categoryForm=document.getElementById('category-form');
const categoryList=document.getElementById('category-list');
const productBody=document.getElementById('products-body');
const productName=document.getElementById('product-name');
const productCategory=document.getElementById('product-categotry');
const productPrice=document.getElementById("product-price");
const productQuantity=document.getElementById('product-quantity');
const categoryName=document.getElementById('category-name');
const searchInput=document.getElementById('search-input');
const categoryFiltre=document.getElementById('category-filtre');
const stockFiltre=document.getElementById('stock-filter');
const formErorr=document.getElementById('form-error');
const ProduitTotal=document.getElementById("total-products");
const ProduitQuantiteTotal=document.getElementById("total-quantity")
const ProduitValeurStock=document.getElementById("stock-value")
const ProduitStockFaible=document.getElementById("low-stock-count");
//open product modal
document.getElementById('open-add-modal').addEventListener('click',()=>{
indexmodifier=-1;
productForm.reset();
document.getElementById('modal-title').textContent="Ajouter un produit";
productModal.classList.add("open")
})

// close product modal
document.getElementById('close-modal').addEventListener('click',()=>{
    productModal.classList.remove('open')
})

document.querySelector('.btn-an').addEventListener('click',()=>{
    productModal.classList.remove('open')
})
//open category modal
document.getElementById('open-category_modal').addEventListener('click',()=>{
    categoryModal.classList.add('open')
})
//close category modal
document.getElementById('close-category-modal').addEventListener('click',()=>{
    categoryModal.classList.remove('open')
})

// sauvgarder les donnes ..........
function sauvgarder(){
    localStorage.setItem('produits',JSON.stringify(produits))
    localStorage.setItem('categories',JSON.stringify(categories))
}

//aff
function aff_categorie(){
    categoryList.innerHTML='';
    for(let i=0;i<categories.length;i++){
        

        categoryList.innerHTML +=`
        <li class="category-item">
        <strong>${categories[i]}</strong>
        <button class="icon-btn-delete" onclick="supprimercategorie(${i})">X</button>
        </li>
        `

        categoryFiltre.innerHTML +=`<option value='${categories[i]}'>${categories[i]}</option>`
        productCategory.innerHTML +=`<option value='${categories[i]}'>${categories[i]}</option>`
    }


    
}



//ajouter une catégorie

categoryForm.addEventListener('submit',(e)=>{
e.preventDefault();
let nom=categoryName.value.trim();

if(nom===""){
    alert('saisir une categorie valid');
    return
}

categories.push(nom);
sauvgarder()
categoryForm.reset()
formErorr.textContent=""
aff_categorie()
})


// supprimer une catégorie

function supprimercategorie(index){
    let utilise=false

    for(let i=0;i<produits.length;i++){
        if(produits[i].categorie===categories[index]){
            utilise=true
        }
    }


    if(utilise){
        formErorr.textContent="cette catégorie contient des produits"
    }else{
        categories.splice(index,1);
        sauvgarder()
        aff_categorie()
        formErorr.textContent=""
    }

}


// aff produits

function affichierproduiy(){
    productBody.innerHTML="";
  

    let recherche=searchInput.value.trim()
    let categorie=categoryFiltre.value;
    let stock=stockFiltre.value;
    let compteur=0;

   let produitsfiltre=produits.filter((p)=>{

    let statu ="available";
    if(p.quantite===0){
        statu="empty"
    }else if(p.quantite <=5){
        statu="low"
    }

    return  p.nom.toLowerCase().includes(recherche) &&
    (categorie==='all'||p.categorie===categorie)&&
    (stock==="all"||stock===statu)

   })


   produitsfiltre.forEach((p)=>{
  let texte="Disponible";
  let classe="statu-dispo";

  if(p.quantite===0){
    texte="Rupture"
    classe="statu-empty"
  }else if(p.quantite<=5){
    texte="stock faible"
    classe="statu-low"
  }
  let index=produits.indexOf(p)
  productBody.innerHTML+=`
  <tr>
  <td class="product-name">${p.nom}</td>
  <td>${p.categorie}</td>
  <td class="product-price">${p.prix}</td>
  <td class="product-quantit">${p.quantite}</td>
  <td class="statu">
      <span class="${classe}">${texte}</span>
  </td>

  <td class="row-actions">
  <button class='icon-btn update' onclick="modifierproduit(${index})"><i class="fa-solid fa-rotate"></i> </button>
  <button class='icon-btn delete' onclick="supprimerproduit(${index})"> <i class="fa-solid fa-x"></i></button>
  </td>
  </tr>
  `

  compteur++;
   })

    if(compteur===0){
        document.getElementById("empty-state").classList.add('visible')
    }else{
        document.getElementById("empty-state").classList.remove('visible')
    }

    afficherstat(produitsfiltre)
}






// ajouter un produit
productForm.addEventListener('submit',(e)=>{
e.preventDefault()
let produit={
    nom:productName.value.trim(),
    categorie:productCategory.value,
    prix:Number(productPrice.value),
    quantite:Number(productQuantity.value)
};

if(indexmodifier === -1){
    produits.push(produit)
}else{
produits[indexmodifier]=produit
}





sauvgarder()
productForm.reset()
indexmodifier=-1;
productModal.classList.remove('open')
affichierproduiy()


})



function modifierproduit(index){

    indexmodifier=index;

    let p =produits[index];
    productName.value=p.nom;
    productCategory.value=p.categorie;
    productPrice.value=p.prix;
    productQuantity.value=p.quantite

document.getElementById('modal-title').textContent='Modifier ce Produit'
    productModal.classList.add('open')

}


function supprimerproduit(index){

    if(confirm('voulez vous supprimer ce produit')){
        produits.splice(index,1)
        sauvgarder()
        affichierproduiy()
    }

}


function afficherstat(produitfiltre){
let quantite=0;
let valeur=0;
let faible=0;

for(let i=0;i<produitfiltre.length;i++){
    quantite +=produitfiltre[i].quantite;

    valeur += produitfiltre[i].quantite * produitfiltre[i].prix;

    if(produitfiltre[i].quantite<=5){
        faible++;
    }

}

ProduitTotal.textContent=produitfiltre.length;
ProduitQuantiteTotal.textContent=quantite;
ProduitValeurStock.textContent=valeur;
ProduitStockFaible.textContent=faible


}

searchInput.addEventListener('input',affichierproduiy)
categoryFiltre.addEventListener('change',affichierproduiy)
stockFiltre.addEventListener('change',affichierproduiy)
affichierproduiy()
aff_categorie()
