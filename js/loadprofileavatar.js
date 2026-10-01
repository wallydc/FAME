
    function loadprofileavatar() {
        let profileid = localStorage.getItem('UserObjectId');
        let param = JSON.stringify({"objectId":profileid});
        let combine = '?where=';
        let url = combine.concat(param);

        $.ajax({
            type: 'GET',
            headers: {
                'X-Parse-Application-Id': APP_ID,
                'X-Parse-REST-API-Key': REST_API_KEY,
                'Content-Type': "application/json"
            }, 
            url: BASE_URL+"1/users/"+url, 
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
                    let profilepic = json.results[i].uploadedprofile;
                    
                    document.getElementById("imgprofile").innerHTML = '<image src="'+profilepic+'" class="img-profile rounded-circle" disabled>';
                    sessionStorage.setItem("getID", objectId);
                    sessionStorage.setItem("getimagePic", profilepic);

                }
                
            }
        });	
    }
