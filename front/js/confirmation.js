//récupération de l'url d'un produit
//----------------------------------------------------------------------------
const query_Url = window.location.href;

//extraire l'id de l'url
//----------------------------------------------------------------------------
const urlId = query_Url.substring(query_Url.lastIndexOf("=") + 1);

//affichage du numéro de commande
//----------------------------------------------------------------------------
showOrderId = document.getElementById("orderId");
showOrderId.insertAdjacentHTML("beforeend", urlId);
