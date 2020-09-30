function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}


// /**
//  * 获取storage
//  */
export function getCache(key) {
  var value = wx.getStorageSync(key)
  if (value) {
    return value
  }
  return ""
}

// /**
//  * 删除storage
//  */
export function removeCache(key) {
  wx.removeStorage(key);
}

/**
 * 存储storage
 */
export function setCache(key, value) {
  try {
    wx.setStorageSync(key, value)
  } catch (e) { }
}

/**
  获取url参数
 */
export function getUrlParam(path) {
  var result = {},
    param = /([^?=&]+)=([^&]+)/gi,
    match;
  while ((match = param.exec(path)) != null) {
    result[match[1]] = match[2];
  }
  return result;
}

/**
  数组是否包含某个字符串
 */
export const carrContainStr = (a, obj) => {
  for (var i = 0; i < a.length; i++) {
    if (a[i] == obj) {
      return i;
    }
  }
  return -1;
}


/**
   克隆
 */
export const clone = (obj) => {
  // Handle the 3 simple types, and null or undefined
  if (null == obj || "object" != typeof obj) return obj;

  // Handle Date
  if (obj instanceof Date) {
    var copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle Array
  if (obj instanceof Array) {
    var copy = [];
    for (var i = 0, len = obj.length; i < len; ++i) {
      copy[i] = clone(obj[i]);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    var copy = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
    }
    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
}


/**
   判断机型
 */
export const isiOS = () => {
  var u = navigator.userAgent;
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
  var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  if (isiOS) {
    return true
  }
  return false;
}


export default {
  formatNumber,
  formatTime
}
