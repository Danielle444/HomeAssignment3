//  הוספה/ביטול השכרות, לפי currentUser
document.addEventListener("DOMContentLoaded", function () {
  const currentUser = getCurrentUserOrRedirect();
  setUserNameUI(currentUser);

  const bookingsKey = getUserBookingsKey(currentUser);
  const bookings = JSON.parse(localStorage.getItem(bookingsKey)) || [];

  const container = document.getElementById("bookingsContainer");
  const noBookingsMessage = document.getElementById("noBookingsMessage");
  
  if (bookings.length === 0) {
    noBookingsMessage.style.display = "block";
    return;
  } else {
    noBookingsMessage.style.display = "none";
  }

bookings.forEach(function (booking, index) {
  const isFuture = new Date(booking.startDate) > new Date();
  const apartment = amsterdam.find(function (apt) {
    return apt.listing_id === booking.listingId;
  });

  if (!apartment) return;
const card = document.createElement("div");
card.className = "card";

card.innerHTML = `
  <div class="card-image-container">
    <img src="${apartment.picture_url}" alt="${apartment.name}" class="thumbnail" />
  </div>
  <div class="card-content">
    <div class="card-header">
      <h3>${apartment.name}</h3>
    </div>
    <div class="card-details">
      <div class="detail-item">
        <p><strong>From:</strong> ${booking.startDate}</p>
      </div>
      <div class="detail-item">
        <p><strong>To:</strong> ${booking.endDate}</p>
      </div>
      <div class="detail-item">
        <p class="${isFuture ? "future" : "past"}">${
  isFuture ? "Upcoming Booking" : "Past Booking"
}</p>
      </div>
    </div>
    <div class="card-actions">
      ${
        isFuture
          ? `<button data-index="${index}" class="card-btn cancelBtn">Cancel</button>`
          : ""
      }
    </div>
  </div>
`;
container.appendChild(card);
});

  container.addEventListener("click", function (event) {
    if (event.target.classList.contains("cancelBtn")) {
      const indexToRemove = parseInt(event.target.dataset.index);
      bookings.splice(indexToRemove, 1);
      localStorage.setItem(bookingsKey, JSON.stringify(bookings));
      location.reload();
    }
  });
});
