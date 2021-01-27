import eel
import os
import numpy as np
import matplotlib.pyplot as plt
import librosa
import librosa.display
from math import floor, ceil
import pyaudio
import tensorflow as tf

eel.init('web')

Model = tf.keras.models.load_model("web/model_speech_jl_rav")

MAX_TIME = 130
N_MFCC = 13
SR = 22050

@eel.expose
def sound_names(folder):
    if os.path.isdir(folder):
        return os.listdir(folder)
    else:
        return 'Folder path not valid'


def soundname2feature(path):
    signal, sr = librosa.load(path, duration=3, sr=SR)
    mfccs = librosa.feature.mfcc(y=signal, n_mfcc=N_MFCC, sr=SR)
    return format_mfcc(mfccs).reshape((1, -1))[0].tolist()


@eel.expose
def predict_emotion(sound_name):
    path_ = "web/sound_samples/" + sound_name
    mfccs = np.array(soundname2feature(path_)).reshape((1, N_MFCC, MAX_TIME, 1))
    predicted = Model.predict(mfccs)
    predicted = predicted * 100
    return predicted.tolist()
    
@eel.expose
def format_mfcc(raw_mfcc):
    diff = (MAX_TIME - len(raw_mfcc[0])) / 2
    pre_pad = np.zeros((N_MFCC, floor(diff)))
    post_pad = np.zeros((N_MFCC, ceil(diff)))
    return np.concatenate((pre_pad, raw_mfcc,  post_pad), axis=1).reshape((1, N_MFCC, MAX_TIME, 1))


recording = []

@eel.expose
def record_and_predict():
    global recording
    
    CHUNK = 11025
    RATE = 22050

    p = pyaudio.PyAudio()
    stream = p.open(format=pyaudio.paFloat32,
                    channels=1,
                    rate=SR,
                    input=True,
                    frames_per_buffer=CHUNK)

    while 1:
        if eel.stopPredicting()():
            break
        data = np.frombuffer(stream.read(CHUNK), dtype=np.float32)
        recording.append(data)
        if len(recording) == (3 * int(RATE / CHUNK)):
            record = np.array(recording).reshape((-1))
            mfcc = librosa.feature.mfcc(record, sr=SR, n_mfcc=N_MFCC)
            del recording[0: int(RATE / CHUNK) * 2]
            prediction = Model.predict(format_mfcc(mfcc)) * 100
            eel.updateChart(prediction.tolist()[0])
    
    stream.stop_stream()
    stream.close()
    recording = []
    return None

def plot_mfcc(mfcc):
    plt.figure(figsize=(10, 5))
    librosa.display.specshow(np.array(mfcc).reshape([N_MFCC, -1]))
    plt.show()
    

eel.start("index.html", block=True)
