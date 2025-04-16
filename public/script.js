// Dummy database (not needed now as we are fetching data from the server)
const existingUsers = ['Sahil', 'Bhushan', 'Atharva'];  // This is now just for UI logic
const colleges = [
  'TSEC', 'VESIT', 'IIT Kharagpur', 'IIT Delhi',
  'IIT Bombay', 'IIT Gandhinagar', 'NIT Manipur', 'IIT Chembur'
];

// Username live check with server
function checkUsername() {
  const username = document.getElementById('username').value.trim().toLowerCase();
  const userMsg = document.getElementById('userMsg');

  // AJAX request to check if the username exists on the server
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/usernameCheck', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function () {
    const response = JSON.parse(xhr.responseText);
    if (response.exists) {
      userMsg.textContent = 'Username already exists!';
    } else {
      userMsg.textContent = '';
    }
  };
  xhr.send(JSON.stringify({ username }));
}

// Password match check (unchanged)
function checkPasswordMatch() {
  const password = document.getElementById('password').value;
  const confirm = document.getElementById('confirmPassword').value;
  const passMsg = document.getElementById('passMsg');

  if (confirm.length > 0) {
    if (password !== confirm) {
      passMsg.textContent = 'Passwords do not match!';
    } else {
      passMsg.textContent = '';
    }
  } else {
    passMsg.textContent = '';
  }
}

// College suggestions using the server
// College suggestions using the server
function suggestCollege() {
  const input = document.getElementById('college').value.toLowerCase();
  const suggestionsBox = document.getElementById('suggestions');
  suggestionsBox.innerHTML = '';

  if (input.length === 0) {
    suggestionsBox.classList.add('d-none');
    return;
  }

  // AJAX request to get college suggestions from the server
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `/suggestColleges?query=${encodeURIComponent(input)}`, true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      try {
        const suggestions = JSON.parse(xhr.responseText);
        suggestionsBox.innerHTML = '';
        suggestionsBox.classList.remove('d-none');
        
        suggestions.forEach(college => {
          const div = document.createElement('div');
          div.textContent = college;
          div.className = 'suggestion-item';
          div.onclick = () => {
            document.getElementById('college').value = college;
            suggestionsBox.classList.add('d-none');
          };
          suggestionsBox.appendChild(div);
        });
      } catch (e) {
        console.error('Error parsing response:', e);
      }
    }
  };
  xhr.onerror = function() {
    console.error('Request failed');
  };
  xhr.send();
}

// Close suggestions when clicking outside
document.addEventListener('click', function(event) {
  const suggestionsBox = document.getElementById('suggestions');
  const collegeInput = document.getElementById('college');
  
  if (event.target !== collegeInput && !suggestionsBox.contains(event.target)) {
    suggestionsBox.classList.add('d-none');
  }
});

// Final registration (with server-side communication)
function submitForm() {
  const username = document.getElementById('username').value.trim().toLowerCase();
  const password = document.getElementById('password').value;
  const confirm = document.getElementById('confirmPassword').value;
  const message = document.getElementById('message');

  // Validate username and password
  if (existingUsers.includes(username)) {
    alert("Username already taken.");
    return false;
  }

  if (password !== confirm) {
    alert("Passwords do not match.");
    return false;
  }

  // Send registration data to the server
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/register', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function () {
    const response = JSON.parse(xhr.responseText);
    message.textContent = response.message;
    document.getElementById('registerForm').reset();
    document.getElementById('userMsg').textContent = '';
    document.getElementById('passMsg').textContent = '';
    document.getElementById('suggestions').innerHTML = '';
  };
  xhr.send(JSON.stringify({
    username,
    password,
    college: document.getElementById('college').value
  }));

  return false;
}
