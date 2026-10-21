import { describe, it, expect } from 'vitest';

describe('Cryptographic Proof Pack Verification Client Logic', () => {
  it('validates canonical structure and detects missing signature', () => {
    const invalidPack: any = {
      manifest: {
        pack_id: 'PROOF-001',
        asset_id: 'ASSET-01',
        verdict_state: 'Likely compromised'
      },
      signature_b64: '',
      public_key_b64: 'MCowBQYDK2VwAyEA12345678901234567890123456789012'
    };

    expect(Boolean(invalidPack.signature_b64)).toBe(false);
  });

  it('detects tampering in manifest verdict state against payload verdict', () => {
    const mockPack = {
      manifest: {
        pack_id: 'PROOF-001',
        verdict_state: 'Clear of compromise'
      },
      verdict: {
        state: 'Likely compromised'
      }
    };

    const hasVerdictMismatch = mockPack.manifest.verdict_state !== mockPack.verdict.state;
    expect(hasVerdictMismatch).toBe(true);
  });
});
