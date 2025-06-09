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
  // TODO: לולאה על כל מפתחות ה-localStorage של המשתמשים
  // רמז - key.endsWith('_bookings')
  //      - קריאה לנתוני ההזמנות שלהם
  //      - חיפוש הזמנות עם listingId זה
  //      - שימוש ב-isDateRangeOverlap להשוואה בין טווחים
  // להחזיר false אם יש חפיפה, true אם פנוי
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.endsWith("_bookings")) {
      const bookings = JSON.parse(localStorage.getItem(key)) || [];

      for (let booking of bookings) {
        if (booking.listingId == listingId) {
          const overlap = isDateRangeOverlap(
            startDate,
            endDate,
            booking.startDate,
            booking.endDate
          );

          if (overlap) {
            return false;
          }
        }
      }
    }
  }
  return true;
}
// --- שליפת מזהי דירה ואלמנטים מהדף ---
const params = new URLSearchParams(location.search);
const listingId = params.get("listingId");
const selectedApt = amsterdam.find(function (apt) {
  return apt.listing_id == listingId;
});
const container = document.getElementById("apartmentDetails");

if (!selectedApt) {
  container.innerHTML = "<p>Apartment not found.</p>";
} else {
  container.innerHTML = `
    <img src="${selectedApt.picture_url}" alt="Apartment image" class="apartment-image">
    <h2>${selectedApt.name}</h2>
    <p><strong>Description:</strong> ${selectedApt.description}</p>
    <p><strong>Price:</strong> $${selectedApt.price} per night</p>
    <p><strong>Rating:</strong> ${selectedApt.review_scores_rating || "No rating available"}</p>
  `;
}
const bookingsKey = currentUser.username + "_bookings";

const rentForm = document.getElementById("rentForm");
const startInput = document.getElementById("startDate");
const endInput = document.getElementById("endDate");
const ccInput = document.getElementById("ccNumber");
const message = document.getElementById("bookingMessage");

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

  const isAvailable = checkAvailability(listingId, startDate, endDate);
  if (!isAvailable) {
    message.textContent = "Sorry, these dates are already booked.";
    message.style.color = "red";
    return;
  }

  const newBooking = {
    listingId: listingId,
    startDate: startDate,
    endDate: endDate
  };

  const previousBookings = JSON.parse(localStorage.getItem(bookingsKey)) || [];
  previousBookings.push(newBooking);
  localStorage.setItem(bookingsKey, JSON.stringify(previousBookings));

  message.textContent = "Your booking has been saved!";
  message.style.color = "green";
  rentForm.reset();

  setTimeout(function () {
  if (confirm("Your booking was saved! Would you like to view your bookings?")) {
    window.location.href = "mybookings.html";
  }
}, 300);
});
