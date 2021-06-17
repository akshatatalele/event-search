const { json, response } = require('express');
const express = require('express');
var geohash = require('ngeohash');
const axios = require('axios')
var SpotifyWebApi = require('spotify-web-api-node');
const { Console } = require('console');

const app = express();
const eventRoute = express.Router();
const APIKey_Ticketmaster = "xTIxkBBzgc0IRs4YXUJFWtW1FWduxVQ9"
const APIKEY_GoogleAPI = "AIzaSyCogQES6TBka55wgg2UkynCjP6SzbUXi0A"
const SPOTIFY_CLIENT_ID = "154eb0af6b3e423ca00362a9de3dc6a9"
const SPOTIFY_SECRET_ID = "e71c518e098e4e65a52142c1c2ae6747"
var spotifyApi = new SpotifyWebApi({
  clientId: SPOTIFY_CLIENT_ID,
  clientSecret: SPOTIFY_SECRET_ID
});
segmentID = {
  'Music':'KZFzniwnSyZfZ7v7nJ',
  'Sports':'KZFzniwnSyZfZ7v7nE',
  'Arts & Theatre':'KZFzniwnSyZfZ7v7na',
  'Film':'KZFzniwnSyZfZ7v7nn',
  'Miscellaneous':'KZFzniwnSyZfZ7v7n1'
}

eventRoute.route('/').get((req, res) => {
 console.log("In route /");
 res.json(data)
})

eventRoute.route('/get-event-list/:input').get(async(req, res) => {
  var obj = JSON.parse(req.params['input'])

  // # Ticketmaster API parameters
  // # 1. apikey-
  // # 2. geoPoint-
  // # 3. radius-
  // # 4. segmentId - different for each category-
  // # 5. unit
  // # 6. keyword
  // # URL: https://app.ticketmaster.com/discovery/v2/events.json?apikey=YOUR_API_KEY&keyword=University+of+Southern+California&segmentId=KZFzniwnSyZfZ7v7nE&radius=10&unit=miles&geoPoint=9q5cs
  var latlng = []
  if(obj.radio == ""){
    latlng = obj.LatLong.split(",")
  }else{
    // Call geocoding api
    var address = obj.LatLong
    let data = await callGeoCodingAPI(address)
    var coords = data['results'][0]['geometry']['location']
    latlng = [coords['lat'], coords['lng']]
  }
  geopoint = geohash.encode(latlng[0], latlng[1]);

  console.log(geopoint)
  //Call Ticketmaster API
  let data = await callTicketMaster(obj.Keyword, obj.Category, obj.Distance, obj.Units, geopoint)
  var response = {}

  if(data.status == 200){
    // Parse response
    response = parseEventListResponse(data.data)
  }else{
    response['error'] = "No records"
  }
  console.log("Res:",response)
  res.json(response)
})

async function callGeoCodingAPI(address){
  var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=" + APIKEY_GoogleAPI
  params = {}
  params['apikey'] = APIKEY_GoogleAPI;
  let data = await axios({
      method: 'GET',
      url,
      params: params
  }).then(response => response.data).catch(err => err);
  return data
}

async function callTicketMaster(keyword, category, distance, units, geopoint){
  var url = ""
  if (category == "All"){
    url = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=" + APIKey_Ticketmaster + "&keyword=" + keyword + "&radius=" + distance + "&unit=" + units + "&geoPoint=" + geopoint
  }
  else{
    url = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=" + APIKey_Ticketmaster + "&keyword=" + keyword + "&radius=" + distance + "&unit=" + units + "&geoPoint=" + geopoint + "&segmentId=" + segmentID[category]
  }
  console.log(url)

  params = {}
  params['apikey'] = APIKey_Ticketmaster;
  let data = await axios({
      method: 'GET',
      url,
      params: params
  }).then(response => response).catch(err => err);
  return data
}

