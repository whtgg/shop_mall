import { baseUrlApi } from "./api"
import request from "./request"
var opt = {
    baseURL:baseUrlApi
}

var opt1 = {
    //baseURL:"http://192.168.23.89:9999"
}
export default {
    //发送验证码
    wxCode:(phone)=>{
        return request.post(`/vtraceprocessuserlogin/sendcode/${phone}`,null,opt)
    },
    //重置密码
    wxReset:(code,phone,pwd)=>{
        return request.post(`/vtraceprocessuserlogin/resetpassword?password=${pwd}&verificationCode=${code}&phone=${phone}`,null,opt)
    },
    //角色列表
    wxRole:(phone)=>{
        return request.get(`/vtraceprocessrole/roleNames/byphone/${phone}`,null,opt)  
    },
    //退出
    wxLogout:()=>{
        return request.delete(`/auth/token/logout`,null,opt1)
    },
    //过程记录列表
    wxRecord:(data)=>{
        return request.get(`/vtraceprocessrecord/process/app/page?page=${data.cur}&limit=${data.size}&current=${data.cur}&size=${data.size}&roleId=${data.role}`,null,opt)
    },
    //记录详情
    wxDetail:(data)=>{
        return request.get(`/vtraceprocessrecord/app/page?page=${data.cur}&limit=${data.size}&current=${data.cur}&size=${data.size}&roleId=${data.role}&batchNo=${data.num}`,null,opt)
    },
    //获得记录总数
    wxTotal:(roleId)=>{
        return request.get(`/vtraceprocessrecord/totalAccount?roleId=${roleId}`,null,opt)
    },

    //上链
    wxChain:(data)=>{
        return request.post(`/vtraceorgproductbatch/app/chain/${data.id}`,null,opt)
    },
    //记录修改(图片)
    wxModify:(data)=>{
        return new Promise((resolve,reject)=>wx.uploadFile({
                url:baseUrlApi+"/vtraceprocessrecord/update",
                filePath:data.img,
                name:"file",
                header:{
                    "content-type":"multipart/form-data",
                    "Authorization":"Bearer "+wx.getStorageSync("access_token")
                },
                formData:{
                    'id':data.id,
                    'roleId':wx.getStorageSync("roleId")
                },
                success(res){
                    console.log(res)
                    if(JSON.parse(res.data).code == 0){
                        resolve(1)
                    }else{
                        resolve(0)
                    }
                },
                fail(err){
                    reject(err)
                }
            })
        )
    },
    //记录修改(文字)
    wxModifyWork(data){
        return new Promise((resolve,reject)=>{
            wx.request({
                url:baseUrlApi+"/vtraceprocessrecord/update",
                method:"POST",
                header:{
                    "content-type":"application/x-www-form-urlencoded ",
                    "Authorization":"Bearer "+wx.getStorageSync("access_token")
                },
                data:{
                    'id':data.id,
                    'roleId':wx.getStorageSync("roleId"),
                    'work':data.work
                },
                success(res){
                    if(res.data.code == 0){
                        resolve(1)
                    }else{
                        resolve(0)
                    }
                },
                fail(err){
                    reject(err)
                }
            })
        })
    }
}
