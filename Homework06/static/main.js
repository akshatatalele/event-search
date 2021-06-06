var keywordVal = "", categoryVal = "", distanceVal = "", currentLocVal = "", locationVal = "", currentLocChecked = "", locationChecked="";
var APIKey_IpInfo = "879f3cd55bf6c3"
var tableContent = ""
var perEventDetails = ""

function searchEvents(){
    document.getElementById('eventDetails').style.display = "none";
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
        message.className = "NoResults"
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
                var cell = tr.insertCell(-1);
                if (headers[i] == "Icon"){
                    var icon = document.createElement("img");
                    icon.src = data[eventNameList[row]][headers[i]];
                    icon.style.height = "100%"
                    cell.appendChild(icon);
                }
                else if (headers[i] == "Event"){
                    var event = createAnchortag(data[eventNameList[row]][headers[i]], data[eventNameList[row]]['ID']);
                    event.style.paddingLeft = "10px";
                    cell.appendChild(event);
                    cell.style.textAlign = "left";
                }
                else{                    
                    cell.innerHTML = data[eventNameList[row]][headers[i]];
                    if (headers[i] != "Date"){
                        cell.style.textAlign = "left";
                        cell.style.paddingLeft = "10px"
                    }
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
    event.setAttribute('onclick', 'getEventDetails("'+id+', ' + name +'")')
    return event;
}

// Get event details
function getEventDetails(id){
    var params = id.split(", ");
    $.ajax({
        dataType: "json",
        url: 'getEventDetails',
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        async: false,
        data: { id: params[0], name: params[1] },
        success: function (data){
            perEventDetails = data;
        }
    });
    displayEventDetails(perEventDetails);
}

function displayEventDetails(data){
    console.log(data);
    fieldNames = Object.keys(data)
    totalNumOfFields = fieldNames.length
    fields = ["Date", "Artist / Team", "Venue", "Genres", "Price Ranges", "Ticket Status", "Buy Ticket At", "Seatmap"]

    var detailDiv = document.getElementById('eventDetails');
    detailDiv.style.display="block"
    var displayMap = document.getElementById("map")
    displayMap.innerHTML = ""
    var displayDetails = document.getElementById('Content');
    displayDetails.innerHTML = "";
    var noIconP = document.createElement("p")
    noIconP.innerHTML = ""

    var heading = document.createElement("h2")
    heading.textContent = data["Name"]
    detailDiv.innerHTML = ""
    detailDiv.appendChild(heading);
    var isMap = false;
    for(var i=0; i < fields.length ; i++){
        var parent = document.createElement("p");

        if (fields[i] == "Artist / Team" && fields[i] in data && data[fields[i]].length != 0){
            var headingTag = document.createElement("h3");
            headingTag.textContent = fields[i];
            parent.appendChild(headingTag);
            var artists = data[fields[i]];
            var artistTag = document.createElement("p");
            artistTag.className = "description";
            for(var k=0;k<artists.length;k++){
                artistTag.appendChild(createArtistTag(artists[k]));
                if (k != artists.length-1){
                    var span = document.createElement("span")
                    span.textContent = " | "
                    artistTag.appendChild(span);
                }
            }
            parent.appendChild(artistTag)
        }
        else if (fields[i] == "Buy Ticket At" && fields[i] in data && data[fields[i]] != {}){
            // console.log("Buy Ticket At")
            var headingTag = document.createElement("h3");
            headingTag.textContent = fields[i] + ":";
            parent.appendChild(headingTag);
            var pTag = document.createElement("p");
            pTag.className = "description"
            var a = document.createElement("a")
            a.appendChild(document.createTextNode(data[fields[i]]['linkname']));
            a.href = data[fields[i]]['URL'];
            a.target = "_Blank"
            pTag.appendChild(a);
            parent.appendChild(pTag);
        }
        else if (fields[i] == "Seatmap" && fields[i] in data && data[fields[i]] != "NA"){
            var icon1 = document.createElement("img");
            icon1.src = data[fields[i]];
            displayMap.appendChild(icon1);
            // isMap = true;
            // detailDiv.appendChild(displayMap);
        }
        else if (fields[i] != "Artist / Team" && fields[i] != "Buy Ticket At" && fields[i] in data && data[fields[i]] != "NA"){
            // console.log(fields[i])
            var headingTag = document.createElement("h3");
            headingTag.textContent = fields[i];
            parent.appendChild(headingTag);
            var desc = document.createElement("p");
            desc.className = "description"
            desc.textContent = data[fields[i]];
            parent.appendChild(desc);
        }
        noIconP.appendChild(parent);
    }
    displayDetails.appendChild(noIconP);
    detailDiv.appendChild(displayDetails);
    if (displayMap.innerHTML == ""){

    }
    detailDiv.appendChild(displayMap);
}

function createArtistTag(artist){
    var a = document.createElement("a")
    a.appendChild(document.createTextNode(artist['artistName']));
    a.href = artist['artistURL'];
    a.target = "_Blank"
    return a
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