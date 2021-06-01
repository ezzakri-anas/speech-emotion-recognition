# speech-emotion-recognition
An implementation of a convolutional neural network for Speech Emotion Recognition. This model can predict 
one of five different emotions in a speech audio.

### Dependencies installation
#### Using pip install following packages:
  matplotlib==3.2.1
  PyAudio==0.2.11
  numpy==1.18.2
  Eel==0.14.0
  tensorflow==2.4.0
  librosa==0.8.0
#### Or use the following command instead:
  pip install -r requirements.txt
  
### Directory Structure
- `speech-emotion-recognition-model/` - Contains the CNN model and code files, as notebooks, used to extract, clean the data and train the Model.
- `app/` - Contains a desktop GUI that plots model prediction on a chart made with [Chart.js-Rounded-Bar-Charts](https://github.com/jedtrow/Chart.js-Rounded-Bar-Charts). The predictions are made on audio samples from 'app/web/sound_samples' directory or from realtime voice recording functionality (still under development). The GUI is built using an Electron-like python library, [Eel](https://github.com/ChrisKnott/Eel#:~:text=Eel%20is%20a%20little%20Python,from%20Javascript%2C%20and%20vice%20versa.). 

### Datasets
Made use of the followings datasets:
1. [RAVDESS](https://zenodo.org/record/1188976): This dataset contains 7356 files from 24 different actors, 12 males and 12 females, in 8 different emotions i.e 1 = neutral, 2 = calm, 3 = happy, 4 = sad, 5 = angry, 6 = fearful, 7 = disgust, 8 = surprised.
2. [JL corpus](https://www.kaggle.com/tli725/jl-corpus): This dataset contains 2400 recordings of 240 sentences by 4 actors, 2 males and 2 females, in 5 primary emotions: (angry, sad, neutral, happy, excited) and 5 secondary emotions: (anxious, apologetic, pensive, worried, enthusiastic). **Credit: Jesin James, Li Tian, Catherine Watson, "An Open Source Emotional Speech Corpus for Human Robot Interaction Applications", in Proc. Interspeech, 2018.**
Only utterances cooresponding to the following emotions were retained:
'neutral', 'happy', 'sad', 'angry', 'fearful'

## Feature extraction


<author(s) names> (<date>) <title of program/source code> (<code version>) [<type>]. Web address or publisher.
