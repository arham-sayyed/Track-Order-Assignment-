import type { OrderStatus } from '../types/order';

export const STAGE_ORDER: OrderStatus[] = ['PLACED', 'PREPARING', 'READY', 'COLLECTED'];

export const stageRank = (s: OrderStatus): number => STAGE_ORDER.indexOf(s);

const PREPARING_AT_MS = 20_000;
const READY_AT_MS = 90_000;

/** Order stage as a function of time since it was placed. See Global Constraints. */
export function deriveStage(elapsedMs: number): OrderStatus {
  if (elapsedMs < PREPARING_AT_MS) return 'PLACED';
  if (elapsedMs < READY_AT_MS) return 'PREPARING';
  return 'READY';
}
