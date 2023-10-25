from flask import Flask,request,render_template
import re
app=Flask(__name__)

@app.route("/")
def front():
    return render_template('index.html')


@app.route("/bot_response",methods=["GET","POST"])
def response(): 
    if request.method=="POST":
        import bardapi
        token="cQgxCd6SC2g1S-UJ70uSzpokgYbUf8dD7jRGYdwqFKOD-Qa1jqeIoGsqIhnkujeTDcp4Ew."
        movie_name=request.form['movie_name']
        user_input=request.form['user_input']
        text = f"Movie Name: {movie_name}\nUser Question: {user_input}\nContext: You are an AI bot specifically created to address customer inquiries related to Fire TV content. In response to user questions about the movie, please provide clear and concise responses."
        response = bardapi.core.Bard(token).get_answer(text)
        response=response['content']
        response=response.replace('\n',"<br>")
        pattern = r'\*\*(.*?)\*\*'

        # Use re.sub() to replace the matched text with <strong> tags
        response = re.sub(pattern, r'<strong>\1</strong>', response)
        return render_template("index.html", response=response)

if __name__=="__main__":
    app.run()
