import { describe, expect, it } from 'vitest';
import { isDawnTicketQaRequested, isDawnTicketRevivalQaRequested } from './state';

describe('QA URL flags', () => {
  it('dawn_ticket QA 所持導線をURLから判定する', () => {
    expect(isDawnTicketQaRequested('?qa=dawn-ticket')).toBe(true);
    expect(isDawnTicketQaRequested('?qa=dawn-ticket-revival')).toBe(true);
    expect(isDawnTicketQaRequested('?qaDawnTicket=true')).toBe(true);
    expect(isDawnTicketQaRequested('?qa=quick-clear')).toBe(false);
  });

  it('dawn_ticket 復帰QAは低HP開始用URLとして判定する', () => {
    expect(isDawnTicketRevivalQaRequested('?qa=dawn-ticket-revival')).toBe(true);
    expect(isDawnTicketRevivalQaRequested('?qa=dawn-ticket')).toBe(false);
  });
});
