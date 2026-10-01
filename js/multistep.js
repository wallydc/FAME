/* const setpasswordInput = document.querySelector("#setpassword")
const retypepasswordInput = document.querySelector("#retypepassword")
const seteye = document.querySelector("#seteye")
const retypeeye = document.querySelector("#retypeeye")

seteye.addEventListener("click", function(){
  this.classList.toggle("fa-eye-slash")
  const type = setpasswordInput.getAttribute("type") === "password" ? "text" : "password"
  setpasswordInput.setAttribute("type", type)
})

retypeeye.addEventListener("click", function(){
  this.classList.toggle("fa-eye-slash")
  const type = retypepasswordInput.getAttribute("type") === "password" ? "text" : "password"
  retypepasswordInput.setAttribute("type", type)
}) */

// ---------- FOR MULTI-STEP HERE ----------
var currentTab = 0; // Current tab is set to be the first tab (0)
showTab(currentTab); // Display the current tab

function showTab(n) {
  // This function will display the specified tab of the form...
  var x = document.getElementsByClassName("tab");
  x[n].style.display = "block";
  //... and fix the Previous/Next buttons:
  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "inline";
  }
  if (n == (x.length - 1)) {
    document.getElementById("nextBtn").innerHTML = "Submit";

    // document.getElementById("nextBtn").style.display = 'none';
    // document.getElementById("saveBtn").style.display = 'block';
  } else {
    document.getElementById("nextBtn").innerHTML = 'Proceed&nbsp;&nbsp;<i class="fa-solid fa-arrow-right"></i>';
    /* document.getElementById("nextBtn").style.display = 'block';
    document.getElementById("saveBtn").style.display = 'none'; */
  }
  //... and run a function that will display the correct step indicator:
  fixStepIndicator(n)
}

function nextPrev(n) {
  // This function will figure out which tab to display
  var x = document.getElementsByClassName("tab");
  // Exit the function if any field in the current tab is invalid:
  if (n == 1 && !validateForm()) return false;
  // Hide the current tab:
  x[currentTab].style.display = "none";
  // Increase or decrease the current tab by 1:
  currentTab = currentTab + n;
  // if you have reached the end of the form...
  if (currentTab >= x.length) {
    // ... the form gets submitted:
    // document.getElementById("regForm").submit();

    resetpassword();
    // updateinfo();
    return false;
  }
  // Otherwise, display the correct tab:
  showTab(currentTab);
}

function validateForm() {
  // This function deals with validation of the form fields
  var x, y, i, valid = true;
  x = document.getElementsByClassName("tab");
  y = x[currentTab].getElementsByTagName("input");
  // A loop that checks every input field in the current tab:
 
  for (i = 0; i < y.length; i++) {
    // If a field is empty...
    if ((y[i].value == "")||(y[i].value == " ")) {
      // add an "invalid" class to the field:
      y[i].className += " invalid";
      // and set the current valid status to false
      valid = false;
      y[i].value = "";
    }
    
    if(customCheck.checked == false){
      y[3].className += " invalid";
      valid = false;
      // console.log("false");
      if (i >= 3) {
        // alert("Kindly check the Terms and Conditions");
        document.getElementById("labelCheck").style.color = "#ffdddd";
        document.getElementById("labelCheck2").style.color = "#f00";
        break;
      }
    } else {
      // console.log("true");
      document.getElementById("labelCheck").style.color = "#000";
      document.getElementById("labelCheck2").style.color = "#006bfe";
    }


  }
  // If the valid status is true, mark the step as finished and valid:
  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
  }
  return valid; // return the valid status
}

function fixStepIndicator(n) {
  // This function removes the "active" class of all steps...
  var i, x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  //... and adds the "active" class on the current step:
  x[n].className += " active";
}

// ---------- FOR PARSE PLATFORM - REST API HERE ----------


//-----RESET PASSWORD USER HERE

function resetpassword() {
  var usermail = $("#emailpassreset").val();
  // $('#mypreloader').show();
  $.ajax({
      type: 'POST',
      headers: {
          'X-Parse-Application-Id': "qIZJSomGlIEJLGzBLIZQQDHCTPSSNMLgMUd4VlRA",
          'X-Parse-REST-API-Key': "v7nVylPk8VeGBph6994YZMY6ONNVd4VTAMGTRmMH",
          // 'X-Parse-Master-Key': "x74LkLK7v04GUHLypIqbgX34Ad4hzNsSVT8cMMRU",
          'Content-Type': "application/json"
      },
      url: "https://pg-app-m8z2b4l7sm6v21liysy9fe27j8bf3f.scalabl.cloud/1/requestPasswordReset",
      data: JSON.stringify({"email": usermail}),
                  
      dataType: "json",
      error: function(data) {
        if (data.readyState == 4) {
            var result = JSON.parse(data.responseText);
            var status = JSON.parse(data.status);
            console.log(result);
            if (status == 200) {
              console.log("ok");
              setTimeout(function() {
                
              }, 1000);
            } else {
              console.log("not ok");
            }
        }
          if (data.readyState == 0) {
              alert("No internet, Kindly check your connection!");
              setTimeout(function() {
                window.location.href = "account.html";
              }, 1000);
          } else {
              // alert("Your email "+usermail+" is not yet registered!");
          }
      },
      success: function (data) {
        if (data = {}) {
            console.log("ok");
            setTimeout(function() {
              updateinfo();
            }, 1000);
        } else {
          console.log("not ok");
        }
      }
  });
}
  

