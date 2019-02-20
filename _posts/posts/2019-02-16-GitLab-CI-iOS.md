---
layout: post
title: A simple GitLab CI pipeline for iOS
categories: posts
---

I recently set up GitLab CI for an iOS project, as well as for shared Swift Libraries. First of all, a Mac is needed for this, but it should be possible to create a VM running macOS as a kind of build server. For the basic setup, I used my local machine.

## Step 1: Install and Configure GitLab CI Runner

The [GitLab runner](https://docs.gitlab.com/runner/]) is a single binary written in Go, which receives jobs and reports the results back to GitLab. AFAIK, there is currently no brew package avaiable, so installation has to be done manually as described in the offical docs. Here is the summary:

```bash
 # Download the latest runner binary
 sudo curl --output /usr/local/bin/gitlab-runner https://gitlab-runner-downloads.s3.amazonaws.com/latest/binaries/gitlab-runner-darwin-amd64

 # Execution permissions
 sudo chmod +x /usr/local/bin/gitlab-runner

 # Register your runner with GitLab (gitlab.com or on-premise)
 gitlab-runner register
```

For registration, use the token can be found in project settings under CI->Runners. When asked for the executor to be used by the runner, use `shell`.

When asked for tags for your runner, you should at least specify one such as `ios` or `swift`. The tag will be used in the CI file to make sure, we use this specific runner.

To install the runner as a service the following can be done additionally:

```bash
cd ~
gitlab-runner install
gitlab-runner stop
```

## Step 2: Xcode command line tools

I assume you have Xcode installed and with it the command line tools. If not or for setting up an environment wihtout a full Xcode installation (a build server maybe), the following should be sufficient to install the command line tools:

```bash
xcode-select --install
```

Now, the `xcodebuild` command can be used for building Xcode projects and running tests from the command line. For details, see this [technical note](https://developer.apple.com/library/archive/technotes/tn2339/_index.html).

## Step 3: Setting up the CI file

For the `.gitlab-ci.yml` file, here is a very simple example:

```yml
stages:
  - build
  - test

xcodeBuild:
  tags:
    - ios
  stage: build
  script: xcodebuild -scheme {schemaName}

xcodeTest:
  tags:
    - ios
  stage: test
  script: xcodebuild test -scheme {schemaName} -destination 'platform=iOS Simulator,name=iPhone 6s,OS=12.1'
```

This assumes that there is a .xcworkspace or .xcodeproj file in the repository at root level and a scheme has been setup (there should be one by default when creating a project), as well as signing. For the test job a destination has to be provided by passing a string as formatted in the example.

And that's it, a very simple CI pipeline for an iOS project, useful for running unit tests. Again, for details on how to run builds and tests via `xcodebuild` check the [technical note](https://developer.apple.com/library/archive/technotes/tn2339/_index.html), it contains the information necessary for building for multiple targets and more.