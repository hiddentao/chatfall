# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

It is published at https://hiddentao.github.io/chatfall/.

### Installation

Run this in the repository root folder:

```
$ bun install
```

### Local Development

```
$ bun run start
```

This command starts a local development server at http://localhost:3001/chatfall/. Most changes are reflected live without having to restart the server.

### Build

```
$ bun run build
```

This command generates static content into the `build` directory. To preview the build locally:

```
$ bun run serve
```

### Deployment

The website is deployed to GitHub Pages by the [`publish-docs`](../.github/workflows/publish-docs.yaml) GitHub Actions workflow. It runs when changes to the `website/` folder are pushed to `main`, when a new release is published, and when started manually from the Actions tab.
