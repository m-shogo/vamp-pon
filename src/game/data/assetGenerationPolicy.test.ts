import { describe, expect, it } from 'vitest';
import { assetFactoryPromptCatalog } from './assetFactoryCatalog';
import {
  ASSET_GENERATION_CONTRACT_SCHEMA_VERSION,
  assetGenerationContracts,
} from './assetGenerationPolicy';
import { goldenReferenceSetById } from './goldenReferenceRegistry';

describe('asset generation consistency policy', () => {
  it('creates exactly one contract for every prompt catalog record', () => {
    expect(assetGenerationContracts).toHaveLength(assetFactoryPromptCatalog.length);
    expect(new Set(assetGenerationContracts.map((contract) => contract.promptCatalogKey)).size)
      .toBe(assetFactoryPromptCatalog.length);
  });

  it('locks candidate generation and final approval boundaries', () => {
    for (const contract of assetGenerationContracts) {
      expect(contract.contractVersion).toBe(ASSET_GENERATION_CONTRACT_SCHEMA_VERSION);
      expect(contract.generationPolicy.candidateCount).toBe(4);
      expect(contract.generationPolicy.oneShotFinalForbidden).toBe(true);
      expect(contract.approvalPolicy.defaultState).toBe('candidate');
      expect(contract.approvalPolicy.approvedAsFinalDefault).toBe(false);
      expect(contract.approvalPolicy.runtimeApprovedDefault).toBe(false);
      expect(contract.approvalPolicy.finalRequiresGoldenReference).toBe(true);
      expect(contract.approvalPolicy.finalRequiresLineageManifest).toBe(true);
      expect(contract.referencePolicy.finalApprovalBlockedWithoutIdentityReference).toBe(true);
    }
  });

  it('keeps global style reference registered but separate from runtime approval', () => {
    const global = goldenReferenceSetById.get('global:visual-style-v1');
    expect(global).toBeDefined();
    expect(global?.status).toBe('approved-style-reference');
    expect(global?.assets.length).toBeGreaterThan(0);
    expect(global?.assets.every((asset) => asset.approvedForRuntime === false)).toBe(true);
  });
});
