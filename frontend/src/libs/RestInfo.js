export default class RestInfo {
    constructor(axiosInstance){
        this.axiosInstance = axiosInstance;
    }

    async getInfo(){
        return this.axiosInstance.get('/api/info').then(response => response.data);
    }
};
