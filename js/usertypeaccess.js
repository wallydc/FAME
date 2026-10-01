let usergroup = localStorage.getItem("myusergroup");
let param = JSON.stringify({"usergroup" : usergroup});
let compare = '?where=';
let url = compare.concat(param);

$.ajax({
    type: 'GET',
    headers: {
        'X-Parse-Application-Id': APP_ID,
        'X-Parse-REST-API-Key': REST_API_KEY,
        'Content-Type': "application/json"
    }, 
    url: BASE_URL+"1/classes/permission/"+url, 
    data: '{"results":[{}]}',
    data: {order: 'createdAt'},
    dataType: "json",
    error: function() {
        //alert("No data found.");
    },

    success: function (data) {

        let jstr = JSON.stringify(data);
        let json = JSON.parse(jstr);

        for(var i=0; i< json.results.length; i++) {
            
            let objectId = json.results[i].objectId;
            let map = json.results[i].map;
            let notifications = json.results[i].notifications;
            let dashboard = json.results[i].dashboard;
            let devices = json.results[i].devices;
            let reports = json.results[i].reports;
            let settings = json.results[i].settings;

            console.log(objectId, map, notifications, dashboard, devices, reports, settings)

                if (map != "block") {
                    $('.map').remove();
                }
                if (notifications != "block") {
                    $('.notifications').remove();
                }
                if (dashboard != "block") {
                    $('.dashboard').remove();
                }
                if (devices != "block") {
                    $('.devices').remove();
                }
                if (reports != "block") {
                    $('.reports').remove();
                }
                if (settings != "block") {
                    $('.settings').remove();
                }
        }
        
    }
});	
