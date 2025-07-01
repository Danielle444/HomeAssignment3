document.addEventListener("DOMContentLoaded", function () {
  console.log(amsterdam);
  const rentals = amsterdam;
  
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }
  
  const countHeader = document.getElementById("countRentals");
  const totalHeader = document.createElement("h4");
  totalHeader.textContent = `Discover ${rentals.length} unique properties waiting for you`;
  countHeader.insertAdjacentElement("beforebegin", totalHeader);

  countHeader.textContent = "Use our smart filters to find your perfect Amsterdam escape";

  const roomsDiv = document.getElementById("roomsContainer");
  const roomSelect = document.createElement("select");
  roomSelect.id = "slctRooms";
  roomSelect.className = "filter-select";
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
  defaultOption.textContent = "All rooms";
  roomSelect.appendChild(defaultOption);

  roomOptions.forEach(function (num) {
    const opt = document.createElement("option");
    opt.value = num;
    opt.textContent = num + " rooms";
    roomSelect.appendChild(opt);
  });

  const displayMin = document.getElementById("displayMin");
  const displayMax = document.getElementById("displayMax");
  const rngMin = document.getElementById("rngMinPrice");
  const rngMax = document.getElementById("rngMaxPrice");

  let highestPrice = 0;
  let lowestPrice = Infinity;
  for (const rent of rentals) {
    let cleanPrice = rent.price.replace(",", "").replace("$", "").trim();
    let numPrice = parseFloat(cleanPrice);
    if (highestPrice < numPrice) {
      highestPrice = numPrice;
    }
    if (lowestPrice > numPrice) {
      lowestPrice = numPrice;
    }
  }

  rngMin.min = lowestPrice;
  rngMin.max = highestPrice;
  rngMin.value = lowestPrice;
  displayMin.textContent = rngMin.value + "$";

  rngMax.min = lowestPrice;
  rngMax.max = highestPrice;
  rngMax.value = highestPrice;
  displayMax.textContent = rngMax.value + "$";

  rngMin.addEventListener("input", function () {
    displayMin.textContent = rngMin.value + "$";
  });

  rngMax.addEventListener("input", function () {
    displayMax.textContent = rngMax.value + "$";
  });

  const ratingSelect = document.getElementById("slctMinRating");
  ratingSelect.innerHTML = "";

  const ratingOptions = new Set();

  rentals.forEach(function (r) {
    const rating = parseInt(r.review_scores_rating);
    if (!isNaN(rating)) {
      ratingOptions.add(rating);
    }
  });

  const sortedRatings = Array.from(ratingOptions).sort((a, b) => a - b);

  const defaultOpt = document.createElement("option");
  defaultOpt.value = 0;
  defaultOpt.textContent = "Any";
  ratingSelect.appendChild(defaultOpt);

  sortedRatings.forEach(function (rating) {
    const opt = document.createElement("option");
    opt.value = rating;
    opt.textContent = rating + (rating > 1 ? " stars" : " star");
    ratingSelect.appendChild(opt);
  });

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

  function displayResults(filtered) {
    const resultsSection = document.getElementById("results");
    resultsSection.innerHTML = "";
    const currentUser = getCurrentUserOrRedirect();
    const favoritesKey = getUserFavoritesKey(currentUser);
    const favorites = JSON.parse(localStorage.getItem(favoritesKey)) || [];

    filtered.forEach(function (listing) {
      const card = document.createElement("div");
      card.className = "card";

      const isFav = favorites.includes(Number(listing.listing_id));
      const favText = isFav ? "Remove from Favorites" : "Add to Favorites";
      const favClass = isFav ? "favorited" : "";

      const rating = listing.review_scores_rating ? 
        Math.round(listing.review_scores_rating) : 0;
      const stars = "★".repeat(rating) + "☆".repeat(5 - rating);

      const fullDescription = cleanDescription(listing.description);
      
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
          <div class="availability-badge">Available</div>
        </div>
        <div class="card-content">
          <div class="card-header">
            <h3>${listing.name}</h3>
            <span class="card-id">ID: ${listing.listing_id}</span>
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
          <button onclick="toggleFavorite(this, ${listing.listing_id})" class="card-btn btn-favorite ${favClass}" aria-label="${favText}"></button>
        </div>
      `;

      resultsSection.appendChild(card);
    });

    const toggleButtons = document.querySelectorAll('.btn-toggle-description');
    toggleButtons.forEach(function(button) {
      button.addEventListener('click', toggleDescription);
    });
  }

  function filterRentals() {
    const minRating = parseInt(ratingSelect.value);
    const minPrice = parseInt(rngMin.value);
    const maxPrice = parseInt(rngMax.value);
    const selectedRooms = roomSelect.value;

    if (minPrice > maxPrice) {
      alert(
        "The minimum price can't be larger than the maximum price filtered"
      );
      return;
    }

    const filtered = rentals.filter(function (r) {
      const rating = parseInt(r.review_scores_rating || 0);
      const price = parseFloat(
        r.price.replace(",", "").replace("$", "").trim()
      );
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