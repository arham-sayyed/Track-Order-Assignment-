import { deriveStage, stageRank, STAGE_ORDER } from '../status';

describe('deriveStage', () => {
  it('is PLACED under 20s', () => {
    expect(deriveStage(0)).toBe('PLACED');
    expect(deriveStage(19_999)).toBe('PLACED');
  });
  it('is PREPARING from 20s to 90s', () => {
    expect(deriveStage(20_000)).toBe('PREPARING');
    expect(deriveStage(89_999)).toBe('PREPARING');
  });
  it('is READY at/after 90s', () => {
    expect(deriveStage(90_000)).toBe('READY');
    expect(deriveStage(10 * 60_000)).toBe('READY');
  });
});

describe('stageRank', () => {
  it('orders the stages', () => {
    expect(stageRank('PLACED')).toBeLessThan(stageRank('PREPARING'));
    expect(stageRank('READY')).toBeLessThan(stageRank('COLLECTED'));
    expect(STAGE_ORDER).toEqual(['PLACED', 'PREPARING', 'READY', 'COLLECTED']);
  });
});
