export default class RestProposals {
    constructor(axiosInstance){
        this.axiosInstance = axiosInstance;
    }

    async create(proposal){
        return this.axiosInstance.post('/api/proposals/create',proposal).then(response => response.data);
    }

    async getByFreelancerJobId(job_id){
        return this.axiosInstance.get(`/api/proposals/${job_id}`).then(response => response.data);
    }
};
