# Virtual Builder (👷 ALPHA version)

A framework for building virtuals worlds in a web application.

## Getting started

### Requirements

- Node.js

### Creating a new project

1. Create a folder for your project
```bash
mkdir my-project
cd my-project
```
2. Install dependencies

**VirtualBuilder** :
```bash
npm install git+https://github.com/LD2Studio/virtualBuilder.git
```
**Vite** :
```bash
npm install vite -D
```
3. Create a `index.html` file
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="main.js" type="module"></script>
</head>
<body>

</body>
</html>
```
4. Create a `main.js` file
```js
import { app } from 'virtualbuilder'
app.init()
```
5. Run Vite
```bash
npx vite
```

That's it!

### Creating an asset for your virtual world

An **asset** is a virtual object made up of one or more rigid parts, which can be attached together by joints, in order to create complex objects which can be used in the virtual world.



