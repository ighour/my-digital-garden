# Discover

It will read the content folder at root level and create a tree of the content, including posts and categories.

It can be run standalone and create a json file with the tree in `output` folder with:
```bash
npm run discover
```

Or imported in other modules with:
```typescript
import discover from "src/discover";
```

# SSG

A very simple HTML static site generator from discovered content.

It can be run standalone and create a static website in `output` folder with:
```bash
npm run ssg
```

# Website

It will run `SGG` and serve it using [https://www.npmjs.com/package/http-server](http-server) on port 9999:

```bash
npm run website
```