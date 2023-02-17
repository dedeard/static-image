---
layout: docs
title: Placeholder
description: Easily generate powerful and fast Image Placeholders effortlessly.
image: https://cdn.dedeard.my.id/og/Easily generate powerful and fast Image Placeholders effortlessly.jpg?sign=https://static.dedeard.my.id/placeholder
---

### URL format:

- `https://cdn.dedeard.my.id/placeholder.:format?:options`

> Note: _all requests must use_ `GET` _or_ `HEAD` _method, otherwise it will be rejected._

For examples:
`/placeholder.webp?width=640&height=320`

![Placeholder Example](https://cdn.dedeard.my.id/placeholder.webp?width=720&height=320)

### Options:

**format=:string**

Set image format.

Value: `webp - jpeg - jpg - png`

Default: `webp`

For example: `/placeholder.jpg`

<br>

**width=:pixel**

Set new image width in pixel.

Value: `val > 0`

Default: `640`

For example: `/placeholder?width=600`

<br />

**height=:pixel**

Set new image height in pixel.

Value: `val > 0`

Default: `480`

For example: `/placeholder?height=600`

<br />

**color=:hex**

Set image text color.

Default `#111827`

For example: `/placeholder?color=#000000`

<br />

**bgcolor=:hex**

Set image background color.

Default `#f3f4f6`

For example: `/placeholder?color=#ffffff`
