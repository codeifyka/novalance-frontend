export default class RestClientJobs{
    constructor(axiosInstance){
        this.axiosInstance = axiosInstance;
    }

    async getAll(){
        return this.axiosInstance.get('/api/job/').then(Response => Response.data)
    }

    async getById(id){
        return this.axiosInstance.get(`/api/job/${id}`).then(Response => Response.data)
    }

    async create(job){
        return this.axiosInstance.post('/api/job',job).then(Response => Response.data)
    }

    async update(id,job){
        return this.axiosInstance.put(`/api/job/${id}`,job).then(Response => Response.data)
    }

    async delete(id){
        return this.axiosInstance.delete(`/api/job/${id}`).then(Response => Response.data)
    }
}