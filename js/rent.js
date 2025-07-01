//  ניהול תהליך השכרה של דירה אחת

/**
 * פונקציית עזר לבדיקת חפיפה בין שני טווחי תאריכים.
 * מחזירה true אם יש חפיפה, false אם אין.
 * @param {string} start1 - תאריך התחלה של הטווח הראשון (בפורמט 'YYYY-MM-DD')
 * @param {string} end1 - תאריך סיום של הטווח הראשון (בפורמט 'YYYY-MM-DD')
 * @param {string} start2 - תאריך התחלה של הטווח השני (בפורמט 'YYYY-MM-DD')
 * @param {string} end2 - תאריך סיום של הטווח השני (בפורמט 'YYYY-MM-DD')
 * @returns {boolean} - האם יש חפיפה בין הטווחים
 */
function isDateRangeOverlap(start1, end1, start2, end2) {
  return !(end1 < start2 || start1 > end2);
}

/**
 * בודק האם הטווח שהתבקש פנוי להשכרה בדירה מסוימת.
 * יש לממש את החלק של קריאת ההזמנות ב-localStorage והבדיקה בעזרת isDateRangeOverlap.
 * @param {string} listingId - מזהה הדירה
 * @param {string} startDate - תאריך התחלה שנבחר להשכרה
 * @param {string} endDate - תאריך סיום שנבחר להשכרה
 * @returns {boolean} - true אם הזמנים פנויים, false אם יש חפיפה
 */

function checkAvailability(listingId, startDate, endDate) {
  const unavailable = [];
  const bookings = getBookingsForListing(listingId);
  for (let booking of bookings) {
    const overlap = isDateRangeOverlap(
      startDate,
      endDate,
      booking.startDate,
      booking.endDate
    );
    if (overlap) {
      const conflictRange = `${formatDateForDisplay(
        booking.startDate
      )} - ${formatDateForDisplay(booking.endDate)}`;
      return { available: false, conflictRange: conflictRange };
    }
  }
  return { available: true };
}

/**
 * פונקציית עזר לחיפוש כל התאריכים התפוסים של הדיה
 * מחזירה את כל ההזמנות שבוצעו עבור דירה ספציפית.
 * @param {string} listingId - מזהה הדירה לחיפוש
 * @returns {Array} - מערך של כל ההזמנות עבור הדירה
 */
function getBookingsForListing(listingId) {
  const allBookingsForListing = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.endsWith("_bookings")) {
      const userBookings = JSON.parse(localStorage.getItem(key)) || [];
      for (const booking of userBookings) {
        if (booking.listingId === listingId) {
          allBookingsForListing.push(booking);
        }
      }
    }
  }
  return allBookingsForListing;
}

/**
 * ממירה מחרוזת תאריך מפורמט 'YYYY-MM-DD' לפורמט 'DD/MM/YYYY'.
 * @param {string} dateString - מחרוזת התאריך בפורמט 'YYYY-MM-DD'.
 * @returns {string} - מחרוזת התאריך המעוצבת 'DD/MM/YYYY'.
 */
function formatDateForDisplay(dateString) {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

/**
 * מציגה הודעת התראה למשתמש.
 * @param {string} message - ההודעה להצגה.
 * @param {string} type - סוג ההודעה.
 */
function showNotification(message, type = "error") {
  const existingNotification = document.getElementById("notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement("div");
  notification.id = "notification";
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("show");
  }, 100);

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 500);
  }, 3000);
}

//בעת הזמנת מקום התאריכים שנבחרו משוריינים לימים מלאים
function getUnavailableDates(listingId) {
  const unavailable = [];
  const bookings = getBookingsForListing(listingId);

  bookings.forEach(function (booking) {
    let current = new Date(booking.startDate);
    const end = new Date(booking.endDate);

    while (current <= end) {
      const iso = current.toISOString().split("T")[0];
      unavailable.push(iso);
      current.setDate(current.getDate() + 1);
    }
  });

  return unavailable;
}

function disableDates(input, unavailableDates) {
  input.addEventListener("input", function () {
    const selected = input.value;
    if (unavailableDates.includes(selected)) {
      showNotification(
        "This date is already booked. Please choose another.",
        "error"
      );
      input.value = "";
    }
  });
}

function validateCardholderName(name) {
  const nameRegex = /^[A-Za-z\s]+$/;
  return nameRegex.test(name.trim()) && name.trim().length >= 2;
}

function validateIdNumber(id) {
  const idRegex = /^\d{9}$/;
  return idRegex.test(id);
}

