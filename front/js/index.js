//récupérer les données de l'api pour pouvoir afficher les produits
//----------------------------------------------------------------------------

//création d'un tableau
let couchsData = [];

//appel api
const fetchCouchsData = () =>
  fetch("http://localhost:3000/api/products")
    .then((res) => {
      if (res.ok) {
        console.log("SUCCESS");
        return res.json();
      } else {
        console.log("Not Successful");
      }
    })
    .then((data) => {
      couchsData = data;
    })
    .catch((error) => console.log("ERROR"));

//afficher les produits
//----------------------------------------------------------------------------
const showCouchs = async () => {
  //attente de la réponse de l'api
  await fetchCouchsData();
  //chercher l'élément où on va agir
  let domElement = document.getElementById("items");
  //affichage des cartes
  let content = "";
  for (let couch of couchsData)
    content += `<a href="/front/html/product.html?id=${couch._id}">
      <article>
        <img src="${couch.imageUrl}" alt="${couch.altTxt}">
          <h3 class="productName">${couch.name}</h3>
          <p class="productDescription">${couch.description}</p>
      </article>
    </a>`;
  domElement.innerHTML = content;
};
showCouchs();
