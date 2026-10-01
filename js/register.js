//----- FUNCTIONS HERE -----

function validateemail(email) {
    var filter = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]{3,}\.[a-zA-z0-9]{2,7}$/;
    if (filter.test(email)) {
        return true;
    }
    else {
        return false;
    }
}
function save_newuser() {
	console.log("Saving");
    document.getElementById("save_btn").disabled = true;
    $("#mypreloader2").show();

    var fullname = $("#fullname").val();
    var email = $("#email").val();
    var username = $("#username").val();
    // Password Tab
    var password = $("#userpassword").val();
    var conpassword = $("#conpassword").val();

        if ($.trim(fullname) != "" || $.trim(fullname).length != 0) {
					if ($.trim(email) != "" || $.trim(email).length != 0) {
					if (validateemail(email)) {
					if ($.trim(username) != "" || $.trim(username).length != 0) {
					if ($.trim(password) != "" || $.trim(password).length != 0) {
						if ($.trim(conpassword) != "" || $.trim(conpassword).length != 0) {
							if ($.trim(password) === $.trim(conpassword)) {
                                
                                //----- CHECK FOR NULL VALUE
								if(!fullname ||!username  ) {						 
                                    fullname = fullname || " "; username = username || " "; 
                                }
                                
                                    var xmlhttp = new XMLHttpRequest();
                                    xmlhttp.open("POST", BASE_URL+"1/classes/_User");
                                    xmlhttp.setRequestHeader("X-Parse-Application-Id", APP_ID);
                                    xmlhttp.setRequestHeader("X-Parse-REST-API-Key", REST_API_KEY);
                                    xmlhttp.setRequestHeader("X-Parse-Master-Key", MASTER_KEY);
                                    xmlhttp.setRequestHeader("Content-Type", "application/json");
                                    
                                    xmlhttp.onreadystatechange = function() {
                                        if (xmlhttp.readyState == 4) {
                                            var result = JSON.parse(xmlhttp.responseText);
                                            // if (result.objectId) { }
                                            
                                            localStorage.setItem("UserObjectId", result.objectId);
                                            if (result.error) {
                                                alert(result.error+" kindly check");
                                                document.getElementById("save_btn").disabled = false;
                                                $('#mypreloader2').hide();
                                            } else {
                                                setTimeout(function() {
													
                                                    alert("Congratulations! "+fullname+", You’re successfully registered");
                                                    setTimeout(function() {
                                                        window.location.href = "account.html";
                                                       // $("#upload_images").click();
                                                    }, 1000);
                                                }, 5000);
                                            }
                                        }
                                    }

                                    var data = JSON.stringify({ fullname : fullname, username : username, email : email, Email : email, password : password, BusinessName : " ", BusinessAddress : " ", BusinessContact : " ", RecoverNumber : " ", BusinessContactNumber : " ", emailVerified : false, usergroup : "user" });
                                    xmlhttp.send(data);

                                } else { alert('Entries in the password field did not match. Please input and confirm your password again'); document.getElementById("save_btn").disabled = false; $("#mypreloader2").hide(); }

                            } else { alert('Confirm Password is require'); document.getElementById("save_btn").disabled = false; $("#mypreloader2").hide(); }

                        } else { alert('Password is require'); document.getElementById("save_btn").disabled = false; $("#mypreloader2").hide(); }

                    } else { alert('Username is require'); document.getElementById("save_btn").disabled = false; $("#mypreloader2").hide(); }
					} else { alert("Please enter a valid email address!"); document.getElementById("save_btn").disabled = false; $("#mypreloader2").hide(); }
                    } else { alert('email is require'); document.getElementById("save_btn").disabled = false; $("#mypreloader2").hide(); }

			} else { alert('Full Name is require'); document.getElementById("save_btn").disabled = false; $("#mypreloader2").hide(); }
}
