export default class RestUserSession {
    constructor(axiosInstance){
        this.axiosInstance = axiosInstance;
    }

    async login(userCredentials){
        let { email, password } = userCredentials;
        return this.axiosInstance.post('/api/auth/login',{ email, password }).then(response => response.data);
    }

    async register(user){
        return this.axiosInstance.post('/api/auth/register', user).then(response => response.data);
    }

    async checkAuth(access_token){
        return this.axiosInstance.get('/api/auth/me',{ headers: { Authorization: `Bearer ${access_token}` }}).then(response => response.data);
    }
};
