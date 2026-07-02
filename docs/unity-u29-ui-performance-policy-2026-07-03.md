# Unity U29 UI Performance Policy

## Scope

This policy covers HUD, LevelUp, Result, StageSelect, reward cards, unlock reveal, previous result stamp, and Kokuyou gauge. It is a performance preparation note, not a final UI rewrite.

## Static / Dynamic Split

- HUD: static frame and labels separate from dynamic timer / HP / EXP / Kokuyou fill.
- LevelUp: card layout static; selected glow and card state isolated.
- Result: ledger and seal static; reward values and unlock labels update once when opened.
- StageSelect: map and route static; active lantern and previous result stamp update on open.

## Text Update Frequency

- Timer: once per second.
- HP / EXP / pickup count: on value change only.
- Result / StageSelect text: once per transition, not per frame.

## Layout Rebuild Guard

- Avoid layout groups for frequently changing battle HUD values.
- Keep animated glow / stamp / seal as transform / alpha changes rather than text/layout changes.
- Keep 390x844 readability and do not remove critical Result / StageSelect information.

## Future Checks

U30 / U31 should capture Canvas rebuild count and frame debugger evidence on mobile device.
