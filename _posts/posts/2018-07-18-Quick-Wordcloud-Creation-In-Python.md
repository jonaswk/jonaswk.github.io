---
layout: post
title: Quick Wordclouds in Python
categories: posts
---

I decided to create a wordcloud, just for fun, from my summary for a financing lecture I attended.

This is easily achieved!

## 1. Export the word document as a plain txt file.

## 2. Read the file

```python
with open('Summary.txt','r', encoding='utf-16') as f:
    read_data = f.read()
```

## 3. Clean up and prepare the data for plotting

```python
import string
read_data = read_data.lower()
words = read_data.split()

validChars = set(string.ascii_lowercase)
validChars.add('-')
words = [w for w in words if all(c in validChars for c in w)]
```

First, using `read_data = read_data.lower()` everything is converted to lowercase. Then, the string is split. For this we use python's string splitting methods without the use of a separator, this will use runs of whitespace as separators and also remove trailing or leading whitespace.

Next, we remove all words with invalid characters from our word list by using list comprehension.

## 4. Creating the wordcloud

Using this [wordcloud generator](https://github.com/amueller/word_cloud) we will generate the plot.

```python
from wordcloud import WordCloud, STOPWORDS

wordcloud = WordCloud(width=800,height=400,background_color='white',stopwords=STOPWORDS).generate(','.join(words))
figure = plt.figure(figsize=(7,7))
plt.imshow(wordcloud, interpolation='bicubic')
plt.axis('off')
plt.show()
figure.savefig('cloud.png', dpi=900)
```

We ignore the provided "stopwords", words like prepositions for example. This is what the result looks like:

![Wordcloud](https://i.imgur.com/21T6tEo.png)

If we limit the maximum font size by using `max_font_size=40`, we can get something like this:

![Wordcloud limited](https://i.imgur.com/J085ubo.png)

That's it! How the actual wordcloud is constructed is very interesting and described nicely in Andreas Mueller's [blog](http://peekaboo-vision.blogspot.com/2012/11/a-wordcloud-in-python.html).