function parseEventListResponse(data){
  // # Result table
  //   # 1. date - localDate, localTime
  //   # 2. icon - images
  //   # 3. event - name
  //   # 4. genre - segment
  //   # 5. venue - name in venue object
  var response = {}
  index = 0
  if (data['page']['totalElements'] != 0){
    events = data['_embedded']['events']
    for(var i=0; i < events.length; i++){
      eventDate = "N/A"
      eventName = "N/A"
      eventCategory = "N/A" //genre, segment
      eventVenue = "N/A"
      eventID = ""

      // ID
      if ("id" in events[i]){
        eventID = events[i]['id']
      }

      // Name
      if ("name" in events[i]){
        eventName = events[i]['name']
      }

      // Date
      if ("dates" in events[i]){
        date = events[i]['dates']
        if ("start" in date){
          start = date['start']
          if ("localDate" in start){
            eventDate = start['localDate']
          }
        }
      }

      // Category
      var temp = []
      if("classifications" in events[i]){
        classify = events[i]['classifications']
        if (classify.length != 0){
          if ("segment" in classify[0]){
            seg = classify[0]['segment']
            if ("name" in seg && seg['name'] != "Undefined" && seg['name'] != "undefined"){
              temp.push(seg['name'])
            }
          }
          if ("genre" in classify[0]){
            seg = classify[0]['genre']
            if ("name" in seg && seg['name'] != "Undefined" && seg['name'] != "undefined"){
              temp.push(seg['name'])
            }
          }
          if ("subGenre" in classify[0]){
            seg = classify[0]['subGenre']
            if ("name" in seg && seg['name'] != "Undefined" && seg['name'] != "undefined"){
              temp.push(seg['name'])
            }
          }
          if ("type" in classify[0]){
            seg = classify[0]['type']
            if ("name" in seg && seg['name'] != "Undefined" && seg['name'] != "undefined"){
              temp.push(seg['name'])
            }
          }
          if ("subType" in classify[0]){
            seg = classify[0]['subType']
            if ("name" in seg && seg['name'] != "Undefined" && seg['name'] != "undefined"){
              temp.push(seg['name'])
            }
          }
        }
      }
      if(temp == []){
        eventCategory = ""
      }else{
        setGen = new Set(temp)
        eventCategory = Array.from(setGen).join(" | ")
      }

      // Venue
      if ("_embedded" in events[i]){
        if ("venues" in events[i]['_embedded']){
          ven = events[i]['_embedded']['venues']
          if (ven.length != 0){
              venue = ven[0]
              if ("name" in venue){
                  eventVenue = venue['name']
              }
          }
        }
      }
      res = {}
      res['ID'] = eventID
      res['Date'] = eventDate
      res['Event'] = eventName
      res['Category'] = eventCategory
      res['Venue'] = eventVenue
      response["Event"+index] = res
      index += 1
    }
  }else{
    response['error'] = "No records"
  }
  return response
}

//All details fetch
eventRoute.route('/get-event-details/:input').get(async(req, res) => {
  var detailParam = JSON.parse(req.params['input'])
  var eventRes = {}
  var finalResponse = {}

  //Get event details
  let data = await callTicketMaster_EventDetails(detailParam.id)
  if(data.status == 200){
    // Parse event details response
    eventRes = parseEventLDetailResponse(data.data)
    finalResponse['Event Info'] = eventRes

    //Get artist details
    var artistRes = []
    if (finalResponse['Event Info']['Artist / Team'] != "NoData"){
      artistRes = await getArtistDetails(finalResponse['Event Info']['Artist / Team'])
    }else{
      artistRes = []
    }
    finalResponse['Artists Info'] = artistRes

    //Get venue details
    var venueRes = {}
    if (finalResponse['Event Info']['Venue'] != "NoData"){
      venueRes = await getVenueDetails(finalResponse['Event Info']['Venue'])
    }else{
      venueRes = {}
    }
    finalResponse['Venue Info'] = venueRes
    res.json(finalResponse)
  }else{
    eventRes['error'] = "Failed to get event details results"
    finalResponse['Event Info'] = eventRes
    res.json(finalResponse)
  }
})

