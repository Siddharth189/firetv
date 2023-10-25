from transformers import T5ForConditionalGeneration, T5Tokenizer
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re

# Define the user query
user_query = "Action and thriller where two heroes attack each other and become friends"

# List of potential genres
potential_genres = ["action", "adventure", "comedy", "drama", "fantasy", "horror", "mystery", "romance", "sci-fi", "thriller", "musical"]

# Extracting genres
genres = [genre for genre in potential_genres if genre.lower() in user_query.lower()]

# Removing genre keywords from the query
filtered_query = re.sub(r'|'.join(genres), "", user_query, flags=re.IGNORECASE)

# Extracting the remaining text as the overview
overview = filtered_query.strip()

# Initialize the T5 model and tokenizer
model = T5ForConditionalGeneration.from_pretrained('t5-small')
tokenizer = T5Tokenizer.from_pretrained('t5-small')

# Generate the output using the T5 model
input_text = f"Genres: {', '.join(genres)} Overview: {overview} "
inputs = tokenizer.encode(input_text, return_tensors="pt", max_length=512, truncation=True)
outputs = model.generate(inputs, max_length=100, num_beams=4, early_stopping=True)
output_text = tokenizer.decode(outputs[0], skip_special_tokens=True)

output_text = output_text.replace("|endoftext|>", "").strip()
print(input_text)

# Load the movie dataset into a Pandas DataFrame
movie_data = pd.read_csv("tmdb_5000_movies.csv")

# Calculate TF-IDF vectors for the combined text (genres + overview)
tfidf_vectorizer = TfidfVectorizer(stop_words="english")
combined_text = movie_data["overview"].fillna("") + " " + movie_data["genres"].apply(lambda x: " ".join([genre["name"] for genre in eval(x)]) if pd.notna(x) else "")
tfidf_matrix = tfidf_vectorizer.fit_transform(combined_text)


cosine_similarities = cosine_similarity(tfidf_vectorizer.transform([input_text]), tfidf_matrix)

# Combine similarity scores and popularity scores to rank movies
movie_data["similarity"] = cosine_similarities[0]
movie_data["popularity_rank"] = movie_data["popularity"].rank(ascending=False)


# Define a function to get movie recommendations based on popularity and similarity
def get_movie_recommendations(n=10):
    recommended_movies = movie_data.sort_values(
        by=["popularity_rank", "similarity"], ascending=[False, True]
    ).head(n)
    return recommended_movies[["original_title", "overview", "popularity"]]


# Get movie recommendations based on the user query
recommended_movies = get_movie_recommendations(n=10)

# Print the recommended movies
print(recommended_movies)
