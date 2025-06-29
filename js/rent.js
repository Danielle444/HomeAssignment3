//#region עברתי ונראה טוב
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
let datesOcupide = ``;
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
            datesOcupide = `${formatDateForDisplay(booking.startDate)} - ${formatDateForDisplay(booking.endDate)}`;
            return false;
        }
      }
  return true;
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
    const [year, month, day] = dateString.split('-'); 
    return `${day}/${month}/${year}`;
}

//#endregion

//#region צריך להאפיר את התאריכים שנכנסים למערך CSS
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
//#endregion

//#region נראה טוב עברתי
function disableDates(input, unavailableDates) {
  input.addEventListener("input", function () {
    const selected = input.value;
    if (unavailableDates.includes(selected)) {
      alert("This date is already booked. Please choose another.");
      input.value = "";
    }
  });
}

//#endregion

//#region NEW VALIDATION FUNCTIONS - הוספה חדשה
/**
 * Validates cardholder name - only English letters and spaces
 */
function validateCardholderName(name) {
    const nameRegex = /^[A-Za-z\s]+$/;
    return nameRegex.test(name.trim()) && name.trim().length >= 2;
}

/**
 * Validates Israeli ID number - exactly 9 digits
 */
function validateIdNumber(id) {
    const idRegex = /^\d{9}$/;
    return idRegex.test(id);
}

/**
 * Validates CVC - exactly 3 digits
 */
function validateCVC(cvc) {
    const cvcRegex = /^\d{3}$/;
    return cvcRegex.test(cvc);
}

/**
 * Validates email format
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validates expiry date - must be in the future
 */
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

/**
 * Calculates the number of nights between two dates
 */
function calculateNights(startDate, endDate) {
    if (!startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    return daysDiff > 0 ? daysDiff : 0;
}

/**
 * Updates the booking summary with calculated totals
 */
function updateBookingSummary() {
    const startDate = startInput.value;
    const endDate = endInput.value;
    const summaryDiv = document.getElementById('bookingSummary');
    
    if (!startDate || !endDate || !selectedApt) {
        summaryDiv.style.display = 'none';
        return;
    }
    
    const nights = calculateNights(startDate, endDate);
    if (nights <= 0) {
        summaryDiv.style.display = 'none';
        return;
    }
    
    // Extract price from selectedApt.price (remove $ and commas)
    const pricePerNight = parseFloat(selectedApt.price.replace(/[$,]/g, ''));
    const totalAmount = nights * pricePerNight;
    
    // Update summary display
    document.getElementById('numberOfNights').textContent = nights;
    document.getElementById('pricePerNight').textContent = selectedApt.price;
    document.getElementById('totalAmount').textContent = `$${totalAmount.toFixed(2)}`;
    
    summaryDiv.style.display = 'block';
}

//#endregion

// --- שליפת מזהי דירה ואלמנטים מהדף ---
const params = new URLSearchParams(location.search);
const listingId = params.get("listingId");
const selectedApt = amsterdam.find(function (apt) {
  return apt.listing_id === listingId;
});

//good
const container = document.getElementById("apartmentDetails");

if (!selectedApt) {
  container.innerHTML = "<p>Apartment not found.</p>";
} else {
      const rating = selectedApt.review_scores_rating ? 
      Math.round(selectedApt.review_scores_rating) : 0;
    const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
  container.innerHTML =`
      <div class="card-image-container">
        <img src="${selectedApt.picture_url}" alt="${selectedApt.name}" loading="lazy" />
      </div>
      <div class="card-content">
        <div class="card-header">
          <h3>${selectedApt.name}</h3>
        </div>
        <a href="${selectedApt.listing_url}" class="card-url" target="_blank" rel="noopener">View Original Listing</a>
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
              <span>${selectedApt.review_scores_rating || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
  `;
}

//#endregion
//#region 
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
//#endregion
//#region נראה טוב עברתי
function disableDates(input, unavailableDates) {
  input.addEventListener("input", function () {
    const selected = input.value;
    if (unavailableDates.includes(selected)) {
      alert("This date is already booked. Please choose another.");
      input.value = "";
    }
  });
}

const rentForm = document.getElementById("rentForm");
const startInput = document.getElementById("startDate");
const endInput = document.getElementById("endDate");
const ccInput = document.getElementById("ccNumber");
const message = document.getElementById("bookingMessage");

const currentUser = getCurrentUserOrRedirect();
const bookingsKey = getUserBookingsKey(currentUser);
const unavailableDates = getUnavailableDates(listingId);
disableDates(startInput, unavailableDates);
disableDates(endInput, unavailableDates);

//#region הוספה חדשה - input formatting
// Populate expiry years
const yearSelect = document.getElementById('expiryYear');
const currentYear = new Date().getFullYear();
for (let year = currentYear; year <= currentYear + 10; year++) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
}

