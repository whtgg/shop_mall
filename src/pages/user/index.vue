<template>
    <view class="page">
        <!-- header -->
        <view class="wt-header">
            <view class="wt-item-image">
                <image class="wt-info-img" :src="user.pic" mode="scaleToFill"></image>
            </view>
            <view class="wt-item">
                <view class="wt-flex wt-column">
                    <view class="wt-txt-bg wt-txt-bg-pd">{{user.username}}</view>
                    <view class="wt-txt-sm wt-txt-sm-pd">角色：{{user.work}}</view>
                </view>
            </view>
            <view class="wt-item">
                <view class="wt-flex wt-column">
                    <view class="wt-txt-bg wt-txt-bg-pd" style="color:#F39E16;">{{user.recordTotal}}</view>
                    <view class="wt-txt-sm wt-txt-sm-pd">记录次数</view>
                </view>
            </view>
        </view>
        <view class="wt-divider"></view>
        <!-- list -->
        <view class="wt-list wt-column">
            <view class="wt-list-cell" v-for="(item,i) in labels" :key="item" >
                <image :src="left_logo[i]" class="wt-logo"></image>
                <view class="wt-cell-txt" v-if="item.act == 'text'">
                    <text>{{item.label}}</text>
                </view>
                <view  v-if="item.act == 'model'" class="wt-picker">
                    <picker @change="pickerChange" :value="idx" :range="roles" range-key="name">
                        <view class="wt-cell-txt">
                           {{role}}
                        </view>
                    </picker>
                </view>
                <view class="wt-arrow">
                    <image :src="right_logo" class="wt-logo"></image>
                </view>
                <view class="wt-layer" v-if="item.act == 'text'" @click="router(item.path)"></view>
            </view>
        </view>
        <view class="wt-logout">
            <button plain size="large" @click="logout">退出</button>
        </view>

        <!-- 模态框-->
        <!-- <view class="wt-mask-layer" :class="{'wt-hidden':!layer}" @touchmove.stop="layerStop">
            <view class="wt-mask-content">
                <view class="wt-mask-top">
                    <view>更换角色</view>
                    <input type="text" />
                </view>
                <view class="wt-mask-bottom">
                    <button plain type="primary" size="normal" @click="maskShow">取消</button>
                    <button type="primary" size="normal" class="submit">确定</button>
                </view>
            </view>
        </view> -->
        
        <!-- tabbar -->
        <van-tab :showlist="showlist"></van-tab>
    </view>
