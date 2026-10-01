$(document).ready(function() {
    // 1. Helper function to create the AJAX requests cleanly
    function getStatusData(statusName) {
        var param = JSON.stringify({"Status": statusName});
        return $.ajax({   
            type: 'GET',
            headers: {
                'X-Parse-Application-Id': "qIZJSomGlIEJLGzBLIZQQDHCTPSSNMLgMUd4VlRA",
                'X-Parse-REST-API-Key': "v7nVylPk8VeGBph6994YZMY6ONNVd4VTAMGTRmMH",
                'Content-Type': "application/json"
            }, 
            url: "https://pg-app-m8z2b4l7sm6v21liysy9fe27j8bf3f.scalabl.cloud/1/classes/Devices?where=" + param,   
            data: { order: '-createdAt', limit: 1000 },
            dataType: "json"
        });
    }

    // 2. Helper function to sum up the totals from the response
    function calculateTotal(data) {
        var sum = 0;
        if (data && data.results) {
            for (var i = 0; i < data.results.length; i++) {
                sum += parseFloat(data.results[i].count) || 0;
            }
        }
        return sum;
    }

    // 3. Fire all 3 requests at the same time, wait until ALL are done
    // NOTE: Double-check if your database uses "Unknown" or "Unknow"
    $.when(
        getStatusData("Online"), 
        getStatusData("Offline"), 
        getStatusData("Unknown") 
    ).done(function(onlineResponse, offlineResponse, unknownResponse) {
        
        // Extract the JSON data arrays from the jQuery responses
        var onlineTotal  = calculateTotal(onlineResponse[0]);
        var offlineTotal = calculateTotal(offlineResponse[0]);
        var unknownTotal = calculateTotal(unknownResponse[0]);

        // Update your HTML elements if needed
        $('#total_online').text(onlineTotal);
        $('#total_offline').text(offlineTotal);
        $('#total_unknown').text(unknownTotal);

        // Optional: Save to localStorage if your app relies on it elsewhere
        localStorage.setItem("pie_online", onlineTotal);
        localStorage.setItem("pie_offline", offlineTotal);
        localStorage.setItem("pie_unknown", unknownTotal);

        // 4. BUILD THE PIE CHART RIGHT HERE
        buildPieChart(onlineTotal, offlineTotal, unknownTotal);

    }).fail(function() {
        console.error("One of the API calls failed fetching device data.");
    });
});

// 5. The Chart Rendering Function (using Chart.js as an example)
function buildPieChart(online, offline, unknown) {
    var ctx = document.getElementById('myPieChart').getContext('2d');
    
    // If a chart instance already exists, you should destroy it first to avoid bugs
    if(window.myPie) { window.myPie.destroy(); }

    window.myPie = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Online', 'Offline', 'Unknow'],
            datasets: [{
                data: [online, offline, unknown],
                backgroundColor: ['#2ecc71', '#d2d7df', '#ffb03b'], // Matching your image colors
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' }
            }
        }
    });
}