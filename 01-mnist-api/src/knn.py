import numpy as np
from collections import Counter


class KNNClassifier:
    def __init__(self, k=3):
        self.k = k
        self.X_train = None
        self.y_train = None

    def fit(self, X, y):
        self.X_train = np.array([x.flatten() for x in X])  # Ensure 2D
        self.y_train = np.array(y)
        return self

    def _euclidean_distance(self, x1, x2):
        return np.sqrt(np.sum((x1 - x2) ** 2))

    def _predict_point(self, x):
        distances = [self._euclidean_distance(x, x_train) for x_train in self.X_train]
        k_indices = np.argsort(distances)[: self.k]
        k_nearest_labels = self.y_train[k_indices]
        most_common = Counter(k_nearest_labels).most_common(1)
        return most_common[0][0]

    def predict(self, X):
        X = np.array([x.flatten() for x in X])
        return np.array([self._predict_point(x) for x in X])

    def score(self, X, y):
        y_pred = self.predict(X)
        return np.mean(y_pred == np.array(y))
