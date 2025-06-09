// הרשמה והתחברות (usersList, currentUser)
const keyList = 'usersList';
const keyCurrentUser = 'currentUser';

// קבלת אלמנטים - Register
const signupUserName = document.getElementById('signupUserName');
const signupPassword = document.getElementById('signupPassword');
const btnSignup = document.getElementById('btnSignup');
const btnGoToLogin = document.getElementById('btnGoToLogin');

// קבלת אלמנטים - Login
const loginName = document.getElementById('loginName');
const loginPassword = document.getElementById('loginPassword');
const btnLogin = document.getElementById('btnLogin');
const btngoToRegister = document.getElementById('btngoToRegister');

/**
 * בודק האם משתמש קיים במערכת
 * @param {string} userName - שם המשתמש לבדיקה
 * @returns {number|undefined} - אינדקס המשתמש אם קיים, undefined אם לא
 */
function userExists(userName) {
    if (localStorage[keyList] !== undefined) {
        const usersList = JSON.parse(localStorage.getItem(keyList));
        for (let i = 0; i < usersList.length; i++) {
            if (usersList[i].name === userName) {
                return i;
            }
        }
    }
    return undefined;
}

/**
 * מעבר לדף התחברות
 */
if (btnGoToLogin) {
    btnGoToLogin.addEventListener('click', function () {
        window.location.href = "login.html";
    });
}

/**
 * מעבר לדף הרשמה
 */
if (btngoToRegister) {
    btngoToRegister.addEventListener('click', function () {
        window.location.href = "register.html";
    });
}

/**
 * הרשמת משתמש חדש
 */
if (btnSignup) {
    btnSignup.addEventListener('click', function () {
        const userName = signupUserName.value.trim();
        const password = signupPassword.value.trim();

        // בדיקת תקינות קלט
        if (!userName || !password) {
            alert('Please fill in all fields');
            return;
        }

        if (userName.length < 8 || password.length < 8) {
            alert('Username and password must be at least 8 characters long');
            return;
        }

        // בדיקה האם המשתמש כבר קיים
        const userIndex = userExists(userName);
        if (userIndex !== undefined) {
            alert("Username already exists");
            return;
        }

        // יצירת משתמש חדש
        const newUser = {
            name: userName,
            password: password
        };

        // שמירת המשתמש ברשימה
        let usersList = localStorage.getItem(keyList);
        if (!usersList) {
            usersList = [];
        } else {
            usersList = JSON.parse(usersList);
        }
        
        usersList.push(newUser);
        localStorage.setItem(keyList, JSON.stringify(usersList));
        
        alert("Registration successful");
        window.location.href = "login.html";
    });
}

/**
 * התחברות משתמש
 */
if (btnLogin) {
    btnLogin.addEventListener('click', function () {
        const userName = loginName.value.trim();
        const password = loginPassword.value.trim();

        // בדיקת תקינות קלט
        if (!userName || !password) {
            alert('Please fill in all fields');
            return;
        }

        // בדיקת קיום המשתמש
        const userIndex = userExists(userName);
        if (userIndex === undefined) {
            alert("User not found");
            return;
        }

        // בדיקת סיסמה
        const usersList = JSON.parse(localStorage.getItem(keyList));
        if (usersList[userIndex].password !== password) {
            alert("Incorrect password");
            return;
        }

        // שמירת המשתמש המחובר
        const currentUser = {
            name: userName,
            password: password
        };
        localStorage.setItem(keyCurrentUser, JSON.stringify(currentUser));
        
        alert("Login successful");
        window.location.href = "index.html";
    });
}