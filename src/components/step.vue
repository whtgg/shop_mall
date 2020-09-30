<template>
    <view class="content">
        <view class="wt-title">
            <image :src="clock" mode="scaleToFill"></image>
            <view class="wt-title-txt">时间：
                <text>{{steps.createTime}}</text>
            </view>
        </view>
        <view class="wt-line"></view>
        <view class="wt-main">
            <view class="wt-gt-item">
                <view>{{steps.roleName}}：
                    <text v-if="steps.userName === null">未知</text>
                    <text v-else>{{steps.userName}}</text>
                </view>
            </view>
            <view class="wt-gt-item">
                <image :src="steps.picture" mode="scaleToFill" v-if="steps.picture" class="wt-image"></image>
                <image :src="picture" mode="scaleToFill" v-if="!steps.picture" class="wt-image"></image>
                <image :src="chongpai" class="wt-btn-image" @click="changeImg(steps.id)" v-if="top == 0 && status == 0"></image>
            </view>
            <view class="wt-gt-item">
                <view>地址：
                    <text>{{steps.address}}</text>
                </view>
            </view>
            <view class="wt-gt-item">
                <view class="wt-item-content">坐标：
                    <text>{{steps.lng}}{{steps.lat}}</text>
                    <van-icon name="location-o" size="18px" @click="toMap"></van-icon>
                </view>
            </view>
            <view class="wt-gt-item">
                <view class="wt-item-content">工作：
                    <text>{{steps.work}}</text>
                    <van-icon name="edit" size="20px" @click="maskLayer" v-if="status == 0"></van-icon>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
export default {
    props:['steps','top','status','role'],
    data(){
        return {
            chongpai:"/static/images/chongpai.png",
            clock:"/static/images/clock.png",
            role:"",
            picture: 'https://vtracer-prod.oss-cn-hangzhou.aliyuncs.com/vtrace-161/561337fad2e749879f896e3d6830d698.jpg?Expires=4730509851&OSSAccessKeyId=LTAI4Fw7gbJ1VDAmTUM2AYzn&Signature=Oq7DdT0mY3CWxDWnCQ01Dv7VmEA%3D',
        }
    },
    methods:{
        changeImg(id){
            let that = this
            wx.chooseImage({
                count:1,
                sizeType:["compressed"],
                sourceType:["camera"],
                success:(res)=>{
                    that.$parent.step_modify(id,res.tempFilePaths[0])
                },
                fail:(err)=>{
                    wx.showToast({
                        title:"更换失败",
                        icon:"warn",
                        duration:500
                    })
                }
            })
        },
        modifyWork(content){
            this.steps.work = content
        },
        modifyImg(img){
            this.steps.picture = img
        },
        maskLayer(){
            this.$parent.maskAct(this.steps);
        },
        toMap(){
            wx.navigateTo({
                url:"/pages/map/main",
                complete:(err)=>{
                    console.log(err)
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    .content{
        padding:66rpx 20rpx 90rpx 20rpx;
        display:flex;
        color:#666666;
        font-size:28rpx;
        position: relative;
    }
    .wt-title{
        position: absolute;
        top:0;
        background-color: #F39E16;
        padding:0 22rpx;
        border-radius: 25rpx;
        display:flex;
        align-items: center;
        image{
            width:28rpx;
            height:28rpx;
            margin-right:10rpx;
        }
    }
    .wt-title-txt{
        height:48rpx;
        line-height:48rpx;
        color:#fff;
        font-size:28rpx;
    }
    .wt-line{
        width:4rpx;
        height:100%;
        background-color: #F39E16;
        position: absolute;
        left:34rpx;
        top:0;
    }
    .wt-main{
        flex:1;
        display:flex;
        flex-direction: column;
    }
    .wt-item-content{
        display:flex;
        align-items: center;
    }
    .wt-gt-item{
        padding:15rpx 0 15rpx 61rpx;
        position:relative;
    }
    .wt-image{
        width:100%;
        height:400rpx;
    }
    .wt-btn-image{
        width:78rpx;
        height:71rpx;
        position: absolute;
        top:15rpx;
        right:0;
    }
    // .wt-mask{
    //     height:480rpx;
    //     flex:1;
    //     background-color: #fff;
    //     border:1rpx solid #666666;
    // }
</style>


