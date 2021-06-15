const { json, response } = require('express');
const express = require('express');
var geohash = require('ngeohash');
const axios = require('axios')

const app = express();
const eventRoute = express.Router();
const APIKey_Ticketmaster = "xTIxkBBzgc0IRs4YXUJFWtW1FWduxVQ9"
const APIKEY_GoogleAPI = "AIzaSyCogQES6TBka55wgg2UkynCjP6SzbUXi0A"
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

  // Parse response
  var response = parseEventListResponse(data)
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
  if (category == "ALL"){
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
  }).then(response => response.data).catch(err => err);
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
      eventCategory = temp.join(" | ")

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
  }
  return response
}

eventRoute.route('/get-event-details/:input').get(async(req, res) => {
  var detailParam = JSON.parse(req.params['input'])

  //Call Ticketmaster API
  // URL: https://app.ticketmaster.com/discovery/v2/events/vvG1IZ4zCXpxU9?apikey=xTIxkBBzgc0IRs4YXUJFWtW1FWduxVQ9
  let data = await callTicketMaster_EventDetails(detailParam.id)

  // Parse response
  var response = parseEventLDetailResponse(data)

  res.json(response)
})

async function callTicketMaster_EventDetails(id){
  var url = "https://app.ticketmaster.com/discovery/v2/events/" + id + "?apikey=" + APIKey_Ticketmaster
  // var url = "https://app.ticketmaster.com/discovery/v2/events/vvG1IZ4zCXpxU9?apikey=xTIxkBBzgc0IRs4YXUJFWtW1FWduxVQ9"
  params = {}
  params['apikey'] = APIKey_Ticketmaster;
  let data = await axios({
      method: 'GET',
      url,
      params: params
  }).then(response => response.data).catch(err => err);
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
  console.log(data)
  detailResponse = {}
  detailResponse["Name"] = data['name']

  // # Artist/Team
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
    detailResponse["Artist / Team"] = temp.join(" | ")

  // Date
  detailDate = "N/A"
  if ("dates" in data){
    if ("start" in data['dates']){
      datetime = data['dates']['start']
      if ("localDate" in datetime){
        detailDate = datetime['localDate']
      }
    }
  }
  detailResponse["Date"] = detailDate

  // Genre
  detailGenre = "NA"
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
  if (tempGenre){
    detailGenre = ""
    detailGenre = tempGenre.join(" | ")
  }
  detailResponse["Genres"] = detailGenre

  // # Price Range
  detailPrice = "NA"
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
  detailStatus = "NA"
  if ("dates" in data && "status" in data['dates'] && "code" in data['dates']['status']){
    detailStatus = data['dates']['status']['code']
  }
  detailResponse["Ticket Status"] = detailStatus

  // # Buy ticket at
  detailBuyTicket = {}
  if ("url" in data){
    detailBuyTicket['linkname'] = "Ticketmaster"
    detailBuyTicket['URL'] = data['url']
  }
  detailResponse["Buy Ticket At"] = detailBuyTicket

  // # Seat map
  detailsSeatMap = "NA"
  if ("seatmap" in data && "staticUrl" in data['seatmap']){
    detailsSeatMap = data['seatmap']['staticUrl']
  }
  detailResponse["Seatmap"] = detailsSeatMap

  console.log(detailResponse)
  return detailResponse
}

module.exports = eventRoute;
