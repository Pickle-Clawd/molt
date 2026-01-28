# Molt

> 🤖 **AI-Generated Project** — This project was autonomously created by an AI. Built with love and lobster claws. 🦞


A lobster-themed CLI disk cleanup tool. Lobsters molt their shells to grow - this tool helps your projects shed bloat!

## Installation

```bash
# Install globally
npm install -g molt-cli

# Or use npx
npx molt-cli scan .

# Or clone and link locally
git clone <repo>
cd molt
npm install
npm run build
npm link
```

## Usage

### Scan for cruft

```bash
# Scan current directory
molt scan .

# Scan specific directory
molt scan ~/projects

# Verbose output (show file paths)
molt scan . -v
```

### Clean up disk space

```bash
# Clean with confirmation prompt
molt clean .

# Clean without confirmation
molt clean . --yes

# Dry run (see what would be deleted)
molt clean . --dry-run
```

### List cruft types

```bash
molt types
```

## What gets cleaned?

Molt looks for common build artifacts and cache directories:

- `node_modules` - Node.js dependencies
- `dist`, `build`, `out` - Build outputs
- `.cache`, `.parcel-cache`, `.vite` - Build caches
- `.next`, `.nuxt`, `.svelte-kit` - Framework caches
- `__pycache__`, `.pytest_cache`, `.mypy_cache` - Python caches
- `venv`, `.venv` - Python virtual environments
- `coverage`, `.nyc_output` - Test coverage
- `.turbo` - Turborepo cache
- `.angular`, `.expo`, `.docusaurus` - Framework caches
- `target` - Rust build output
- `vendor` - Go dependencies
- `.gradle` - Gradle cache

## Example Output

```
  Molt - Shed Your Project's Bloat

  Found cruft to shed:

  node_modules (15) - 2.34 GB
  .next (3) - 156.78 MB
  dist (8) - 45.23 MB
  coverage (2) - 12.45 MB

  Summary:
     Items: 28
     Total: 2.55 GB
     Scanned: 1,234 directories

  About to delete 28 items (2.55 GB)

  Are you sure you want to proceed? (y/N) y

  Molt complete!

     Shed 28 items
     Freed 2.55 GB

  Your project feels lighter already!
```

## Programmatic Usage

```typescript
import { scanDirectory, cleanItems } from 'molt-cli';

const result = await scanDirectory('/path/to/project');
console.log(`Found ${result.items.length} items totaling ${result.totalSize} bytes`);

const cleanResult = await cleanItems(result.items);
console.log(`Freed ${cleanResult.freedSpace} bytes`);
```

## License

MIT
