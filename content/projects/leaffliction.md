---
title: "Leaffliction — Plant Disease Classification"
summary: "A computer vision pipeline combining dataset analysis, augmentation, classical image processing, and deep learning to classify plant disease from leaf images."
date: "2026-10-22"
year: 2026
timeframe: "Jul 2026 - Oct 2026"
featured: true
image: "/projects/leaffliction/prediction_comparison_light.png"
imageDark: "/projects/leaffliction/prediction_comparison_dark.png"
imagePosition: "object-contain"
tech:
  - Python
  - PyTorch
  - OpenCV
  - NumPy
links:
  - label: GitHub
    url: https://github.com/marsha-t/leaffliction
team: 2
---

# Leaffliction — Plant Disease Classification

*From classical image processing to deep learning for plant disease classification*

<figure id="hero-image">
  <div className="bg-[var(--bg-secondary)] p-4 rounded-xl block dark:hidden">
    <img 
      src="/projects/leaffliction/dataset_examples_light.png"
      alt="Leaffliction dataset examples"
      class="rounded-lg mx-auto "
    />
  </div>
  <div className="bg-[var(--bg-secondary)] p-4 rounded-xl hidden dark:block">
    <img 
      src="/projects/leaffliction/dataset_examples_dark.png"
      alt="Leaffliction dataset examples"
      class="rounded-lg mx-auto "
    />
  </div>
</figure>

## Overview

Leaffliction explores classical computer vision and deep learning through plant disease classification. Developed as part of the 42 curriculum, the project covers dataset analysis, augmentation, leaf segmentation, and image classification.

We extended the classification requirements by implementing four models across two architectural families: convolutional neural networks (CNNs) and Vision Transformers (ViTs). For each, we compared a custom architecture trained from scratch with a pretrained model using transfer learning.

## Architecture

<figure>
  <div className="bg-[var(--bg-secondary)] p-4 rounded-xl block dark:hidden">
    <img 
      src="/projects/leaffliction/leaffliction-architecture-light.svg"
    />
  </div>
  <div className="bg-[var(--bg-secondary)] p-4 rounded-xl hidden dark:block">
    <img 
      src="/projects/leaffliction/leaffliction-architecture-dark.svg"
    />
  </div>
  <figcaption>
  The project's four modular workflows: dataset analysis, augmentation, classical image processing, and deep learning classification.
  </figcaption>
</figure>

Leaffliction is organised into four modular packages:

- **Analysis** — validates the dataset and visualises class distributions.
- **Augmentation** — applies image transformations and generates additional samples to balance classes.
- **Transformation** — performs classical image processing, including leaf segmentation, contour extraction, shape measurements, and colour analysis.
- **Classification** — handles dataset preparation, model training, evaluation, and prediction.

Command-line scripts provide entry points to each workflow, while the underlying implementations remain in reusable modules.

## Dataset Preparation & Augmentation

<figure>
  <div className="bg-[var(--bg-secondary)] p-4 rounded-xl block dark:hidden">
    <img 
      src="/projects/leaffliction/augmentation_light.png"
    />
  </div>
  <div className="bg-[var(--bg-secondary)] p-4 rounded-xl hidden dark:block">
    <img 
      src="/projects/leaffliction/augmentation_dark.png"
    />
  </div>
  <figcaption>
  Image augmentation techniques applied to an original leaf image, including flipping, rotation, skewing, shearing, cropping, elastic distortion, and grid distortion.
  </figcaption>
</figure>


Before training, we analysed the distribution of images across disease classes. To address class imbalance, we implemented targeted augmentation, generating additional images for underrepresented classes until they matched the largest class.

The augmentation module supports flipping, rotation, skewing, shearing, cropping, and geometric distortions. Rather than applying every transformation to every image, I implemented an augmentation planner that distributes transformations across original images, avoids duplicate image–augmentation pairs, and supports rerunning interrupted operations without unnecessarily regenerating completed outputs.

The standalone augmentation workflow generates a balanced copy of the dataset to meet the project's evaluation requirements. Classification uses a separate preparation pipeline, where original images are split into training and validation sets before augmentation. This prevents augmented versions of training images from appearing in validation, which could otherwise inflate validation accuracy.

To ensure consistent comparisons across the four models, I implemented CSV manifests recording each image's split assignment and planned training augmentations. Reusing these manifests across training runs ensures that every model uses the same training and validation samples, rather than generating a new split each time. Validation contains only unaugmented original images.

## Classical Image Processing

<figure>
  <div className="bg-[var(--bg-secondary)] p-4 rounded-xl block dark:hidden">
    <img 
      src="/projects/leaffliction/transformation_light.png"
    />
  </div>
  <div className="bg-[var(--bg-secondary)] p-4 rounded-xl hidden dark:block">
    <img 
      src="/projects/leaffliction/transformation_dark.png"
    />
  </div>
  <figcaption>
  Classical image processing techniques applied to a leaf image, including Gaussian blurring, segmentation, region-of-interest extraction, contour and shape analysis, boundary landmarks, and colour distribution.
  </figcaption>
</figure>

The 42 project also required us to explore classical image processing, extracting leaf characteristics through a sequence of defined transformations.

