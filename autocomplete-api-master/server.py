import json
from flask import Flask, Response, request
from flask_cors import CORS
from nltk.tokenize import RegexpTokenizer
from tensorflow.keras.models import load_model
import numpy as np
import pickle
import heapq

#Model1
model = load_model('nextword1.h5')
tokenizer = pickle.load(open('tokenizer1.pkl', 'rb'))

# Model2
path = 'sher.txt'
text = open(path).read().lower()
# text = text.replace('\n', '').replace('\r', '').replace('\ufeff', '')
text = text.replace('\r', '').replace('\ufeff', '')
tokenizer2 = RegexpTokenizer(r'\w+')
words = tokenizer2.tokenize(text)
unique_words = np.unique(words)
unique_word_index = dict((c, i) for i, c in enumerate(unique_words))
model2 = load_model('keras_next_word_model.h5')
history2 = pickle.load(open("history.p", "rb"))
WORD_LENGTH = 3


def prepare_input(text):
    x = np.zeros((1, WORD_LENGTH, len(unique_words)))
    for t, word in enumerate(text.split()):
        print(word, unique_word_index[word])
        x[0, t, unique_word_index[word]] = 1
    return x

def sample(preds, top_n=3):
    preds = np.asarray(preds).astype('float64')
    preds = np.log(preds)
    exp_preds = np.exp(preds)
    preds = exp_preds / np.sum(exp_preds)

    return heapq.nlargest(top_n, range(len(preds)), preds.take)

def predict_completions(text, n=3):
    if text == "":
        return("0")
    x = prepare_input(text)
    preds = model2.predict(x, verbose=0)[0]
    next_indices = sample(preds, n)
    return [unique_words[idx] for idx in next_indices]

def PredictNextWord(model, tokenizer, text):
   for i in range(3):
        sequence = tokenizer.texts_to_sequences([text])[0]
        # sequence = np.array(sequence)
        # preds = model.predict_classes(sequence)
        preds = np.argmax(model.predict(sequence), axis=-1)
        predicted_words = []
        for key, value in tokenizer.word_index.items():
            if value == preds:
                predicted_words.append(key)
        print(predicted_words)
        return predicted_words

def predict_next_word(phrase):
    seq = " ".join(tokenizer2.tokenize(phrase.lower())[0:WORD_LENGTH])
    return predict_completions(seq, 12)

app = Flask(__name__)
cors = CORS(app)

@app.route('/complete/', methods=['GET', 'POST'])
def func():
    if request.method == 'POST':
        phrase = request.get_json()['phrase']
        words = phrase.split()
        if len(words)<2:
            return "Insufficient information"
        text = words[-1]
        text = ''.join(text)
        res = PredictNextWord(model, tokenizer, text)
        if len(words)>2:
            res = predict_next_word(phrase) + res
        return Response(json.dumps(res), mimetype='application/json')
    elif request.method == 'GET':
       return "OK"


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, threaded=True)
