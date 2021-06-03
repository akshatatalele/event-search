var keywordVal = "", categoryVal = "", distanceVal = "", currentLocVal = "", locationVal = "", currentLocChecked = "", locationChecked="";
var APIKey_IpInfo = "879f3cd55bf6c3"

function searchEvents(){
    getFormValues();
    
   //Call to python function for TicketMasterAPI
   call = $.getJSON('getEvents?keyword='+ keywordVal +'&category=' + categoryVal + '&distance=' + distanceVal + '&currLocCheck='+currentLocChecked +
        '&currLocVal='+currentLocVal + '&locCheck='+locationChecked + '&locVal='+locationVal, 
        function(data) {
            console.log("Hello")
            console.log(data.result);
        }
    );
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