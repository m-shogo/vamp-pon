# Story Map

Internal story map files for Vamp Pon.

## Files

- `vamp-pon-story-street-map.html`
- `vamp-pon-story-map-data.json`
- `vamp-pon-story-map.js`

## Purpose

Private planning map for story and design relationships.

## Features

- JSON data source
- node details
- draggable node positions
- localStorage position saving
- localStorage memo saving
- SVG relationship lines
- text search
- lineage filter
- Season filter
- design status filter
- item lookup
- reading lookup
- relationship lookup
- design backlog
- selected brief box
- review and preview path fields
- data integrity check

## Commands

```sh
pnpm story-map:check
pnpm story-map:serve
```

Then open the localhost URL and select `vamp-pon-story-street-map.html`.

Direct file open may not load the JSON in some browsers.

## Rule

The map is a planning artifact.
