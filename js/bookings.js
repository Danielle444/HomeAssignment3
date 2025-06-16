//  הוספה/ביטול השכרות, לפי currentUser
document.addEventListener("DOMContentLoaded", function () {
  const currentUser = getCurrentUserOrRedirect();
  setUserNameUI(currentUser);

  const bookingsKey = getUserBookingsKey(currentUser);
  var bookings = JSON.parse(localStorage.getItem(bookingsKey)) || [];

  var container = document.getElementById("bookingsContainer");
  var noBookingsMessage = document.getElementById("noBookingsMessage");

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
  card.className = "booking-card";

  card.innerHTML = `
    <img src="${apartment.picture_url}" alt="${apartment.name}" class="thumbnail" />
    <div class="booking-info">
      <h3>${apartment.name}</h3>
      <p><strong>From:</strong> ${booking.startDate}</p>
      <p><strong>To:</strong> ${booking.endDate}</p>
      <p class="${isFuture ? "future" : "past"}">${isFuture ? "Upcoming Booking" : "Past Booking"}</p>
      ${
        isFuture
          ? `<button data-index="${index}" class="cancelBtn">Cancel</button>`
          : ""
      }
    </div>
  `;
  container.appendChild(card);
});

  container.addEventListener("click", function (event) {
    if (event.target.classList.contains("cancelBtn")) {
      var indexToRemove = parseInt(event.target.dataset.index);
      bookings.splice(indexToRemove, 1);
      localStorage.setItem(bookingsKey, JSON.stringify(bookings));
      location.reload();
    }
  });
});
