//----- FUNCTIONS HERE -----

function checkemail(usermail) {
  var filter = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]{3,}\.[a-zA-z0-9]{2,10}$/;
  if (filter.test(usermail)) {
    return true;
  } else {
    return false;
  }
}

function validateemail(email) {
  var filter = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]{3,}\.[a-zA-z0-9]{2,4}$/;
  if (filter.test(email)) {
    return true;
  } else {
    return false;
  }
}

//-----RESET PASSWORD USER HERE

function resetpassword() {
  var usermail = $("#usermail").val();
  $("#mypreloader").show();
  $.ajax({
    type: "POST",
    headers: {
      "X-Parse-Application-Id": APP_ID,
      "X-Parse-Master-Key": MASTER_KEY,
      "Content-Type": "application/json",
    },
    url: BASE_URL+"1/requestPasswordReset",
    data: JSON.stringify({ email: usermail }),

    dataType: "json",
    error: function (data) {
      if (data.readyState == 4) {
        alert("Your email " + usermail + " is not yet registered!");
      } else {
        alert("No internet, Kindly check your connection!");
      }
    },
    success: function (data) {
      alert(
        "You receive reset instructions, from your provided email: " + usermail + " !"
      );
      setTimeout(function () {
        window.location.href = "login.html";
      }, 1000);
    },
  });
}

// ----------


//-----RESET USER HERE -----
$("#btn_reset").click(function () {
  var usermail = $("#usermail").val();

  //-----MY CONDITION HERE
  if ($.trim(usermail) != "" || $.trim(usermail).length != 0) {
    if (checkemail(usermail)) {
      resetpassword();
    } else {
      alert("Please enter a valid registered email!");
    }
  } else {
    alert("Kindly fill your email");
  }
});



// $(document).ready(function () {
//----- FOR TOGGLE HIDDEN PASSWORD -----
$(".toggle-password").click(function () {
  $(this).toggleClass("fa-eye fa-eye-slash");
  var input = $($(this).attr("toggle"));
  if (input.attr("type") == "password") {
    input.attr("type", "text");
  } else {
    input.attr("type", "password");
  }
});

$("#mypreloader2").show();
setTimeout(function () {
  $("#mypreloader2").hide();
}, 5000);

$("#user").val("");
$("#password").val("");

// ---------- FOR REMEMBER ME HERE ----------
const rmCheck = document.getElementById("customCheck"),
    userInput = document.getElementById("user");

if (sessionStorage.checkbox && sessionStorage.checkbox !== "") {
    rmCheck.setAttribute("checked", "checked");
    userInput.value = sessionStorage.username;
} else {
    rmCheck.removeAttribute("checked");
    userInput.value = "";
}
// --------------------

function lsRememberMe() {
  if (rmCheck.checked && userInput.value !== "") {
    sessionStorage.username = userInput.value;
    sessionStorage.checkbox = rmCheck.value;
  } else {
    sessionStorage.username = "";
    sessionStorage.checkbox = "";
  }
}


//----- LOGIN USER HERE -----
// ==========================================
// LOGIN BUTTON
// ==========================================

document.getElementById("btn_login").addEventListener("click", async function () {

    const languagedrop = document.getElementById("languagedrop").value.trim();
    const InputEmail = document.getElementById("user").value.trim();
    const InputPassword = document.getElementById("password").value;

    // ==========================================
    // CHECK LANGUAGE
    // ==========================================

    if (!languagedrop) {
        alert("Kindly select language");
        return;
    }

    // ==========================================
    // CHECK EMAIL
    // ==========================================

    if (!InputEmail) {
        alert("Kindly fill the Email");
        return;
    }

    // ==========================================
    // CHECK PASSWORD
    // ==========================================

    if (!InputPassword) {
        alert("Kindly fill the Password");
        return;
    }

    try {

        // Remember Me
        lsRememberMe();

        // ==========================================
        // STEP 1
        // THINGSBOARD LOGIN FIRST
        // ==========================================

        /* console.log("Logging in to ThingsBoard...");

        const thingsBoardSuccess =
            await loginThingsBoard();

        // STOP if ThingsBoard login failed
        if (!thingsBoardSuccess) {
            return;
        }

        console.log("ThingsBoard login successful."); */

        // ==========================================
        // STEP 2
        // LOGIN
        // ==========================================

        console.log("Logging in to Parse...");

        const sashidoSuccess =
            await loginParse(InputEmail, InputPassword);

        // STOP if Parse login failed
        if (!sashidoSuccess) {
            return;
        }

        console.log("Parse login successful.");

        // ==========================================
        // BOTH LOGIN SUCCESSFUL
        // ==========================================

        console.log("ThingsBoard + Parse login successful.");

    } catch (error) {

        console.error("Login error:", error);

        alert(error.message || "Login failed.");
    }

});

