var keywordVal = "", categoryVal = "", distanceVal = "", currentLocVal = "", locationVal = "", currentLocChecked = "", locationChecked="";
var APIKey_IpInfo = "879f3cd55bf6c3"
var tableContent = ""

function searchEvents(){
    getFormValues();

    //Call to python function for TicketMasterAPI
    var params = {
        keyword: keywordVal,
        category: categoryVal,
        distance: distanceVal,
        currLocCheck: currentLocChecked,
        currLocVal: currentLocVal,
        locCheck: locationChecked,
        locVal: locationVal
    }  

    $.ajax({
        dataType: "json",
        url: 'getEvents',
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        async: false,
        data: params,
        success: function (data){
            tableContent = data;
        }
    });
    displayEventTable(tableContent);
}

// Display events table
function displayEventTable(data){
    totalNumOfRows = Object.keys(data).length;
    eventNameList = Object.keys(data);

    document.getElementById("tableContent").style.display="block";

    if (totalNumOfRows == 0){
        var message = document.createElement("p");
        message.textContent = "No Records has been found";
        var displayTable = document.getElementById('tableContent');
        displayTable.innerHTML = "";
        displayTable.append(message);

    }else{
        var eventTable = document.createElement("table");

        var tr = eventTable.insertRow(-1);                   
        headers = ["Date", "Icon", "Event", "Genre", "Venue"]
        for (var i = 0; i < headers.length; i++) {
            var th = document.createElement("th");
            th.innerHTML = headers[i];
            tr.appendChild(th);
        }
    
        for (var row = 0; row < totalNumOfRows; row++) {
            tr = eventTable.insertRow(-1);
            for (var i = 0; i < headers.length; i++) {
                if (headers[i] == "Icon"){
                    var icon = document.createElement("img");
                    icon.src = data[eventNameList[row]][headers[i]];
                    tr.insertCell(-1).appendChild(icon);
                }
                else if (headers[i] == "Event"){
                    var event = createAnchortag(data[eventNameList[row]][headers[i]], data[eventNameList[row]]['ID']);
                    tr.insertCell(-1).appendChild(event);
                }
                else{
                    tr.insertCell(-1).innerHTML = data[eventNameList[row]][headers[i]];
                }
                
            }
        }
        
    
        var displayTable = document.getElementById('tableContent');
        displayTable.innerHTML = "";
        displayTable.appendChild(eventTable);
    }
    
}

function createAnchortag(name, id){
    var event = document.createElement("a");
    event.appendChild(document.createTextNode(name));
    event.id = "eventName";
    event.setAttribute('onclick', 'getEventDetails("'+id+'")')
    return event;
}

// Get event details
function getEventDetails(id){
    // console.log(id);
    call = $.getJSON('/getEventDetails', 
        data = {id:id},
        function(data) {
            console.log("Hello");
            console.log(JSON.stringify(data));
        });
}

// Get values from the search form
function getFormValues(){
    keywordVal = document.getElementById("keyword").value
    var e = document.getElementById("category");
    categoryVal = e.options[e.selectedIndex].text;
    distanceVal = document.getElementById("distance").value
    if(distanceVal == ""){
        distanceVal = document.getElementById("distance").placeholder
    }
    currentLocChecked = document.getElementById("currentLoc").checked;
    locationChecked = document.getElementById("location").checked;
    if (locationChecked == true){
        //Get location from input
        locationVal = document.getElementById("input_loc").value
    }
}

// Get user's current location using IpInfo.io API
function getCurrentLocation(){

    document.getElementById("tableContent").style.display="none";
    document.getElementById("eventDetails").style.display="none";
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      
    fetch("https://ipinfo.io/json?token="+APIKey_IpInfo, requestOptions)
        .then(response => response.json())
        .then(result => getLatLong(result.loc))
        .catch(error => console.log('error', error));

    // // Sleep in loop
    // for (let i = 0; i < 5; i++) {
    //     if (i == 3)
    //         sleep(4000);
    //     console.log(i);
    // }
    // sleep(3000)
    document.getElementById("searchButton").disabled = false;
    
}

function getLatLong(latLong){
    currentLocVal = latLong;
}

function clearForm(){
    document.getElementById("searchForm").reset();
    document.getElementById("tableContent").style.display="none";
    document.getElementById("eventDetails").style.display="none";
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}