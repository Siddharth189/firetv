from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import re
import pandas as pd
import requests
import pickle
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer

app = Flask(__name__)
CORS(app)  # Add this line to enable CORS for all routes

api_key = '5b923f780b5401e92b81a39fb35f266d'


vis = []

# Load data
sim = pd.compat.pickle_compat.load(open('sim', 'rb'))
movies = pd.compat.pickle_compat.load(open('movies_list', 'rb'))
movies_df = movies

# Create a TF-IDF vectorizer for tags
tfidf_vectorizer = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf_vectorizer.fit_transform(movies_df['tags'])


def recommend(user_choice, user_history):
    if user_choice in movies_df['title'].values:
        # User choice matches a movie title, recommend based on the movie title
        ind = movies_df[movies_df['title'] == user_choice].index[0]
        recom_list = sorted(
            list(enumerate(sim[ind])), key=lambda x: x[1], reverse=True)
    else:
        # User choice doesn't match any movie title, recommend based on similarity to tags
        tfidf_user_choice = tfidf_vectorizer.transform([user_choice])
        cosine_sim = cosine_similarity(tfidf_user_choice, tfidf_matrix)
        recom_list = sorted(
            list(enumerate(cosine_sim[0])), key=lambda x: x[1], reverse=True)

    count = 0
    upd_recom_list = []
    for i in recom_list:
        if count >= 15:
            break
        if i not in vis:
            vis.append(i)
            upd_recom_list.append(i)
            count += 1

    recommended_movies = []
    recommended_ids = []
    recommended_popularity = []
    recommended_votecount = []

    for i in upd_recom_list:
        movie_id = movies_df.iloc[i[0]].id
        pop = movies_df.iloc[i[0]].popularity
        vote_c = movies_df.iloc[i[0]].vote_count
        recommended_ids.append(movie_id)
        recommended_movies.append(movies_df.iloc[i[0]].title)
        recommended_popularity.append(pop)
        recommended_votecount.append(vote_c)

    return recommended_movies, recommended_ids, recommended_popularity, recommended_votecount


@app.route("/")
def front():
    return render_template('index.html')


@app.route("/search-query", methods=["POST"])
def recommend_movies():
    data = request.get_json()  # Get JSON data from the request
    user_query = data.get("searchText")


# Example usage
    # user_choice = "give me movies with animation and family"
    user_history = []  # You can add user's previous choices if needed

    recommended_movies, recommended_ids, recommended_popularity, recommended_votecount = recommend(
        user_query, user_history)
    # for ind in range(len(recommended_movies)):
    #     print(recommended_movies[ind], recommended_ids[ind],
    #         recommended_popularity[ind], recommended_votecount[ind])

    # top_10_popular_movies = matching_movies.head(6)

    # Prepare the response in JSON format
    response_data = {
        "RecommendedMovies": []
    }

    for i in range(len(recommend_movies)):
        movie_id = recommended_ids[i]
        movie_name = recommend_movies[i]
        popularity = recommended_popularity[i]
        vote_count = recommended_votecount[i]

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