// Function here

// ==========================================
// THINGSBOARD LOGIN
// ==========================================

async function loginThingsBoard() {

    // Your existing ThingsBoard credentials
    const username = "user@fame.systems";
    const password = "Fame123@";

    // Your ThingsBoard server
    const TB_URL = "http://143.198.80.60:8080";

    try {

        const response = await fetch(
            `${TB_URL}/api/auth/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username: username,
                    password: password
                })
            }
        );

        const data = await response.json();

        // ThingsBoard login failed
        if (!response.ok) {

            console.error("ThingsBoard error:", data);

            alert(
                data.message ||
                "ThingsBoard login failed."
            );

            return false;
        }

        // ==========================================
        // LOGIN SUCCESS
        // ==========================================

        console.log("ThingsBoard authentication successful.");

        // Save ThingsBoard JWT
        sessionStorage.setItem(
            "thingsBoardToken",
            data.token
        );

        // Save refresh token
        sessionStorage.setItem(
            "thingsBoardRefreshToken",
            data.refreshToken
        );

        return true;

    } catch (error) {

        console.error(
            "ThingsBoard connection error:",
            error
        );

        alert(
            "Unable to connect to ThingsBoard. " +
            "Please check your internet connection or server."
        );

        return false;
    }
}

// ==========================================
// PARSE LOGIN
// ==========================================

async function loginParse(InputEmail, InputPassword) {

    try {

        const response = await fetch(
            BASE_URL + "1/login?" +
            new URLSearchParams({
                username: InputEmail,
                password: InputPassword
            }),
            {
                method: "GET",

                headers: {
                    "X-Parse-Application-Id": APP_ID,
                    "X-Parse-REST-API-Key": REST_API_KEY
                }
            }
        );

        // ==========================================
        // LOGIN ERROR
        // ==========================================

        if (!response.ok) {

            let errorData = {};

            try {
                errorData = await response.json();
            } catch (e) {
                // Response was not JSON
            }

            console.error("Parse error:", errorData);

            alert(
                "Incorrect input of Email or Password\n" +
                "or your username: " +
                InputEmail +
                " not yet registered\n" +
                "Please try again!"
            );

            return false;
        }

        // ==========================================
        // LOGIN SUCCESS
        // ==========================================

        const result = await response.json();

        console.log("Parse login successful.");
        console.log(result);

        // ==========================================
        // GET USER DATA
        // ==========================================

        const objectId = result.objectId;
        const username = result.username;
        const fullname = result.fullname;
        const email = result.email;
        const sessionToken = result.sessionToken;
        const emailVerified = result.emailVerified;
        const usergroup = result.usergroup;


        // ==========================================
        // SAVE USER INFORMATION
        // ==========================================

        localStorage.setItem(
            "UserObjectId",
            objectId
        );

        localStorage.setItem(
            "myusername",
            username
        );

        localStorage.setItem(
            "myfullname",
            fullname
        );

        localStorage.setItem(
            "myemail",
            email
        );

        localStorage.setItem(
            "mysessiontoken",
            sessionToken
        );

        sessionStorage.setItem(
            "authToken",
            sessionToken
        );

        localStorage.setItem(
            "myemailverified",
            emailVerified
        );

        localStorage.setItem(
            "regAuthor",
            usergroup
        );


        // ==========================================
        // GET USER GROUP
        // ==========================================

        const get_emp =
            localStorage.getItem("regAuthor");

        const get_users =
            localStorage.getItem("myusername");


        // ==========================================
        // CHECK EMAIL VERIFICATION
        // ==========================================

        if (
            emailVerified !== undefined &&
            emailVerified !== false
        ) {

            console.log("Email verified: true");


            // ==========================================
            // ADMIN
            // ==========================================

            if (get_emp === "admin") {

                localStorage.setItem(
                    "myusergroup",
                    "vXvbEAa3yn"
                );

                get_user_obj();

                setTimeout(function () {

                    window.location.href =
                        "dashboard.html";

                }, 3000);

            }


            // ==========================================
            // SUPERVISOR
            // ==========================================

            else if (get_emp === "supervisor") {

                localStorage.setItem(
                    "myusergroup",
                    "so9Zn6jqqf"
                );

                get_user_obj();

                setTimeout(function () {

                    window.location.href =
                        "dashboard.html";

                }, 3000);

            }


            // ==========================================
            // USER
            // ==========================================

            else if (get_emp === "user") {

                localStorage.setItem(
                    "myusergroup",
                    "mp7I5ONNYu"
                );

                get_user_obj();

                setTimeout(function () {

                    window.location.href =
                        "map.html";

                }, 3000);

            }

        } else {

            console.log("Email verified: false");

            window.location.href =
                "account.html";
        }

        return true;

    } catch (error) {

        console.error(
            "Parse connection error:",
            error
        );

        alert(
            "No internet, Kindly check your connection!"
        );

        return false;
    }
}
//----- LOGIN USER HERE -----


//-----LOGOUT USER HERE -----
/* $("#btn_logout").click(function(){
        $('#mypreloader').show();
        setTimeout(function(){ window.location.href = "../index.html"; }, 2000);
    }); */

$("#btn_logout").click(function () {
  $("#mypreloader").show();
  var sessionToken = sessionStorage.getItem("authToken") || localStorage.getItem("mysessionToken");

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open(
    "POST",
    BASE_URL+"1/logout"
  );
  xmlhttp.setRequestHeader(
    "X-Parse-Application-Id",
    APP_ID
  );
  xmlhttp.setRequestHeader(
    "X-Parse-REST-API-Key",
    REST_API_KEY
  );
  xmlhttp.setRequestHeader("X-Parse-Session-Token", sessionToken);

  var data = JSON.stringify({});
  xmlhttp.send(data);
  setTimeout(function () {
    window.location.href = "../index.html";
  }, 2000);
});

function get_user_obj(){
		//setTimeout(function() {
		var objectId_user = localStorage.getItem("myusergroup");
		var param = JSON.stringify({"objectId":objectId_user});
		var compare = '?where=';
		var url = compare.concat(param);
		$.ajax({
          type: "GET",
          headers: {
            "X-Parse-Application-Id": APP_ID,
            "X-Parse-REST-API-Key": REST_API_KEY,
          },
		 url: BASE_URL+"1/classes/permission"+url,
			dataType: "json",
			//cache: false,
			error: function() {
				//alert("No data found.");
			},
			success: function (data) {
						var jstr = JSON.stringify(data);
						var json = JSON.parse(jstr);
						
						for(var i=0; i< json.results.length; i++)
						{
							var dashboard = json.results[i].dashboard;
							var notifications = json.results[i].notifications;
							var map = json.results[i].map;
							var devices = json.results[i].devices;
							var reports = json.results[i].reports;
							var settings = json.results[i].settings;
							
						}	
							localStorage.setItem("dashboard", dashboard);
							localStorage.setItem("notifications", notifications);
							localStorage.setItem("map", map);
							localStorage.setItem("devices", devices);
							localStorage.setItem("reports", reports);
							localStorage.setItem("settings", settings);
	
			}
		});
		
		
	}
// });
