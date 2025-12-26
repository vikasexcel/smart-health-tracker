import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np
import pandas as pd
import os

class HealthModel:
    def __init__(self, data_path):
        self.data_path = data_path
        self.model = None

    def load_data(self):
        try:
            data = pd.read_csv(self.data_path)
            # Assuming the last column is the target variable
            X = data.iloc[:, :-1].values
            y = data.iloc[:, -1].values
            return X, y
        except Exception as e:
            print(f"Error loading data: {e}")
            raise

    def build_model(self, input_shape):
        model = keras.Sequential([
            layers.Dense(64, activation='relu', input_shape=(input_shape,)),
            layers.Dense(64, activation='relu'),
            layers.Dense(1, activation='sigmoid')  # Assuming binary classification
        ])
        model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
        return model

    def train_model(self, X, y, epochs=50, batch_size=32):
        self.model = self.build_model(X.shape[1])
        try:
            self.model.fit(X, y, epochs=epochs, batch_size=batch_size, validation_split=0.2)
        except Exception as e:
            print(f"Error during model training: {e}")
            raise

    def save_model(self, model_path):
        try:
            self.model.save(model_path)
        except Exception as e:
            print(f"Error saving model: {e}")
            raise

if __name__ == "__main__":
    data_file_path = os.path.join(os.path.dirname(__file__), 'data', 'health_data.csv')
    model_save_path = os.path.join(os.path.dirname(__file__), 'saved_model', 'health_model.h5')

    health_model = HealthModel(data_file_path)
    X, y = health_model.load_data()
    health_model.train_model(X, y)
    health_model.save_model(model_save_path)