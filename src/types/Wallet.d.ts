interface WalletSummary {
    wallet_id: number;
    balance: number;
    escrow_balance: number;
    transactions: WalletTransaction[];
}

type WalletTransactionType = 
    | 'deposit' 
    | 'escrow_lock' 
    | 'escrow_release' 
    | 'escrow_refund' 
    | 'payout' 
    | 'platform_fee';

type WalletTransactionDirection = 'credit' | 'debit';
type WalletTransactionStatus = 'pending' | 'completed' | 'failed';

interface WalletTransaction {
    id: number;
    wallet_id: number;
    type: WalletTransactionType;
    amount: number;
    direction: WalletTransactionDirection;
    source_type?: string;
    source_id?: number;
    provider?: string;
    provider_data?: Record<string, any>;
    status: WalletTransactionStatus;
    description?: string;
    created_at: string;
    updated_at: string;
}

type DisputeStatus = 
    | 'open' 
    | 'under_review' 
    | 'resolved_refund_client' 
    | 'resolved_partial' 
    | 'resolved_release_freelancer';

interface Dispute {
    id: number;
    proposal_id: number;
    client_id: number;
    freelancer_id: number;
    reason: string;
    status: DisputeStatus;
    client_refund_amount?: number;
    freelancer_amount?: number;
    admin_notes?: string;
    resolved_by?: number;
    resolved_at?: string;
    proposal?: Proposal;
    client?: User;
    freelancer?: User;
    resolver?: User;
    created_at: string;
    updated_at: string;
}

type PayoutStatus = 'pending' | 'completed' | 'rejected';

interface PayoutRequest {
    id: number;
    user_id: number;
    amount: number;
    provider: string;
    provider_data?: Record<string, any>;
    status: PayoutStatus;
    transaction_reference?: string;
    admin_notes?: string;
    processed_at?: string;
    user?: User;
    created_at: string;
    updated_at: string;
}

interface DepositIntentResult {
    payment_id: string;
    client_secret: string;
    amount: number;
    currency: string;
    status: string;
    provider_data?: Record<string, any>;
}
