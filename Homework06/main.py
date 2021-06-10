from flask import Flask, redirect, url_for, render_template, request, flash, jsonify
import json

from flask.globals import g
from geolib import geohash
import requests

app = Flask(__name__)
app.config['SECRET_KEY'] = 'webtechnologieshomework'
APIKEY_GoogleAPI = "AIzaSyCogQES6TBka55wgg2UkynCjP6SzbUXi0A"
APIKEY_TicketMasterAPI = "xTIxkBBzgc0IRs4YXUJFWtW1FWduxVQ9"

@app.route("/")
def index():
    message1 = "Hello World Akshata"
    return render_template("home.html", message1= message1)

@app.route("/getEvents")
def getEvents():
    print("In Get events -----------------")
    keywordVal = request.args.get('keyword', 0, type=str)
    categoryVal = request.args.get('category', 0, type=str)
    distanceVal = request.args.get('distance', 0, type=str)
    currentLocCheck = request.args.get('currLocCheck', 0, type=str)
    currentLocVal = request.args.get('currLocVal', 0, type=str)
    locationChecked = request.args.get('locCheck', 0, type=str)
    locationVal = request.args.get('locVal', 0, type=str)

    # Ticketmaster API parameters
    # 1. apikey-
    # 2. geoPoint-
    # 3. radius-
    # 4. segmentId - different for each category-
    # 5. unit
    # 6. keyword
    # URL: https://app.ticketmaster.com/discovery/v2/events.json?apikey=YOUR_API_KEY&keyword=University+of+Southern+California&segmentId=KZFzniwnSyZfZ7v7nE&radius=10&unit=miles&geoPoint=9q5cs
    
    if currentLocCheck == 'true':
        # Use user's current location
        geopoint = geohash.encode(currentLocVal.split(',')[0], currentLocVal.split(',')[1], 7)
    
    if locationChecked == 'true':
        # Use Google map's GeoCoding API to find coordinates from address
        latitude, longitude = getCoordinates(locationVal)
        geopoint = geohash.encode(latitude, longitude, 7)
    
    if categoryVal == 'Music':
        segmentId = 'KZFzniwnSyZfZ7v7nJ'
    elif categoryVal == 'Sports':
        segmentId = 'KZFzniwnSyZfZ7v7nE'
    elif categoryVal == 'Arts & Theatre':
        segmentId = 'KZFzniwnSyZfZ7v7na'
    elif categoryVal == 'Film':
        segmentId = 'KZFzniwnSyZfZ7v7nn'
    elif categoryVal == 'Miscellaneous':
        segmentId = 'KZFzniwnSyZfZ7v7n1'

    if categoryVal == 'Default':
        url = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=" + APIKEY_TicketMasterAPI + "&keyword=" + keywordVal + "&radius=" + distanceVal + "&unit=miles&geoPoint=" + geopoint
    else:
        url = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=" + APIKEY_TicketMasterAPI + "&keyword=" + keywordVal + "&radius=" + distanceVal + "&unit=miles&geoPoint=" + geopoint + "&segmentId=" + segmentId

    eventResponse = requests.get(url)

    # Result table
    # 1. date - localDate, localTime
    # 2. icon - images
    # 3. event - name
    # 4. genre - segment
    # 5. venue - name in venue object

    response = dict()
    index = 0

    if eventResponse.json()['page']['totalElements'] != 0:
        events = eventResponse.json()['_embedded']['events']
        for event in events:
            eventDate = "N/A"
            eventIcon = "N/A"
            eventName = "N/A"
            eventGenre = "N/A"
            eventVenue = "N/A"
            eventID = ""

            #ID
            if "id" in event:
                eventID = event['id']

            # Date
            # temp = event['dates']['start']
            # if temp:
            #     eventDate = temp['localDate'] + " " + temp['localTime']
            if "dates" in event:
                date = event['dates']
                if "start" in date:
                    start = date['start']
                    if "localDate" in start and "localTime" in start:
                        eventDate = start['localDate'] + " " + start['localTime']
                    elif "localDate" in start:
                        eventDate = start['localDate']
                    elif "localTime" in start:
                        eventDate = start['localTime']

            # Icon
            # images = event['images']
            # if images:
            #     eventIcon = images[0]['url']
            if "images" in event:
                images = event['images']
                if len(images) != 0:
                    if "url" in images[0]:
                        eventIcon = images[0]['url']
                
            # Name
            # eventName = event['name']
            if "name" in event:
                eventName = event['name']
            
            # Genre
            # eventGenre = event['classifications'][0]['segment']['name']
            if("classifications" in event):
                classify = event['classifications']
                if (len(classify) != 0):
                    if("segment" in classify[0]):
                        seg = classify[0]['segment']
                        if "name" in seg:
                            eventGenre = seg['name']
            
            # Venue
            # eventVenue = event['_embedded']['venues'][0]['name']
            if "_embedded" in event:
                if "venues" in event['_embedded']:
                    ven = event['_embedded']['venues']
                    if len(ven) != 0:
                        venue = ven[0]
                        if "name" in venue:
                            eventVenue = venue['name']

            res = dict()
            res['ID'] = eventID
            res['Date'] = eventDate
            res['Icon'] = eventIcon
            res['Event'] = eventName
            res['Genre'] = eventGenre
            res['Venue'] = eventVenue
            response["Event"+str(index)] = res
            index += 1
    return response

