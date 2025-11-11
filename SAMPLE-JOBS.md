# 📝 Sample Job Configurations

Copy and paste these examples into the job submission form at http://localhost:3000/submit-job

---

## Example 1: Simple Neural Network (Recommended for Testing)

**Title:**
```
Simple Neural Network Training
```

**Description:**
```
Training a basic neural network for image classification
```

**Config JSON:**
```json
{
  "epochs": 10,
  "batchSize": 32,
  "learningRate": 0.001,
  "optimizer": "adam"
}
```

---

## Example 2: Image Classification (CNN)

**Title:**
```
CNN Image Classification Model
```

**Description:**
```
Training a Convolutional Neural Network for CIFAR-10 dataset
```

**Config JSON:**
```json
{
  "epochs": 20,
  "batchSize": 64,
  "learningRate": 0.0001,
  "modelType": "CNN",
  "dataset": "CIFAR-10",
  "optimizer": "adam",
  "lossFunction": "categorical_crossentropy"
}
```

---

## Example 3: Language Model (Transformer)

**Title:**
```
Transformer Language Model
```

**Description:**
```
Training a transformer-based model for text generation
```

**Config JSON:**
```json
{
  "epochs": 10,
  "batchSize": 32,
  "learningRate": 0.001,
  "modelType": "transformer",
  "vocabSize": 50000,
  "hiddenSize": 768,
  "numLayers": 12,
  "optimizer": "adamw"
}
```

---

## Example 4: Reinforcement Learning

**Title:**
```
DQN Reinforcement Learning Agent
```

**Description:**
```
Training a Deep Q-Network agent for game playing
```

**Config JSON:**
```json
{
  "epochs": 100,
  "batchSize": 128,
  "learningRate": 0.0003,
  "modelType": "DQN",
  "environment": "CartPole",
  "gamma": 0.99,
  "epsilon": 0.1
}
```

---

## Example 5: Computer Vision (ResNet)

**Title:**
```
ResNet Image Recognition Model
```

**Description:**
```
Training a ResNet model for image recognition tasks
```

**Config JSON:**
```json
{
  "epochs": 15,
  "batchSize": 32,
  "learningRate": 0.0001,
  "modelType": "ResNet",
  "depth": 50,
  "dataset": "ImageNet",
  "optimizer": "sgd",
  "momentum": 0.9
}
```

---

## Example 6: Natural Language Processing (BERT)

**Title:**
```
BERT Text Classification Model
```

**Description:**
```
Fine-tuning BERT for text classification on custom dataset
```

**Config JSON:**
```json
{
  "epochs": 5,
  "batchSize": 16,
  "learningRate": 2e-5,
  "modelType": "BERT",
  "maxLength": 512,
  "numLabels": 3,
  "optimizer": "adamw"
}
```

---

## Example 7: Quick Test (Minimal)

**Title:**
```
Quick Test Job
```

**Description:**
```
Quick test to verify job processing works
```

**Config JSON:**
```json
{
  "epochs": 10,
  "batchSize": 32
}
```

---

## Example 8: Advanced Configuration

**Title:**
```
Advanced ML Training Pipeline
```

**Description:**
```
Complete training pipeline with data augmentation and validation
```

**Config JSON:**
```json
{
  "epochs": 25,
  "batchSize": 64,
  "learningRate": 0.001,
  "optimizer": "adam",
  "lossFunction": "categorical_crossentropy",
  "metrics": ["accuracy", "f1_score"],
  "validationSplit": 0.2,
  "dataAugmentation": true,
  "earlyStopping": true,
  "patience": 5,
  "modelType": "CNN",
  "layers": [
    {"type": "Conv2D", "filters": 32, "kernelSize": 3},
    {"type": "MaxPooling2D", "poolSize": 2},
    {"type": "Dense", "units": 128, "activation": "relu"},
    {"type": "Dense", "units": 10, "activation": "softmax"}
  ]
}
```

---

## How to Use

1. Go to: http://localhost:3000/submit-job
2. Copy the **Title** and paste it in the Title field
3. Copy the **Description** and paste it in the Description field
4. Copy the entire **Config JSON** block and paste it in the Config JSON field
5. Click "Submit Job"
6. Watch it process on the Dashboard!

---

## Tips

- Start with **Example 1** or **Example 7** for quick testing
- All jobs take ~10 seconds to process
- You can submit multiple jobs at once
- Jobs are processed in the order they're submitted
- Check the Dashboard to see real-time progress

