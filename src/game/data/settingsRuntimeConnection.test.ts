import fs from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => fs.readFileSync(path, 'utf8');

describe('settings runtime connection contract', () => {
  it('Webはsingle APP_PREFERENCE ownerから4項目を提供する', () => {
    const owner = read('src/game/persistence/appPreferences.ts');
    const screen = read('src/game/scenes/SettingsScene.ts');
    expect(owner).toContain("APP_PREFERENCE_STORAGE_KEY = 'yorunoShirube.appPreferences.v1'");
    for (const id of ['bgmVolume', 'seVolume', 'hapticsEnabled', 'reducedMotion']) {
      expect(owner).toContain(id);
      expect(screen).toContain(id);
    }
    expect(screen).toContain("super('SettingsScene')");
  });

  it('Unityはgameplay saveではなくAppPreferenceServiceからaudio/haptic/motionへ接続する', () => {
    const owner = read('unity/VampPonUnity/Assets/_Project/Scripts/Runtime/AppPreferenceService.cs');
    const audio = read('unity/VampPonUnity/Assets/_Project/Scripts/U49/AudioHaptic/U49AudioHapticRuntimeOwner.cs');
    const shell = read('unity/VampPonUnity/Assets/_Project/Scripts/Runtime/AppFlow/U46RuntimeShell.cs');
    expect(owner).toContain('yorunoShirube.app-preferences.v1');
    expect(owner).toContain('PlayerPrefs.SetString');
    expect(owner).toContain('ReducedMotionEnabled');
    expect(audio).toContain('ApplySettings(AppPreferenceSnapshot settings)');
    expect(audio).toContain('profile.DefaultBgmVolume * bgmVolume');
    expect(audio).toContain('profile.DefaultSeVolume * seVolume');
    expect(shell).toContain('preferences = new AppPreferenceService()');
    expect(shell).toContain('preferences.Changed += ApplyPreferences');
  });
});
