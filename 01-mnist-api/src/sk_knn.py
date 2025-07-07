import mnist_loader
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score
import mlflow
import os


def log_mlflow_data(accuracy, n_neighbors, X_train_shape):
    """
    Logs machine learning experiment data to MLflow.

    Args:
        accuracy (float): The accuracy score of the model.
        n_neighbors (int): The number of neighbors used in KNeighborsClassifier.
        X_train_shape (tuple): The shape of the training data (for feature count).
    """
    # Ensure MLflow tracking URI is set (optional, can be configured via environment variable)
    mlflow.set_tracking_uri("http://127.0.0.1:5000/")

    with mlflow.start_run(run_name="KNN_MNIST_Experiment"):
        mlflow.log_param("K", n_neighbors)
        mlflow.log_metric("accuracy", accuracy)

        output_dir = "outputs"
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

        output_file_path = os.path.join(output_dir, "test.txt")
        with open(output_file_path, "w") as f:
            f.write("hello world! This is an artifact from the MLflow run.")

        # Log the entire 'outputs' directory as an artifact
        mlflow.log_artifacts(output_dir)

        # Log multiple parameters at once
        mlflow.log_params(
            {
                "model_type": "KNN",
                "dataset": "MNIST",
                "feature_count": X_train_shape[1],  # Log number of features
            }
        )

        print(f"MLflow Run ID: {mlflow.active_run().info.run_id}")
        print(f"MLflow Tracking URI: {mlflow.get_tracking_uri()}")


def main():
    """
    Train the neural network on MNIST data using SGD and monitor evaluation accuracy.
    """
    # Load MNIST data in sklearn-style format
    X_train, y_train, X_val, y_val, X_test, y_test = (
        mnist_loader.load_data_sklearn_style()
    )

    n_neighbors = 3  # Define K here for clarity and to pass it to MLflow
    knn = KNeighborsClassifier(n_neighbors=n_neighbors)
    knn.fit(X_train, y_train)
    y_pred = knn.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print("Accuracy:", accuracy)

    # Call the separate function to log data to MLflow
    log_mlflow_data(accuracy, n_neighbors, X_train.shape)


if __name__ == "__main__":
    main()
