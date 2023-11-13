export default class RestCategories {
    constructor(axiosInstance){
        this.axiosInstance = axiosInstance;
    }

    async getAll(){
        return this.axiosInstance.get(`/api/categories`).then(response => response.data);
    }
};
