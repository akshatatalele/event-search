from flask import Flask, redirect, url_for, render_template, request, flash

app = Flask(__name__)
app.config['SECRET_KEY'] = 'webtechnologieshomework'

@app.route("/")
def index():
    message1 = "Hello World Akshata"
    return render_template("home.html", message1= message1)

@app.route("/getEvents")
def getEvents():
    return ""

if __name__ == "__main__":
    app.run(debug=True)