async function callTicketMaster_EventDetails(id){
  var url = "https://app.ticketmaster.com/discovery/v2/events/" + id + "?apikey=" + APIKey_Ticketmaster
  // var url = "https://app.ticketmaster.com/discovery/v2/events/" +" iddfghjkl" + "?apikey=" + APIKey_Ticketmaster
  // var url = "https://app.ticketmaster.com/discovery/v2/events/vvG1IZ4zCXpxU9?apikey=xTIxkBBzgc0IRs4YXUJFWtW1FWduxVQ9"
  params = {}
  params['apikey'] = APIKey_Ticketmaster;
  let data = await axios({
      method: 'GET',
      url,
      params: params
  }).then(response => response).catch(err => err);
  return data
}

function parseEventLDetailResponse(data){
  // # Event details
  // # 1. Date -
  // # 2. Artist/Team -
  // # 3. Venue -
  // # 4. Genre -
  // # 5. Price ranges -
  // # 6. Ticket status
  // # 7. Buy ticket At
  // # 8. Seat map
  // console.log(data)
  detailResponse = {}
  detailResponse["Name"] = data['name']

  // # Artist/Team
  var detailArtist = ""
    var temp = []
    if ("_embedded" in data){
        if ("attractions" in data['_embedded']){
            artists = data['_embedded']['attractions']
            numOfArtists = artists.length
            if (numOfArtists != 0){
                for (var i=0;i<numOfArtists;i++){
                    temp.push(artists[i]['name'])
                }
            }
        }
    }
    if (temp == []){
      detailResponse["Artist / Team"] = ""
    }else{
      detailArtist = temp.join(" | ")
      detailResponse["Artist / Team"] = detailArtist
    }


  // Date
  detailDate = "NoData"
  if ("dates" in data){
    if ("start" in data['dates']){
      datetime = data['dates']['start']
      if ("localDate" in datetime){
        detailDate = datetime['localDate']
      }
    }
  }
  detailResponse["Date"] = detailDate

  //Venue
  detailVenue = "NoData"
  if ("_embedded" in data){
    if ("venues" in data['_embedded']){
      ven = data['_embedded']['venues']
      if (ven.length != 0){
          venue = ven[0]
          if ("name" in venue){
              detailVenue = venue['name']
          }
      }
    }
  }
  detailResponse["Venue"] = detailVenue

  // Genre
  detailGenre = ""
  tempGenre = []
  if ("classifications" in data){
    classify = data['classifications']
    if (classify.length != 0){
      for (var j=0;j<classify.length;j++){
        if ("segment" in classify[j] && (classify[j]['segment']['name'] != "Undefined" && classify[j]['segment']['name'] != "undefined")){
          tempGenre.push(classify[j]['segment']['name'])
        }
        if ("genre" in classify[j] && (classify[j]['genre']['name'] != "Undefined" && classify[j]['genre']['name'] != "undefined")){
          tempGenre.push(classify[j]['genre']['name'])
        }
        if ("subGenre" in classify[j] && (classify[j]['subGenre']['name'] != "Undefined" && classify[j]['subGenre']['name'] != "undefined")){
          tempGenre.push(classify[j]['subGenre']['name'])
        }
        if ("type" in classify[j] && (classify[j]['type']['name'] != "Undefined" && classify[j]['type']['name'] != "undefined")){
          tempGenre.push(classify[j]['type']['name'])
        }
        if ("subType" in classify[j] && (classify[j]['subType']['name'] != "Undefined" && classify[j]['subType']['name'] != "undefined")){
          tempGenre.push(classify[j]['subType']['name'])
        }
      }
    }
  }
  if(tempGenre == []){
    detailResponse["Genres"] = ""
  }else{
    setGen = new Set(tempGenre)
    detailGenre = Array.from(setGen).join(" | ")
    detailResponse["Genres"] = detailGenre
  }


  // # Price Range
  detailPrice = "NoData"
  if ("priceRanges" in data){
    if (data['priceRanges']){
      price = data['priceRanges'][0]
      if ("min" in price && "max" in price && "currency" in price
        && (price['min'] != "Undefined" && price['min'] != "undefined") && (price['max'] != "Undefined" && price['max'] != "undefined")
          && (price['currency'] != "Undefined" && price['currency'] != "undefined")){
          detailPrice = price['min'] + " - " + price['max'] + " " + price['currency']
      }
      else if ("min" in price && "currency" in price
        && (price['min'] != "Undefined" && price['min'] != "undefined") && (price['currency'] != "Undefined" && price['currency'] != "undefined")){
        detailPrice = price['min'] + " " + price['currency']
      }
      else if ("max" in price && "currency" in price
        && (price['max'] != "Undefined" && price['max'] != "undefined") && (price['currency'] != "Undefined" && price['currency'] != "undefined")){
        detailPrice = price['max'] + " " + price['currency']
      }
    }
  }
  detailResponse["Price Ranges"] = detailPrice

  // # Ticket status
  detailStatus = "NoData"
  if ("dates" in data && "status" in data['dates'] && "code" in data['dates']['status']){
    detailStatus = data['dates']['status']['code']
  }
  detailResponse["Ticket Status"] = detailStatus

  // # Buy ticket at
  detailBuyTicket = "NoData"
  if ("url" in data){
    detailBuyTicket = data['url']
  }
  detailResponse["Buy Ticket At"] = detailBuyTicket

  // # Seat map
  detailsSeatMap = "NoData"
  if ("seatmap" in data && "staticUrl" in data['seatmap']){
    detailsSeatMap = data['seatmap']['staticUrl']
  }
  detailResponse["Seatmap"] = detailsSeatMap

  // console.log(detailResponse)
  return detailResponse
}

