//récupération de l'url d'un produit
//----------------------------------------------------------------------------
const query_Url = window.location.href;

//extraire l'id de l'url
//----------------------------------------------------------------------------
const url = new URL(query_Url);

const searchParams = new URLSearchParams(url.search);

//si on retouve les caractères "id" dans l'url on créer un tableau
if (searchParams.has("id")) {
  let couchData = [];
  let couchId = searchParams.get("id");
  //requête API qui sélectionne le produit par son id
  //----------------------------------------------------------------------------
  const fetchCouchsDataById = () =>
    fetch(`http://localhost:3000/api/products/${couchId}`)
      .then((res) => {
        if (res.ok) {
          console.log("SUCCESS");
          return res.json();
        } else {
          console.log("Not Successful");
        }
      })
      .then((data) => {
        couchData = data;
        console.log(couchData);
      })
      .catch((error) => console.log("ERROR"));

  //affichage des données relative au produit
  //----------------------------------------------------------------------------
  const showCouchData = async () => {
    //on attend la réponse de l'api
    await fetchCouchsDataById();

    //affichage de l'image
    couchImg = document.getElementsByClassName("item__img")[0];
    couchImg.insertAdjacentHTML(
      "beforeend",
      `<img src="${couchData.imageUrl}" alt="${couchData.altTxt}">`
    );

    //affichage du titre
    couchTitle = document.getElementById("title");
    couchTitle.insertAdjacentHTML("beforeend", `${couchData.name}`);

    //affichage du prix
    couchPrice = document.getElementById("price");
    couchPrice.insertAdjacentHTML("beforeend", `${couchData.price}`);

    //affichage de la description
    couchDescription = document.getElementById("description");
    couchDescription.insertAdjacentHTML(
      "beforeend",
      `${couchData.description}`
    );

    //affichage du choix des couleurs
    couchColors = document.getElementById("colors");
    for (let color = 0; color < couchData.colors.length; color += 1) {
      //ici on utilise les fonctions createElement et appendChild...
      //...afin de conserver la valeur d'origine "SVP, choisissez une couleur"
      let addColors = document.createElement("option");
      addColors.content = `<option value="${color}">${color}</option>`;
      addColors.innerHTML = couchData.colors[color];
      couchColors.appendChild(addColors);
    }
  };
  showCouchData();

  //ajouter au panier le produit selectionné au click
  //----------------------------------------------------------------------------

  //sélection du bouton "ajoutez au panier"
  const addCouchToCart = document.getElementById("addToCart");
  addCouchToCart.addEventListener("click", (event) => {
    event.preventDefault();

    //récupérer id couleur et quantité
    let quantity = document.getElementById("quantity");
    let couchOptions = {
      couchId: couchData._id,
      couchColor: colors.value,
      couchQuantity: parseInt(quantity.value),
    };

    //----------------------------------------------------------------------------
    //fonction pour valider la saisie de la couleur et de la quantité
    const validateToAddToCart = () => {
      if (couchOptions.couchQuantity == 0) {
        alert("veuillez saisir une quantité svp");
        return false;
      }
      if (couchOptions.couchColor == "") {
        alert("veuillez choisir une couleur svp");
        return false;
      } else {
        return true;
      }
    };

    if (validateToAddToCart()) {
      //fonction ajouter produit dans le local storage
      const addToLocalStorage = () => {
        //sélection du produit désiré
        let search = couchSelected.find(
          (couch) =>
            couch.couchId == couchOptions.couchId &&
            couch.couchColor == couchOptions.couchColor
        );
        //si le même produit avec la même couleur n'est pas déjà dans le local storage...
        if (search == undefined) {
          //...on le "push" dans le local storage
          couchSelected.push(couchOptions);
          //sinon on recherche la quantité déjà entré...
        } else {
          couchSelected = couchSelected.map((couch) => {
            if (
              couch.couchId == couchOptions.couchId &&
              couch.couchColor == couchOptions.couchColor
            ) {
              //...et on y ajoute la nouvelle quantité
              return {
                couch,
                couchQuantity: couch.couchQuantity + couchOptions.couchQuantity,
              };
            }
            return couch;
          });
        }
        // création de l'objet qui sera ajouter dans le local strorage
        localStorage.setItem("couch", JSON.stringify(couchSelected));
      };

      //fonction popup de confirmation
      const popupCartConfirmation = () => {
        if (window.confirm(`Le produit a bien été ajouté à votre panier`));
      };
      //----------------------------------------------------------------------------

      //récupérer données pour le local storage
      let couchSelected = JSON.parse(localStorage.getItem("couch"));

      //si on a déjà des produits dans le local storage
      if (couchSelected) {
        addToLocalStorage();
        popupCartConfirmation();
      }
      //si le local storage est vide...
      else {
        //...on crée un tableau
        couchSelected = [];
        addToLocalStorage();
        popupCartConfirmation();
      }
    }
  });
}
