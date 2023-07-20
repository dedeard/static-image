---
layout: docs
title: Placeholder
description: Easily generate powerful and fast Image Placeholders effortlessly.
image: https://cdn.dedeard.my.id/og/Easily generate powerful and fast Image Placeholders effortlessly.jpg?sign=https://static.dedeard.my.id/placeholder
---

### URL format:

- `https://cdn.dedeard.my.id/placeholder/:options`

> Note: _all requests must use_ `GET` _or_ `HEAD` _method, otherwise it will be rejected._

For example:
`https://cdn.dedeard.my.id/placeholder/w=720,h=320.webp`

![Placeholder Example](https://cdn.dedeard.my.id/placeholder/w=720,h=320.webp)

### Options:

**format=:string** OR **f=:string**

Set image format.

Value: `webp - jpeg - jpg - png - svg`

Default: `svg`

For example: `/placeholder/_.jpg`

<br>

**width=:pixel** OR **w=:pixel**

Set new image width in pixel.

Value: `val > 0`

Default: `640`

For example: `/placeholder/width=600`

<br />

**height=:pixel** OR **h=:pixel**

Set new image height in pixel.

Value: `val > 0`

Default: `480`

For example: `/placeholder/height=600`

<br />

**color=:hex** OR **c=:hex**

Set image text color.

Default `111827`

For example: `/placeholder/color=000000`

<br />

**bgcolor=:hex** OR **b=:hex**

Set image background color.

Default `f3f4f6`

For example: `/placeholder/bgcolor=ffffff`
