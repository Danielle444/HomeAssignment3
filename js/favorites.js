// ניהול מועדפים לפי currentUser

const currentUser = getCurrentUserOrRedirect();
const favoritesKey = getUserFavoritesKey(currentUser);

function toggleFavorite(button, listingId) {
  let favorites = JSON.parse(localStorage.getItem(favoritesKey)) || [];

  listingId = Number(listingId);
  const index = favorites.indexOf(listingId);

  if (index === -1) {
    favorites.push(listingId);
    button.textContent = "Remove from Favorites";
  } else {
    favorites.splice(index, 1);
    button.textContent = "Add to Favorites";
  }

  localStorage.setItem(favoritesKey, JSON.stringify(favorites));

  if (window.location.href.includes("favorites.html")) {
    location.reload();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const favoriteIds = JSON.parse(localStorage.getItem(favoritesKey)) || [];

  const favoritesContainer = document.getElementById("favoritesContainer");
  if (!favoritesContainer) return;

  if (typeof amsterdam === "undefined") {
    favoritesContainer.innerHTML =
      "<p>Data not loaded. Please try again later.</p>";
    return;
  }

  const favoriteRentals = amsterdam.filter(function (apt) {
    return favoriteIds.includes(Number(apt.listing_id));
  });

  if (favoriteRentals.length === 0) {
    favoritesContainer.innerHTML = "<p>You have no favorite rentals.</p>";
    return;
  }

  favoritesContainer.innerHTML = "";

  favoriteRentals.forEach(function (listing) {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
            <img src="${listing.picture_url}" alt="${listing.name}" />
            <h3>${listing.name}</h3>
            <h5>${listing.listing_id}</h5>
            <a href="${listing.listing_url}">${listing.listing_url}</a>
            <p>${listing.description}</p>
            <p><strong>Price:</strong> $${listing.price} | <strong>Rating:</strong> ${listing.review_scores_rating}</p>
            <button onclick="location.href='rent.html?listingId=${listing.listing_id}'">Rent</button>
            <button onclick="toggleFavorite(this, ${listing.listing_id})">Remove From Favorites</button>
        `;
    favoritesContainer.appendChild(card);
  });
});
