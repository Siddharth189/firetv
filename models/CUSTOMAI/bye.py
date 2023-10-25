import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

# Load the dataset
data = pd.read_csv('tmdb_dataset.csv')  # Replace 'tmdb_dataset.csv' with the actual dataset file

# Preprocess data
# Handling missing values
data['overview'] = data['overview'].fillna('')

# Extracting genres
data['genres'] = data['genres'].apply(lambda x: [i['name'] for i in eval(x)])

# Implement the search functionality
def search_movies(user_query, data):
    # Preprocess the user query
    # Implement natural language processing techniques

    # Filter out the genre from the user query
    user_genres = []  # Add the logic to extract genres from the user query

    # Filter out the overview from the user query
    user_overview = user_query  # Modify this to extract relevant overview from the user query

    # Vectorize the data
    tfidf_vectorizer = TfidfVectorizer()
    tfidf_matrix = tfidf_vectorizer.fit_transform(data['overview'])

    # Compute the similarity scores based on overview
    overview_query_vector = tfidf_vectorizer.transform([user_overview])
    overview_cosine_similarities = linear_kernel(overview_query_vector, tfidf_matrix)

    # Filter data based on genres
    relevant_data = data[data['genres'].apply(lambda x: any(item for item in user_genres if item in x))]

    # Compute the similarity scores based on genres
    # Use appropriate metrics or similarity calculation based on the genre list

    # Combine the results based on both overview and genres
    # Implement appropriate aggregation or scoring mechanism

    # Return the recommended movies
    return relevant_data  # Modify this to return the relevant list of movies

# Example usage
user_query = "RomCom Hindi movie having popular songs"
recommended_movies = search_movies(user_query, data)

# Print the recommended movies
for index, movie in recommended_movies.iterrows():
    print(movie['title'], movie['genres'], movie['overview'])