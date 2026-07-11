# U46.1 iOS Simulator Regression

- Unity 6000.5.1f1 iOS Simulator build: PASS
- Xcode 26.6 Release build: PASS
- iPhone 17 Pro / iOS 26.5 install and launch: PASS, PID 46290
- Clear/Fail x rewards有無、empty state、保存成功/失敗、Current保護、Retry、StageSelect return、灯録: PASS
- shell再Initialize後のLevelUp open/close: 各1回
- 通常HUD verification button: absent
- crash: false、unhandled exception: 0、EventSystem/AudioListener duplicate: 0
- 360x800 / 390x844 / 430x932相当: 目視済み、P0/P1 0

総合判定はPASS_WITH_ISSUES。既存P2のstat chip ornamentとlabelの軽微な競合だけを残す。
