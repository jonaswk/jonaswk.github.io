---
layout: post
title: OpenCV from source on macOS
categories: posts
---

I use a Mac, I wanted to use OpenCV. As I decided to install from source, here is what I did.

The basic steps are:

## 1. Checkout OpenCV 3.4.x from GitHub.

## 2. Configure the project using CMake

```shell
cd [path you ran clone in]/opencv
mkdir build
cd build
cmake -D CMAKE_BUILD_TYPE=Release ..
```
CMake is available from homebrew.

## 3. Build using make

Run `make -j`. If want to specify the number of of job slots append an integer behind the `-j` flag.

## 4. Install libs

Run `sudo make install`

This should do the trick, note that this is the simplest configuration (no python bindings, no java or android, etc.).