---
layout: post
title: Getting started with OpenCV
categories: posts
---

Note: If you have experience with C++ there will probably not be too much to see here for you, just some very basic OpenCV API usage.

To actually do something with our shiny new [OpenCV installation](/OpenCV-Mac/), let's run one of the offical examples: Create a new .cpp file and add the following code, which does simple edge detection.

```cpp
#include "opencv2/opencv.hpp"

using namespace cv;

int main(int, char**) {
    VideoCapture cap(0);
    if(!cap.isOpened())
        return -1;

    Mat edges;
    namedWindow("edges", 1);

    for(;;) {
        Mat frame;
        cap >> frame;
        cvtColor(frame, edges, COLOR_BGR2GRAY);
        GaussianBlur(edges, edges, Size(7,7), 1.5, 1.5);
        Canny(edges, edges, 0, 30, 3);
        imshow("edges", edges);
        if(waitKey(30) >= 0) break;
    }

    return 0;
}
```

Let us take a more detailed look.

```cpp
VideoCapture cap(0);
    if(!cap.isOpened())
        return -1;
```

We create a VideoCapture object with the index of the video capture device we want to open in the same step. Here we use "0", as this is the webcam I have attached, unless you have multiple video devices it should work for you as well. We check if opening the device worked, otherwise we abort the program.

```cpp
Mat edges;
namedWindow("edges", 1);
```

`Mat` is OpenCV's n-dimensional dense array class and is used for representing images, for example a video frame, as images are not much more than a number of matrices of color values to a computer (more on this maybe later). In this case here, we create `Mat`object for the edges we are going to detect. We also create a window with a title and a flag to set it to be resizable.

```
for(;;) {
        Mat frame;
        cap >> frame;
        cvtColor(frame, edges, COLOR_BGR2GRAY);
        GaussianBlur(edges, edges, Size(7,7), 1.5, 1.5);
        Canny(edges, edges, 0, 30, 3);
        imshow("edges", edges);
        if(waitKey(30) >= 0) break;
    }
```

We loop as long as no key is pressed. For holding our frames from the camera we create a `Mat` variable in which we shift the frames. Using `cvtColor` we convert the color space of our captured frame from BGR to gray scale (Note: BGR is RGB just in reversed order, which is the default format in OpenCV).

We apply Gaussian blur with kernel size 7 and standard deviation of 1.5 in both X and Y direction to our frame. We then apply the Canny algorithm [[1]](#ref1) to it to find the edges. Then we just display out result to our window.

To build the example, you can use the following:
```shell
g++ $(pkg-config --cflags --libs opencv) capture.cpp -o Capture
```

Then execute it: `./Capture`

![Resulting Image](https://i.imgur.com/GHxPFT3.png)

[1] <span id="ref1"/> John Canny. A computational approach to edge detection. Pattern Analysis and Machine Intelligence, IEEE Transactions on, (6):679–698, 1986. [Link](https://ieeexplore.ieee.org/abstract/document/4767851/). A pdf can be found [here](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.420.3300&rep=rep1&type=pdf).