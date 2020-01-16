import HttpRequest from '@/libs/axios'
import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.dev

const axios = new HttpRequest(baseUrl)
console.log(axios)
export default axios