The pipeline applies Gaussian blur to reduce noise, generates a binary mask to isolate the leaf, and extracts its contour. From the segmented leaf, it identifies a region of interest, calculates shape measurements, and samples landmarks along the boundary. A masked RGB histogram captures the colour distribution within the leaf.

We implemented this workflow using NumPy, OpenCV, and Pillow, allowing us to inspect and visualise intermediate results at each stage. Unlike our deep learning classifiers, which learn features from image data, these techniques explicitly define how visual characteristics are extracted.

## Classification & Model Evaluation

We implemented four classifiers across two architectural families: a custom CNN with four convolutional blocks and a custom Vision Transformer (ViT) with six transformer encoder blocks, both trained from scratch; and ImageNet-pretrained ResNet18 and ViT-B/16 models adapted through transfer learning. For the pretrained models, we froze the backbones and trained replacement classification heads.

All four models use a shared PyTorch training pipeline with cross-entropy loss, the AdamW optimiser, and a learning-rate scheduler that responds to validation loss. Preprocessing is model-specific: custom models use normalisation statistics calculated from training data, while pretrained models use the transforms associated with their ImageNet weights.

The pipeline records training and validation loss and accuracy after each epoch. It also saves model checkpoints and training histories, selecting the best checkpoint based on the lowest validation loss rather than the highest accuracy.

We trained separate classifiers for Apple and Grape leaves, each with four classes. The figure shows validation accuracy across 20 epochs, with markers indicating the selected checkpoints.

<figure>
  <div className="bg-[var(--bg-secondary)] p-4 rounded-xl block dark:hidden">
    <img 
      src="/projects/leaffliction/validation_accuracy_light.svg"
    />
  </div>
  <div className="bg-[var(--bg-secondary)] p-4 rounded-xl hidden dark:block">
    <img 
      src="/projects/leaffliction/validation_accuracy_dark.svg"
    />
  </div>
  <figcaption>
  Validation accuracy across training epochs for four classification models—Custom CNN, ResNet18, Custom ViT, and ViT-B/16—on the Apple and Grape datasets, with selected checkpoints highlighted.
  </figcaption>
</figure>

All four models achieved over 94% validation accuracy at their selected checkpoints. The pretrained models converged quickly, with ViT-B/16 achieving the highest accuracy on both datasets (99.84%). Among the models trained from scratch, the custom CNN also converged relatively quickly, while the custom ViT improved more gradually and exhibited greater fluctuations in validation accuracy.

These results are from individual training runs on the validation datasets, rather than an independent test set.

## Prediction & Explainability

We built a prediction pipeline that loads a trained model from its checkpoint, restoring its architecture, learned weights, class labels, and preprocessing configuration. This allows images to be classified without manually reconstructing the model or its training setup.

Beyond displaying the predicted disease class, we implemented visualisations to help interpret the models' decisions. Grad-CAM generates heatmaps highlighting regions associated with a prediction, supporting both CNNs and ViTs. For our custom ViT, we also implemented attention rollout, which combines attention across transformer layers to visualise how attention propagates from the classification token to image patches.

The prediction interface displays the original image, its preprocessed version, and the corresponding explanation heatmaps, allowing us to inspect the model's output alongside the visual evidence it uses.

<figure>
  <div className="bg-[var(--bg-secondary)] p-4 rounded-xl block dark:hidden">
    <img 
      src="/projects/leaffliction/prediction_comparison_light.png"
    />
  </div>
  <div className="bg-[var(--bg-secondary)] p-4 rounded-xl hidden dark:block">
    <img 
      src="/projects/leaffliction/prediction_comparison_dark.png"
    />
  </div>
  <figcaption>
  Comparison of model interpretability visualisations for an Apple rust prediction, showing Grad-CAM heatmaps from the Custom CNN and Custom ViT alongside the Vision Transformer's attention rollout.
  </figcaption>
</figure>

## My Contributions

My work focused primarily on dataset preparation, CNN-based classification, and the shared training and prediction infrastructure.

- **Dataset preparation and augmentation:** Implemented the augmentation planner, dataset splitting, and CSV manifests to support consistent training and validation samples across models.
- **CNN classification:** Developed the custom CNN and integrated pretrained ResNet18 using transfer learning.
- **Training and evaluation:** Built shared utilities for training, validation, checkpoint management, and recording model performance.
- **Prediction and explainability:** Implemented checkpoint-based inference and Grad-CAM visualisations for CNNs, contributing to the shared prediction workflow.
- **Classical image processing:** Worked on the initial implementation of leaf segmentation and image transformations, as well as integrating the processing workflow.

## Challenges & Reflections

One of the more challenging aspects of the project was keeping the data preparation and training workflows consistent across four models. Decisions such as when to split the dataset, how to apply augmentation, and what preprocessing to save with each checkpoint required more planning than I initially expected.

Working with both CNNs and ViTs also gave me a better understanding of their different approaches to image classification. Although all four models achieved high validation accuracy, their learning curves differed considerably, particularly between the custom and pretrained architectures.

The project made me more attentive to how experimental design affects the results of machine learning models. I learned to think about dataset preparation, model training, and evaluation as parts of the same process rather than separate implementation tasks.
