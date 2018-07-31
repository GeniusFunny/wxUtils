const baseURL = 'http://test.com'

/**
 * 配置查询字符串
 * @param
 * @example {username: geniusFunny, password: helloWorld}
 * @returns string
 * @example ?username=geniusFunny&password=helloWorld
 */
const createQueryString = (data) => {
  let keys = Object.keys(data)
  let values = Object.values(data)
  let str = ''
  if (keys.length && values.length) {
    str = '?'
    keys.forEach((item, index) => {
      str += `${item}=${values[index]}&`
    })
    str.slice(0, -1)
  }
  return str
}

/**
 * 非RESTFUL API请求
*/
const commonApi = (url, method, data) => {
  if (method === 'get') {
    return {
      url: baseURL + url + createQueryString(data),
      method: 'GET'
    }
  } else {
    return {
      url: `${baseURL}/${url}`,
      method: method,
      data: data
    }
  }
}

/**
 *配置RESTFUL URL
 * @example [1, 2, 3] or 2
 * @returns /1/2/3 or /2
 * @param arr
 */
const createRestfulUrl = (arr) => {
  let str = ''
  if (typeof arr === 'object') {
    arr.forEach(item => {
      str += `/${item}`
    })
  } else if (typeof arr === 'string' && arr.length >= 1){
    str += `/${arr}`
  }
  return str
}

/**
 * RESTFUL API请求
*/
const restfulApi = {
  'GET_RESTFUL': (url, data) => ({
    url: `${baseURL}/${url}` + createRestfulUrl(data.id),
    method: 'GET'
  })
}

function ajax(url = 'test', method = 'get', data = {}, header = {'Content-Type': 'application/json'}) {
  let xhrHeader = {}
  try {
    xhrHeader = restfulApi[method.toUpperCase()](url, data)
  } catch(e) {
    console.error(`${e}, 非Restful API`)
    xhrHeader = commonApi(url, method.toUpperCase(), data)
  }
  if (xhrHeader.method === 'POST') {
    header = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

  return new Promise((resolve, reject) => {
    wx.request({
      ...xhrHeader,
      header: header,
      success: res => {
        if (res) {  //判断response是否为期待值
          resolve(res)
        } else {
          reject('权限错误')
        }
      },
      fail: err => reject(err)
    })
  })
}

export default ajax
