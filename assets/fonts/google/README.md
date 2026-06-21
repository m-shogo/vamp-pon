# Google Fonts bundled for Vamp Pon

Runtime text is self-hosted from this directory instead of a CDN.

## Font roles

- Body/UI: `M PLUS Rounded 1c`
- Headings/titles: `Kiwi Maru`
- Numeric HUD: `Courier New` fallback stack remains local/system because it is used only for compact counters.

## Bundled files

- `MPLUSRounded1c-Regular.ttf`
- `MPLUSRounded1c-Medium.ttf`
- `MPLUSRounded1c-Bold.ttf`
- `KiwiMaru-Regular.ttf`
- `KiwiMaru-Medium.ttf`

## License

Both bundled font families are published by Google Fonts under the SIL Open Font License 1.1.

- `OFL-MPLUSRounded1c.txt`: M PLUS Rounded 1c license text and copyright notice.
- `OFL-KiwiMaru.txt`: Kiwi Maru license text and copyright notice.

Source references:

- https://fonts.google.com/specimen/M+PLUS+Rounded+1c
- https://fonts.google.com/specimen/Kiwi+Maru
- https://github.com/google/fonts/tree/main/ofl/mplusrounded1c
- https://github.com/google/fonts/tree/main/ofl/kiwimaru

## Kaisei Decol comparison

Kaisei Decol was considered as a title candidate only. It has decorative Mincho-like stroke endings that can look charming in large static titles, but Vamp Pon frequently renders titles on a 390 x 844 mobile viewport over a dark game canvas. Compared with Kiwi Maru, Kaisei Decol is less readable at small title sizes and in short overlay bursts, so it is not bundled or used in runtime CSS.
