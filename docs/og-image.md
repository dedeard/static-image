---
layout: docs
title: OG Image
description: Easily generate powerful and fast Open Graph images effortlessly.
---

### URL format:

- `https://cdn.dedeard.my.id/og/:text.:format?:options`

> Note: _all requests must use_ `GET` _or_ `HEAD` _method, otherwise it will be rejected._

For example:
`https://cdn.dedeard.my.id/og/Hello World.jpg?sign=static.dedeard.my.id/og-image`

![OG Image Example](https://cdn.dedeard.my.id/og/Hello World.jpg?sign=static.dedeard.my.id/og-image)

### Options:

**format=:string** OR **f=:string**

Set image format.

Value: `webp - jpeg - jpg - png - svg`

Default: `webp`

For example: `/og/Hello World.jpg`

<br>

**sign=:string** OR **s=:string**

Set image sign.

For example: `/og/Hello World?sign=example.com/path`

<br />

**color=:hex** OR **c=:hex**

Set image text color.

Default `111827`

For example: `/og/Hello World?color=000000`

<br />

**bgcolor=:hex** OR **b=:hex**

Set image background color.

Default `f3f4f6`

For example: `/og/Hello World?color=ffffff`
