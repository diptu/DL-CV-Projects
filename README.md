# DL-CV-Projects
A full-stack deep learning playground for computer vision built with FastAPI, React, and PyTorch. Practice-ready projects running on Google Colab, deployable as real-world web apps.

DL-CV-Projects is a curated collection of hands-on computer vision projects, blending deep learning models (PyTorch), API services (FastAPI), and interactive UIs (React). It is designed to help learners without access to personal GPUs build, test, and deploy real-world CV applications — all free using Google Colab.

Each project follows an end-to-end pipeline:

Model training (Google Colab + PyTorch)

Backend API (FastAPI serving inference)

Frontend (React for image upload, visualization, etc.)

Lightweight deployment configs for Heroku/Fly.io/Render

🧠 Projects Included
(Can be separate folders inside the monorepo)

Folder	Project Title	Description
01-mnist-api	Hello Digits CV	Train and serve a digit recognizer as a web API
02-fashion-classifier	ThreadAI	Classify clothing types with visual feedback
03-catdog-detector	PetSort	Fine-tuned ResNet for Cats vs Dogs, React image drop UI
04-mask-detector	MaskRadar	Real-time face mask detection using YOLO + webcam
05-xray-analyzer	MediScan	Chest X-ray pneumonia classifier with heatmap visualization
06-unet-segmentation	SegMint	Semantic segmentation demo for medical/carvana datasets
07-stylegan-ui	FaceCrafter	GAN-based face generator with latent vector sliders

🧪 Tech Stack
Backend: FastAPI + PyTorch (serving models as APIs)

Frontend: React + TailwindCSS (upload images, see results)

Training: Google Colab Notebooks

Deployment: Docker + Render/Fly.io + GitHub Actions (optional)