// Format credit card input
ccInput.addEventListener("input", function () {
  let rawValue = ccInput.value.replace(/\D/g, "").slice(0, 16);
  let formattedValue = rawValue.match(/.{1,4}/g)?.join(" ") || "";
  ccInput.value = formattedValue;
});

// Format ID number input
const idInput = document.getElementById('idNumber');
idInput.addEventListener("input", function () {
    let rawValue = idInput.value.replace(/\D/g, "").slice(0, 9);
    idInput.value = rawValue;
});

// Format CVC input
const cvcInput = document.getElementById('cvcNumber');
cvcInput.addEventListener("input", function () {
    let rawValue = cvcInput.value.replace(/\D/g, "").slice(0, 3);
    cvcInput.value = rawValue;
});
//#endregion

// --- ולידציה חיה בזמן בחירת תאריכים ---
function validateDatesLive() {
  const startDate = startInput.value;
  const endDate = endInput.value;

  if (!startDate || !endDate) {
    message.textContent = "";
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(startDate);
  const end = new Date(endDate);

  
  if (start < today) {
    message.textContent = "Start date must be today or later.";
    message.style.color = "red";
    return;
  }

  if (start >= end) {
    message.textContent = "End date must be after start date.";
    message.style.color = "red";
    return;
  }

  // אם הכל תקין – ננקה את ההודעה ונעדכן סיכום
  message.textContent = "";
  updateBookingSummary();
}

startInput.addEventListener("change", validateDatesLive);
endInput.addEventListener("change", validateDatesLive);

// --- טיפול בשליחה (submit) של הטופס ---
rentForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const startDate = startInput.value;
  const endDate = endInput.value;
  const cardholderName = document.getElementById('cardholderName').value.trim();
  const idNumber = document.getElementById('idNumber').value.trim();
  const ccNumber = ccInput.value;
  const cvcNumber = document.getElementById('cvcNumber').value.trim();
  const expiryMonth = document.getElementById('expiryMonth').value;
  const expiryYear = document.getElementById('expiryYear').value;
  const email = document.getElementById('email').value.trim();

  // אם יש שגיאת ולידציה פעילה – לא נתקדם
  if (message.textContent !== "") return;

  // NEW VALIDATIONS
  if (!validateCardholderName(cardholderName)) {
    message.textContent = "Please enter a valid cardholder name (English letters only).";
    message.style.color = "red";
    return;
  }

  if (!validateIdNumber(idNumber)) {
    message.textContent = "Please enter a valid 9-digit ID number.";
    message.style.color = "red";
    return;
  }

  if (!validateCVC(cvcNumber)) {
    message.textContent = "Please enter a valid 3-digit CVC.";
    message.style.color = "red";
    return;
  }

  if (!validateExpiryDate(expiryMonth, expiryYear)) {
    message.textContent = "Please select a valid expiry date.";
    message.style.color = "red";
    return;
  }

  if (!validateEmail(email)) {
    message.textContent = "Please enter a valid email address.";
    message.style.color = "red";
    return;
  }

  const cleanCC = ccNumber.replace(/\s/g, ""); 

  if (!/^\d{16}$/.test(cleanCC)) {
    message.textContent = "Please enter a valid 16-digit credit card number.";
    message.style.color = "red";
    return;
  }

  const isAvailable = checkAvailability(listingId, startDate, endDate);
  if (!isAvailable) {
    message.textContent = `Sorry, the property is booked on the ${datesOcupide}.`;
    message.style.color = "red";
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

  message.textContent = "Your booking has been saved!";
  message.style.color = "green";
  rentForm.reset();

  setTimeout(function () {
    if (
      confirm("Your booking was saved! Would you like to view your bookings?")
    ) {
      window.location.href = "mybookings.html";
    }
  }, 300);
});
//#endregion