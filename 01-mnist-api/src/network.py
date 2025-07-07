"""
network.py

A neural network implementation with stochastic gradient descent (SGD),
supporting cross-entropy cost, regularization, and improved weight initialization.

Designed to work with scikit-learn-style datasets (NumPy arrays).
"""

import json
import random
import sys
from typing import List, Tuple, Optional

import numpy as np


class QuadraticCost:
    """Quadratic cost function."""

    @staticmethod
    def fn(a: np.ndarray, y: np.ndarray) -> float:
        """
        Compute quadratic cost between prediction and target.

        Parameters
        ----------
        a : np.ndarray
            Predicted output.
        y : np.ndarray
            True label.

        Returns
        -------
        float
            Cost value.
        """
        return 0.5 * np.linalg.norm(a - y) ** 2

    @staticmethod
    def delta(z: np.ndarray, a: np.ndarray, y: np.ndarray) -> np.ndarray:
        """
        Compute error delta for output layer.

        Returns
        -------
        np.ndarray
            Delta value.
        """
        return (a - y) * sigmoid_prime(z)


class CrossEntropyCost:
    """Cross-entropy cost function."""

    @staticmethod
    def fn(a: np.ndarray, y: np.ndarray) -> float:
        return float(np.sum(np.nan_to_num(-y * np.log(a) - (1 - y) * np.log(1 - a))))

    @staticmethod
    def delta(_: np.ndarray, a: np.ndarray, y: np.ndarray) -> np.ndarray:
        return a - y


