from flask import Flask, redirect, url_for, render_template, request, flash, jsonify
import json
from geolib import geohash
import requests

app = Flask(__name__)
app.config['SECRET_KEY'] = 'webtechnologieshomework'
APIKEY_GoogleAPI = "AIzaSyCogQES6TBka55wgg2UkynCjP6SzbUXi0A"
APIKEY_TicketMasterAPI = "xTIxkBBzgc0IRs4YXUJFWtW1FWduxVQ9"
response_ = ""


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

    eventDate = ""
    eventIcon = ""
    eventName = ""
    eventGenre = ""
    eventVenue = ""
    response = dict()
    index = 0

    if eventResponse.json()['page']['totalElements'] != 0:
        events = eventResponse.json()['_embedded']['events']
        for event in events:
            temp = event['dates']['start']
            eventDate = temp['localDate'] + temp['localTime']
            images = event['images']
            if images:
                eventIcon = images[0]['url']
            eventName = event['name']
            eventGenre = event['classifications'][0]['segment']['name']
            eventVenue = event['_embedded']['venues'][0]['name']
            res = dict()
            res['date'] = eventDate
            res['icon'] = eventIcon
            res['name'] = eventName
            res['genre'] = eventGenre
            res['venue'] = eventVenue
            response["Event"+str(index)] = res
            index += 1
    return response

@app.route("/test")
def test():
    print(response_)
    return response_

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