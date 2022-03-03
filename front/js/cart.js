//récupération des keys/values enregistrées dans le local storage
//----------------------------------------------------------------------------
let couchSelected = JSON.parse(localStorage.getItem("couch"));

//----------------------------------------------------------------------------
//fonctions du panier
//----------------------------------------------------------------------------

//sauvegarder le panier
function saveCart() {
  localStorage.setItem("couch", JSON.stringify(couchSelected));
}

//retirer du panier
function removeFromCart(couchId, couchColor) {
  //retire le produit de la page
  couchSelected = couchSelected.filter((couch) => {
    return !(couch.couchId == couchId && couch.couchColor == couchColor);
  });
  //retire le produit du local storage en faisant la fonction saveCart
  saveCart();
  //relance l'affichage en recalculant la quantité et le prix total
  data();
}

//changer quantité
function changeQuantity(couchId, couchColor, value) {
  let searchCouch = couchSelected.find(
    (couch) => couch.couchId == couchId && couch.couchColor == couchColor
  );
  if (searchCouch != undefined) {
    searchCouch.couchQuantity = parseInt(value);
  }
  //rafraichir le local storage pour actualiser la nouvelle quantité saisie
  saveCart();
  //rappel de l'affichage pour afficher la nouvelle quantité
  data();
}

//faire le total des produits ajoutés
function getNumberOfCouchs() {
  let number = 0;
  for (let couch of couchSelected) {
    number += couch.couchQuantity;
  }
  return number;
}

//faire le total du prix du panier
function getTotalPrice() {
  let total = 0;
  for (let couch of couchSelected) {
    total += couch.couchQuantity * couch.couchPrice;
  }
  return total;
}

//----------------------------------------------------------------------------
//affichage des produits dans le panier
//----------------------------------------------------------------------------

const data = () => {
  //création d'un tableau
  let couchSelectedData = [];

  //rappel de l'affichage et des fonctions de calcul pour actualiser...
  //...les éventuels changements apportés dans le panier par l'utilisateur...
  //...sur le changement de quantité ou la suppression d'un produit
  const showCouchsInCart = document.getElementById("cart__items");
  const showTotalNumberOfCouchs = document.getElementById("totalQuantity");
  const showTotalPriceOfTheOrder = document.getElementById("totalPrice");

  //si le panier est vidé
  //----------------------------------------------------------------------------
  showCouchsInCart.innerHTML = "";
  //appel fonction pour calculer les quantités
  showTotalNumberOfCouchs.innerHTML = 0;
  //appel fonction pour calculer les prix
  showTotalPriceOfTheOrder.innerHTML = 0;

  //appel api pour récupérer les informations absentes du local storage
  //----------------------------------------------------------------------------
  for (i = 0; i < couchSelected.length; i++) {
    const fetchCouchSelectedData = () =>
      fetch(`http://localhost:3000/api/products/${couchSelected[i].couchId}`)
        .then((res) => {
          if (res.ok) {
            console.log("SUCCESS");
            return res.json();
          } else {
            console.log("Not Successful");
          }
        })
        .then((data) => {
          couchSelectedData = data;
        })
        .catch((error) => console.log("ERROR"));

    //affichage
    //----------------------------------------------------------------------------
    const showCart = async () => {
      //attente de la réponse de l'api
      await fetchCouchSelectedData();

      //ajouter les données du fetch api dans le local storage
      const addData = () => {
        for (i = 0; i < couchSelected.length; i++) {
          if (couchSelected[i].couchId == couchSelectedData._id) {
            let couchName = { couchName: couchSelectedData.name };
            let couchImg = { couchImg: couchSelectedData.imageUrl };
            let couchAlt = { couchAlt: couchSelectedData.altTxt };
            let couchPrice = { couchPrice: couchSelectedData.price };
            Object.assign(couchSelected[i], couchName);
            Object.assign(couchSelected[i], couchImg);
            Object.assign(couchSelected[i], couchAlt);
            Object.assign(couchSelected[i], couchPrice);
          }
        }
      };

      //création du contenu de la page
      addData();
      let content = "";
      for (couch of couchSelected)
        content += `<article class="cart__item" data-id="${
          couch.couchId
        }" data-color="${couch.couchColor}">
                <div class="cart__item__img">
                    <img src="${couch.couchImg || ""}" alt="${couch.couchAlt}">
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${couch.couchName}</h2>
                        <p>${couch.couchColor}</p>
                        <p>${couch.couchPrice} €</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                        <p>Qté : </p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${
                          couch.couchQuantity
                          //l'indentation ici n'est pas prise en compte par l'extension prettier
                        }" onchange="changeQuantity('${couch.couchId}','${
          couch.couchColor
        }', this.value)">
                        </div>
                        <div class="cart__item__content__settings__delete">
                        <p class="deleteItem" onclick="removeFromCart('${
                          couch.couchId
                        }','${couch.couchColor}')" >Supprimer</p>
                        </div>
                    </div>
                </div>
            </article>`;

      showCouchsInCart.innerHTML = content;
      //appel fonction pour calculer les quantités
      showTotalNumberOfCouchs.innerHTML = `${getNumberOfCouchs(couchSelected)}`;
      //appel fonction pour calculer les prix
      showTotalPriceOfTheOrder.innerHTML = `${getTotalPrice(couchSelected)}`;
    };
    showCart();
  }
};

