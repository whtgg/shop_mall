var Fly = require("flyio/dist/npm/wx")
import { getCache } from "../utils"

const request = new Fly()

//全局加载提示
let ltime = 0;

function closeLoading(param){
    ltime--
}

request.interceptors.request.use((request)=>{
    ltime++
    let token = wx.getStorageSync("access_token")
    request.headers = {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization":"Bearer "+token,
        //"UserAgent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36",
        "ClientType":5
    }
    //let dataSource = getCache("dataSource")
    // request.headers = {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //     // "source": "miniApp",
    //     // "dataSource": dataSource ? dataSource : ''
    // }
    // 没用到
    // if (request.url.indexOf('getReviewInfo') != -1) {
    //     closeLoading()
    //     return request
    // }
    // let type = '';
    // if(request.url.indexOf("wxLogin") != -1) {
    //     type = request.body.loginType;
    // }
    // if (request.url.indexOf("wxLogin") == -1 || type == 'WORKBENCH') {
    //     let storeCode = getCache("storeCode");
    //     let inviter = getCache("inviter");
    //     let token = getCache("token");
    //     request.headers = {
    //         "Content-Type": "application/x-www-form-urlencoded",
    //         "source": "miniApp",
    //         "token": token,
    //         "storeCode": storeCode,
    //         "inviter": inviter
    //     }
    //     let dataSource = getCache("dataSource")
    //     if (dataSource) {
    //         request.headers['dataSource'] = dataSource
    //     }
    // }
    return request
})

request.interceptors.response.use((response) => {
    if(response.data.code != 0){
        console.log("code is ",response.data.code)
        if(response.data.code == 9000){
            wx.clearStorageSync()
            setTimeout(function(){
                wx.showToast({
                    title:res.data.msg,
                    success(){
                        wx.reLaunch({
                            url:"/pages/index/main",
                            complete:(err)=>{
                                console.log(err)
                            }
                        })
                    },
                    fail(err){
                        console.log(err)
                    }
                })
            },2000)
        }else{
            console.log("iiii")
            wx.showToast({
                title:response.data.msg,
                duration:2000,
                icon:"none"
            })
        }
    }
//     closeLoading()
//    // wx.hideNavigationBarLoading()
//    // 微信运维统计
//    if (response.status) {
//        wx.reportMonitor('0', +(response.status))
//    }
//    if (response.headers.date) {
//        let time = new Date().getTime() - new Date(response.headers.date).getTime()
//        wx.reportMonitor('1', +(time))
//    }
//    // 错误提示
//    if (response.status != 200) {
//        wx.showToast({
//            title: '出错啦！请稍后再试试哦～',
//            icon: 'none',
//            duration: 2000
//        })
//    }
   return response
   //return promise.resolve(response.data)
},(err, Promise) => {
    console.log("err is ",err)
    if(err.status == 401){
        wx.clearStorageSync()
        wx.hideLoading()
        setTimeout(function(){
            wx.showToast({
                title:"登陆令牌已过期",
                success(){
                    wx.reLaunch({
                        url:"/pages/index/main",
                        complete:(err)=>{
                            console.log(err)
                        }
                    })
                }
            })
        },2000)
    }
    // wx.hideNavigationBarLoading()
    // console.log(err.status)
    // return Promise.reject(err)
})
export default request