---
layout: docs
title: Avatar
description: Generate powerful and fast Avatar Images easily with no effort.
image: https://cdn.dedeard.my.id/og/Generate powerful and fast Avatar Images easily with no effort.jpg?sign=https://static.dedeard.my.id/avatar
---

### URL format:

- `https://cdn.dedeard.my.id/avatar/:nickname.:format?:options`

> Note: _all requests must use_ `GET` _or_ `HEAD` _method, otherwise it will be rejected._

For example:
`https://cdn.dedeard.my.id/avatar/dede ard.jpg?size=600`

![Avatar Example](https://cdn.dedeard.my.id/avatar/dede ard.jpg?size=600)

### Options:

**format=:string** OR **f=:string**

Set avatar format.

Value: `webp - jpeg - jpg - png - svg`

Default: `webp`

For example: `/avatar/dede ard.png`

<br>

**size=:pixel** OR **s=:pixel**

Set avatar size in pixel.

Value: `val > 0`

Default: `60`

For example: `/avatar/dede ard?size=120`

<br />

**maxlength=:pixel** OR **m=:pixel**

Set avatar maximum character length.

Value: `1 - 3`

Default: `2`

For example: `/avatar/dede ard?maxlength=3`

<br />

**color=:hex** OR **c=:hex**

Set avatar text color.

Default: `111827`

For example: `/avatar/dede ard?color=000000`

<br />

**bgcolor=:hex** OR **b=:hex**

Set avatar background color.

Default: `f3f4f6`

For example: `/avatar/dede ard?color=ffffff`
