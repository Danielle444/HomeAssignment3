const keyCurrentUser = "currentUser";

function getCurrentUserOrRedirect() {
  const currentUser = JSON.parse(localStorage.getItem(keyCurrentUser));
  if (!currentUser) {
    window.location.href = "login.html";
    return null;
  }
  return currentUser;
}

function setUserNameUI(user) {
  const nameP = document.getElementById("userName");
  if (nameP && user) {
    nameP.textContent = user.name;
  }
}

function getUserBookingsKey(user) {
  return user.name + "_bookings";
}

function getUserFavoritesKey(user) {
  return user.name + "_favorites";
}

const signOutBtn = document.getElementById("SignOut");
if (signOutBtn) {
  signOutBtn.addEventListener("click", function () {
    localStorage.removeItem(keyCurrentUser);
    window.location.href = "login.html";
  });
}

document.addEventListener("DOMContentLoaded", function() {
  const userNameElement = document.getElementById("userName");
  if (userNameElement) {
    const currentUser = getCurrentUserOrRedirect();
    if (currentUser) {
      setUserNameUI(currentUser);
    }
  }
});