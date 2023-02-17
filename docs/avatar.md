---
layout: docs
title: Avatar
description: Generate powerful and fast Avatar Images easily with no effort.
---

### URL format:

- `https://cdn.dedeard.my.id/avatar/:nickname.:format?:options`

> Note: _all requests must use_ `GET` _or_ `HEAD` _method, otherwise it will be rejected._

For examples:
`/avatar/dede ard.jpg?size=600`

![Avatar Example](https://cdn.dedeard.my.id/avatar/dede ard.jpg?size=600)

### Options:

**format=:string**

Set avatar format.

Value: `webp - jpeg - jpg - png`

Default: `webp`

For example: `/avatar/dede ard.png`

<br>

**size=:pixel**

Set avatar size in pixel.

Value: `val > 0`

Default: `60`

For example: `/avatar/dede ard?size=120`

<br />

**color=:hex**

Set avatar text color.

Default: `#111827`

For example: `/avatar/dede ard?color=#000000`

<br />

**bgcolor=:hex**

Set avatar background color.

Default: `#f3f4f6`

For example: `/avatar/dede ard?color=#ffffff`