eventRoute.route('/get-event-suggestions/:input').get(async(req, res) => {
  var obj = JSON.parse(req.params['input'])

  //Call Ticketmaster API Get suggestions
  let data = await callTicketMaster_GetSuggestions(obj)

  // Parse response
  var response = []
  response = parseSuggestionResponse(data)

  if(response == []){
    res.json("No Details")
  }else{
    res.json(response)
  }
})

async function callTicketMaster_GetSuggestions(obj){
  //https://app.ticketmaster.com/discovery/v2/suggest?apikey=YOUR_API_KEY&keyword=laker
  var url = "https://app.ticketmaster.com/discovery/v2/suggest?apikey=" + APIKey_Ticketmaster + "&keyword=" + obj
  params = {}
  params['apikey'] = APIKey_Ticketmaster;
  let data = await axios({
      method: 'GET',
      url,
      params: params
  }).then(response => response.data).catch(err => err);
  return data
}

function parseSuggestionResponse(data){
  suggestion = []
  if ("_embedded" in data){
    if ("attractions" in data['_embedded']){
      suggest = data['_embedded']['attractions']
      numOfArtists = suggest.length
      if (numOfArtists != 0){
        for (var i=0;i<numOfArtists;i++){
          suggestion.push(suggest[i]['name'])
          }
      }
    }
  }
  return suggestion
}

async function getVenueDetails(venue){
  //Call Ticketmaster API search venue
  let data = await callTicketMaster_VenueDetails(venue)
  var response = {}

  if(data.status == 200){
    // Parse response
    response = parseVenueDetailsResponse(data.data)
  }else{
    response['error'] = "Failed to get venue details results"
  }
  return response
}

eventRoute.route('/get-venue-details/:input').get(async(req, res) => {
  var obj = JSON.parse(req.params['input'])

  //Call Ticketmaster API Get suggestions
  let data = await callTicketMaster_VenueDetails(obj)

  // Parse response
  var response = {}
  response = parseVenueDetailsResponse(data)

  if (response == {}){
    res.json({})
  }else{
    res.json(response)
  }
})

