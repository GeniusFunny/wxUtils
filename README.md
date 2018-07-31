## 使用Promise封装微信小程序API（完善中）
为了避免重新回到ES6之前的回调噩梦，所以将工作中常用到的微信小程序的一些API使用Promise封装了一层。
某些地方代码存在缺陷，望各位大神指正，欢迎Pull request，共同维护此仓库。
### Ajax模块
#### createQueryString（配置查询字符串）
```javascript
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
```
#### commonApi （非RESTFUL API请求）
```javascript
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
```
#### createRestfulUrl （配置Restful URL）
```javascript
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
```
#### restfulApi （RESTFUL API请求）
```javascript
const restfulApi = {
  'GET_RESTFUL': (url, data) => ({
    url: `${baseURL}/${url}` + createRestfulUrl(data.id),
    method: 'GET'
  })
}
```
#### ajax （主函数）
```javascript
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
```
### wxUtils模块
#### toast （显示消息提示框）
```javascript
const toast = (title = '提示', icon = 'success', duration = 1500, mask = false) => {
  return new Promise((resolve, reject) => {
    wx.showToast({
      title: title,
      icon: icon,
      duration: duration,
      mask: mask,
      success: res => resolve(res),
      fail: err => reject(err)
    })
  })
}
```
#### showLoading （显示loading提示框）
```javascript
const showLoading = (title = '加载中', mask = false) => {
  return new Promise((resolve, reject) => {
    wx.showLoading({
      title: title,
      success: res => resolve(res),
      fail: err => reject(err)
    })
  })
}
```
#### hideLoading （隐藏loading提示框）
```javascript
const hideLoading = () => {
  wx.hideLoading()
}
```
#### modal （显示模态弹窗）
```javascript
const modal = (title = '提示', content = '') => {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: title,
      content: content,
      success: res => {
        if (res.confirm) {
          resolve(res)
        } else {
          reject()
        }
      },
      fail: err => reject(err)
    })
  })
}
```
#### getStorage （同步读取数据缓存）
```javascript
const getStorage = (item) => {
  return wx.getStorageSync(item)
}
```
#### setStorage （同步存储数据缓存）
```javascript
const setStorage = (key, value) => {
  wx.setStorageSync(key, value)
}
```
#### chooseImg （选择本地图片）
```javascript
const chooseImg = (count = 9) => {
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      count: count,
      success: res => resolve(res),
      fail: err => reject(err)
    })
  })
}
```
#### wxLogin （获取临时登录凭证）
```javascript
const wxLogin = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      success: res => resolve(res),
      fail: err => reject(err)
    })
  })
}
```
#### upLoad （上传）
```javascript
const upLoad = (filePath, formData) => {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: fileURL,
      filePath: filePath, //  本地路径名
      name: 'file',
      formData: formData,
      success: res => resolve(res),
      fail: err => reject(err)
    })
  })
}
```
#### jumpTo （路由跳转）
```javascript
const jumpTo = (url) => {
  let state = url.indexOf('homeA') !== -1 || url.indexOf('homeB') !== -1 || url.indexOf('homeC') !== -1
  if (state) {
    wx.switchTab({
      url: url
    })
  } else {
    wx.navigateTo({
      url: url
    })
  }
}
```



