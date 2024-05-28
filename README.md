# @jiangweiye/install-pkg

#### @jiangweiye/install-pkg

<p align="center">
  <img src="https://img.shields.io/npm/v/@jiangweiye/install-pkg" alt='version'>
  <img src="https://img.shields.io/npm/dw/@jiangweiye/install-pkg" alt='download'>
  <img src="https://img.shields.io/github/issues/jwyGithub/install-pkg" alt='issues'>
  <img src="https://img.shields.io/github/license/jwyGithub/install-pkg" alt='license'>
</p>
<br />

### install

#### with pnpm

```sh
pnpm add @jiangweiye/install-pkg -D
```

#### with yarn

```sh
yarn add @jiangweiye/install-pkg -D
```

#### with npm

```sh
npm install @jiangweiye/install-pkg -D
```

### use

```ts
import { installPackage } from '@jiangweiye/install-pkg';

await installPackage('vite', { silent: true });
```
