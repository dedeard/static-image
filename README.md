<p align="center">
  <a href="https://static.dedeard.my.id">
    <img src="https://cdn.dedeard.my.id/Logo.svg" alt="Logo Static" width="80" height="80" />
  </a>
</p>

<h1 align="center">S T A T I C</h1>

<p align="center">
  Easy and powerful way to speed up loading of images on your website.
  <br />
  Developed using node with typescript.
</p>

<p align="center">
  <a href="https://www.instagram.com/dedeard.js">Instagram</a> -
  <a href="https://static.dedeard.my.id">static.dedeard.my.id</a> -
  <a href="https://dedeard.my.id">dedeard.my.id</a> -
  <a href="https://www.linkedin.com/in/dedeard">Linkedin</a>
</p>

<br><br>

<p align="center">
  <a href="https://www.buymeacoffee.com/dedeard">
    <img src="https://cdn.dedeard.my.id/bmc-button.svg" alt="buymeacoffee" height="50" />
  </a>
</p>

<hr />

# Getting Started

## Using Node.js

### Requirements

- [Node.js](https://nodejs.org)
- [Yarn](https://yarnpkg.com)

### Run the app

1. Clone this repo
1. `yarn install` to install all required dependencies
1. `yarn dev` to run development server and vscode debugging
1. `yarn test` to run unit testing
1. `yarn build` to compile the typescript code
1. `yarn start` to run production server

## Using Docker

### Requirements

- [Node.js](https://nodejs.org)
- [Docker](https://docs.docker.com/desktop/)

### Run the app

1. Clone this repo
2. `npm run docker:dev up` to run development server and vscode debugging
3. `npm run docker:test up` to run unit testing
4. `npm run docker up` to run production server

<br><br>

# Api

## Image Service

### URL format:

- `https://cdn.dedeard.my.id/image/:image-url`
- `https://cdn.dedeard.my.id/image/:options/:image-url`

> Note: _all requests must use_ `GET` _or_ `HEAD` _method, otherwise it will be rejected._

For examples:
`/image/width=640,height=480/static.dedeard.my.id/kai.jpg`

![Martial Peak - Yang kai](https://cdn.dedeard.my.id/image/width=640,height=480/static.dedeard.my.id/kai.jpg)

### Supported Image Types:

- GIF
- JPEG
- PNG
- WebP

### Options:

**format=:string**

Convert image format.

Value: `webp - jpeg - jpg - png`

For example: `/image/format=webp/static.dedeard.my.id/kai.jpg`

<br />

**quality=:percentage**

Set new image quality in percentage.

Value: `10 - 100`

Default: `80`

For example: `/image/quality=80/static.dedeard.my.id/kai.jpg`

<br />

**width=:pixel**

Set new image width in pixel.

Value: `val > 0`

For example: `/image/width=600/static.dedeard.my.id/kai.jpg`

<br />

**height=:pixel**

Set new image height in pixel.

Value: `val > 0`

For example: `/image/height=600/static.dedeard.my.id/kai.jpg`

<br />

## Avatar Service

### URL format:

- `https://cdn.dedeard.my.id/avatar/:nickname.:format?:options`

> Note: _all requests must use_ `GET` _or_ `HEAD` _method, otherwise it will be rejected._

For examples:
`/avatar/dede ard.jpg?size=320`

![Avatar Example](https://cdn.dedeard.my.id/avatar/dede ard.jpg?size=320)

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

<br />

## OG Image Service

### URL format:

- `https://cdn.dedeard.my.id/og/:text.:format?:options`

> Note: _all requests must use_ `GET` _or_ `HEAD` _method, otherwise it will be rejected._

For examples:
`/og/Hello World.jpg?sign=static.dedeard.my.id/og-image`

![OG Image Example](https://cdn.dedeard.my.id/og/Hello World.jpg?sign=static.dedeard.my.id/og-image)

### Options:

**format=:string**

Set image format.

Value: `webp - jpeg - jpg - png`

Default: `webp`

For example: `/og/Hello World.jpg`

<br>

**sign=:string**

Set image sign.

For example: `/og/Hello World?sign=example.com/path`

<br />

**color=:hex**

Set image text color.

Default `#111827`

For example: `/og/Hello World?color=#000000`

<br />

**bgcolor=:hex**

Set image background color.

Default `#f3f4f6`

For example: `/og/Hello World?color=#ffffff`

<br />

## Placeholder Service

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

<br />
