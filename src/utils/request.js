import axios from 'axios'
import qs from 'qs'
import { cloneDeep, isEmpty } from 'lodash'
const { parse, compile } = require("path-to-regexp")
import { message } from 'antd'
import { CANCEL_REQUEST_MESSAGE } from 'utils/constant'
import url from "./url.config";
const { API_URL } = url

const { CancelToken } = axios
window.cancelRequest = new Map()

export default function request(options) {
  let { data, url, method = 'get' } = options
  const cloneData = cloneDeep(data)

  try {
    let domain = ''
    const urlMatch = url.match(/[a-zA-z]+:\/\/[^/]*/)
    if (urlMatch) {
      ;[domain] = urlMatch
      url = url.slice(domain.length)
    }

    const match = parse(url)
    url = compile(url)(data)

    for (const item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name]
      }
    }
    url = domain + url
  } catch (e) {
    message.error(e.message)
  }

  options.url = url
  options.params = cloneData
  options.cancelToken = new CancelToken(cancel => {
    window.cancelRequest.set(Symbol(Date.now()), {
      pathname: window.location.pathname,
      cancel,
    })
  })

  const instance = axios.create({
    baseURL: API_URL,
    timeout: 1000,
    headers: {
      // 'X-Custom-Header': 'foobar',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })

  const myInterceptor = instance.interceptors.request.use(function (config) {
    switch (config.method) {
      case 'upload':
        const cloneData = cloneDeep(config.data)
        let formData = new FormData()
        for (let key in cloneData) {
          formData.append(key, cloneData[key])
        }
        config.data = formData;
        config.method = 'post';
        break;
      case 'download':
        config.method = 'get';
        config.responseType = 'blob';
        break;
    }

    return config
  });

  return instance(options)
    .then(response => {
      const { statusText, status, data } = response

      let result = {}
      if (typeof data === 'object') {
        result = data
        if (Array.isArray(data)) {
          result.list = data
        }
      } else {
        result.data = data
      }

      return Promise.resolve({
        success: true,
        message: statusText,
        statusCode: status,
        ...result,
      })
    })
    .catch(error => {
      const { response, message } = error

      if (String(message) === CANCEL_REQUEST_MESSAGE) {
        return {
          success: false,
        }
      }

      let msg
      let statusCode

      if (response && response instanceof Object) {
        const { data, statusText } = response
        statusCode = response.status
        msg = data.message || statusText
      } else {
        statusCode = 600
        msg = error.message || 'Network Error'
      }

      /* eslint-disable */
      return Promise.reject({
        success: false,
        statusCode,
        message: msg,
      })
    })
    .finally(() => {
      instance.interceptors.request.eject(myInterceptor);
    })
}