function validateCVC(cvc) {
  const cvcRegex = /^\d{3}$/;
  return cvcRegex.test(cvc);
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateExpiryDate(month, year) {
  if (!month || !year) return false;

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const expiryYear = parseInt(year);
  const expiryMonth = parseInt(month);

  if (expiryYear > currentYear) return true;
  if (expiryYear === currentYear && expiryMonth >= currentMonth) return true;

  return false;
}

function calculateNights(startDate, endDate) {
  if (!startDate || !endDate) return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDiff = end.getTime() - start.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  return daysDiff > 0 ? daysDiff : 0;
}

function updateBookingSummary() {
  const startDate = startInput.value;
  const endDate = endInput.value;
  const summaryDiv = document.getElementById("bookingSummary");

  if (!startDate || !endDate || !selectedApt) {
    summaryDiv.style.display = "none";
    return;
  }

  const nights = calculateNights(startDate, endDate);
  if (nights <= 0) {
    summaryDiv.style.display = "none";
    return;
  }

  const pricePerNight = parseFloat(selectedApt.price.replace(/[$,]/g, ""));
  const totalAmount = nights * pricePerNight;

  document.getElementById("numberOfNights").textContent = nights;
  document.getElementById("pricePerNight").textContent = selectedApt.price;
  document.getElementById("totalAmount").textContent = `$${totalAmount.toFixed(
    2
  )}`;

  summaryDiv.style.display = "block";
}

const params = new URLSearchParams(location.search);
const listingId = params.get("listingId");
const selectedApt = amsterdam.find(function (apt) {
  return apt.listing_id === listingId;
});

const container = document.getElementById("apartmentDetails");

if (!selectedApt) {
  container.innerHTML = "<p>Apartment not found.</p>";
} else {
  const rating = selectedApt.review_scores_rating
    ? Math.round(selectedApt.review_scores_rating)
    : 0;
  const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
  container.innerHTML = `
      <div class="card-image-container">
        <img src="${selectedApt.picture_url}" alt="${
    selectedApt.name
  }" loading="lazy" />
      </div>
      <div class="card-content">
        <div class="card-header">
          <h3>${selectedApt.name}</h3>
        </div>
        <a href="${
          selectedApt.listing_url
        }" class="card-url" target="_blank" rel="noopener">View Original Listing</a>
        <p class="card-description">${selectedApt.description}</p>
        <div class="card-details">
          <div class="detail-item">
            <div class="detail-label">Price per night</div>
            <div class="detail-value price-value">${selectedApt.price}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Rating</div>
            <div class="detail-value rating-value">
              <span class="rating-stars">${stars}</span>
              <span>${selectedApt.review_scores_rating || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>
  `;
}

const rentForm = document.getElementById("rentForm");
const startInput = document.getElementById("startDate");
const endInput = document.getElementById("endDate");
const ccInput = document.getElementById("ccNumber");

const currentUser = getCurrentUserOrRedirect();
const bookingsKey = getUserBookingsKey(currentUser);
const unavailableDates = getUnavailableDates(listingId);
disableDates(startInput, unavailableDates);
disableDates(endInput, unavailableDates);

const yearSelect = document.getElementById("expiryYear");
const currentYear = new Date().getFullYear();
for (let year = currentYear; year <= currentYear + 10; year++) {
  const option = document.createElement("option");
  option.value = year;
  option.textContent = year;
  yearSelect.appendChild(option);
}

ccInput.addEventListener("input", function () {
  let rawValue = ccInput.value.replace(/\D/g, "").slice(0, 16);
  let formattedValue = rawValue.match(/.{1,4}/g)?.join(" ") || "";
  ccInput.value = formattedValue;
});

const idInput = document.getElementById("idNumber");
idInput.addEventListener("input", function () {
  let rawValue = idInput.value.replace(/\D/g, "").slice(0, 9);
  idInput.value = rawValue;
});

const cvcInput = document.getElementById("cvcNumber");
cvcInput.addEventListener("input", function () {
  let rawValue = cvcInput.value.replace(/\D/g, "").slice(0, 3);
  cvcInput.value = rawValue;
});

function validateDatesLive() {
  const startDate = startInput.value;
  const endDate = endInput.value;

  if (!startDate || !endDate) {
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start < today) {
    showNotification("Start date must be today or later.", "error");
    return;
  }

  if (start >= end) {
    showNotification("End date must be after start date.", "error");
    return;
  }

  const result = checkAvailability(listingId, startDate, endDate);
  if (!result.available) {
    showNotification(
      `Sorry, the property is booked on the ${result.conflictRange}.`,
      "error"
    );
    return;
  }
  updateBookingSummary();
}

startInput.addEventListener("input", validateDatesLive);
endInput.addEventListener("input", validateDatesLive);

rentForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const errors = [];

  const startDate = startInput.value;
  const endDate = endInput.value;
  const cardholderName = document.getElementById("cardholderName").value.trim();
  const idNumber = document.getElementById("idNumber").value.trim();
  const ccNumber = ccInput.value.replace(/\s/g, "");
  const cvcNumber = document.getElementById("cvcNumber").value.trim();
  const expiryMonth = document.getElementById("expiryMonth").value;
  const expiryYear = document.getElementById("expiryYear").value;
  const email = document.getElementById("email").value.trim();

  if (!startDate || !endDate) {
    errors.push("Please select check-in and check-out dates.");
  }

  if (!validateCardholderName(cardholderName)) {
    errors.push("Please enter a valid cardholder name (English letters only).");
  }
  if (!validateIdNumber(idNumber)) {
    errors.push("Please enter a valid 9-digit ID number.");
  }
  if (!/^\d{16}$/.test(ccNumber)) {
    errors.push("Please enter a valid 16-digit credit card number.");
  }
  if (!validateCVC(cvcNumber)) {
    errors.push("Please enter a valid 3-digit CVC.");
  }
  if (!validateExpiryDate(expiryMonth, expiryYear)) {
    errors.push("Please select a valid expiry date.");
  }
  if (!validateEmail(email)) {
    errors.push("Please enter a valid email address.");
  }

  if (errors.length === 0) {
    const result = checkAvailability(listingId, startDate, endDate);
    if (!result.available) {
      errors.push(
        `Sorry, the property is booked on the ${result.conflictRange}.`
      );
    }
  }

  if (errors.length > 0) {
    showNotification(errors[0], "error");
    return;
  }

  const newBooking = {
    listingId: listingId,
    startDate: startDate,
    endDate: endDate,
  };

  const previousBookings = JSON.parse(localStorage.getItem(bookingsKey)) || [];
  previousBookings.push(newBooking);
  localStorage.setItem(bookingsKey, JSON.stringify(previousBookings));

  showNotification("Your booking has been saved!", "success");
  rentForm.reset();
  document.getElementById("bookingSummary").style.display = "none";

  setTimeout(function () {
    if (
      confirm("Your booking was saved! Would you like to view your bookings?")
    ) {
      window.location.href = "mybookings.html";
    }
  }, 500);
});
