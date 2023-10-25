from flask import Flask, request, jsonify
import pickle
import pandas as pd
import numpy as np
import requests

from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/recommend": {"origins": "http://127.0.0.1:5500"}})

# Load movie data
movies_df = pd.read_csv('tmdb_5000_movies.csv')

# Load similarity matrix
sim = pd.compat.pickle_compat.load(open('sim', 'rb'))

# Your TMDB API key
api_key = '5b923f780b5401e92b81a39fb35f266d'

def get_movie_poster_url(movie_id):
    response = requests.get(f'https://api.themoviedb.org/3/movie/{movie_id}?api_key={api_key}')
    if response.status_code == 200:
        poster = response.json()
        poster_path = poster.get('poster_path')
        if poster_path:
            return 'https://image.tmdb.org/t/p/w500/' + poster_path
    return None

def recommend(movie_name, user_history):
    vis = []  # Initialize the vis list
    matching_movies = movies_df[movies_df['title'] == movie_name]

    if matching_movies.empty:
        return [], [], [], [], []  # Return empty lists when the movie is not found

    ind = matching_movies.index[0]
    recom_list = sorted(list(enumerate(sim[ind])), reverse=True, key=lambda x: x[1])
    count = 0
    upd_recom_list = []
    for i in recom_list:
        if count >= 8:
            break
        if i not in vis:
            vis.append(i)
            upd_recom_list.append(i)
            count = count + 1

    recommended_movies = []
    recommended_ids = []
    recommended_popularity = []
    recommended_votecount = []
    recommended_voteaverage = []
    recommended_poster_url = []  # List to store poster URLs

    for i in upd_recom_list:
        movie_id = movies_df.iloc[i[0]].id
        pop = movies_df.iloc[i[0]].popularity
        vote_c = movies_df.iloc[i[0]].vote_count
        vote_avg = movies_df.iloc[i[0]].vote_average

        poster_url = get_movie_poster_url(movie_id)  # Get the poster URL

        recommended_ids.append(int(movie_id))  # Convert to regular Python int
        recommended_movies.append(movies_df.iloc[i[0]].title)
        recommended_popularity.append(float(pop))  # Convert to regular Python float
        recommended_votecount.append(int(vote_c))  # Convert to regular Python int
        recommended_voteaverage.append(float(vote_avg))  # Convert to regular Python float
        recommended_poster_url.append(poster_url)  # Store the poster URL

    return recommended_movies, recommended_ids, recommended_popularity, recommended_votecount, recommended_voteaverage, recommended_poster_url

# Create a route for movie recommendations
@app.route('/recommend', methods=['POST'])
def get_recommendations():
    data = request.get_json()
    if not data or 'user_history' not in data:
        return jsonify({'error': 'Invalid data format or missing "user_history" key'})

    user_history = data['user_history']
    recommended_data = {}
    for selected_movie_name in user_history:
        names, ids, popularity, vote_count, vote_average, poster_urls = recommend(selected_movie_name, user_history)
        recommended_data[selected_movie_name] = {
            'Movies': names,
            'Popularity': popularity,
            'VoteCount': vote_count,
            'VoteAverage': vote_average,
            'PosterURLs': poster_urls  # Include poster URLs
        }

    return jsonify(recommended_data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5430)



