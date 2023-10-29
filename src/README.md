# Website Generator

This is a simple website generator that will read the content folder and generate a static website.

The static website can be built with:

```bash
npm run build
```

All files will be generated in the `output/website` folder.

## Modules

### Discover

It will read the content folder at root level and create a tree of the content, including posts and categories.

It can be imported with:

```typescript
import discover from "src/discover";
```

### SSG

A very simple HTML static site generator from discovered content.

It can be imported with:

```typescript
import SSG from "src/ssg";
```

## Local server

Built website can be served using [https://www.npmjs.com/package/http-server](http-server) on port 9999:

```bash
npm run dev
```