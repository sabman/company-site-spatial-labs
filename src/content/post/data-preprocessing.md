---
publishDate: 2023-04-15T00:00:00Z
title: Ship Detection Competition - Part 1 (Data Wrangling)
excerpt: Data wrangling for ship detection competition
image: ~/assets/images/data-wrangling-thumbnail.png
tags:
  - deep learning
  - yolo
  - object detection
# draft: true
canonical: https://spatial-labs.dev/ship-detection-competition-part-1
---

## What am I gonna learn?
By the end of this blog, you will know how to use PyTorch dataset iterator to efficiently convert DOTA format annotations to Darknet format.

You will have built the following api to do the darknet format conversion.

```py
train_dataset = ShipDetectionDataset(train_files)
val_dataset = ShipDetectionDataset(val_files)

for img, path, boxes in tqdm(train_dataset):
    convert2darknet(img, path, boxes)

for img, path, boxes in tqdm(val_dataset):
    convert2darknet(img, path, boxes, val=True)
```
---


## Introduction


Detection of ships is an important task when it comes to congestion control and tracking of ships that have turned off the **AIS** (Automatic Identification System). 

Efficient detection of ships can allow us to optimize the cargo transportation and track ships. Ship tracking using object detection models can be used in law enforcement by altering authorities of ships that are suspected of illegal trafficking of goods.

In this series, we will go over the [ship detection competition](https://huggingface.co/spaces/competitions/ship-detection) organized by [Data Driven Science](https://datadrivenscience.com/). This series is divided into three parts:

- Data wrangling
- Handling Outliers
- Model Training

The dataset for this competition can be downloaded from [HuggingFace](https://huggingface.co/datasets/datadrivenscience/ship-detection) which is a subset of [DOTA dataset](https://captain-whu.github.io/DOTA/dataset.html).

## Directory Structure

The structure of the dataset directory is given as follows:

    ship-detection
    ├── .extras
    │   ├── submission_sample.csv
    │   └── train.csv
    ├── test
    └── train

The `.extras` directory contains a sample of submissions and annotations of training data. 
The `train` directory contains training images and likewise, `test` directory contains testing images.

## Conversion to Darknet

Since we want to use yolov5, we need to convert the data annotations into darknet format. As mentioned in the documentations, each image width and height are between **_0_** and **_1_**. Thus, widths and heights of the objects are normalized in this range as well. 

Darknet format annotations consists of `*.txt` files, one for each image. These files can contain multiple rows, one for each object. These rows are in `class x_center y_center width height` format. Class labels start from **_0_** and since there's only one class in our case (ships), **_0_** will be the only label here.

> For more details, refere to [this](https://docs.ultralytics.com/yolov5/train_custom_data/#12-create-labels).

Now we dive into the coding part:

## Code
We begin by importing the libraries we are going to use:

```py
import os
import shutil

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split

import torch
from torch.utils.data import Dataset, DataLoader, random_split

import torchvision
from torchvision.utils import draw_bounding_boxes
from torchvision.io import read_image
```

Now we read the `train.csv` in the extras directory.

```py
df = pd.read_csv("ship-detection/.extras/train.csv")
df.head(5)
```

|    | id    |   xmin |   ymin |   xmax |   ymax |
|---:|:------|-------:|-------:|-------:|-------:|
|  0 | 0.png |   6690 |   3599 |   7164 |   3850 |
|  1 | 0.png |   6772 |   3386 |   7039 |   3546 |
|  2 | 0.png |   6705 |   3291 |   7060 |   3485 |
|  3 | 0.png |   6230 |   3442 |   6597 |   3647 |
|  4 | 0.png |   5501 |    790 |   5552 |    868 |

We can read annotations of any file as following:

```py
df[df['id'] == "0.png"]
```

|    | id    |   xmin |   ymin |   xmax |   ymax |
|---:|:------|-------:|-------:|-------:|-------:|
|  0 | 0.png |   6690 |   3599 |   7164 |   3850 |
|  1 | 0.png |   6772 |   3386 |   7039 |   3546 |
|  2 | 0.png |   6705 |   3291 |   7060 |   3485 |
|  3 | 0.png |   6230 |   3442 |   6597 |   3647 |
|  4 | 0.png |   5501 |    790 |   5552 |    868 |
|  5 | 0.png |   2076 |   3189 |   2634 |   3797 |
|  6 | 0.png |   6195 |   3530 |   6246 |   3565 |

Now we will split the training files into 80-20 ratio.

```py
files = df['id'].unique() # get distinct files

train_files, val_files = train_test_split(files, test_size=0.2, random_state=42) # for reproducablity
print(f"No. of training images: {len(train_files)}")
print(f"No. of validation images: {len(val_files)}")
```

Now we will create a torch dataset to iterate over training and validation splits. We will be using this just as an iterator for now to easily convert annotations to darknet format.

```py
class ShipDetectionDataset(Dataset): # this will help us perform data operations
    
    def __init__(self, files):
        self.dataset_loc = "ship-detection"
        self.files = files
        self.bbox_df = pd.read_csv(f"{self.dataset_loc}/.extras/train.csv")
        # bounding box columns ['xmin', 'ymin', 'xmax', 'ymax']
        self.boxes_cols = self.bbox_df.columns[1:]
        
    def __len__(self):
        return len(self.files)
    
    def __getitem__(self, idx):
        filename = self.files[idx]
        filepath = f"{self.dataset_loc}/train/{filename}"
        
        bboxes = self.bbox_df[self.bbox_df['id'] == filename][self.boxes_cols]
        targets = torch.tensor(bboxes.values)
        img = read_image(filepath)
        return img, filename, targets
```
Next, we define a functions to convert the annotations format.

```py

DATASET_LOC = "ship-detection"

def get_darknet_annots(img, boxes):
    _, height, width = img.shape
    annots = []
    for b in boxes:
        x1, y1, x2, y2 = b.tolist()
        w = x2 - x1
        h = y2 - y1
        x_center = (x1 + x2) / (2*width)
        y_center = (y1 + y2) / (2*height)
        w = w/width
        h = h/height
        annot = f"0 {x_center} {y_center} {w} {h}" # 0 => ship class
        annots.append(annot)
    return annots

def convert2darknet(img, path, boxes, val=False):
    annots = get_darknet_annots(img, boxes)
    
    filename = path.split(".")[0]
    annot_filepath = f"{DATASET_LOC}/{'val' if val else 'train'}/labels/{filename}.txt"
    with open(annot_filepath, "w") as f:
        for annot in annots:
            f.write(f"{annot}\n")
            
    src = f"{DATASET_LOC}/{path}"
    dest = f"{DATASET_LOC}/{'val' if val else 'train'}/images/{path}"
    shutil.move(src, dest)
```

Creating the needed directories:

```sh
!mkdir ship-detection/train/labels ship-detection/train/images

!mkdir ship-detection/val ship-detection/val/labels ship-detection/val/images
```

Now we will create dataset iterators for training and validation files and call `convert2darknet`.

```py
train_dataset = ShipDetectionDataset(train_files)
val_dataset = ShipDetectionDataset(val_files)

for img, path, boxes in tqdm(train_dataset):
    convert2darknet(img, path, boxes)

for img, path, boxes in tqdm(val_dataset):
    convert2darknet(img, path, boxes, val=True)
```

At this point, we are finally done wrangling the dataset.