</template>
<script>
import tabbar from "../../components/tabbar"
import service from "../../utils/service"
export default {
    components:{
        "van-tab":tabbar
    },
    data(){
        return {
            left_logo:["/static/images/lock.png","/static/images/user.png","/static/images/roles.png"],
            right_logo:"/static/images/arrow.png",
            user:{
                recordTotal:0,
                name:"无",
                work:"",
            },
            layer:false,
            roles:[{"id":0,"name":"更换角色"}],
            role:"更换角色",
            idx:0,
            created:false,
            showlist: {
                indexshow: true,
                classifyshow: true,
                cartshow: false,
                mineshow: true
            },
            pic:"https://vtracer-prod.oss-cn-hangzhou.aliyuncs.com/vtrace-161/561337fad2e749879f896e3d6830d698.jpg?Expires=4730509851&OSSAccessKeyId=LTAI4Fw7gbJ1VDAmTUM2AYzn&Signature=Oq7DdT0mY3CWxDWnCQ01Dv7VmEA%3D",
            labels:[
                {
                    "label":"重置密码",
                    "path":"/pages/reset/main",
                    "act":"text"
                },
                {
                    "label":"关于我们",
                    "path":"/pages/about/main",
                    "act":"text"
                },
                {
                    "label":"选择角色",
                    "path":"/pages/index/main",
                    "act":"model"
                }
            ]
        }
    },
    methods:{
        router(url){
            wx.navigateTo({
                url:url,
                complete:(err)=>{
                    console.log(err)
                }
            })
        },
        pickerChange: function(e) {
            this.idx = e.target.value
            //this.role = this.roles[this.idx].name
            this.user.work = this.roles[this.idx].name
            if(this.user.id == 0) {
                this.user.work = "未选择"
            }
            this.listTotal()
            wx.setStorageSync("roleId",this.roles[this.idx].id)
            wx.setStorageSync("name",this.user.work)
        },
        listTotal:function(){
            let that = this
            let roleId = wx.getStorageSync("roleId")
            service.wxTotal(roleId).then(res=>{
                if(res.data.code == 0){
                    that.user.recordTotal = res.data.data
                }
            })
        },
        roleList:function(){
            let that = this
            service.wxRole(this.user.username).then(res=>{
                if(res.data.code == 0){
                    that.roles = []
                    for(let i=0;i<res.data.data.length;i++){
                        let tmp = new Object()
                        tmp.id = res.data.data[i].id
                        tmp.name = res.data.data[i].name
                        that.roles.push(tmp)
                    }
                }
            }).catch(err=>{
                console.log(err)
            })
            console.log("that",that.user)
        },
        logout(){
             wx.clearStorageSync()
             wx.reLaunch({
                url:"/pages/index/main",
                complete:(err)=>{
                    console.log(err)
                }
            })
        }
    },
    created:function(){
        let token = wx.getStorageSync("access_token")
        if(token.length > 0){
            this.listTotal()
        }
         this.created = true
    },
    onShow:function(){
        this.idx = 0
        this.role="更换角色"
        if(this.created){
            this.listTotal()
        }
    },
    onLoad:function(){
        let picture = wx.getStorageSync("avatarUrl")
        this.user.username = wx.getStorageSync("username")
        this.user.work = wx.getStorageSync("name")
        this.user.roleId = wx.getStorageSync("roleId")
        this.user.pic = picture?picture:this.pic
        this.roleList()
    }
}
</script>
<style lang="scss" scoped>
    .wt-header{
        display:flex;
        justify-content: center;
    }
    .wt-txt-bg{
        font-weight: bold;
        font-size: 36rpx;
        color: #000;
    }
    .wt-txt-sm{
        font-size: 24rpx;
        color:#888;
    }
    .wt-column{
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
    }
    .wt-txt-sm-pd,.wt-txt-bg-pd{
        padding:0 0 15rpx 0;
    }
    .wt-list{
        display:flex;
        position: relative;
    }
    .wt-list-cell{
        display:flex;
        position: relative;
        padding:30rpx 0;
        width:100%;
        align-items: center;
    }
    .wt-list-cell::after{
        position:absolute;
        bottom:0;
        left:0;
        right:0;
        height: 3rpx;
        transform: scaleY(.5);
	    background-color: #CCCCCC;
        content:"";
    }
    // .wt-list::before{
    //     position:absolute;
    //     top:0;
    //     left:0;
    //     right:0;
    //     height: 20rpx;
    //     transform: scaleY(.5);
	//     background-color: #F2F2F2;
    //     content:"";
    // }
    .wt-cell-txt{
        color:#888;
        font-size:30rpx;
        padding:0 20rpx;
    }
    .wt-item-image{
        width:180rpx;
        justify-content: center;
        align-items: center;
        padding:30rpx 0;
        display:flex;
        color:#c8c7cc;
        .wt-info-img{
            width: 80rpx;
            height: 80rpx;
            border-radius: 100%;
            border:5rpx solid #888;
        }
    }
    .wt-item{
        flex:1;
        justify-content: flex-start;
        align-items: center;
        padding:30rpx 0;
        display:flex;
        color:#c8c7cc;
    }
    .wt-logout{
        padding:0 20rpx;
        margin-top:90rpx;
    }
    button[plain]{
       color:#F39E16;
       border-color:#c8c7cc;
    }
    .wt-divider{
        width:100%;
        height:20rpx;
        background-color: #F2F2F2;
    }
    .wt-logo{
        width:30rpx;
        height:30rpx;
        margin-left:20rpx;
    }
    .wt-arrow{
        flex:1;
        display:flex;
        align-items: center;
        justify-content: flex-end;
        image{
            margin-right:20rpx;
        }
    }
    .wt-layer{
        width:100%;
        height:100rpx;
        position: absolute;
    }
    .wt-picker{
        position: absolute;
        left:45rpx;
        width:90%;
        text-align: left;
    }

    // .wt-mask-layer{
    //     background-color: rgba(0, 0, 0, 0.4);
    //     position: fixed;
    //     top:0;
    //     left:0;
    //     bottom:0;
    //     right:0;
    //     display:flex;
    //     align-items: flex-end;
    //     z-index:10002;
    //     display:none;
    // }
    // .wt-mask-content{
    //     width:100%;
    //     height:380rpx;
    //     background-color: #fff;
    //     transform: translateY(0);//弹框弹出距离，与弹框布局高度有关，如300%表示弹起距离为3倍弹窗高度
    //     transition: all 0.4s ease;
    //     padding:0 65rpx;
    //     .wt-mask-bottom{
    //         display:flex;
    //         justify-content: space-between;
    //         padding-top:60rpx;
    //         button[plain]{
    //             color:#242725;
    //             border-color:#c8c7cc;
    //             width:268rpx;
    //             margin-left:-1rpx;
    //         }
    //         button.submit{
    //             width:268rpx;
    //             background: #F39E16;
    //             margin-right:-1rpx;
    //         }
    //     }
    //     .wt-mask-top{
    //         margin-top:35rpx;
    //         position: relative;
    //     }
    // }
    // .wt-hidden{
    //     display:none;
    // }
</style>

