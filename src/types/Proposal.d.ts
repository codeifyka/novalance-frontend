type ProposalStatus = 'pending' | 'active' | 'done';
interface Proposal {
    id: number;
    cover_letter: string;
    duration: Duration;
    bid: number;
    freelancer_id: number;
    job_post_id: number;
    status: ProposalStatus;
    started_at: string;
    ends_at: string;
    created_at: string;
    updated_at: string;
}

interface CreateProposal {
    job_post_id: number;
    cover_letter: string;
    duration: Duration;
    bid: number;
}

type Duration = 'more than 6 months' | '3 to 6 months' | '1 to 3 months' | 'less than 1 month'
