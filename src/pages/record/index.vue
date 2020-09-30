<template>
    <view class="page">
        <van-nav :title="videoTitle"
            :navBackgroundColor="'#242725'"
            :titleColor="'#FFFFFF'"
            :back-visible="true"
            :home-path="'/pages/index/main'"></van-nav>
        <!-- header -->
        <view class="table">
            <view class="wt-tab">
                <view v-for="(item,i) in tabs" :key="item" class="wt-item wt-item-lg">
                    <text class="wt-tab-txt" v-if="i == 0" style="left:15rpx;position:absolute;">{{item}}</text>
                    <text class="wt-tab-txt" v-else>{{item}}</text>
                </view>
                <view v-for="(item,index) in tabs_sm" :key="item" class="wt-item">
                    <text class="wt-tab-txt">{{item}}</text>
                </view>
            </view>
            <view class="wt-list">
                <view v-for="item in data" :key="item" class="wt-list-cell">
                    <view class="wt-flex wt-item wt-item-lg" style="justify-content:flex-start;">
                        <text style="margin-left:15rpx;">{{item.batchNo}}</text>
                    </view>
                    <view class="wt-flex wt-item wt-item-lg">
                        <!--{{item.recordNum}}-->
                        <text @click="router_detail(item.id,item.status)" style="color:blue;">查看详情</text>
                    </view>
                    <view class="wt-flex wt-item">
                        <text v-if="item.status == 2" style="color:#FF9900;">上链中</text>
                        <text v-else-if="item.status == 3" style="color:#008000;">已上链</text>
                        <text v-else-if="item.status == 1" style="color:#FF9900;">上链中</text>
                        <text v-else style="color:#FF0000;">未上链</text>
                    </view>
                    <view class="wt-flex wt-item">
                        <!-- <van-icon name="eye-o"  :color="eye" size="20px" v-if="item.status == 0"/>
                        <van-icon name="eye-o" @click="router_detail(item.batchNo,item.status)" size="20px" v-else /> -->
                        <text style="color:blue;" @click="router_chain(item,index)" v-if="item.status == 0">上链</text>
                    </view>
                </view>
            </view>
        </view>
        <!-- tabbar -->
        <van-tab :showlist="showlist"></van-tab>
    </view>
</template>
<script>
import tabbar from "../../components/tabbar"
import nav from "../../components/nav"
import service from "../../utils/service"
import getCache from "../../utils/index"
import utils from '../../utils/index'
export default {
    components:{
        "van-tab":tabbar,
        "van-nav":nav
    },
    data(){
        return {
            eye:"#F39E16",
            videoTitle: '',
            tabs:["批次/商品编号","过程记录"],
            tabs_sm:["上链状态","操作"],
            showlist: {
                indexshow: true,
                classifyshow: false,
                cartshow: true,
                mineshow: true
            },
            page:1,
            data:[],
            total:0
        }
    },
    onPullDownRefresh(){
        this.record_clear()
        this.record_data(1)
    },
    onReachBottom(){
        wx.showLoading({
            title: '玩命加载中',
        })
        this.record_data(this.page)
        wx.hideLoading();
    },    
    methods:{
        router_detail(no,state){
            wx.navigateTo({
                url:"/pages/detail/main?orderNo="+no+"&status="+state,
                complete:(err)=>{
                    console.log(err)
                }
            })
        },

        router_chain(data,idx){
            let that = this
            wx.showModal({
                title: '',
                content: '一经上链不能修改信息，是否确认上链？',
                success (res) {
                    if (res.confirm) {
                        if(data.status == 0){
                            service.wxChain(data).then((r)=>{
                                if(r.data.code == 0) {
                                    that.data[idx].status = 2
                                }
                            })
                        }else{
                            wx.showToast({
                                title:"上链中",
                                duration:3000,
                            })
                        }
                    }
                }
            })
        },
        record_clear(){
            this.page = 1
            this.data = []
        },
        record_data(cur){
            if(this.total > 0 && this.page > this.total){
                return;
            }
            wx.showLoading({
                title: '玩命加载中',
            })
            cur = cur ? cur :1
            let req = {
                cur:cur,
                size:20,
                role:wx.getStorageSync("roleId")}
            let that = this
            service.wxRecord(req).then(res=>{
                let tmpArr = that.data
                if(res.data.code == 0){
                    tmpArr.push.apply(tmpArr,res.data.data.records)
                    this.page++
                    that.total = res.data.data.pages
                    wx.hideLoading()
                    if(res.data.data.records.length == 0){
                        wx.showToast({
                            title:"还没有记录",
                            duration:2000,
                        })
                        setTimeout(function(){
                            wx.switchTab({
                                url:"/pages/verb/main"
                            })
                        },2000)
                    }
                }else{
                    wx.showToast({
                        title:res.data.msg,
                        duration:2000,
                        icon:'none'
                    })
                    setTimeout(function(){
                        wx.switchTab({
                            url:"/pages/verb/main"
                        })
                    },2000)
                }
            }).catch(err=>{
                wx.switchTab({
                    url:"/pages/verb/main"
                })
            })
        }
    },
    onShow(){
        this.record_clear()
        this.record_data(1)
    }
}
</script>
<style lang="scss" scoped>
    .table{
        width:100%;
    }
    .wt-tab{
        background-color: #eee;
        display:flex;
        justify-content: center;
        padding:25rpx 0;
    }
    .wt-tab-txt{
        font-size:30rpx;
        color:#242725;
    }
    .wt-flex{
        display:flex;
        justify-content: center;
        align-items: center;
    }
    .wt-item{
        flex:1;
        text-align: center;
        position: relative;
    }
    .wt-item-lg{
        flex:1.5;
    }
    .wt-list{
        display:flex;
        flex-direction: column;
    }
    .wt-list-cell{
        display:flex;
        padding:30rpx 0 30rpx 0;
        position: relative;
        font-size:28rpx;
        color:#666666;
    }
    .wt-list-cell::after{
        position:absolute;
        bottom:0;
        left:0;
        right:0;
        height: 3rpx;
        transform: scaleY(.5);
	    background-color: #c8c7cc;
        content:"";
    }
    
</style>


