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

## Image
### URL format: 
- `http://localhost:3000/image/:image-url`
- `http://localhost:3000/image/:options/:image-url`
  
Notes: *all requests must use* `GET` *method.*

Examples:
- Without options `http://localhost:3000/image/cdn.dedeard.my.id/cat.jpg`
- With options `http://localhost:3000/image/width=600,height=400/cdn.dedeard.my.id/cat.jpg`

### Supported Image Types:
- GIF
- JPEG
- PNG
- WebP

### Options:
**format=:string**

Convert image format.

Value: `webp - jpeg - jpg - png`

Example: `/image/format=webp/cdn.dedeard.my.id/cat.jpg`

<br />

**quality=:percentage**

Set new image quality in percentage.

Value: `10 - 100`

Example: `/image/quality=80/cdn.dedeard.my.id/cat.jpg`


<br />

**width=:pixel**

Set new image width in pixel.

Value: `> 0`

Example: `/image/width=600/cdn.dedeard.my.id/cat.jpg`


<br />

**height=:pixel**

Set new image height in pixel.

Value: `> 0`

Example: `/image/height=600/cdn.dedeard.my.id/cat.jpg`


<br />

## Avatar
### URL format: 
- `http://localhost:3000/avatar/:nickname.:format?:options`
  
Notes: *all requests must use* `GET` *method.*

Examples:
- Without options `http://localhost:3000/avatar/dede ard`
- With format `http://localhost:3000/avatar/dede ard.png`
- With options `http://localhost:3000/avatar/dede ard?size=120`

### Options:
**format=:string**

Set avatar format. Default: webp.

Value: `webp - jpeg - jpg - png`

Example: `/avatar/dede ard.png`

<br>

**size=:pixel**

Set avatar size in pixel. Default 60.

Value: `> 0`

Example: `/avatar/dede ard?size=120`


<br />

**color=:hex**

Set avatar text color. Default #111827.

Example: `/avatar/dede ard?color=#000000`


<br />

**bgcolor=:hex**

Set avatar background color. Default #f3f4f6.

Example: `/avatar/dede ard?color=#ffffff`

<br />


## OG Image
### URL format:
- `http://localhost:3000/og/:text.:format?:options`
  
Notes: *all requests must use* `GET` *method.*

Examples:
- Without options `http://localhost:3000/og/Hello World`
- With format `http://localhost:3000/og/Hello World.png`
- With options `http://localhost:3000/og/Hello World?color=#00000`

### Options:
**format=:string**

Set image format. Default: webp.

Value: `webp - jpeg - jpg - png`

Example: `/og/Hello World.png`

<br>

**sign=:string**

Set image sign.

Example: `/og/Hello World?sign=example`

<br />

**color=:hex**

Set image text color. Default #111827.

Example: `/og/Hello World?color=#000000`


<br />

**bgcolor=:hex**

Set image background color. Default #f3f4f6.

Example: `/og/Hello World?color=#ffffff`

<br />


## Placeholder
### URL format:
- `http://localhost:3000/placeholder.:format?:options`
  
Notes: *all requests must use* `GET` *method.*

Examples:
- Without options `http://localhost:3000/placeholder`
- With format `http://localhost:3000/placeholder.png`
- With options `http://localhost:3000/placeholder?color=#00000`

### Options:
**format=:string**

Set image format. Default: webp.

Value: `webp - jpeg - jpg - png`

Example: `/placeholder.png`

<br>

**width=:pixel**

Set new image width in pixel. Default: 640.

Value: `> 0`

Example: `/placeholder?width=600`


<br />

**height=:pixel**

Set new image height in pixel. Default: 480.

Value: `> 0`

Example: `/placeholder?height=600`


<br />

**color=:hex**

Set image text color. Default #111827.

Example: `/og/Hello World?color=#000000`


<br />

**bgcolor=:hex**

Set image background color. Default #f3f4f6.

Example: `/og/Hello World?color=#ffffff`

<br />