---
layout: docs
title: Image
description: Optimize and resize image to speed it up.
image: https://cdn.dedeard.my.id/og/Optimize and resize image to speed it up.jpg?sign=https://static.dedeard.my.id/image
---

### URL format:

- `https://cdn.dedeard.my.id/image/:image-url`
- `https://cdn.dedeard.my.id/image/:options/:image-url`

> Note: _all requests must use_ `GET` _or_ `HEAD` _method, otherwise it will be rejected._

For example:
`https://cdn.dedeard.my.id/image/w=640,h=480/static.dedeard.my.id/kai.jpg`

![Martial Peak - Yang kai](https://cdn.dedeard.my.id/image/w=640,h=480/static.dedeard.my.id/kai.jpg)

### Supported Input Image Types:

- JPEG
- PNG
- WebP
- AVIF
- GIF
- SVG
- TIFF

### Options:

**format=:string** OR **f=:string**

Convert image format.

Value: `webp - jpeg - jpg - png`

For example: `/image/format=webp/static.dedeard.my.id/kai.jpg`

<br />

**quality=:percentage** OR **q=:percentage**

Set new image quality in percentage.

Value: `10 - 100`

Default: `80`

For example: `/image/quality=80/static.dedeard.my.id/kai.jpg`

<br />

**width=:pixel** OR **w=:pixel**

Set new image width in pixel.

Value: `val > 0`

For example: `/image/width=600/static.dedeard.my.id/kai.jpg`

<br />

**height=:pixel** OR **h=:pixel**

Set new image height in pixel.

Value: `val > 0`

For example: `/image/height=600/static.dedeard.my.id/kai.jpg`