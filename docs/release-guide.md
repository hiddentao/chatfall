# Chatfall Release Guide for Core Developers

This guide outlines the steps for creating and publishing a new release of Chatfall.

## Prerequisites

- **Git access**: Ensure you have push access to the Chatfall repository.
- **NPM access**: Ensure you have permission to publish packages to NPM.
- **Bun installed**: The build process uses Bun.

## Step 1: Update Version Numbers

Update the version numbers in the `package.json` files for both the client and server:

- **Client**: `client/package.json`
- **Server**: `server/package.json`

Follow [semantic versioning](https://semver.org/) guidelines.

## Step 2: Commit Changes

Commit your changes with a meaningful commit message:
