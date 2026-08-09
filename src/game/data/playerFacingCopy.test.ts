import { describe, expect, it } from 'vitest';
import {
  PLAYER_FACING_COPY,
  PLAYER_FACING_COPY_RUNTIME_CONNECTION,
  PLAYER_FACING_LEGACY_COPY_TARGETS,
  formatPlayerCarryHomeCopy,
} from './playerFacingCopy';

describe('player-facing copy authority', () => {
  it('正式タイトルと主要navigationをCurrent語へ固定する', () => {
    expect(PLAYER_FACING_COPY.title).toBe('ヨルノシルベ');
    expect(PLAYER_FACING_COPY.navigation.collection).toBe('灯録');
    expect(PLAYER_FACING_COPY.navigation.growth).toBe('旅支度');
    expect(PLAYER_FACING_COPY.navigation.stageSelect).toBe('夜の地図');
  });

  it('first-runでは記憶片を拾う体験として説明する', () => {
    expect(PLAYER_FACING_COPY.firstRun.fragmentLevelUp).toBe('記憶片を拾ってレベルアップ。');
    expect(PLAYER_FACING_COPY.firstRun.fragmentLevelUp).not.toContain('EXP');
  });

  it('Resultは死亡断定せず黒耀化のCurrent表記を使う', () => {
    expect(PLAYER_FACING_COPY.result.defeatTitle).toBe('夜に飲まれた');
    expect(PLAYER_FACING_COPY.result.defeatExplanation).toContain('朝まで残れなかった');
    expect(PLAYER_FACING_COPY.result.noBlackYoukaLabel).toBe('黒耀化なし');
    expect(PLAYER_FACING_COPY.result.rewardsHeading).toBe('持ち帰り');
    expect(PLAYER_FACING_COPY.result.newRecordsHeading).toBe('新しい記録');
  });

  it('敗北文と通貨名を別authorityから合成する', () => {
    expect(formatPlayerCarryHomeCopy()).toBe('朝まで残れなくても、黒曜片は持ち帰れる。');
  });

  it('旧production copyを監査台帳へ残し、active Web/Unity接続を記録する', () => {
    expect(PLAYER_FACING_LEGACY_COPY_TARGETS).toContain('VAMP PON');
    expect(PLAYER_FACING_LEGACY_COPY_TARGETS).toContain('黒曜研究所');
    expect(PLAYER_FACING_LEGACY_COPY_TARGETS).toContain('黒曜なし');
    expect(PLAYER_FACING_COPY_RUNTIME_CONNECTION).toBe('ACTIVE_WEB_AND_UNITY_CONNECTED');
  });
});
