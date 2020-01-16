import axios from '@/libs/api.request'

export const login = ({ user_name, password }) => {

  const data = {
    user_name,
    password
  }
  return axios.request({
    url: '/api/index/login',
    data,
    method: 'post'
  })
}
// 获取表单费用类别科目
export const subject = (id) => {
 
  return axios.request({
    url: '/api/subject/list',
    data:id ,
    method: 'post'
  })
}
export const getUserInfo = (token) => {
  return axios.request({
    url: 'get_info',
    params: {
      token
    },
    method: 'get'
  })
}

export const logout = (token) => {
  return axios.request({
    url: '/api/index/login/out',
    method: 'post'
  })
}

export const getUnreadCount = () => {
  return axios.request({
    url: 'message/count',
    method: 'get'
  })
}

export const getMessage = () => {
  return axios.request({
    url: 'message/init',
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return axios.request({
    url: 'message/content',
    method: 'get',
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: 'message/has_read',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return axios.request({
    url: 'message/remove_readed',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: 'message/restore',
    method: 'post',
    data: {
      msg_id
    }
  })
}

// //上传文件
// export const uploadFile = (file) => {
//   return axios.request({
//     url: '/api/upload/file',
//     data:file ,
//     method: 'post',
//     headers:{"Content-type": "multipart/form-data"}
//   })
// }
// 获取公司列表
export const companylist = msg_id => {
  return axios.request({
    url: '/api/company/list',
    method: 'post',
    data:msg_id
  })
}