data();

//----------------------------------------------------------------------------
//formulaire de commande
//----------------------------------------------------------------------------

//récupération des données du formulaire
//----------------------------------------------------------------------------

//sélection du bouton "commander!"
const getUserDatasForOrder = document.getElementById("order");

//récupération des valeurs dans le formulaire au click
getUserDatasForOrder.addEventListener("click", (event) => {
  event.preventDefault();

  //création de la variable qui va contenir les éléments
  let newOrderDatas = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    address: document.getElementById("address").value,
    city: document.getElementById("city").value,
    email: document.getElementById("email").value,
  };

  //----------------------------------------------------------------------------
  //fonctions du formulaire
  //----------------------------------------------------------------------------

  //pop up de confirmation pour commande validée
  const popupOrderConfirmation = () => {
    if (window.confirm(`Votre commande a bien été enregistrée`));
  };

  //validation du formulaire
  const formValidation = () => {
    //----------------------------------------------------------------------------
    //variables pour la validation du nom, du prénom et de la ville.
    let firstNameLastNameAndCityValidation = /^[a-z ,.'-]+$/i;
    let firstName = newOrderDatas.firstName;
    let lastName = newOrderDatas.lastName;
    let city = newOrderDatas.city;

    //variables pour la validation de l'adresse
    let addressValidation = /^[a-zA-Z0-9\s,.'-]{3,}$/;
    let address = newOrderDatas.address;

    //variables pour la validation de l'email
    let emailValidation = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    let email = newOrderDatas.email;
    //----------------------------------------------------------------------------

    //validation du prénom
    let isFirstNameValid =
      firstName == firstName.match(firstNameLastNameAndCityValidation);
    const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
    firstNameErrorMsg.innerHTML = isFirstNameValid
      ? //si ok le champs est vide
        ""
      : //sinon message d'alerte
        `Merci de renseigner votre prénom ici svp`;

    //validation du nom
    let isLastNameValid =
      lastName == lastName.match(firstNameLastNameAndCityValidation);
    const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
    lastNameErrorMsg.innerHTML = isLastNameValid
      ? //si ok le champs est vide
        ""
      : //sinon message d'alerte
        `Merci de renseigner votre nom ici svp`;

    //validation de l'adresse
    let isAddressValid = address == address.match(addressValidation);
    const addressErrorMsg = document.getElementById("addressErrorMsg");
    addressErrorMsg.innerHTML = isAddressValid
      ? //si ok le champs est vide
        ""
      : //sinon message d'alerte
        `Merci de renseigner votre adresse ici svp`;

    //validation de la ville
    let isCityValid = city == city.match(firstNameLastNameAndCityValidation);
    const cityErrorMsg = document.getElementById("cityErrorMsg");
    cityErrorMsg.innerHTML = isCityValid
      ? //si ok le champs est vide
        ""
      : //sinon message d'alerte
        `Merci de renseigner votre ville ici svp`;

    //validation de l'email
    let isEmailValid = email == email.match(emailValidation);
    const emailErrorMsg = document.getElementById("emailErrorMsg");
    emailErrorMsg.innerHTML = isEmailValid
      ? //si ok le champs est vide
        ""
      : //sinon message d'alerte
        `Merci de renseigner une adresse email valide ici svp`;

    //si tout est ok le formulaire est validé
    if (
      (isFirstNameValid,
      isLastNameValid,
      isAddressValid,
      isCityValid,
      isEmailValid)
    ) {
      return true;
    } else {
      return false;
    }
  };
  //----------------------------------------------------------------------------

  //envoi des informations dans le serveur
  //----------------------------------------------------------------------------

  if (formValidation()) {
    //récupération de l'id des produits
    productId = couchSelected.map((couch) => couch.couchId);

    //envoi de l'objet dans le serveur
    fetch(`http://localhost:3000/api/products/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contact: {
          firstName: newOrderDatas.firstName,
          lastName: newOrderDatas.lastName,
          address: newOrderDatas.address,
          city: newOrderDatas.city,
          email: newOrderDatas.email,
        },
        products: productId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        //confirmation de la commande
        popupOrderConfirmation();
        //redirection vers la page confirmation
        window.location.replace(
          `http://127.0.0.1:5500/front/html/confirmation.html?id=${data.orderId}`
        );
      });
  }
});
