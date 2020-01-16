import axios from '@/libs/api.request'


// 修改密码
export const updatepassword = (info) => {
  return axios.request({
    url: '/api/index/update/password',
    data:info,
    method: 'post'
  })
}





//浏览文件

export const showfile = (info) => {
  return axios.request({
    url: '/api/upload/show/file',
    data:info,
    method: 'post'
  })
}

// 内部通启编号验证

export const communverify = (info) => {
  return axios.request({
    url: '/api/ias/cost/commun/verify',
    data:info,
    method: 'post'
  })
}

// 费用报销开始

// 费用报销列表
export const expenselist = (info) => {

    return axios.request({
      url: '/api/ias/expense/list',
      data:info,
      method: 'post'
    })
}
//表单用户信息
export const expenseadd = (info) => {

    return axios.request({
      url: '/api/ias/expense/add',
      params:info,
      method: 'get'
    })
}

// 表单用户提交
export const expenseaddpost = (info) => {

  return axios.request({
    url: '/api/ias/expense/add',
    data:info,
    method: 'post'
  })
}

// 修改编辑
export const expensedit = (info) => {

  return axios.request({
    url: '/api/ias/expense/edit',
    params:info,
    method: 'get'
  })
}

// 修改提交
export const expenseditpost = (info) => {

  return axios.request({
    url: '/api/ias/expense/edit',
    params:info,
    method: 'post'
  })
}

//审核
export const expenseexamine = (info) => {
  return axios.request({
    url: '/api/ias/expense/examine',
    params:info,
    method: 'post'
  })
}

// 财务结算
export const settlement = (info) => {
  return axios.request({
    url: '/api/ias/expense/settlement',
    params:info,
    method: 'post'
  })
}





// 行政内部通启

//table 列表
export const communlist = (info) => {
    return axios.request({
      url: '/api/ias/commun/list',
      data:info,
      method: 'post'
    })
}


//获取表单头
export const communadd = (info) => {
  return axios.request({
    url: '/api/ias/commun/add',
    params:info,
    method: 'get'
  })
}

// 表单提交
export const communaddpost = (info) => {
  return axios.request({
    url: '/api/ias/commun/add',
    params:info,
    method: 'post'
  })
}

// 修改表单
export const communedit = (info) => {
  return axios.request({
    url: '/api/ias/commun/edit',
    params:info,
    method: 'get'
  })
}
// 修改提交表单
export const communeditpost = (info) => {
  return axios.request({
    url: '/api/ias/commun/edit',
    params:info,
    method: 'post'
  })
}

//审核 
export const communexamine = (info) => {
  return axios.request({
    url: '/api/ias/commun/examine',
    params:info,
    method: 'post'
  })
}

// 行政结束



// 费用内部通启

 //table 列表
 export const costcommunlist = (info) => {
    return axios.request({
      url: '/api/ias/cost/commun/list',
      data:info,
      method: 'post'
    })
}
// 添加获取
export const costcommunadd = (info) => {
  return axios.request({
    url: '/api/ias/cost/commun/add',
    params:info,
    method: 'get'
  })
}

// 添加提交
export const costcommunaddpost = (info) => {
  return axios.request({
    url: '/api/ias/cost/commun/add',
    data:info,
    method: 'post'
  })
}
//编辑获取
export const costcommunedit = (info) => {
  return axios.request({
    url: '/api/ias/cost/commun/edit',
    params:info,
    method: 'get'
  })
}
//编辑提交
export const costcommunaddedit = (info) => {
  return axios.request({
    url: '/api/ias/cost/commun/edit',
    data:info,
    method: 'post'
  })
}
// 审批
export const costcommunexamine= (info) => {
  return axios.request({
    url: '/api/ias/cost/commun/examine',
    data:info,
    method: 'post'
  })
}

 


// 借款申请
 //table 列表
 export const loanlist = (info) => {
    return axios.request({
      url: '/api/ias/loan/list',
      data:info,
      method: 'post'
    })
}
// 添加获取
export const loancreate = (info) => {
  return axios.request({
    url: '/api/ias/loan/create',
    params:info,
    method: 'get'
  })
}

// 添加提交
 export const loancreatepost = (info) => {
    return axios.request({
      url: '/api/ias/loan/create',
      data:info,
      method: 'post'
    })
}

// 编辑获取
export const loanedit = (info) => {
  return axios.request({
    url: '/api/ias/loan/edit',
    params:info,
    method: 'get'
  })
}
// 编辑提交
 export const loaneditpost = (info) => {
    return axios.request({
      url: '/api/ias/loan/edit',
      data:info,
      method: 'post'
    })
}

// 审核
 export const loanexamine = (info) => {
    return axios.request({
      url: '/api/ias/loan/examine',
      data:info,
      method: 'post'
    })
}

// 结算
export const financeedit = (info) => {
  return axios.request({
    url: '/api/ias/loan/finance/edit',
    data:info,
    method: 'post'
  })
}







// 支票支付
 //table 列表
 export const paylist = (info) => {
    return axios.request({
      url: '/api/ias/cheque/pay/list',
      data:info,
      method: 'post'
    })
}
// 添加获取
export const payadd= (info) => {
  return axios.request({
    url: '/api/ias/cheque/pay/add',
    params:info,
    method: 'get'
  })
}

