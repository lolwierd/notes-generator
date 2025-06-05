# Obsidian AI Notes Plugin

This plugin allows you to generate new notes or expand existing selections using the OpenAI API.

## Development

Install dependencies and build:

```bash
make build
```

Copy the `obsidian-ai-notes` folder into your Obsidian plugins directory to use.
Alternatively run `make install` to build and copy the plugin automatically. The
default install path is defined in the `Makefile`.

### Debugging

If Obsidian reports "Failed to load plugin" check the following:
1. Confirm `main.js` and `manifest.json` exist in the plugin folder.
2. Open the developer console (Cmd/Ctrl+Shift+I) for error details.
3. Rebuild with `make build` to ensure the latest code is compiled.
4. Reload Obsidian without cache (`Cmd/Ctrl+R`).
