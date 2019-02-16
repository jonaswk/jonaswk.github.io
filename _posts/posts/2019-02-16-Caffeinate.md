---
layout: post
title: Caffeinate - Keep your mac from sleeping
categories: posts
---
PSA: If you have long running shell scripts, your Mac going to sleep can stop them from finishing. Fortunately, their is a command that can prevent exactly that: `caffeinate`. For example, when backing up with `rsync`, it can be used like this:

```bash
caffeinate rsync --progress -az ./LightroomMasters/ /Volumes/LRBackup/LightroomMasters
```

Now even large backups will not be interrupted! After the script is finished running, your Mac will sleep as usual. Way better than changing it in the system preferences and forgetting to turn sleep back on.