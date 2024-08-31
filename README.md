# NewStar CTF

This project is a documentation website for NewStar CTF.

## Build the project

Clone the project and install the dependencies with your preferred package manager.

```shell
pnpm install
```

Run package command to build the document.

```shell
pnpm run docs:build
```

Files will be generated in the `dist` directory at the root of the project.

## Development

VitePress configuration is located at [vitepress.config.ts](./vitepress.config.ts).

Theme configuration is located at [theme-config.yml](./theme-config.yml). It's mostly nav and sitebar configuration. For other theme configurations, it's recommended to modify [vitepress.config.ts](./vitepress.config.ts) with type hints.

Theme at [theme/](./theme/), which has path alias `@`.

All the documentations are located at [docs/](./docs/), which has the path alias `@docs`.

The static files are located at [public/](./public/).

For static assets which might be bundled, it's recommended to put them in the `assets` directory in the `docs` directory. For example, image files.

To use Vue in markdown, related components are most defined at [theme/components/docs/](./theme/components/docs/).

## License

Copyright (c) NewStar CTF. All rights reserved.

Licensed under the [MIT](LICENSE) License.
