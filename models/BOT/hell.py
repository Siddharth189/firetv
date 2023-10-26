import assemblyai as aai

aai.settings.api_key = f"b2c5514226e848a6bce9e681d18eeecf"

FILE_URL = "speech.mp3"

transcriber = aai.Transcriber()
transcript = transcriber.transcribe(FILE_URL)

print(transcript.text)
