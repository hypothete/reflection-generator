# Reflection Generator

## [Click here to try it out on github.io!](https://hypothete.github.io/reflection-generator/)

![An example still image with an added reflection](screenshot.png)

Remember back in the 90s and early 2000s when people used Java applets to generate cool looking reflections under images on their websites? You don't? Well, take it from me, it was really cool. I wanted a way to generate looping videos like the applets I remembered, and came up with a [Canvas](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/captureStream) and [MediaStream](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API) based solution.

## How to use

Just drag an image onto the current reflective image, fiddle with the ripple settings for the reflection, then click the "Get WebM Download Link" button. After a few seconds a link will appear to a looping video that you can download!

## If you need an MP4

Face it, you need an MP4, but Chromium's MediaStream recording doesn't output MP4. If you have `ffmpeg` installed, you can run this in a terminal to do the conversion (where "video" is the filename):

```
ffmpeg -i video.webm -crf 0 video.mp4
```

### Miscellanea

Demo image is part of the level background for [Palmtree Panic Zone](https://info.sonicretro.org/Palmtree_Panic) in Sonic CD (1993).
