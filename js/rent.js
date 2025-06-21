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
 * @returns {bool} - true אם הזמנים פנויים, false אם יש חפיפה
 */
  let datesOcupide = ``;
function checkAvailability(listingId, startDate, endDate) {
  // TODO: לולאה על כל מפתחות ה-localStorage של המשתמשים
  // רמז - key.endsWith('_bookings')
  //      - קריאה לנתוני ההזמנות שלהם
  //      - חיפוש הזמנות עם listingId זה
  //      - שימוש ב-isDateRangeOverlap להשוואה בין טווחים
  // להחזיר false אם יש חפיפה, true אם פנוי
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
                if (booking.listingId == listingId) {
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
    const [year, month, day] = dateString.split('-'); // 
    return `${day}/${month}/${year}`;
}
// --- שליפת מזהי דירה ואלמנטים מהדף ---
const params = new URLSearchParams(location.search);
const listingId = params.get("listingId");
const selectedApt = amsterdam.find(function (apt) {
  return apt.listing_id == listingId;
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
            <div class="detail-value price-value">$${selectedApt.price}</div>
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
//#region צריך להאפיר את התאריכים שנכנסים למערך CSS
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

ccInput.addEventListener("input", function () {
  let rawValue = ccInput.value.replace(/\D/g, "").slice(0, 16);
  let formattedValue = rawValue.match(/.{1,4}/g)?.join(" ") || "";
  ccInput.value = formattedValue;
});

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

  // אם הכל תקין – ננקה את ההודעה
  message.textContent = "";
}

startInput.addEventListener("change", validateDatesLive);
endInput.addEventListener("change", validateDatesLive);

// --- טיפול בשליחה (submit) של הטופס ---
rentForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const startDate = startInput.value;
  const endDate = endInput.value;
  const ccNumber = ccInput.value;

  // אם יש שגיאת ולידציה פעילה – לא נתקדם
  if (message.textContent !== "") return;
  const cleanCC = ccNumber.replace(/\s/g, ""); 

  if (!/^\d{16}$/.test(cleanCC)) {
    message.textContent = "Please enter a valid 16-digit credit card number.";
    message.style.color = "red";
    return;
  }
  const isAvailable = checkAvailability(listingId, startDate, endDate);
  if (!isAvailable) {
    message.textContent = `Sorry, the proprety is booked on the ${datesOcupide}.`;
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
