/**
 * Temporal Workflow: Approval Request Management
 * 
 * Manages approval request state and waits for human decision
 * via Temporal Signals.
 */

import { 
  proxyActivities, 
  sleep, 
  signal 
} from '@temporalio/workflow';
import type * as activities from '../activities';

const { updateApprovalStatus } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute'
});

export interface ApprovalState {
  approvalId: string;
  agentId: string;
  action_type: string;
  action_details: any;
  risk_level: string;
  status: 'pending' | 'approved' | 'rejected' | 'timeout';
  decidedBy?: string;
  decision_reason?: string;
}

export interface DecisionSignal {
  decision: 'approved' | 'rejected';
  decision_reason: string;
  decidedBy: string;
}

/**
 * Approval Request Workflow
 * 
 * This workflow waits for a human decision signal.
 * It can timeout after a configurable period (default: 24 hours).
 */
export async function approvalRequestWorkflow(
  state: ApprovalState
): Promise<void> {
  let decisionReceived = false;
  let decision: 'approved' | 'rejected' | 'timeout' = 'timeout';
  let decision_reason = '';
  let decidedBy = '';

  // Define decision signal handler
  const decisionSignal = signal<DecisionSignal>('decision', (payload) => {
    decisionReceived = true;
    decision = payload.decision;
    decision_reason = payload.decision_reason;
    decidedBy = payload.decidedBy;
  });

  // Wait for decision or timeout (24 hours)
  await Promise.race([
    sleep(86400000), // 24 hours
    decisionSignal()
  ]);

  // If no decision received, mark as timeout
  if (!decisionReceived) {
    state.status = 'timeout';
    decision = 'timeout';
    decision_reason = 'Approval request timed out after 24 hours';
  } else {
    state.status = decision;
    state.decidedBy = decidedBy;
    state.decision_reason = decision_reason;
  }

  // Update approval status in database
  await updateApprovalStatus(
    state.approvalId,
    state.status,
    decision,
    decision_reason,
    decidedBy
  );
}
