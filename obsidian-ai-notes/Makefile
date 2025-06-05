PLUGIN_PATH := /Users/lolwierd/Library/Mobile\ Documents/iCloud~md~obsidian/Documents/lolwierd/.obsidian/plugins/obsidian-ai-notes

.PHONY: build install

build:
	npm install
	npm run build

install: build
	mkdir -p "$(PLUGIN_PATH)"
	cp manifest.json "$(PLUGIN_PATH)/"
	cp -r dist "$(PLUGIN_PATH)/"
	if [ -f styles.css ]; then cp styles.css "$(PLUGIN_PATH)/"; fi
