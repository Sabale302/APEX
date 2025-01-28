import pickle
import logging
from flask import Flask, render_template, request, jsonify
import json

app = Flask(__name__)
app.logger.setLevel(logging.DEBUG)
handler = logging.StreamHandler()
handler.setLevel(logging.DEBUG)
app.logger.addHandler(handler)

with open('model.pkl', 'rb') as model_file:
    model = pickle.load(model_file)


@app.route('/predict', methods=['POST', 'GET'])
def predict():
    try:
        data = request.get_json()  # Get feature data from the request
        app.logger.debug('Received request data: %s', data)
        features = [data['valid'], data['urlLen'], data['haveDash'],
                    data['domainLen'], data['nosofsubdomain'], data['ranking'], data['activeDuration']]
        # Make a prediction using your model
        prediction = model.predict([features])

        # Convert the int64 to a standard integer
        integer_value = int(prediction[0])

        # Convert the integer to a JSON object
        json_obj = {"my_integer": integer_value}

        # Convert the JSON object to a JSON string
        json_str = json.dumps(json_obj)

        # Now, json_str contains the JSON representation of your integer
        print(json_str)

        app.logger.debug('my_integer: %s', integer_value)
        return jsonify({"my_integer": integer_value})  # Return the prediction
    except Exception as e:
        app.logger.error('Error occurred during prediction: %s', str(e))
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
