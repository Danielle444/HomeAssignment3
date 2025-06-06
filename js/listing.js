document.addEventListener("DOMContentLoaded", function () {
  console.log(amsterdam);
  const rentals = amsterdam;
//#region מספר חדרים
  const countHeader = document.getElementById("countRentals");
  //אולי נכון להוסיף את totatlHeader ב html? סתם כי הוא תמיד מופיעה
  const totalHeader = document.createElement("h4");
  totalHeader.textContent =
    "There are " + rentals.length + " rentals available in total";
  countHeader.insertAdjacentElement("beforebegin", totalHeader);

  countHeader.textContent = "Please choose your filters and click FILTER";

  const roomsDiv = document.getElementById("roomsContainer");
  const roomSelect = document.createElement("select");
  roomSelect.id = "slctRooms";
  roomsDiv.appendChild(roomSelect);

  const roomOptions = [];

  rentals.forEach(function (apt) {
    if (apt.bedrooms != null && !roomOptions.includes(apt.bedrooms)) {
      roomOptions.push(apt.bedrooms);
    }
  });

  roomOptions.sort(function (a, b) {
    return a - b;
  });

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "All";
  roomSelect.appendChild(defaultOption);

  roomOptions.forEach(function (num) {
    const opt = document.createElement("option");
    opt.value = num;
    opt.textContent = num + " rooms";
    roomSelect.appendChild(opt);
  });
//#endregion
//#region מינימום מקסימום  
const displayMin = document.getElementById("displayMin");
  const displayMax = document.getElementById("displayMax");
  const rngMin = document.getElementById("rngMinPrice");
  const rngMax = document.getElementById("rngMaxPrice");

let highestPrice = 0;
let lowestPrice = Infinity;
for(const rent of rentals)
{
  let cleanPrice = rent.price.trim().replace("$","");
  let numPrice = parseFloat(cleanPrice);
  if(highestPrice<numPrice)
  {
    highestPrice = numPrice;
  }
  if(lowestPrice>numPrice)
  {
    lowestPrice = numPrice;
  }
}

rngMin.min = lowestPrice;
rngMin.max = highestPrice;
rngMin.value = lowestPrice;
displayMin.textContent = rngMin.value + '$';

rngMax.min = lowestPrice;
rngMax.max = highestPrice;
rngMax.value = highestPrice;
displayMax.textContent = rngMax.value  + '$';

  rngMin.addEventListener("input", function () {
    displayMin.textContent = rngMin.value + '$';
  });

  rngMax.addEventListener("input", function () {
    displayMax.textContent = rngMax.value  + '$';
  });
//#endregion
  

const resultsSection = document.createElement("section");
  resultsSection.id = "results";
  document.body.appendChild(resultsSection);

 function displayResults(filtered) {
  const resultsSection = document.getElementById("results");
  resultsSection.innerHTML = "";

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  let favorites = [];

  if (currentUser) {
    const key = currentUser.name + "_favorites";
    favorites = JSON.parse(localStorage.getItem(key)) || [];
  }

  filtered.forEach(function (listing) {
    const card = document.createElement("div");
    card.className = "card";

    const isFav = favorites.includes(Number(listing.listing_id));
    const favText = isFav ? "Remove from Favorites" : "Add to Favorites";

    card.innerHTML =
      '<img src="' +
      listing.picture_url +
      '" alt="' +
      listing.name +
      '" />' +
      "<h3>" +
      listing.name +
      "</h3>" +
      "<p>" +
      listing.description +
      "</p>" +
      "<p><strong>Price:</strong> $" +
      listing.price +
      " | <strong>Rating:</strong> " +
      listing.review_scores_rating +
      "</p>" +
      "<button onclick=\"location.href='rent.html?id=" +
      listing.listing_id +
      "'\">Rent</button>" +
      '<button onclick="toggleFavorite(this, ' +
      listing.listing_id +
      ')">' +
      favText +
      "</button>";

    resultsSection.appendChild(card);
  });
}


  function filterRentals() {
    const minRating = parseInt(document.getElementById("slctMinRating").value);
    const minPrice = parseInt(rngMin.value);
    const maxPrice = parseInt(rngMax.value);
    const selectedRooms = roomSelect.value;

    const filtered = rentals.filter(function (r) {
      const rating = parseInt(r.review_scores_rating || 0);
      const price = parseFloat(r.price.replace("$", ""));
      const rooms = r.bedrooms;
      return (
        rating >= minRating &&
        price >= minPrice &&
        price <= maxPrice &&
        (selectedRooms === "" || rooms == selectedRooms)
      );
    });

    countHeader.textContent = "Found " + filtered.length + " rentals";
    displayResults(filtered);
  }

  document.getElementById("filter").addEventListener("click", filterRentals);
});