function getinfo() {
  console.log("getinfo");
  var getobjectid = localStorage.getItem("UserObjectId");
  var param = JSON.stringify({"objectId":getobjectid}); 
  var compare = '?where=';
  var url = compare.concat(param);
  
  $.ajax({
    type: 'GET',
    headers: {
        'X-Parse-Application-Id': "qIZJSomGlIEJLGzBLIZQQDHCTPSSNMLgMUd4VlRA",
        'X-Parse-REST-API-Key': "v7nVylPk8VeGBph6994YZMY6ONNVd4VTAMGTRmMH",
				'Content-Type': "application/json"
    },
    url: "https://pg-app-m8z2b4l7sm6v21liysy9fe27j8bf3f.scalabl.cloud/1/users/"+url,
    // url: "https://pg-app-m8z2b4l7sm6v21liysy9fe27j8bf3f.scalabl.cloud/1/users/"+getobjectid,
    dataType: "json",
    error: function(data) {
    //   $('#mypreloader').hide();
    if (data.readyState == 4) {
      alert("No internet, Kindly check your connection or refresh the page!");
    } else {
      alert("No internet, Kindly check your connection or refresh the page!");
    }

    },
    success: function (data) {
        var jstr = JSON.stringify(data);
        var json = JSON.parse(jstr);
        
        for(var i=0; i< json.results.length; i++) {
          var objectId = json.results[i].objectId;
          var BusinessName = json.results[i].BusinessName;
          var BusinessAddress = json.results[i].BusinessAddress;
          var BusinessContact = json.results[i].BusinessContact;
          var BusinessContactNumber = json.results[i].BusinessContactNumber;
          var RecoverNumber = json.results[i].RecoverNumber;
          var emailVerified = json.results[i].emailVerified;
          var email = json.results[i].Email;
          var fullname = json.results[i].fullname;
          
        }

        if(!BusinessName || !BusinessAddress || !BusinessContact || !BusinessContactNumber || !RecoverNumber) {
          BusinessName = BusinessName || ""; BusinessAddress = BusinessAddress || ""; BusinessContact = BusinessContact || ""; BusinessContactNumber = BusinessContactNumber || ""; RecoverNumber = RecoverNumber || ""; 
        }
        
        $("#fName").text(fullname);
        $("#businessname").val(BusinessName);
        $("#businessadd").val(BusinessAddress);
        $("#businesscontact").val(BusinessContact);
        $("#recovernumber").val(RecoverNumber);
        $("#emailpassreset").val(email);
    }
});


}

function updateinfo() {
  document.getElementById("savedetails").style.display = 'block';
  var btnprev = document.getElementById("prevBtn");
  btnprev.setAttribute('disabled', '');
  var btnnext = document.getElementById("nextBtn");
  btnnext.setAttribute('disabled', '');
  
  var getobjectid = localStorage.getItem("UserObjectId");
  var BusinessName = $("#businessname").val();
  var BusinessAddress = $("#businessadd").val();
  var BusinessContact = $("#businesscontact").val();
  var RecoverNumber = $("#recovernumber").val();
  var email = $("#emailpassreset").val();
  
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("PUT", "https://pg-app-m8z2b4l7sm6v21liysy9fe27j8bf3f.scalabl.cloud/1/users/"+getobjectid, true);
  xmlhttp.setRequestHeader("X-Parse-Application-Id","qIZJSomGlIEJLGzBLIZQQDHCTPSSNMLgMUd4VlRA");
  xmlhttp.setRequestHeader("X-Parse-REST-API-Key","v7nVylPk8VeGBph6994YZMY6ONNVd4VTAMGTRmMH");
  xmlhttp.setRequestHeader("X-Parse-Master-Key","x74LkLK7v04GUHLypIqbgX34Ad4hzNsSVT8cMMRU");
  xmlhttp.setRequestHeader("Content-Type", "application/json");

  xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4) {
          var result = JSON.parse(xmlhttp.responseText);
          var status = JSON.parse(xmlhttp.status);
          console.log(result);
          if (status == 200) {
            console.log("ok");
            setTimeout(function() {
              window.location.href = "login.html";
            }, 1000);
          } else {
            console.log("not ok");
          }
      }
  }
  
  var data = JSON.stringify({ emailVerified : true, BusinessName : BusinessName, BusinessAddress : BusinessAddress, BusinessContact : BusinessContact, RecoverNumber : RecoverNumber });
  xmlhttp.send(data);
}

function validateemail(email) {
  var filter = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]{3,}\.[a-zA-z0-9]{2,4}$/;
  if (filter.test(email)) {
      return true;
  }
  else {
      return false;
  }
}

$(document).ready(function(){
  getinfo();

  $("input").click(function(){
    var getval = $(this).val();
    if ((getval == " ") || (getval == "")) {
      $(this).val("");
    } else {
      
    }
  });
  
  //-----RESET USER HERE -----
  /* $("#btn_reset").click(function(){
    var usermail = $("#usermail").val();

    //-----MY CONDITION HERE
    if ($.trim(usermail) != "" || $.trim(usermail).length != 0) {
        if (checkemail(usermail)) {
            resetpassword();
        } else { alert("Please enter a valid email address!") }
    } else { alert("Kindly fill your email") }

  }); */


});

