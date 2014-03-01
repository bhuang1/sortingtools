from flask import Flask, url_for, redirect
app = Flask(__name__)

@app.route('/')
def homePage():
  return 'Home page'

@app.route('/insertionSort')
def insertionSort():
  return redirect(url_for('static', filename='insertionSort.html'))

@app.route('/selectionSort')
def selectionSort():
  return redirect(url_for('static', filename='selectionSort.html'))

if __name__ == "__main__":
  app.run()
