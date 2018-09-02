const FILEURL = 'https://cgi.urlsec.qq.com/index.php?m=uploadFile&a=upload' //  文件服务器地址

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

const showLoading = (title = '加载中', mask = false) => {
  return new Promise((resolve, reject) => {
    wx.showLoading({
      title: title,
      success: res => resolve(res),
      fail: err => reject(err)
    })
  })
}

const hideLoading = () => {
  wx.hideLoading()
}

const modal = (title = '提示', content = '', showCancel = true) => {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: title,
      content: content,
      showCancel: showCancel,
      success: res => {
        if (res.confirm) {
          resolve(res)
        }
      },
      fail: err => reject(err)
    })
  })
}

const getStorage = (item) => {
  return wx.getStorageSync(item)
}

const setStorage = (key, value) => {
  wx.setStorageSync(key, value)
}

const chooseImg = (count = 9) => {
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      count: count,
      success: res => resolve(res),
      fail: err => reject(err)
    })
  })
}
const wxLogin = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      success: res => resolve(res),
      fail: err => reject(err)
    })
  })
}

const upLoad = (filePath) => {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: FILEURL,
      filePath: filePath, //  本地路径名
      name: 'file',
      success: res => resolve(res),
      fail: err => reject(err)
    })
  })
}
const jumpTo = (url) => {
  let state = url.indexOf('personalCenter') !== -1 || url.indexOf('add') !== -1 || url.indexOf('find') !== -1
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
const redirectTo = (url) => {
  return wx.redirectTo({
    url: url
  })
}

const navigateBack = (num) => {
  return wx.navigateBack({
    delta: num
  })
}
const clearStorage = () => {
  return wx.clearStorageSync()
}

const previewImage = (currentUrl, urls) => {
  return wx.previewImage({
    current: currentUrl,
    urls: urls
  })
}

const removeStorage = (...keys) => {
  return keys.forEach(item => {
    wx.removeStorageSync(item)
  })
}
const warning = (content, title = '警告') => {
  return wx.showModal({
    title: title,
    content: content,
    showCancel: false
  })
}
export {
  toast, //  提示窗
  showLoading, //  显示加载提示框
  hideLoading, //  隐藏加载提示框
  modal, // 模态框
  getStorage, //  读取缓存（同步）
  setStorage, //  设置缓存（同步）
  removeStorage, // 删除缓存（同步）
  clearStorage, // 清空缓存（同步）
  chooseImg, //  选取图片
  wxLogin, //  登录微信服务器
  upLoad, // 上传,
  jumpTo, //  页面跳转,
  redirectTo, // 重置到某一页面,
  navigateBack, // 返回上一页面或多级页面
  previewImage, // 预览图片
  warning
}
