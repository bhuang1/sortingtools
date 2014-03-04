'''
Handles the backend application.

Allows users to navigate through the sorting website dynamically and
register the number of operations for each sort so that instructors
can monitor how well the class understands a type of sort.

Author: Chandrasekar Ramesh
Date:   March, 2014
'''
import os
import sqlite3


from flask import Flask, request, session, g, redirect, url_for, abort, \
     render_template, flash

# Create application
app = Flask(__name__)
app.config.from_object(__name__)

# Load default config and override config from environemnt variable
app.config.update(dict(
  DATABASE=os.path.join(app.root_path, 'flaskr.db'),
  DEBUG=True,
  SECRET_KEY='development key',
  USERNAME='admin',
  PASSWORD='default'
))
app.config.from_envvar('FLASKR_SETTINGS', silent=True)


def init_db():
  '''Create the database.'''
  with app.app_context():
    db = get_db()
    with app.open_resource('schema.sql', mode='r') as f:
      db.cursor().executescript(f.read())
    db.commit()


def connect_db():
  '''Connects to the specific database.'''
  rv = sqlite3.connect(app.config['DATABASE'])
  rv.row_factory = sqlite3.Row
  return rv


def get_db():
  '''
  Opens a new database connection if there is none yet for the
  current application context.
  '''
  if not hasattr(g, 'sqlite_db'):
    g.sqlite_db = connect_db()
  return g.sqlite_db


@app.teardown_appcontext
def close_db(error):
  '''Closes the database again at the end of the request.'''
  if hasattr(g, 'sqlite_db'):
    g.sqlite_db.close()


@app.route('/')
def show_entries():
    db = get_db()
    cur = db.execute('select * from entries order by id desc')
    entries = cur.fetchall()
    return render_template('show_entries.html', entries=entries)


@app.route('/add', methods=['POST'])
def add_entry():
  if not session.get('logged_in'):
    abort(401)
  db = get_db()
  db.execute('insert into entries (title, text) values (?, ?)',
               [request.form['title'], request.form['text']])
  db.commit()
  flash('New entry was successfully posted')
  return redirect(url_for('show_entries'))


@app.route('/login', methods=['GET', 'POST'])
def login():
  error = None
  if request.method == 'POST':
    if request.form['username'] != app.config['USERNAME']:
      error = 'Invalid username'
    elif request.form['password'] != app.config['PASSWORD']:
      error = 'Invalid password'
    else:
      session['logged_in'] = True
      flash('You were logged in')
      return redirect(url_for('show_entries'))
  return render_template('login.html', error=error)


@app.route('/logout')
def logout():
  session.pop('logged_in', None)
  flash('You were logged out')
  return redirect(url_for('show_entries'))

#@app.errorhandler(404)
#def page_not_found(e):
#    return render_template('404.html'), 404

#@app.route('/')
#def homePage():
#  return render_template('layout.html')
#
#@app.route('/insertionSort')
#def insertionSort():
#  return redirect(url_for('static', filename='insertionSort.html'))
#
#@app.route('/selectionSort')
#def selectionSort():
#  return redirect(url_for('static', filename='selectionSort.html'))

if __name__ == "__main__":
  app.debug = True
  app.run()
