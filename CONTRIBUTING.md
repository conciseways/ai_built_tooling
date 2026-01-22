# Contributing to the Fast Tracker Monorepo

This document provides guidelines and instructions for contributing to the Fast Tracker monorepo.

## Monorepo Structure

```
fast-tracker-monorepo/
├── packages/
│   └── fast-tracker/     # Fast Tracker HTML application
│   └── [other-packages]/ # Other packages will be added here
├── scripts/              # Utility scripts for the monorepo
├── package.json          # Root package.json for workspace configuration
└── README.md             # Main documentation
```

## Adding a New Package

There are two ways to add a new package to the monorepo:

### 1. Using the Create Package Script

We provide a utility script to create new packages with the correct structure:

```bash
npm run new-package
```

This will prompt you for:
- Package name
- Package description
- Package type (app or library)

The script will create the necessary files and directory structure for your new package.

### 2. Manually Creating a Package

If you prefer to create a package manually:

1. Create a new directory in the `packages` folder:
   ```bash
   mkdir packages/your-package-name
   ```

2. Initialize a new package:
   ```bash
   cd packages/your-package-name
   npm init
   ```

3. Create the basic structure:
   ```
   your-package-name/
   ├── src/           # Source code
   ├── package.json   # Package configuration
   └── README.md      # Package documentation
   ```

4. Add your package to the workspace by ensuring it's included in the root `package.json` workspaces array (it should be automatically included if it's in the `packages` directory).

## Development Workflow

### Installing Dependencies

To install dependencies for all packages:

```bash
npm install
```

To install dependencies for a specific package:

```bash
cd packages/your-package-name
npm install your-dependency
```

### Running Scripts

To run a script for all packages:

```bash
npm run <script-name>
```

To run a script for a specific package:

```bash
cd packages/your-package-name
npm run <script-name>
```

Or using Lerna:

```bash
npx lerna run <script-name> --scope=your-package-name
```

### Building Packages

To build all packages:

```bash
npm run build
```

To build a specific package:

```bash
npx lerna run build --scope=your-package-name
```

## Git Workflow

1. Create a new branch for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them:
   ```bash
   git add .
   git commit -m "Description of your changes"
   ```

3. Push your branch and create a pull request:
   ```bash
   git push origin feature/your-feature-name
   ```

## Code Standards

- Follow the existing code style and formatting
- Write tests for new features
- Update documentation as needed
- Keep commits focused and descriptive

## Need Help?

If you have questions or need help, please refer to the README.md file or open an issue in the repository.
