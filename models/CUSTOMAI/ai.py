from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import re
import pandas as pd
import requests

app = Flask(__name__)
CORS(app)  # Add this line to enable CORS for all routes

api_key = '5b923f780b5401e92b81a39fb35f266d'


@app.route("/")
def front():
    return render_template('index.html')


@app.route("/search-query", methods=["POST"])
def recommend_movies():
    data = request.get_json()  # Get JSON data from the request
    user_query = data.get("searchText")

    # Your code for extracting genres and generating movie recommendations
    potential_genres = ['war', 'mystery', 'tv movie', 'crime', 'family', 'western', 'animation', 'action', 'fantasy', 'adventure',
                        'foreign', 'romance', 'drama', 'comedy', 'documentary', 'thriller', 'horror', 'music', 'science fiction', 'history']
    genres = [genre for genre in potential_genres if genre.lower()
              in user_query.lower()]
    filtered_query = re.sub("|".join(genres), "",
                            user_query, flags=re.IGNORECASE)
    overview = filtered_query.strip()

    # Load movie data from a CSV file
    movie_data = pd.read_csv("tmdb_5000_movies.csv")

    # Filter the dataset based on the input genres
    input_genres = genres
    matching_movies = movie_data[movie_data['genres'].str.lower(
    ).str.contains('|'.join(input_genres))]
    matching_movies = matching_movies.sort_values(
        by='popularity', ascending=False)

    # Get the top 10 popular movies
    top_10_popular_movies = matching_movies.head(6)

    # Prepare the response in JSON format
    response_data = {
        "RecommendedMovies": []
    }

    for index, row in top_10_popular_movies.iterrows():
        movie_id = row['id']
        movie_name = row['title']
        popularity = row['popularity']
        vote_count = row['vote_count']

        poster_url = get_movie_poster_url(movie_id)
        movie_info = {
            "MovieName": movie_name,
            "MovieID": movie_id,
            "Popularity": popularity,
            "VoteCount": vote_count,
            "PosterURL": poster_url
        }
        response_data["RecommendedMovies"].append(movie_info)

    return jsonify(response_data)


def get_movie_poster_url(movie_id):
    response = requests.get(
        f'https://api.themoviedb.org/3/movie/{movie_id}?api_key={api_key}')
    if response.status_code == 200:
        poster = response.json()
        poster_path = poster.get('poster_path')
        if poster_path:
            return 'https://image.tmdb.org/t/p/w500/' + poster_path
    return None


if __name__ == "__main__":
    app.run()
