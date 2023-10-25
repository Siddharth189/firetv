from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import re
import pandas as pd

app = Flask(__name__)
CORS(app)  # Add this line to enable CORS for all routes

@app.route("/")
def front():
    return render_template('index.html')

@app.route("/bot_response", methods=["GET", "POST"])
def response(): 
    if request.method == "POST":
        data = request.get_json()  # Get JSON data from the request
        import bardapi
        token = "cQg5aAvXJl3RN18RyLjzclqzhD1wYnHNvkpEOCuD82ae27_PIFsLgjoFzc4tEp5ULNgnng."
        movie_name = data['content_desc']  # Access the data from the JSON object
        user_input = data['query']  # Access the data from the JSON object
        text = f"Movie Name: {movie_name}\nUser Question: {user_input}\nContext: You are an AI bot specifically created to address customer inquiries related to Fire TV content. In response to user questions about the movie, please provide clear and concise responses."
        response = bardapi.core.Bard(token).get_answer(text)
        response = response['content']
        # response = response.replace('\n', "<br>")
        pattern = r'\*\*(.*?)\*\*'

        # Use re.sub() to replace the matched text with <strong> tags
        # response = re.sub(pattern, r'<strong>\1</strong>', response)
        print(response)
        return jsonify(response=response)  # Return JSON response

if __name__ == "__main__":
    app.run(port=5050)
