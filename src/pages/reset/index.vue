<template>
    <view class="page">
        <view class="wt-group">
            <view class="wt-group-item">
                <view class="wt-input-lf">
                    <view class="wt-input-icon">
                        <image :src="left_logo_user" class="wt-logo"></image>
                    </view>
                    <view class="wt-input">
                        <input type="text" placeholder="验证码" v-model="value"/>
                    </view>
                </view>
                <view class="wt-input-rg" @click="sendCode">
                    <text>{{sendC}}</text>
                </view>
            </view>
            <view class="wt-group-item">
                <view class="wt-input-lf">
                    <view class="wt-input-icon">
                        <image :src="left_logo_lock" class="wt-logo"></image>
                    </view>
                    <view class="wt-input">
                        <input  placeholder="密码" v-model="pwd"  :password="password" />
                    </view>
                    <view class="wt-input-rg" @click="showPwd">
                        <text>显示密码</text>
                    </view>
                </view>
            </view>
        </view>
        <button plain size="large" @click="resetPwd">完成</button>
    </view>
</template>
<script>
import service from "../../utils/service"
export default {
    data(){
        return {
            value:"",
            pwd:"",
            left_logo_lock:"/static/images/lock.png",
            left_logo_user:"/static/images/user.png",
            password:true,
            second:60,
            sendC:"发送验证码",
            sendA:false
        }
    },
    onShow(){
        this.sendA = false
        let tk = wx.getStorageSync("sendTimer")
        if(parseInt(tk) > 0){
            clearInterval(tk)
            this.sendC = "发送验证码"
            this.second = 60
        }
    },
    methods:{
        showPwd(){
            this.password = !this.password
        },
        onChange(e){
            console.log(e.data);
        },
        sendCode(){
            if(this.sendA) return
            let phone = wx.getStorageSync("username")
            if(phone.length < 10) {
                wx.showToast({title:"账号不存在"})
            }
            let that = this
            that.sendA = true
            service.wxCode(phone).then(res=>{
                if(res.data.code == 0){
                    wx.showToast({
                        title:"发送成功",
                    })
                    that.timer()
                }else{
                    wx.showToast({
                        title:"发送失败",
                        icon:"none"
                    })
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        resetPwd(){
            let phone = wx.getStorageSync("username")
            if(phone.length < 10 && phone.replace(/\s*/g,"").length < 10) {
                wx.showToast({
                    title:"账号不存在"
                })
                return
            }
            if(!(/^(?![0-9]+$)(?![A-z]+$)[0-9A-Za-z]{8,20}$/).test(this.pwd) ){
                wx.showToast({
                    title:"密码长度在8到20个字符 含数字和大小写字母",
                    icon:"none",
                    duration:2000
                })
                return
            }
            
            service.wxReset(this.value,phone,this.pwd).then(res=>{
                if(res.data.code == 0) {
                    wx.showToast({title:"重置成功",success:function(){
                        setTimeout(function(){
                        //   wx.navigateBack()
                            wx.clearStorageSync()
                            wx.reLaunch({
                                url:"/pages/index/main",
                                complete:(err)=>{
                                    console.log(err)
                                }
                            })
                        },1000)
                    }})
                }else{
                  wx.showToast({title:res.data.msg,icon:'none'})  
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        timer() {
            let promise = new Promise((resolve, reject) => {
            let setTimer = setInterval(
                () => {
                    wx.setStorageSync("sendTimer",setTimer)
                    this.second--
                    this.sendC = this.second
                    if (this.second <= 0) {
                        this.second = 60
                        resolve(setTimer)
                    }
                }, 1000)
            })
            promise.then((setTimer) => {
                clearInterval(setTimer)
                this.sendA = false
                this.sendC = "发送验证码"
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    .page{
        margin: 0;
        padding:0 20rpx;
    }
    .wt-group{
        padding:20rpx 0;
        font-size:28rpx;
    }
    .wt-group-item{
        display: flex;
        justify-content: center;
        height:88rpx;
        margin-top:20rpx;
    }
    .wt-input-lf::after{
        position:absolute;
        bottom:0;
        left:0;
        right:10rpx;
        height: 1rpx;
        transform: scaleY(.5);
	    background-color: #F2F2F2;
        content:"";
    }
    .wt-input-lf{
        flex:1;
        display:flex;
        justify-content: center;
        flex-shrink: 0;
        position: relative;
        .wt-input-icon{
            flex:0;
            display:flex;
            align-items: center;
            padding-right:20rpx;
        }
        .wt-input{
            flex:1;
            display:flex;
            align-items: center;
            input{
                height:28rpx;
                line-height: 28rpx;
                font-size:28rpx;
            }
        }
    }
    .wt-input-rg{
        width: 200rpx;
        background-color: #F2F2F2;
        display:flex;
        align-items: center;
        justify-content: center;
        text{
            color: #242725;
        }
    }
    button[plain]{
       background-color:#F39E16;
       border-color:#F39E16;
       color:#fff;
       margin-top:90rpx;
    }
    .wt-logo{
        width:30rpx;
        height:30rpx;
        margin-left:20rpx;
    }
</style>


