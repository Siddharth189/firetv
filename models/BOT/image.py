import requests
from flask import Flask, request, render_template

app = Flask(__name__)

api_key = '5b923f780b5401e92b81a39fb35f266d'

@app.route('/image', methods=['GET', 'POST'])
def posters():
    if request.method == 'POST':
        movie_id = request.form.get('movie_id')
        if movie_id:
            response = requests.get(f'https://api.themoviedb.org/3/movie/{movie_id}?api_key={api_key}')
            if response.status_code == 200:
                poster = response.json()
                poster_path = poster.get('poster_path')
                if poster_path:
                    return 'https://image.tmdb.org/t/p/w500/' + poster_path
                    # return render_template("index.html",response='https://image.tmdb.org/t/p/w500/' + poster_path)
                
                else:
                    return 'No poster found for this movie.'
            else:
                return 'Movie not found or API error.'
        else:
            return 'Please provide a valid movie ID.'
    else:
        return 'Send a POST request with a movie ID to get the poster URL.'
    
@app.route("/")
def show():
    return render_template("index.html")

if __name__ == '__main__':
    app.run(port=6000)
