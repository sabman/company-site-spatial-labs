---
publishDate: 2023-01-12T00:00:00Z
title: Getting started with MBSystem
description: Learning how to use MBSystem
excerpt: Learning how to map the ocean floor with MBSystem
image: https://www.mdsg.umd.edu/sites/default/files/images/blog/Husted_Blog2_Img1_1.jpg
category: Tutorials
tags:
  - oceanmapping
  - MBSystem
  - opensource
canonical: https://astrowind.vercel.app/get-started-website-with-astro-tailwind-css
---

MBSystem is an open-source software package for the processing and visualization of bathymetric and oceanographic data. It was originally developed for the purpose of processing multibeam sonar data, but it has since evolved to support a wide range of data formats and processing techniques, including sidescan sonar, sub-bottom profiling, and oceanographic data.

MBSystem provides a suite of tools for cleaning, editing, and processing large datasets of bathymetric and oceanographic data. These tools include algorithms for removing noise and artifacts, interpolating missing data, and generating 3D models of seafloor topography. MBSystem also includes tools for creating visualizations of the processed data, such as contour plots, perspective views, and 3D fly-throughs.

MBSystem is widely used in the oceanographic research community, as well as by government agencies and private companies involved in marine surveying, mapping, and exploration. It is a powerful tool for generating high-quality and accurate maps of the seafloor and for studying the geology, biology, and ecology of the ocean.

MBSystem is available for free and is supported on multiple operating systems, including Linux, macOS, and Windows. It is maintained by a community of developers and is continually being updated and improved with new features and capabilities.

Sure, here's a step-by-step guide to installing MBSystem and creating your first map using sample data:

```bash
# Installing MBSystem using Homebrew
brew install mbsystem

# Downloading sample data
curl -L -O "http://www.ldeo.columbia.edu/res/pi/MB-System/sample_data.tar.gz"

# Extracting sample data
tar -zxvf sample_data.tar.gz

# Creating a map
mbsystem grdcut -R-71.1/-70.4/41.4/41.9 -Gtopo.grd $MB_SYSTEM_DATA/etopo2/etopo2.grd

mbsystem grdimage -R -JM6i -B2 -Cetopo1 -Itopo.grd -P > map.ps

# Converting the PostScript file to PNG
convert -density 300 map.ps map.png
```

Also see: https://www.mbari.org/technology/mb-system/installation/