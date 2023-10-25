from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import re
from transformers import T5ForConditionalGeneration, T5Tokenizer
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity, linear_kernel
from transformers import T5ForConditionalGeneration, T5Tokenizer


app = Flask(__name__)
CORS(app)  # Add this line to enable CORS for all routes


@app.route("/")
def front():
    return render_template('index.html')


@app.route("/search-query", methods=["POST"])
def recommend_movies():
    data = request.get_json()  # Get JSON data from the request
    user_query = data.get("searchText")

    # Your code for extracting genres and generating movie recommendations
    potential_genres = ['war', 'mystery', 'tv movie', 'crime', 'family', 'western', 'animation', 'action', 'fantasy', 'adventure', 'foreign', 'romance', 'drama', 'comedy', 'documentary', 'thriller', 'horror', 'music', 'science fiction', 'history']
    genres = [genre for genre in potential_genres if genre.lower() in user_query.lower()]
    filtered_query = re.sub("|".join(genres), "", user_query, flags=re.IGNORECASE)
    overview = filtered_query.strip()

    # Initialize the T5 model and tokenizer
    model = T5ForConditionalGeneration.from_pretrained('t5-small')
    tokenizer = T5Tokenizer.from_pretrained('t5-small')

    # Generate the output using the T5 model
    input_text = f"Genres: {', '.join(genres)} Overview: {overview} "
    inputs = tokenizer.encode(input_text, return_tensors="pt", max_length=512, truncation=True)

    # Generate the output text
    outputs = model.generate(inputs, max_length=100, num_beams=4, early_stopping=True)
    output_text = tokenizer.decode(outputs[0], skip_special_tokens=True)

    # Define a regular expression pattern to match genres and overview
    parts = output_text.split("Overview:")
    genre1 = ""
    overview1 = ""
    if len(parts) == 2:
        genre_part, overview_part = parts
        genres = [genre.strip() for genre in genre_part.split(",")]
        genres[0] = genres[0].replace("Genres: ", "")
        genre = ""
        for i in genres:
            genre += i+' '
        genre1 = genre
        overview = overview_part.replace("|endoftext|>", "").strip()
        overview1 = overview

    # Load movie data from a CSV file
    movie_data = pd.read_csv("tmdb_5000_movies.csv")

    # Filter the dataset based on the input genres
    input_genres = genre.split()
    matching_movies = movie_data[movie_data['genres'].str.lower().str.contains('|'.join(input_genres))]
    matching_movies = matching_movies.sort_values(by='popularity', ascending=False)

    # Get the top 10 popular movies
    top_10_popular_movies = matching_movies.head(6)

    # Prepare the response in JSON format
    response_data = {
        "Genres": genre1,
        "Overview": overview1,
        "RecommendedMovies": top_10_popular_movies[['id', 'title', 'popularity', 'vote_count']].to_dict(orient='records')
    }

    return jsonify(response_data)


if __name__ == "__main__":
    app.run()
