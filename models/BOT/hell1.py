from google.cloud import speech_v1p1beta1 as speech

def transcribe_audio(audio_file_path):
    client = speech.SpeechClient()

    with open(audio_file_path, 'rb') as audio_file:
        content = audio_file.read()

    audio = speech.RecognitionAudio(content=content)
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=16000,
        language_code="en-US",
    )

    response = client.recognize(config=config, audio=audio)

    # Process the response to extract the transcription and timestamps
    for result in response.results:
        for alternative in result.alternatives:
            print("Transcript: {}".format(alternative.transcript))
            print("Start Time: {} seconds".format(result.start_time.seconds))
            print("End Time: {} seconds".format(result.end_time.seconds))

# Call the function with the path to the audio file
transcribe_audio('speech.mp3')
