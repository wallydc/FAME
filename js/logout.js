
const sessionToken = sessionStorage.getItem("authToken");

// UI ELEMENT REFERENCES
const tologout = document.getElementById("logout");

// click event listener
tologout.addEventListener("click", function () {
  console.log('Logging out...');
  logoutUser(sessionToken);
});

async function logoutUser(sessionToken) {
  try {
    const response = await fetch(`${BASE_URL}1/logout`, {
      method: 'POST',
      headers: {
        'X-Parse-Application-Id': APP_ID,
        'X-Parse-REST-API-Key': REST_API_KEY,
        'X-Parse-Session-Token': sessionToken, // The token to invalidate
        'Content-Type': 'application/json'
      },
      // An empty object is sometimes required for the request body
      body: JSON.stringify({})
    });

    if (response.ok) {
      console.log('Logged out via REST API.');
      // You must manually clear the token from your client-side storage (e.g., localStorage)
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem("getID");
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem("getimagePic");
      sessionStorage.removeItem("editMode");
      sessionStorage.removeItem("trackClicked");
      sessionStorage.removeItem("locClicked");
      sessionStorage.removeItem("reset");
      sessionStorage.removeItem("drawMode");
      sessionStorage.removeItem("add_Latitude");
      sessionStorage.removeItem("add_Longitude");

      localStorage.clear();

      // Redirect user
      window.location.replace("login.html");
    } else {
      const errorData = await response.json();
      console.error('Logout failed:', errorData);
    }
  } catch (error) {
    console.error('Network error during logout:', error);
  }
}

(() => {
  const INACTIVITY_LIMIT_MS = 15 * 60 * 1000; // 15 minutes
  let lastActivityTime = Date.now();
  let consoleInterval;

  const events = [
    'mousemove',
    'mousedown',
    'keydown',
    'scroll',
    'touchstart',
    'click'
  ];

  function updateLastActivity() {
    lastActivityTime = Date.now();
  }

  function startConsoleTimer() {
    clearInterval(consoleInterval);

    consoleInterval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastActivityTime;
      const remaining = INACTIVITY_LIMIT_MS - elapsed;

      if (remaining <= 0) {
        clearInterval(consoleInterval);
        logoutUser(sessionToken);
        return;
      }

      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);

      // console.clear();
      /* console.log(
        `Auto logout in: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      ); */
    }, 1000);
  }

  // 🔹 Detect user activity
  events.forEach(event =>
    window.addEventListener(event, updateLastActivity, true)
  );

  // 🔹 Prevent inactive tab bypass
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      // Re-check immediately when tab becomes active
      const now = Date.now();
      if (now - lastActivityTime >= INACTIVITY_LIMIT_MS) {
        logoutUser(sessionToken);
      }
    }
  });

  // 🔹 Start tracking
  startConsoleTimer();
})();
