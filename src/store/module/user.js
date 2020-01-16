import {
  login,
  logout,
  getUserInfo,
  getMessage,
  getContentByMsgId,
  hasRead,
  removeReaded,
  restoreTrash,
  getUnreadCount,
  subject,
  uploadFile,
  companylist
} from '@/api/user'
import { setToken, getToken ,localSave,localRead} from '@/libs/util'

export default {
  state: {
    user_name: '',
    userId: '',
    avatarImgPath: '',
    token: getToken(),
    comlist: localRead('comlist'),
    access: '',
    hasGetInfo: false,
    unreadCount: 0,
    messageUnreadList: [],
    messageReadedList: [],
    messageTrashList: [],
    messageContentStore: {},
    comlist:[],
    comid:'',
  },
  mutations: {
    setAvatar (state, avatarPath) {
      state.avatarImgPath = avatarPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.user_name = name
    },
    companyId (state, id){
      debugger
      state.comid = id
      localSave('comid',id)
    },
    setAccess (state, access) {
      state.access = access
    },
    localSave1 (state, comlist) {
      state.comlist = comlist
      localSave('comlist',comlist)
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    },
    comlist (state, status){
      state.comlist = status
    },
    setMessageCount (state, count) {
      state.unreadCount = count
    },
    setMessageUnreadList (state, list) {
      state.messageUnreadList = list
    },
    setMessageReadedList (state, list) {
      state.messageReadedList = list
    },
    setMessageTrashList (state, list) {
      state.messageTrashList = list
    },
    updateMessageContentStore (state, { msg_id, content }) {
      state.messageContentStore[msg_id] = content
    },
    moveMsg (state, { from, to, msg_id }) {
      const index = state[from].findIndex(_ => _.msg_id === msg_id)
      const msgItem = state[from].splice(index, 1)[0]
      msgItem.loading = false
      state[to].unshift(msgItem)
    }
  },
  getters: {
    messageUnreadCount: state => state.messageUnreadList.length,
    messageReadedCount: state => state.messageReadedList.length,
    messageTrashCount: state => state.messageTrashList.length
  },
  actions: {
    // 登录
    handleLogin ({ commit }, { user_name, password }) {
      user_name = user_name.trim()
      return new Promise((resolve, reject) => {
        login({
          user_name,
          password
        }).then(res => {
          const data = res.data
          console.log(res)
          //  commit('localSave', data.data.userInfo.id)
           commit('companyId', data.data.userInfo.company_id)
           commit('setToken', data.data.userInfo.id)
           commit('setAvatar', 'https://file.iviewui.com/dist/a0e88e83800f138b94d2414621bd9704.png')
           commit('setUserName', data.data.userInfo.name)
           commit('setUserId', data.role_id)
           commit('setAccess',  data.data.userInfo.name)
           commit('setHasGetInfo', true)
           resolve(data)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('setToken', '')
          commit('setAccess', [])
          resolve()
        }).catch(err => {
          reject(err)
        })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        // commit('setToken', '')
        // commit('setAccess', [])
        // resolve()
      })
    },
    // 获取公司列表
    getcompanylist({state,commit}){
      return new Promise((resolve,reject)=>{
        companylist().then(res=>{
          debugger
          commit('localSave1', JSON.stringify(res.data.data.companyList))
          // commit('comlist', res.data.data)
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getsubject( { commit },{ id }) {
        return new Promise((resolve, reject) => {
            subject(id).then(res => {
            
              resolve(res)
            }).catch(err => {
              reject(err)
            })
          })
        },
    formuploadFile ( { commit },{ file }) {
        return new Promise((resolve, reject) => {
          uploadFile({
             file
          }).then(res => {    
              resolve(res)
          }).catch(err => {
           reject(err)
          })
        })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          getUserInfo(state.token).then(res => {
            const data = res.data
            // commit('setAvatar', data.avatar)
            commit('setUserName', data.name)
            // commit('setUserId', data.user_id)
            // commit('setAccess', data.access)
            commit('setHasGetInfo', true)
            resolve(data)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    // 此方法用来获取未读消息条数，接口只返回数值，不返回消息列表
    getUnreadMessageCount ({ state, commit }) {
      // getUnreadCount().then(res => {
      //   const { data } = res
      //   commit('setMessageCount', data)
      // })
    },
    // 获取消息列表，其中包含未读、已读、回收站三个列表
    getMessageList ({ state, commit }) {
      return new Promise((resolve, reject) => {
        getMessage().then(res => {
          const { unread, readed, trash } = res.data
          commit('setMessageUnreadList', unread.sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
          commit('setMessageReadedList', readed.map(_ => {
            _.loading = false
            return _
          }).sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
          commit('setMessageTrashList', trash.map(_ => {
            _.loading = false
            return _
          }).sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 根据当前点击的消息的id获取内容
    getContentByMsgId ({ state, commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        let contentItem = state.messageContentStore[msg_id]
        if (contentItem) {
          resolve(contentItem)
        } else {
          getContentByMsgId(msg_id).then(res => {
            const content = res.data
            commit('updateMessageContentStore', { msg_id, content })
            resolve(content)
          })
        }
      })
    },
    // 把一个未读消息标记为已读
    hasRead ({ state, commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        hasRead(msg_id).then(() => {
          commit('moveMsg', {
            from: 'messageUnreadList',
            to: 'messageReadedList',
            msg_id
          })
          commit('setMessageCount', state.unreadCount - 1)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 删除一个已读消息到回收站
    removeReaded ({ commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        removeReaded(msg_id).then(() => {
          commit('moveMsg', {
            from: 'messageReadedList',
            to: 'messageTrashList',
            msg_id
          })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 还原一个已删除消息到已读消息
    restoreTrash ({ commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        restoreTrash(msg_id).then(() => {
          commit('moveMsg', {
            from: 'messageTrashList',
            to: 'messageReadedList',
            msg_id
          })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
