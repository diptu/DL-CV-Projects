import mnist_loader
import network


def main():
    """
    Train the neural network on MNIST data using SGD and monitor evaluation accuracy.
    """
    # Load MNIST data in sklearn-style format
    X_train, y_train, X_val, y_val, X_test, y_test = (
        mnist_loader.load_data_sklearn_style()
    )

    # Create and initialize the neural network
    net = network.Network([784, 30, 10], cost=network.CrossEntropyCost)
    net.default_weight_initializer()

    # Train the network using SGD
    net.SGD(
        training_data=(X_train, y_train),
        epochs=30,
        mini_batch_size=10,
        eta=3.0,
        evaluation_data=(X_test, y_test),
        monitor_evaluation_accuracy=True,
    )


if __name__ == "__main__":
    main()
