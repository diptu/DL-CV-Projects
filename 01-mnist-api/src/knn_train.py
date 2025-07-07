import mnist_loader
from knn import KNNClassifier
from sklearn.metrics import accuracy_score
import time  # Import time module


def main():
    # Load MNIST data in sklearn-style format
    X_train, y_train, X_val, y_val, X_test, y_test = (
        mnist_loader.load_data_sklearn_style()
    )

    print("Data loaded. X_train shape:", X_train.shape, "y_train shape:", y_train.shape)
    print("X_test shape:", X_test.shape, "y_test shape:", y_test.shape)

    # Initialize and test model
    knn = KNNClassifier(k=3)
    print("Fitting KNN model (this should be fast)...")
    start_time = time.time()
    knn.fit(X_train, y_train)
    end_time = time.time()
    print(f"KNN fit completed in {end_time - start_time:.2f} seconds.")

    # Make predictions on the test set
    print("Starting full prediction on X_test (this will be slow!)...")
    start_time = time.time()
    y_pred = knn.predict(X_test)
    end_time = time.time()
    print(f"Full prediction completed in {end_time - start_time:.2f} seconds.")

    full_accuracy = accuracy_score(y_test, y_pred)
    print("Full Test Accuracy :", full_accuracy)

    print("Starting subset prediction on X_test[:100] (this should be faster)...")
    start_time = time.time()
    y_pred_subset = knn.predict(X_test[:100])
    end_time = time.time()
    print(f"Subset prediction completed in {end_time - start_time:.2f} seconds.")
    accuracy_subset = accuracy_score(y_test[:100], y_pred_subset)
    print("Test Accuracy on 100 MNIST images:", accuracy_subset)


if __name__ == "__main__":
    main()
