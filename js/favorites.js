const currentUser = getCurrentUserOrRedirect();
const favoritesKey = getUserFavoritesKey(currentUser);

document.addEventListener("DOMContentLoaded", function () {
  loadFavorites();
});

function toggleFavorite(button, listingId) {
  let favorites = JSON.parse(localStorage.getItem(favoritesKey)) || [];

  listingId = Number(listingId);
  const index = favorites.indexOf(listingId);

  if (index === -1) {
    favorites.push(listingId);
    button.className = "card-btn btn-favorite favorited";
    button.setAttribute('aria-label', 'Remove from favorites');
  } else {
    favorites.splice(index, 1);
    button.className = "card-btn btn-favorite";
    button.setAttribute('aria-label', 'Add to favorites');
  }

  localStorage.setItem(favoritesKey, JSON.stringify(favorites));

  if (window.location.href.includes("favorites.html")) {
    loadFavorites();
  }
}

function cleanDescription(text) {
  return text
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function toggleDescription(event) {
  event.preventDefault();
  event.stopPropagation();
  
  const button = event.target;
  const descriptionContainer = button.previousElementSibling;
  const isExpanded = button.textContent === 'Show Less';
  
  if (isExpanded) {
    descriptionContainer.style.display = 'none';
    button.textContent = 'Show More';
  } else {
    descriptionContainer.style.display = 'block';
    descriptionContainer.textContent = button.dataset.fullText;
    button.textContent = 'Show Less';
  }
}

function loadFavorites() {
  const favoriteIds = JSON.parse(localStorage.getItem(favoritesKey)) || [];
  const favoritesContainer = document.getElementById("favoritesContainer");

  if (!favoritesContainer) return;

  if (typeof amsterdam === "undefined") {
    favoritesContainer.innerHTML = "<p class='no-favorites-message'>Data not loaded. Please try again later.</p>";
    return;
  }

  const favoriteRentals = amsterdam.filter(function (apt) {
    return favoriteIds.includes(Number(apt.listing_id));
  });

  if (favoriteRentals.length === 0) {
    favoritesContainer.innerHTML = "<p class='no-favorites-message'>You have no favorite rentals.</p>";
    return;
  }

  favoritesContainer.innerHTML = "";

  favoriteRentals.forEach(function (listing) {
    const card = document.createElement("div");
    card.className = "card";

    const rating = listing.review_scores_rating ? 
      Math.round(listing.review_scores_rating) : 0;
    const stars = "★".repeat(rating) + "☆".repeat(5 - rating);

    const fullDescription = cleanDescription(listing.description);
    
    // Create bedrooms display with bed icons
    let bedroomsHTML = '';
    if (listing.bedrooms && listing.bedrooms > 0) {
      const bedIcons = '🛏️'.repeat(Math.min(listing.bedrooms, 5)); // Max 5 icons for display
      const bedroomsText = listing.bedrooms === 1 ? 'bedroom' : 'bedrooms';
      bedroomsHTML = `
        <div class="card-bedrooms">
          <span class="bedrooms-icons">${bedIcons}</span>
          <span class="bedrooms-text">${listing.bedrooms} ${bedroomsText}</span>
        </div>
      `;
    } else {
      bedroomsHTML = `
        <div class="card-bedrooms">
          <span class="bedrooms-icons">❓</span>
          <span class="bedrooms-text">Bedrooms info not available</span>
        </div>
      `;
    }

    card.innerHTML = `
      <div class="card-image-container">
        <img src="${listing.picture_url}" alt="${listing.name}" loading="lazy" />
      </div>
      <div class="card-content">
        <div class="card-header">
          <h3>${listing.name}</h3>
        </div>
        <a href="${listing.listing_url}" class="card-url" target="_blank" rel="noopener">View Original Listing</a>
        ${bedroomsHTML}
        <p class="card-description" style="display: none;"></p>
        <button class="btn-toggle-description card-btn" data-full-text="${fullDescription}">Show More</button>
        <div class="card-details">
          <div class="detail-item">
            <div class="detail-label">Price per night</div>
            <div class="detail-value price-value">${listing.price}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Rating</div>
            <div class="detail-value rating-value">
              <span class="rating-stars">${stars}</span>
              <span>${listing.review_scores_rating || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="card-actions">
        <button onclick="location.href='rent.html?listingId=${listing.listing_id}'" class="card-btn btn-rent">Book Now</button>
        <button onclick="toggleFavorite(this, ${listing.listing_id})" class="card-btn btn-favorite favorited"></button>
      </div>
    `;
    favoritesContainer.appendChild(card);
  });

  const toggleButtons = document.querySelectorAll('.btn-toggle-description');
  toggleButtons.forEach(function(button) {
    button.addEventListener('click', toggleDescription);
  });
}