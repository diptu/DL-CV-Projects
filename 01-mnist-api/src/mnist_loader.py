"""
mnist_loader
~~~~~~~~~~~~
Updated to mimic scikit-learn style:
Returns train/test/validation data as flat NumPy arrays (features and labels).
"""

import pickle
import gzip
import numpy as np


def load_data_sklearn_style(path="../data/mnist.pkl.gz"):
    """
    Loads MNIST data in scikit-learn style format.

    Returns:
        X_train: ndarray of shape (50000, 784)
        y_train: ndarray of shape (50000,)
        X_val: ndarray of shape (10000, 784)
        y_val: ndarray of shape (10000,)
        X_test: ndarray of shape (10000, 784)
        y_test: ndarray of shape (10000,)
    """
    with gzip.open(path, "rb") as f:
        training_data, validation_data, test_data = pickle.load(f, encoding="latin1")

    X_train, y_train = training_data
    X_val, y_val = validation_data
    X_test, y_test = test_data

    return X_train, y_train, X_val, y_val, X_test, y_test
