var keywordVal = "", categoryVal = "", distanceVal = "", currentLocVal = "", locationVal = "", currentLocChecked = "";
var APIKey_IpInfo = "879f3cd55bf6c3"
var APIKey_GoogleAPI = "AIzaSyCogQES6TBka55wgg2UkynCjP6SzbUXi0A"

function searchEvents(){
    getFormValues();

    var str = locationVal.replaceAll(" ", "+");
    //https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY

    //Get geocoding via Google Maps Geocoding API
    // var requestOptions = {
    //     method: 'GET',
    //     redirect: 'follow'
    //   };
    var fetchStr = "https://maps.googleapis.com/maps/api/geocode/json?address="+str+"&key="+APIKey_GoogleAPI
    
    // fetch(fetchStr, requestOptions)
    //     .then(response => response.json())
    //     .then(result => console.log(result))
    //     .catch(error => console.log('error', error));

    let request = new XMLHttpRequest();
    request.open("GET", fetchStr, true);
    request.onload = () => {
        console.log(request);
        if(request.status == 200){
            console.log(JSON.parse(request.response));
        }else{
            console.log(`error ${request.status} ${request.statusText}`);
        }
    }
    request.send();
        

   //Call to python function for TicketMasterAPI
//    call = $.getJSON('getEvents?source_address='+ start +'&destination_address=' + end, function(data) {
//         console.log(data);

//    });
}

// Get values from the search form
function getFormValues(){
    keywordVal = document.getElementById("keyword").value
    var e = document.getElementById("category");
    categoryVal = e.options[e.selectedIndex].text;
    distanceVal = document.getElementById("distance").value
    currentLocChecked = document.getElementById("currentLoc").checked;
    var locationChecked = document.getElementById("location").checked;
    if (locationChecked == true){
        //Get location from input
        locationVal = document.getElementById("input_loc").value
    }
}

// Get user's current location using IpInfo.io API
function getCurrentLocation(){
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      
    fetch("https://ipinfo.io/json?token="+APIKey_IpInfo, requestOptions)
        .then(response => response.json())
        .then(result => getLatLong(result.loc))
        .catch(error => console.log('error', error));

}

function getLatLong(latLong){
    currentLocVal = latLong;
}