async function callTicketMaster_VenueDetails(obj){
  //https://app.ticketmaster.com/discovery/v2/venues.json?keyword=UCV&apikey=xTIxkBBzgc0IRs4YXUJFWtW1FWduxVQ9
  var url = "https://app.ticketmaster.com/discovery/v2/venues.json?apikey=" + APIKey_Ticketmaster + "&keyword=" + obj
  params = {}
  params['apikey'] = APIKey_Ticketmaster;
  let data = await axios({
      method: 'GET',
      url,
      params: params
  }).then(response => response).catch(err => err);
  return data
}

function parseVenueDetailsResponse(data){
  venueDetails = {}
  var venueAddr = "NoData"
  var venueCity = "NoData"
  var venuePhone = "NoData"
  var venueOpenHours = "NoData"
  var venueGenRule = "NoData"
  var venueChildRule = "NoData"

  if ("_embedded" in data){
    if ("venues" in data['_embedded']){
      venue = data['_embedded']['venues']
      if (venue.length != 0){
        // Address
        if ("address" in venue[0] && "line1" in venue[0]['address'] && venue[0]['address']['line1'] != ""){
          venueAddr = venue[0]['address']['line1']
        }
        // City
        if ("city" in venue[0] && "name" in venue[0]['city'] && venue[0]['city']['name'] != ""
            && "state" in venue[0] && "name" in venue[0]['state'] && venue[0]['state']['name'] != ""){
          venueCity = venue[0]['city']['name'] + ", " + venue[0]['state']['name']
        }
        else if ("city" in venue[0] && "name" in venue[0]['city'] && venue[0]['city']['name'] != ""){
          venueCity = venue[0]['city']['name']
        }
        else if ("state" in venue[0] && "name" in venue[0]['state'] && venue[0]['state']['name'] != ""){
          venueCity = venue[0]['state']['name']
        }

        // Phone nmber
        if ("boxOfficeInfo" in venue[0] && "phoneNumberDetail" in venue[0]['boxOfficeInfo'] && venue[0]['boxOfficeInfo']['phoneNumberDetail'] != ""){
          venuePhone = venue[0]['boxOfficeInfo']['phoneNumberDetail']
        }

        // Open hours
        if ("boxOfficeInfo" in venue[0] && "openHoursDetail" in venue[0]['boxOfficeInfo'] && venue[0]['boxOfficeInfo']['openHoursDetail'] != ""){
          venueOpenHours = venue[0]['boxOfficeInfo']['openHoursDetail']
        }

        // General rule
        if ("generalInfo" in venue[0] && "generalRule" in venue[0]['generalInfo'] && venue[0]['generalInfo']['generalRule'] != ""){
          venueGenRule = venue[0]['generalInfo']['generalRule']
        }
        // Child rule
        if ("generalInfo" in venue[0] && "childRule" in venue[0]['generalInfo'] && venue[0]['generalInfo']['childRule'] != ""){
          venueChildRule = venue[0]['generalInfo']['childRule']
        }
      }
    }
  }
  if(venueAddr == "NoData" && venueCity == "NoData" && venuePhone == "NoData" && venueOpenHours == "NoData" &&
      venueGenRule == "NoData" && venueChildRule == "NoData"){
        venueDetails['error'] = "No data available"
  }else{
    venueDetails['Address'] = venueAddr
    venueDetails['City'] = venueCity
    venueDetails['PhoneNumber'] = venuePhone
    venueDetails['OpenHours'] = venueOpenHours
    venueDetails['GeneralRule'] = venueGenRule
    venueDetails['ChildRule'] = venueChildRule
  }

  return venueDetails
}

