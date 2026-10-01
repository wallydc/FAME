
function login() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "http://52.187.40.172/api/auth/login", true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.setRequestHeader("Accept", "application/json");

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) { //object
            var result = JSON.parse(xmlhttp.responseText);
            // console.log(result);
            
            localStorage.setItem('get_refreshToken', result.refreshToken);
            localStorage.setItem('get_jwt_token', result.token);
        }
    }
    
    var data = JSON.stringify({ "username":"junjunfetizanan@gmail.com", "password":"jun2fetiZanan" });
    xmlhttp.send(data);
}

function addDevice() {

    let input = document.getElementById("add_serialno");
    let value = input.value;

    var accessToken = localStorage.getItem("get_jwt_token");

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "http://52.187.40.172/api/device?accessToken="+value, true);
    xmlhttp.setRequestHeader("Accept", "*/*");
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.setRequestHeader("X-Authorization", "Bearer "+accessToken);

    var data = '{ "name": '+JSON.stringify(value)+', "type": "ADATMU", "label": '+JSON.stringify(value)+'}';
    xmlhttp.send(data);
    
}
