import axios from "axios";


const useApi = axios.create({
    baseURL: "http://172.16.10.5:4000",
})

// useApi.interceptors.request.use((config) => {
//     config.headers["apikey"] = 'documental'
//     config.headers["apisecret"] = 'Documental2021file'
//     config.headers["Content-Type"] = "application/json"
//     return config
// })


export { useApi }