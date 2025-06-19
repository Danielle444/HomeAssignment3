	const keyList = 'usersList';
const keyCurrentUser = 'currentUser';

const signupUserName = document.getElementById('signupUserName');
const signupPassword = document.getElementById('signupPassword');
const btnSignup = document.getElementById('btnSignup');
const btnGoToLogin = document.getElementById('btnGoToLogin');

const loginName = document.getElementById('loginName');
const loginPassword = document.getElementById('loginPassword');
const btnLogin = document.getElementById('btnLogin');
const btngoToRegister = document.getElementById('btngoToRegister');

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

function showNotification(message, type = 'info') {
    const existingNotification = document.getElementById('notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.id = 'notification';
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.style.pointerEvents = 'none';
        button.style.opacity = '0.7';
        const originalText = button.querySelector('span').textContent;
        button.querySelector('span').textContent = 'LOADING...';
        button.setAttribute('data-original-text', originalText);
    } else {
        button.style.pointerEvents = 'auto';
        button.style.opacity = '1';
        const originalText = button.getAttribute('data-original-text');
        if (originalText) {
            button.querySelector('span').textContent = originalText;
        }
    }
}

if (btnGoToLogin) {
    btnGoToLogin.addEventListener('click', function () {
        setButtonLoading(btnGoToLogin, true);
        setTimeout(() => {
            window.location.href = "login.html";
        }, 300);
    });
}

if (btngoToRegister) {
    btngoToRegister.addEventListener('click', function () {
        setButtonLoading(btngoToRegister, true);
        setTimeout(() => {
            window.location.href = "register.html";
        }, 300);
    });
}

if (btnSignup) {
    btnSignup.addEventListener('click', function () {
        const userName = signupUserName.value.trim();
        const password = signupPassword.value.trim();

        if (!userName || !password) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        if (userName.length < 8 || password.length < 8) {
            showNotification('Username and password must be at least 8 characters long', 'error');
            return;
        }

        const userIndex = userExists(userName);
        if (userIndex !== undefined) {
            showNotification("Username already exists", 'error');
            return;
        }

        setButtonLoading(btnSignup, true);

        setTimeout(() => {
            const newUser = {
                name: userName,
                password: password
            };

            let usersList = localStorage.getItem(keyList);
            if (!usersList) {
                usersList = [];
            } else {
                usersList = JSON.parse(usersList);
            }
            
            usersList.push(newUser);
            localStorage.setItem(keyList, JSON.stringify(usersList));
            
            showNotification("Registration successful! Redirecting...", 'success');
            
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);
        }, 800);
    });
}

if (btnLogin) {
    btnLogin.addEventListener('click', function () {
        const userName = loginName.value.trim();
        const password = loginPassword.value.trim();

        if (!userName || !password) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        setButtonLoading(btnLogin, true);

        setTimeout(() => {
            const userIndex = userExists(userName);
            if (userIndex === undefined) {
                setButtonLoading(btnLogin, false);
                showNotification("User not found", 'error');
                return;
            }

            const usersList = JSON.parse(localStorage.getItem(keyList));
            if (usersList[userIndex].password !== password) {
                setButtonLoading(btnLogin, false);
                showNotification("Incorrect password", 'error');
                return;
            }

            const currentUser = {
                name: userName,
                password: password
            };
            localStorage.setItem(keyCurrentUser, JSON.stringify(currentUser));
            
            showNotification("Login successful! Welcome back!", 'success');
            
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);
        }, 800);
    });
}