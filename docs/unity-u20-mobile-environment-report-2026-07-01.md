# Unity U20 Mobile Environment Report

作成日: 2026-07-01

## Environment

- Unity Editor: `6000.5.1f1`
- Unity app path: `/Applications/Unity/Hub/Editor/6000.5.1f1/Unity.app`
- ProjectVersion: `6000.5.1f1`
- PlaybackEngines observed: `MacStandaloneSupport`, `WebGLSupport`
- Xcode command line tools: installed (`/Applications/Xcode.app/Contents/Developer`)
- `adb`: not found
- `idevice_id`: not found

## Build Support

- iOS Build Support: missing
- Android Build Support: missing
- Android SDK/NDK/OpenJDK: missing / not available through this Unity install
- Unity Build Settings target support: mobile build not executed

## Real Device Status

- iPhone実機確認: not executed
- Android実機確認: not executed
- 実機FPS確認: not executed
- 実機touch確認: not executed
- 実機Safe Area確認: not executed

## Notes

U20はmodule不足と端末検出CLI不足のため、実機build / install / profiler確認は実施しない。代替としてEditor batchmode screenshot、Safe Area / Touch / Text / Game Feel / 黒耀化 / Performance verificationでMobile QA proofを行う。
