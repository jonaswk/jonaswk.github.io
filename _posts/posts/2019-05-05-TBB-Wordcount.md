---
layout: post
title: Intel Thread Building Blocks Example
categories: posts
---
Intel's Thread Building Blocks (TBB) is a widely used C++ template library for task parallelism. I like the approach the library takes and want to demonstrate how to write a little parallel word count program using it.

TBB can be downloaded [here](https://www.threadingbuildingblocks.org/download). If you are on Mac, you can also use homebrew to install the library:

```bash
brew install tbb
```

In the case someone does not know what the word count command (wc) on unix(-lilke) systems does, here is an example of running `wc` on Homer's Iliad:

```bash
$ wc homer.txt
    13443  152621  808297 homer.txt
```

The first column gives the number of lines in the file, the second column the number of words and the third column finally gives the number of characters.

How would you implement this in C++? Here is an example, for the sake of simplicity, let's focus on counting words only for now:

```c++
#include <iostream>
#include <fstream>

int main(int argc, char *argv[]) {
    // We take exactly one argument (additional to the name of the program)
    if (argc != 2) {
        std::cerr << "Wrong number of arguments, expecting a filename" << std::endl;
        EXIT_FAILURE;
    }

    // We declare and open an input file stream
    std::ifstream fileStream;
    fileStream.open(argv[1]);

    // If opening the file was not successful, abort
    if (!fileStream) {
        std::cerr << "Could not open file: " << argv[1] << std::endl;
        EXIT_FAILURE;
    }

    // We can get each word by looping over the stream
    std::string str;
    size_t i = 0;
    while (fileStream >> str) {
        ++i;
    }

    std::cout << i << " words in " << argv[1] << std::endl;

    // When done, close the stream
    fileStream.close();
}
```

This results in:

```
152621 words in homer.txt
```

Nice, simple enough!

Now, let's parallelize this to try to make it faster. We can independently count parts of the word in the file and then just compute the sum of the partial results. Some changes are required:

First, we read the entire file into a buffer (an disadvantage of the approach, but keep in mind that it is a toy example for the use of tbb):

```c++
// Include vector and TBB
#include <vector>
#include "tbb/tbb.h"
...

// We declare and open an input file stream
std::ifstream fileStream;
fileStream.open(argv[1]);
...

// Move cursor to end
fileStream.seekg(0, std::ios_base::end);
// Get the file size
std::streamsize size = fileStream.tellg();
// Set position of next character to be read to the very beginning
fileStream.seekg(0, std::ios::beg);

// The buffer for storing the file, reserve size needed for that
std::vector<char> fileBuffer(size);

// Now read the file, if successful, the if condition is not fulfilled
// This works because it implicitly calls bool() which return the same
// as !fail() on the ifstream
if (!fileStream.read(fileBuffer.data(), size)){
    std::cerr << "Could not read file: " << argv[1] << std::endl;
    EXIT_FAILURE;
}

// When done, close the stream
fileStream.close();
```

As a very simple example, we now want to parallelize a loop, which counts words in the buffer. TBB makes it very easy to do so. If you are sure that it is safe to process elements in an array concurrently, you can use `parallel_for`. This template function breaks the iteration into chunks and runs each one on its own thread.

Using C++11 lambdas makes using `parallel_for` even more elegant for simple loops. Here is the generic example as it can be found in the TBB docs:

```c++
parallel_for( blocked_range<size_t>(0, fileBuffer.size()),
        [=](const blocked_range<size_t>& r) {
            for(size_t i=r.begin(); i!=r.end(); ++i)
                Foo(a[i]);
        }
);
```

This creates a `blocked_range` from 0 to our buffer size (non inclusive). This range is recursively split for being distributed to the threads. We then loop over the chunks and do our thing.

To keep track of the words we see, we make use of `enumerable_thread specific`. This, in very simple terms, gives a thread a local copy of elements of a given type. In our case just an integer. Combining both leads to the following code:

```c++
...
typedef tbb::enumerable_thread_specific<int> CounterType;
// Init before the parallel for loop
CounterType Counter (0);

// Loop and count separators (spaces and \n)
parallel_for( blocked_range<size_t>(0, fileBuffer.size()), 
    [&](const blocked_range<size_t>& r) {
        int res = 0;
        CounterType::reference my_counter = Counter.local();
        for(size_t i=r.begin(); i!=r.end(); ++i) {
            if(isSeparator(fileBuffer[i])) {
                my_counter++;
            }
        }
        
    }
);
...
```

Now, we just need to combine the partial sums to the get the total.

```c++
int count = Counter.combine([](int x, int y) {
    return x+y;
});
```

That's it! When building, don't forget to link with TBB (`-ltbb`). I have not measured this in any way, it is probably slower than just using `wc` and the result depends on what you count as a word separator (to be honest, in my implementation I just counted spaces, which is not totally correct). I think it is a nice introduction to a simple use case of TBB, though.