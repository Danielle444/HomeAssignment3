//  הוספה/ביטול השכרות, לפי currentUser
document.addEventListener("DOMContentLoaded", function () {
  const currentUser = getCurrentUserOrRedirect();
  setUserNameUI(currentUser);

  const bookingsKey = getUserBookingsKey(currentUser);
  const bookings = JSON.parse(localStorage.getItem(bookingsKey)) || [];

 function getStartOfDay(date) {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

const today = getStartOfDay(new Date()); // היום, בשעת חצות
const currentBookings = [];
const futureBookings = [];
const pastBookings = [];

bookings.forEach(booking => {
  const startDate = getStartOfDay(booking.startDate);
  const endDate = getStartOfDay(booking.endDate);

  if (endDate < today) {
    booking.status = "past";
    pastBookings.push(booking);
  } else if (startDate > today) {
    booking.status = "future";
    futureBookings.push(booking);
  } else {
    booking.status = "current";
    currentBookings.push(booking);
  }
});

  futureBookings.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  pastBookings.sort((a, b) => new Date(b.endDate) - new Date(a.endDate));
  currentBookings.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));

  const sortedBookings  = currentBookings.concat(futureBookings, pastBookings);

  const container = document.getElementById("bookingsContainer");
  const noBookingsMessage = document.getElementById("noBookingsMessage");
  const filterError = document.getElementById("filterError"); 

const filterCheckboxContainer = document.getElementById("filterCheckbox");
    const filterButton = document.getElementById("filterButton");

    const availableStatuses = {
        "future": futureBookings,
        "current": currentBookings,
        "past": pastBookings,
    };

    let filtersCreated = false;
    for (const status in availableStatuses) {
        if (availableStatuses[status].length > 0) {
            const label = document.createElement("label");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.name = "status";
            checkbox.value = status;
            checkbox.checked = true; 

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(` ${status.charAt(0).toUpperCase() + status.slice(1)}`));
            filterCheckboxContainer.appendChild(label);
            filtersCreated = true;
        }
    }



    if (filtersCreated) {
        filterButton.style.display = "block";
    }

function ShowBookings(sortedBookings)
{
  container.innerHTML = "";

  if (sortedBookings.length === 0) {
    noBookingsMessage.style.display = "block";
    return;
  } else {
    noBookingsMessage.style.display = "none";
  }
  let status = "";
      let statusGroupContainer = null;

sortedBookings.forEach(function (booking, index) {
console.log(`check index ${index}`);
  let isFirstStatus = false;

if(index===0)
{
         isFirstStatus = true;

}
else{
console.log(`check status ${status}`);
if(status !== booking.status)
  {
       isFirstStatus = true;
  }
}
status=booking.status;
  const isFuture = status === "future";
  const apartment = amsterdam.find(function (apt) {
    return apt.listing_id.toString() === booking.listingId.toString();
  });
    if (!apartment) return;
    if(isFirstStatus)
    {
            const statusTitle = document.createElement("h2");
            statusTitle.className = "status-title";
            statusTitle.textContent = `${status.toUpperCase()} Bookings`;
            container.appendChild(statusTitle);

            // יצירת ה-div שיעטוף את כל הכרטיסים בקבוצה
            statusGroupContainer = document.createElement("div"); // 
            statusGroupContainer.className = "status-group";
            container.appendChild(statusGroupContainer); // 
    }
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
      <p class="${status}">${status.charAt(0).toUpperCase() + status.slice(1)} Booking</p>
      </div>
    </div>
    <div class="card-actions">
      ${
          isFuture
            ? `<button data-listing-id="${booking.listingId}" class="card-btn cancelBtn">Cancel</button>`
            : ""
      }
    </div>
  </div>
`;
if(statusGroupContainer)
{
  statusGroupContainer.appendChild(card);
}
else
{
  container.appendChild(card);
}
});
}

ShowBookings(sortedBookings);

    filterButton.addEventListener("click", function() {
        filterError.style.display = "none";
        const selectedStatuses = [];
        const checkboxes = filterCheckboxContainer.querySelectorAll("input[type='checkbox']:checked");
        checkboxes.forEach(checkbox => {
            selectedStatuses.push(checkbox.value);
        });
            if (selectedStatuses.length === 0) {
        container.innerHTML = ""; 
        noBookingsMessage.style.display = "none"; 
        filterError.style.display = "block";
        return;
    }
        const filteredBookings = sortedBookings.filter(booking => selectedStatuses.includes(booking.status));
        ShowBookings(filteredBookings);

    });


container.addEventListener("click", function (event) {
  if (event.target.classList.contains("cancelBtn")) {
    const idToRemove = event.target.dataset.listingId; 

    const indexToRemove = bookings.findIndex(b => b.listingId.toString() === idToRemove.toString());

    if (indexToRemove > -1) {
      bookings.splice(indexToRemove, 1);
      localStorage.setItem(bookingsKey, JSON.stringify(bookings));
      location.reload();
    }
  }
});
});