async function getArtistDetails(allArtists){
  artistsDetailList = {}
  if(allArtists != ""){
    artistsList = allArtists.split(" | ")
    if(artistsList.length > 0){
      for (var i=0;i<artistsList.length;i++){
        //Call Ticketmaster API Get suggestions
        let data = await callAPI_ArtistsDetails(artistsList[i])
        if (data ==401){
          await spotifyApi.clientCredentialsGrant().then(
            function(data) {
              console.log('The access token expires in ' + data.body['expires_in']);
              console.log('The access token is ' + data.body['access_token']);

              // Save the access token so that it's used in future calls
              spotifyApi.setAccessToken(data.body['access_token']);
            },
            function(err) {
              console.log('Something went wrong when retrieving an access token', err);
            }
          );
          data = await callAPI_ArtistsDetails(artistsList[i])
        }

        // Parse response
        var response = {}
        if(data == "" || data == 401){
          response['error'] = "Failed to get artist details results"
        }else if ("statusCode" in data && data.statusCode == 200){
          response = parseArtistsDetailsResponse(data.body, artistsList[i])
        }else {
          response['error'] = "Failed to get artist details results"
        }

        artistsDetailList[artistsList[i]] = response
      }
    }else{
      artistsDetailList['NoArtist'] = {}
    }
  }else{
    artistsDetailList['NoArtist'] = {}
  }
  return artistsDetailList
}

eventRoute.route('/get-artists-details/:input').get(async(req, res) => {
  var obj = JSON.parse(req.params['input'])

  //Call Ticketmaster API Get suggestions
  let data = await callAPI_ArtistsDetails(obj)
  if (data == "401"){
    await spotifyApi.clientCredentialsGrant().then(
      function(data) {
        console.log('The access token expires in ' + data.body['expires_in']);
        console.log('The access token is ' + data.body['access_token']);

        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(data.body['access_token']);
      },
      function(err) {
        console.log('Something went wrong when retrieving an access token', err);
      }
    );
    data = await callAPI_ArtistsDetails(obj)

  }

  // Parse response
  var response = {}
  response = parseArtistsDetailsResponse(data, obj)

  if (response == {}){
    res.json({})
  }else{
    res.json(response)
  }
})

async function callAPI_ArtistsDetails(obj){
  var res = ""
  await spotifyApi.searchArtists(obj)
  .then(function(data) {
    res = data
  }, function(err) {
    // res = err.statusCode
    if (err.statusCode == "401"){
      res = "401"
    }
  });
  return res
}

function parseArtistsDetailsResponse(data, obj){
  artistsDetail = {}
  var artistName = "NoData"
  var artistFollowers = "NoData"
  var artistPopularity = "NoData"
  var artistCheckAt = "NoData"

  if ("artists" in data && "items" in data['artists']){
    var artists = data['artists']['items']
    if(artists.length > 0){
      for (var j=0;j<artists.length;j++){
        if ("name" in artists[j] && artists[j]['name'].toUpperCase() == obj.toUpperCase()){
          break;
        }
      }
      if (j < artists.length){
        // Name
        if(artists[j]['name'] != ""){
          artistName = artists[j]['name']
        }

        // Followers
        if ("followers" in artists[j] && "total" in artists[j]['followers'] && artists[j]['followers']['total'] != ""){
          artistFollowers = artists[j]['followers']['total']
        }

        //Popularity
        if ("popularity" in artists[j] && artists[j]['popularity'] != ""){
          artistPopularity = artists[j]['popularity']
        }

        // Check At
        if ("external_urls" in artists[j] && "spotify" in artists[j]['external_urls'] && artists[j]['external_urls']['spotify'] != ""){
          artistCheckAt = artists[j]['external_urls']['spotify']
        }
      }
    }
  }
  if(artistName == "NoData" && artistFollowers == "NoData" && artistPopularity == "NoData" && artistCheckAt == "NoData"){
    artistsDetail['error'] = "No details available"
  }else{
    artistsDetail['Name'] = artistName
    artistsDetail['Followers'] = artistFollowers
    artistsDetail['Popularity'] = artistPopularity
    artistsDetail['CheckAt'] = artistCheckAt
  }

  return artistsDetail
}

module.exports = eventRoute;
