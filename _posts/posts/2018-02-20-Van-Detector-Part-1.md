---
layout: post
title: Notifying the house about deliveries - Part 1
categories: posts
---

Living in a big apartment block with my window facing the street, I can see whenever the yellow DHL van parks in front of the house. As I had a Raspberry Pi lying around and my webcam is currently not in use most of the time I asked myself if I could use both to send notifications to my fellow block dwellers whenever the delivery van arrives. As I'm currently also taking a machine learning class, I tried to apply what I've learned to achieve this.

## First steps

So first thing was setting up the Raspberry Pi with the webcam to watch the street below my window. I'll skip the details on preparing the sd card for your pi and all that stuff. If you want to learn how this works visit [the offical setup guide](https://www.raspberrypi.org/documentation/setup/). For the webcam, I'll be using my Logitech C920, which I had lying around.

Using it with the Pi is rather easy. Use `sudo apt-get install fswebcam` to install the *fswebcam* package. You can take a look at its manpage [here](http://manpages.ubuntu.com/manpages/xenial/man1/fswebcam.1.html). Now everything you have to do to simply take a picture without any further configuration after you connected the webcam is:

```bash
fswebcam image.jpg
```

This will produce a 352 × 288 picture with an imprinted timestamp.

![Boring view of my room.](https://i.imgur.com/o6OEqzS.jpg){: .center-image }

We now basically have everything we need for taking pictures of the street. Quite easy!

## Collecting training samples

As we will be using supervised learning, we have to create a set of training data. In our case these are pictures of the street manually labelled *no DHL van* or *DHL van*. We have seen how to take one picture, in a next step the webcam was positioned in the window and prepared to consecutively take pictures. For this I prepared a network drive on my main machine for dropping of the pictures there. There is detailed information on the web on how to share a folder in Windows and how to mount it in Linux. I basically used the following to mount a smb share on my Windows 10 machine to a directory on the Pi:

```bash
sudo apt-get install cifs-utils
sudo mount -o vers=2.0,username=user //ip-address/transfer windowShare/
```

Next I created a bash script to be run as a cron job to periodically take pictures of the street below my window. I set the script to be run every 15 minutes, which I estimated to be an interval with good chances of catching the delivery van. The script itself is very simple.

```bash
#!/bin/bash
d=$(date +%Y-%m-%d-%H-%M)
fswebcam windowShare/image$d.jpg
```

In the next part I will take a look at what was produced while I was on vacation. Then, the captured images will have to be pre-processed and tagged manually to create our training set.