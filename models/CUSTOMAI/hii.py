import pandas as pd

# Assuming you have a DataFrame named 'movie_data' with a 'genres' column
unique_genres = set()
movie_data = pd.read_csv("tmdb_5000_movies.csv")

# Iterate through the 'genres' column and add each genre to the set
for genres in movie_data['genres']:
    genres_list = eval(genres)  # Assuming 'genres' contains a list of dictionaries
    for genre in genres_list:
        unique_genres.add(genre['name'])

# Convert the set to a list if needed
unique_genres_list = list(unique_genres)
unique_genres_list = [genre.lower() for genre in unique_genres_list]
print(unique_genres_list)