Project Title: DigitWhiz
📄 Description:
DigitWhiz is a lightweight web API for handwritten digit recognition using the MNIST dataset. It features a trained neural network served via FastAPI, allowing users to send digit images and receive real-time predictions. This project is perfect for demonstrating how deep learning models can be deployed as production-ready services. It also introduces best practices in API design, model packaging, and prediction handling.

🧠 Neural Network Architecture (Mermaid)
Here's a basic feedforward neural network for MNIST (e.g., input → hidden layers → output):



```mermaid

graph LR
  %% Input Layer
  subgraph Input Layer
    I1((I1))
    I2((I2))
  end

  %% Hidden Layer
  subgraph Hidden Layer
    H1((H1))
    H2((H2))
    H3((H3))
  end
  %% Output Layer
  subgraph Output Layer
    O1((O1))
  end

  %% Connections from Input to Hidden
  I1 --> H1
  I1 --> H2
  I1 --> H3
  I2 --> H1
  I2 --> H2
  I2 --> H3

  %% Connections from Hidden to Output
  H1 --> O1
  H2 --> O1
  H3 --> O1


```

## code Credit:
This code is adepted from [neural-networks-and-deep-learning](https://github.com/unexploredtest/neural-networks-and-deep-learning/)