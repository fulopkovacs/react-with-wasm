# React + TypeScript + Vite + Wasm

An example of a project using `wasm` with `React`.

## Project setup

We have 3 packages in a `pnpm monorepo`:

```yaml
packages:
  - 'packages/react-app' # React SPA that uses the
  - 'packages/wasm-module' # Rust code for the wasm module
  - 'packages/hello-wasm' # The JS module with WASM built from the Rust source
```

## Setup

### Rust (only the first time)

```sh
cd packages/wasm-module
cargo install wasm-pack
cargo install
```

### Build the WASM module

```sh
pnpm run build:wasm
```

### Install the wasm module as a js lib (only the first time)

```sh
pnpm i
```