@app.route("/getEventDetails")
def getEventDetails():
    print("In gevent details")
    id = request.args.get('id', 0, type=str)
    # name = request.args.get('name', 0, type=str)
    url = "https://app.ticketmaster.com/discovery/v2/events/" + id + "?apikey=" + APIKEY_TicketMasterAPI
    eventDetails = requests.get(url)
    print("After api call")
    # Event details
    # 1. Date
    # 2. Artist/Team
    # 3. Venue
    # 4. Genre
    # 5. Price ranges
    # 6. Ticket status
    # 7. Buy ticket At
    # 8. Seat map
    detailResponse = parseJSON(eventDetails)

    
    return detailResponse

def parseJSON(eventDetails):
    details = eventDetails.json()
    detailResponse = dict()
    detailResponse["Name"] = details['name']
    # Date
    detailDate = "NA"
    if "dates" in details:
        if "start" in details['dates']:
            datetime = details['dates']['start']
            if "localDate" in datetime and "localTime" in datetime:
                detailDate = datetime['localDate'] + " " + datetime['localTime']
            elif "localDate" in datetime:
                detailDate = datetime['localDate']
            elif "localTime" in datetime:
                detailDate = datetime['localTime']
    detailResponse["Date"] = detailDate

    # Artist/Team
    detailArtist = []
    if "_embedded" in details:
        if "attractions" in details['_embedded']:
            artists = details['_embedded']['attractions']
            numOfArtists = len(artists)
            if numOfArtists != 0:
                for person in artists:
                    artist = {"artistName": "NA", "artistURL": "NA"}
                    artist['artistName'] = person['name']
                    artist['artistURL'] = person['url']
                    detailArtist.append(artist)
    detailResponse["Artist / Team"] = detailArtist
    
    # Venue
    detailVenue = "NA"
    if "_embedded" in details:
        if "venues" in details['_embedded']:
            ven = details['_embedded']['venues']
            if len(ven) != 0:
                venue = ven[0]
                if "name" in venue:
                    detailVenue = venue['name']
    detailResponse["Venue"] = detailVenue
    
    # Genre
    detailGenre = "NA"
    temp = []
    if "classifications" in details:
        classify = details['classifications']
        if (len(classify) != 0):
            for gen in classify:
                if "segment" in gen and (gen['segment']['name'] != "Undefined" and gen['segment']['name'] != "undefined"):
                    temp.append(gen['segment']['name'])
                if "genre" in gen and (gen['genre']['name'] != "Undefined" and gen['genre']['name'] != "undefined"):
                    temp.append(gen['genre']['name'])
                if "subGenre" in gen and (gen['subGenre']['name'] != "Undefined" and gen['subGenre']['name'] != "undefined"):
                    temp.append(gen['subGenre']['name'])
                if "type" in gen and (gen['type']['name'] != "Undefined" and gen['type']['name'] != "undefined"):
                    temp.append(gen['type']['name'])
                if "subType" in gen and (gen['subType']['name'] != "Undefined" and gen['subType']['name'] != "undefined"):
                    temp.append(gen['subType']['name'])
        
    if temp:
        detailGenre = ""
        detailGenre = ' | '.join(temp)
    detailResponse["Genres"] = detailGenre

    # Price Range
    detailPrice = "NA"
    if "priceRanges" in details:
        if details['priceRanges']:
            price = details['priceRanges'][0]
            if "min" in price and "max" in price and "currency" in price \
                and (price['min'] != "Undefined" and price['min'] != "undefined") \
                    and (price['max'] != "Undefined" and price['max'] != "undefined") \
                        and (price['currency'] != "Undefined" and price['currency'] != "undefined"):
                detailPrice = str(price['min']) + " - " + str(price['max']) + " " + price['currency']
            elif "min" in price and "currency" in price\
                and (price['min'] != "Undefined" and price['min'] != "undefined") \
                        and (price['currency'] != "Undefined" and price['currency'] != "undefined"):
                detailPrice = str(price['min']) + " " + price['currency']
            elif "max" in price and "currency" in price\
                    and (price['max'] != "Undefined" and price['max'] != "undefined") \
                        and (price['currency'] != "Undefined" and price['currency'] != "undefined"):
                detailPrice = str(price['max']) + " " + price['currency']
    detailResponse["Price Ranges"] = detailPrice

    # Ticket status
    detailStatus = "NA"
    if "dates" in details and "status" in details['dates'] and "code" in details['dates']['status']:
        detailStatus = details['dates']['status']['code']
    detailResponse["Ticket Status"] = detailStatus

    # Buy ticket at
    detailBuyTicket = dict()
    if "url" in details:
        detailBuyTicket['linkname'] = "Ticketmaster"
        detailBuyTicket['URL'] = details['url']
    detailResponse["Buy Ticket At"] = detailBuyTicket

    # Seat map
    detailsSeatMap = "NA"
    if "seatmap" in details and "staticUrl" in details['seatmap']:
        detailsSeatMap = details['seatmap']['staticUrl']
    detailResponse["Seatmap"] = detailsSeatMap
            

    # print(detailResponse)
    return detailResponse


def getCoordinates(locationVal):
    latitude = "0"
    longitude = "0"
    str = locationVal.replace(" ", "+")
    fetchStr = "https://maps.googleapis.com/maps/api/geocode/json?address=" + str + "&key=" + APIKEY_GoogleAPI
    x = requests.get(fetchStr)
    coords = x.json()['results'][0]['geometry']['location']
    latitude = coords['lat']
    longitude = coords['lng']
    return latitude, longitude

if __name__ == "__main__":
    app.run(debug=True)