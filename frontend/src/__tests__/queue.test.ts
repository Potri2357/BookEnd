import { describe, it, expect } from 'vitest';

describe('Decision Queue Filter and Triage Logic', () => {
  const sampleQueue = [
    {
      asset_id: 'ASSET-01',
      host_name: 'meridian-vpn-gw-01',
      exposure_tier: 'emergency',
      verdict_state: 'Likely compromised',
      gate_locked: true,
      has_blindspot: false
    },
    {
      asset_id: 'ASSET-02',
      host_name: 'meridian-vpn-gw-02',
      exposure_tier: 'standard',
      verdict_state: 'Clear of compromise',
      gate_locked: false,
      has_blindspot: false
    },
    {
      asset_id: 'ASSET-03',
      host_name: 'lotus-telehealth-api',
      exposure_tier: 'high',
      verdict_state: 'Inconclusive (Coverage Blindspot)',
      gate_locked: true,
      has_blindspot: true
    }
  ];

  it('filters by search keyword matching hostname', () => {
    const term = 'vpn-gw-01';
    const filtered = sampleQueue.filter(item => item.host_name.includes(term));
    expect(filtered.length).toBe(1);
    expect(filtered[0].host_name).toBe('meridian-vpn-gw-01');
  });

  it('filters by emergency exposure tier', () => {
    const emergencyOnly = sampleQueue.filter(item => item.exposure_tier === 'emergency');
    expect(emergencyOnly.length).toBe(1);
    expect(emergencyOnly[0].asset_id).toBe('ASSET-01');
  });

  it('filters by blocked gate preset', () => {
    const blockedOnly = sampleQueue.filter(item => item.gate_locked);
    expect(blockedOnly.length).toBe(2);
  });
});
