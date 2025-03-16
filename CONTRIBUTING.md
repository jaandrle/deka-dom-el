# Contributing to Deka DOM Elements

Thank you for your interest in contributing to Deka DOM Elements (dd<el> or DDE)! This document provides guidelines and
instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

Please be respectful and inclusive in your interactions with other contributors. We aim to foster a welcoming community
where everyone feels comfortable participating.

## Getting Started

1. **Fork the repository**:
	- Click the "Fork" button on the GitHub repository

2. **Clone your fork**:
	```bash
	git clone https://github.com/YOUR-USERNAME/deka-dom-el.git
	cd deka-dom-el
	```

3. **Set up the development environment**:
	```bash
	npm ci
	```

4. **Add the upstream repository**:
	```bash
	git remote add upstream https://github.com/jaandrle/deka-dom-el.git
	```

## Development Workflow

1. **Create a new branch**:
	```bash
	git checkout -b your-feature-branch
	```
	Use descriptive branch names that reflect the changes you're making.

2. **Make your changes**:
	- Write clean, modular code
	- Follow the project's coding standards (see [Coding Standards](#coding-standards))
	- Include relevant tests for your changes

3. ~**Run tests**:~
	```bash
	#npm test
	```

4. **Build the project**:
	```bash
	npm run build
	#or
	bs/build.js
	```

5. **Preview documentation changes** (if applicable):
	```bash
	npm run docs
	#or
	bs/docs.js
	```

…see [BS folder](./bs/README.md) for more info.

## Commit Guidelines

We use
[![git3moji](https://img.shields.io/badge/git3moji%E2%80%93v1-%E2%9A%A1%EF%B8%8F%F0%9F%90%9B%F0%9F%93%BA%F0%9F%91%AE%F0%9F%94%A4-fffad8.svg?style=flat-square)](https://robinpokorny.github.io/git3moji/) <!-- editorconfig-checker-disable-line -->
for commit messages. This helps keep the commit history clear and consistent.

```
:emoji: Short summary of the change
```
…for example:

```
:bug: Fix signal update not triggering on nested properties
:zap: Improve event delegation performance
:abc: Add documentation for custom elements
```

## Pull Request Process

1. **Push your changes**:
	```bash
	git push origin your-feature-branch
	```

2. **Open a Pull Request**:
	- Go to the repository on GitHub
	- Click "New Pull Request"
	- Select your branch
	- Provide a clear description of your changes

3. **PR Guidelines**:
	- Use a clear, descriptive title with the appropriate git3moji
	- Reference any related issues
	- Explain what the changes do and why they are needed
	- List any dependencies that are required for the change
	- Include screenshots or examples if applicable

4. **Code Review**:
	- Address any feedback from reviewers
	- Make necessary changes and push to your branch
	- The PR will be updated automatically

5. **Merge**:
	- Once approved, a maintainer will merge your PR
	- The main branch is protected, so you cannot push directly to it

## Issue Guidelines

When creating an issue, please use the appropriate template and include as much information as possible:

### Bug Reports

- Use the `:bug:` emoji in the title
- Clearly describe the issue
- Include steps to reproduce
- Mention your environment (browser, OS, etc.)
- Add screenshots if applicable

### Feature Requests

- Use the `:zap:` emoji in the title
- Describe the feature clearly
- Explain why it would be valuable
- Include examples or mockups if possible

### Documentation Improvements

- Use the `:abc:` emoji in the title
- Identify what documentation needs improvement
- Suggest specific changes or additions

## Coding Standards

- Follow the existing code style in the project
- Use meaningful variable and function names
- Keep functions small and focused
- Add comments for complex logic
- Use TypeScript types appropriately

<!--
## Testing

- Add tests for new features
- Update tests for modified code
- Ensure all tests pass before submitting a PR
-->

## Documentation

- Update the documentation when you add or modify features
- Document both API usage and underlying concepts
- Use clear, concise language
- Include examples where appropriate

---

Thank you for contributing to Deka DOM Elements! Your efforts help make the project better for everyone.
