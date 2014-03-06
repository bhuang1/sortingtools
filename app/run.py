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
  if not session.get('logged_in'):
    abort(401)
  db = get_db()
  cur = db.execute('select * from entries')
  entries = cur.fetchall()
  return render_template('show_entries.html', entries=entries)


@app.route('/newStat', methods=['POST'])
def add_stat():
  '''Adds a new statistics entry to the database.'''
  for s in session:
    print s
  db = get_db()
  db.execute('insert into entries (mem, ops, who) values (?, ?, ?)',
      [request.form['mem'], request.form['ops'],
        'anonymous' if not session.get('logged_in') else session['username']])
  db.commit()
  flash('Posted results to the database!')
  return redirect(url_for('selectionSort'))

@app.route('/login', methods=['GET', 'POST'])
def login():
  error = None
  if request.method == 'POST':
    if request.form['username'] != app.config['USERNAME']:
      error = 'Invalid username'
    elif request.form['password'] != app.config['PASSWORD']:
      error = 'Invalid password'
    else:
      session['username'] = request.form['username']
      session['logged_in'] = True
      flash('You were logged in')
      return redirect(url_for('show_entries'))
  return render_template('login.html', error=error)


@app.route('/selectionSort')
def selectionSort():
  return render_template('selectionSort.html')


@app.route('/logout')
def logout():
  session.pop('logged_in', None)
  flash('You were logged out')
  return redirect(url_for('login'))


@app.errorhandler(404)
def page_not_found(e):
  '''Handle 404 errors.'''
  return render_template('404.html'), 404


@app.errorhandler(401)
def unauthorized(e):
  '''Handle 401 errors.'''
  return render_template('401.html'), 401


if __name__ == "__main__":
  try:
    db = get_db()
  except Exception:
    init_db()
  app.debug = True
  app.run()
