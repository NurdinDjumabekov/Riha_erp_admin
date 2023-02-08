import axios from "axios";

const API = axios.create({
    baseURL: 'http://jsonplaceholder.typicode.com/'
})

export default API