
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

# Load the movie dataset into a Pandas DataFrame
movie_data = pd.read_csv("tmdb_5000_movies.csv")

# Combine genres and overview
movie_data["combined_features"] = movie_data["genres"] + " " + movie_data["overview"].fillna("")

# Create a TF-IDF vectorizer
tfidf_vectorizer = TfidfVectorizer(stop_words="english")

# Fit and transform the TF-IDF vectorizer on the combined features
tfidf_matrix = tfidf_vectorizer.fit_transform(movie_data["combined_features"])

# Calculate cosine similarity between movies
cosine_similarities = linear_kernel(tfidf_matrix, tfidf_matrix)

# Define a function to recommend movies based on genre and overview
def recommend_movies(genre, overview, n=10):
    # Create a combined feature for the input
    input_features = genre + " " + overview
    
    # Transform the input feature using the TF-IDF vectorizer
    input_vector = tfidf_vectorizer.transform([input_features])
    
    # Calculate similarity scores with all movies
    similarity_scores = cosine_similarities.dot(input_vector.T).flatten()
    
    # Get the indices of the top N most similar movies
    similar_movie_indices = similarity_scores.argsort()[::-1][:n]
    
    # Get the titles of the recommended movies
    recommended_movie_titles = movie_data.iloc[similar_movie_indices]["original_title"]
    
    return recommended_movie_titles

# Example usage
genre = "Action Adventure"
overview = "In a world of adventure, heroes take on thrilling challenges."
recommended_movies = recommend_movies(genre, overview, n=10)

# Print the recommended movies
print(recommended_movies)