class Network:
    """Feedforward neural network with backpropagation and SGD."""

    def __init__(self, sizes: List[int], cost=CrossEntropyCost):
        """
        Initialize the neural network.

        Parameters
        ----------
        sizes : list of int
            Sizes of each layer in the network.
        cost : class, optional
            Cost function class.
        """
        self.num_layers = len(sizes)
        self.sizes = sizes
        self.cost = cost
        self.default_weight_initializer()

    def default_weight_initializer(self) -> None:
        """Initialize weights and biases with scaled random values."""
        self.biases = [np.random.randn(y, 1) for y in self.sizes[1:]]
        self.weights = [
            np.random.randn(y, x) / np.sqrt(x)
            for x, y in zip(self.sizes[:-1], self.sizes[1:])
        ]

    def feedforward(self, a: np.ndarray) -> np.ndarray:
        """Compute output of the network for input a."""
        for b, w in zip(self.biases, self.weights):
            a = sigmoid(np.dot(w, a) + b)
        return a

    def SGD(
        self,
        training_data: Tuple[np.ndarray, np.ndarray],
        epochs: int,
        mini_batch_size: int,
        eta: float,
        lmbda: float = 0.0,
        evaluation_data: Optional[Tuple[np.ndarray, np.ndarray]] = None,
        monitor_evaluation_cost: bool = False,
        monitor_evaluation_accuracy: bool = False,
        monitor_training_cost: bool = False,
        monitor_training_accuracy: bool = False,
        early_stopping_n: int = 0,
    ) -> Tuple[List[float], List[int], List[float], List[int]]:
        """
        Train the network using mini-batch stochastic gradient descent.

        Returns
        -------
        tuple
            Lists of evaluation costs, evaluation accuracies, training costs, training accuracies.
        """
        X_train, y_train = training_data
        training_data = [
            (x.reshape(-1, 1), vectorized_result(y)) for x, y in zip(X_train, y_train)
        ]

        if evaluation_data:
            X_eval, y_eval = evaluation_data
            evaluation_data = [(x.reshape(-1, 1), y) for x, y in zip(X_eval, y_eval)]
            n_data = len(evaluation_data)
        else:
            n_data = 0

        best_accuracy = 0
        no_accuracy_change = 0

        evaluation_cost, evaluation_accuracy = [], []
        training_cost, training_accuracy = [], []

        for epoch in range(epochs):
            random.shuffle(training_data)
            mini_batches = [
                training_data[k : k + mini_batch_size]
                for k in range(0, len(training_data), mini_batch_size)
            ]
            for mini_batch in mini_batches:
                self.update_mini_batch(mini_batch, eta, lmbda, len(training_data))

            print(f"Epoch {epoch} training complete")

            if monitor_training_cost:
                cost = self.total_cost(training_data, lmbda)
                training_cost.append(cost)
                print(f"Cost on training data: {cost:.4f}")
            if monitor_training_accuracy:
                accuracy = self.accuracy(training_data, convert=True)
                training_accuracy.append(accuracy)
                print(f"Accuracy on training data: {accuracy} / {len(training_data)}")
            if monitor_evaluation_cost:
                cost = self.total_cost(evaluation_data, lmbda, convert=True)
                evaluation_cost.append(cost)
                print(f"Cost on evaluation data: {cost:.4f}")
            if monitor_evaluation_accuracy:
                accuracy = self.accuracy(evaluation_data)
                evaluation_accuracy.append(accuracy)
                print(f"Accuracy on evaluation data: {accuracy} / {n_data}")

            if early_stopping_n > 0:
                if accuracy > best_accuracy:
                    best_accuracy = accuracy
                    no_accuracy_change = 0
                else:
                    no_accuracy_change += 1
                if no_accuracy_change == early_stopping_n:
                    return (
                        evaluation_cost,
                        evaluation_accuracy,
                        training_cost,
                        training_accuracy,
                    )

        return evaluation_cost, evaluation_accuracy, training_cost, training_accuracy

    def update_mini_batch(
        self,
        mini_batch: List[Tuple[np.ndarray, np.ndarray]],
        eta: float,
        lmbda: float,
        n: int,
    ) -> None:
        """Update weights and biases using backpropagation for a mini-batch."""
        nabla_b = [np.zeros(b.shape) for b in self.biases]
        nabla_w = [np.zeros(w.shape) for w in self.weights]
        for x, y in mini_batch:
            delta_b, delta_w = self.backprop(x, y)
            nabla_b = [nb + dnb for nb, dnb in zip(nabla_b, delta_b)]
            nabla_w = [nw + dnw for nw, dnw in zip(nabla_w, delta_w)]
        self.weights = [
            (1 - eta * (lmbda / n)) * w - (eta / len(mini_batch)) * nw
            for w, nw in zip(self.weights, nabla_w)
        ]
        self.biases = [
            b - (eta / len(mini_batch)) * nb for b, nb in zip(self.biases, nabla_b)
        ]

    def backprop(
        self, x: np.ndarray, y: np.ndarray
    ) -> Tuple[List[np.ndarray], List[np.ndarray]]:
        """Return gradient for cost function via backpropagation."""
        nabla_b = [np.zeros(b.shape) for b in self.biases]
        nabla_w = [np.zeros(w.shape) for w in self.weights]

        activation = x
        activations = [x]
        zs = []

        for b, w in zip(self.biases, self.weights):
            z = np.dot(w, activation) + b
            zs.append(z)
            activation = sigmoid(z)
            activations.append(activation)

        delta = self.cost.delta(zs[-1], activations[-1], y)
        nabla_b[-1] = delta
        nabla_w[-1] = np.dot(delta, activations[-2].T)

        for l in range(2, self.num_layers):
            z = zs[-l]
            sp = sigmoid_prime(z)
            delta = np.dot(self.weights[-l + 1].T, delta) * sp
            nabla_b[-l] = delta
            nabla_w[-l] = np.dot(delta, activations[-l - 1].T)

        return nabla_b, nabla_w

    def accuracy(
        self, data: List[Tuple[np.ndarray, int]], convert: bool = False
    ) -> int:
        """Return number of correct predictions on the given data."""
        if convert:
            results = [(np.argmax(self.feedforward(x)), np.argmax(y)) for x, y in data]
        else:
            results = [(np.argmax(self.feedforward(x)), y) for x, y in data]
        return sum(int(x == y) for x, y in results)

    def total_cost(
        self, data: List[Tuple[np.ndarray, int]], lmbda: float, convert: bool = False
    ) -> float:
        """Return total cost on data set with regularization."""
        cost = 0.0
        for x, y in data:
            a = self.feedforward(x)
            if convert:
                y = vectorized_result(y)
            cost += self.cost.fn(a, y)
        cost += (
            0.5
            * (lmbda / len(data))
            * sum(np.linalg.norm(w) ** 2 for w in self.weights)
        )
        return cost / len(data)

    def save(self, filename: str) -> None:
        """Save the network to a JSON file."""
        data = {
            "sizes": self.sizes,
            "weights": [w.tolist() for w in self.weights],
            "biases": [b.tolist() for b in self.biases],
            "cost": self.cost.__name__,
        }
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(data, f)


def load(filename: str) -> Network:
    """Load a network from file."""
    with open(filename, "r", encoding="utf-8") as f:
        data = json.load(f)
    cost = getattr(sys.modules[__name__], data["cost"])
    net = Network(data["sizes"], cost=cost)
    net.weights = [np.array(w) for w in data["weights"]]
    net.biases = [np.array(b) for b in data["biases"]]
    return net


def vectorized_result(j: int) -> np.ndarray:
    """Convert label to one-hot encoded vector."""
    e = np.zeros((10, 1))
    e[j] = 1.0
    return e


def sigmoid(z: np.ndarray) -> np.ndarray:
    """Numerically stable sigmoid that avoids overflow in exp."""
    out = np.empty_like(z, dtype=np.float64)
    positive_mask = z >= 0
    negative_mask = ~positive_mask

    out[positive_mask] = 1.0 / (1.0 + np.exp(-z[positive_mask]))
    exp_z = np.exp(z[negative_mask])
    out[negative_mask] = exp_z / (1.0 + exp_z)

    return out


def sigmoid_prime(z: np.ndarray) -> np.ndarray:
    """Derivative of the sigmoid function."""
    return sigmoid(z) * (1 - sigmoid(z))