// 添加提交
 export const payaddpost = (info) => {
    return axios.request({
      url: '/api/ias/cheque/pay/add',
      data:info,
      method: 'post'
    })
}

// 编辑获取
export const payedit = (info) => {
  return axios.request({
    url: '/api/ias/cheque/pay/edit',
    params:info,
    method: 'get'
  })
}
// 编辑提交
 export const payeditpost = (info) => {
    return axios.request({
      url: '/api/ias/cheque/pay/edit',
      data:info,
      method: 'post'
    })
}

// 审核
 export const payexamine = (info) => {
    return axios.request({
      url: '/api/ias/cheque/pay/examine',
      data:info,
      method: 'post'
    })
}

// 结算
export const chequepaysettlement = (info) => {
  return axios.request({
    url: '/api/ias/cheque/pay/settlement',
    data:info,
    method: 'post'
  })
}




// 网银支付
//table 列表
 export const banklist = (info) => {
    return axios.request({
      url: '/api/ias/internet/bank/list',
      data:info,
      method: 'post'
    })
 }
// 添加获取
export const bankadd= (info) => {
  return axios.request({
    url: '/api/ias/internet/bank/add',
    params:info,
    method: 'get'
  })
}

// 添加提交
 export const bankaddpost = (info) => {
    return axios.request({
      url: '/api/ias/internet/bank/add',
      data:info,
      method: 'post'
    })
}

// 编辑获取
export const bankedit = (info) => {
  return axios.request({
    url: '/api/ias/internet/bank/edit',
    params:info,
    method: 'get'
  })
}
// 编辑提交
 export const bankeditpost = (info) => {
    return axios.request({
      url: '/api/ias/internet/bank/edit',
      data:info,
      method: 'post'
    })
}

// 审核
 export const bankexamine = (info) => {
    return axios.request({
      url: '/api/ias/internet/bank/examine',
      data:info,
      method: 'post'
    })
}
// 结算
 export const banksettlement = (info) => {
    return axios.request({
      url: '/api/ias/internet/bank/settlement',
      data:info,
      method: 'post'
    })
}


// 往来收支
//table 列表
 export const dealingslist = (info) => {
    return axios.request({
      url: '/api/ias/dealings/list',
      data:info,
      method: 'post'
    })
 }
// 添加获取
export const dealingscreate= (info) => {
  return axios.request({
    url: '/api/ias/dealings/create',
    params:info,
    method: 'get'
  })
}

// 添加提交
 export const dealingscreatepost = (info) => {
    return axios.request({
      url: '/api/ias/dealings/create',
      data:info,
      method: 'post'
    })
}

// 编辑获取
export const dealingsedit = (info) => {
  return axios.request({
    url: '/api/ias/dealings/edit',
    params:info,
    method: 'get'
  })
}
// 编辑提交
 export const dealingseditpost = (info) => {
    return axios.request({
      url: '/api/ias/dealings/edit',
      data:info,
      method: 'post'
    })
}

// 审核
 export const dealingsexamine = (info) => {
    return axios.request({
      url: '/api/ias/dealings/examine',
      data:info,
      method: 'post'
    })
}

//结算
export const dealingsfinanceedit = (info) => {
  return axios.request({
    url: '/api/ias/dealings/finance/edit',
    data:info,
    method: 'post'
  })
}





//盖章申请
//table 列表
 export const seallist = (info) => {
    return axios.request({
      url: '/api/ias/seal/list',
      data:info,
      method: 'post'
    })
 }
// 添加获取
export const sealcreate= (info) => {
  return axios.request({
    url: '/api/ias/seal/create',
    params:info,
    method: 'get'
  })
}

// 添加提交
 export const sealcreatepost = (info) => {
    return axios.request({
      url: '/api/ias/seal/create',
      data:info,
      method: 'post'
    })
}

// 编辑获取
export const sealedit = (info) => {
  return axios.request({
    url: '/api/ias/seal/edit',
    params:info,
    method: 'get'
  })
}
// 编辑提交
 export const sealeditpost = (info) => {
    return axios.request({
      url: '/api/ias/seal/edit',
      data:info,
      method: 'post'
    })
}

// 审核
 export const sealexamine = (info) => {
    return axios.request({
      url: '/api/ias/seal/examine',
      data:info,
      method: 'post'
    })
}


//现金支票
//table 列表
 export const cashlist = (info) => {
    return axios.request({
      url: '/api/ias/cash/list',
      data:info,
      method: 'post'
    })
 }
// 添加获取
export const cashadd= (info) => {
  return axios.request({
    url: '/api/ias/cash/add',
    params:info,
    method: 'get'
  })
}

// 添加提交
 export const cashaddpost = (info) => {
    return axios.request({
      url: '/api/ias/cash/add',
      data:info,
      method: 'post'
    })
}

// 编辑获取
export const cashedit = (info) => {
  return axios.request({
    url: '/api/ias/cash/edit',
    params:info,
    method: 'get'
  })
}
// 编辑提交
 export const casheditpost = (info) => {
    return axios.request({
      url: '/api/ias/cash/edit',
      data:info,
      method: 'post'
    })
}

// 审核
 export const cashexamine = (info) => {
    return axios.request({
      url: '/api/ias/cash/examine',
      data:info,
      method: 'post'
    })
}
// 结算
 export const cashsettlement= (info) => {
    return axios.request({
      url: '/api/ias/cash/settlement',
      data:info,
      method: 'post'
    })
}


