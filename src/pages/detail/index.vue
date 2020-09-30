<template>
    <view class="page">
        <view v-for="(item,i) in steps" :key="item">
            <van-step :steps="item" :top="i" :status="status" :ref="item.id" :role="role"></van-step>
        </view>
        <view class="wt-mask-layer" :class="{'wt-hidden':!layer}" @touchmove.stop="layerStop" >
            <view class="wt-mask-content">
                <view class="wt-mask-top">
                    <view>
                        <textarea class="wt-mask-txt" maxlength="50" @input="areaInput" autocomplete="off" v-model="content">
                        </textarea>
                    </view>
                    <view class="wt-mask-tip">
                        <view class="wt-tip">简要输入工作说明，最多50字</view>
                        <view class="wt-tip">{{curNum}}/50</view>
                    </view>
                </view>
                <view class="wt-mask-bottom">
                    <button plain type="primary" size="normal" @click="maskAct">取消</button>
                    <button type="primary" size="normal" class="submit" @click="step_modify_work">确定</button>
                </view>
            </view>
        </view>
        <!-- map -->
        
    </view>
</template>
<script>
import step from "../../components/step"
import service from "../../utils/service"
import regeneratorRuntime from "../../utils/runtime.js"
export default {
    components:{
        "van-step":step
    },
    data(){
        return {
            layer: false,
            curNum: 0,
            content:'',
            page:1,
            orderNo:"",
            status:1,
            top:true,
            item:{},
            steps: [],
            total:0,
            role:"",
        }
    },
    onPullDownRefresh(){
        this.steps_clear()
        this.steps_data(1)
    },
    onReachBottom(){
        wx.showLoading({
            title: '玩命加载中',
        })
        this.steps_data(this.page)
        // 隐藏加载框
        wx.hideLoading();
    },
    methods:{
        maskAct:function(step){
            this.layer = !this.layer
            this.item = step 
            this.content = ''
        },
        maskHidden:function(){
            this.layer = false
            this.item = {}
        },
        layerStop:function(){
            return
        },
        areaInput:function(e){
            this.curNum = e.target.value.length
        },
        steps_clear(){
            this.page = 1
            this.steps = []
        },
        steps_data(cur){
            if(this.total > 0 && this.page > this.total){
                return;
            }
            wx.showLoading({title: '玩命加载中'})
            cur = cur ? cur :1
            let req = {
                cur:cur,
                size:20,
                num:this.orderNo,
                role:wx.getStorageSync("roleId")}
            let that = this
            service.wxDetail(req).then(res=>{
                if(res.data.code == 0){
                    let tmpArr = that.steps
                    tmpArr.push.apply(tmpArr,res.data.data.records)
                    that.page++
                    that.total = res.data.data.pages
                    wx.hideLoading()
                }else{
                    wx.hideLoading()
                    wx.showToast({
                        title:"数据请求错误"
                    })
                }
            }).catch(err=>{
                wx.showToast({
                    title:err,
                    icon:"none"
                })
            })
        },
        //编辑
        async step_modify(id,img){
            let obj = {
                img:img,
                id:id
            }
            let state = await service.wxModify(obj)
            if(state == 1) {
                this.$refs[id][0].modifyImg(img)
                wx.showToast({
                    title:"修改成功",
                    icon:"success",
                })
            }else{
                wx.showToast({
                    title:"修改失败",
                    icon:"fail",
                })
            }
        },
        async step_modify_work(){
            let that = this
            let re = new RegExp(`^[ ]+$`)
            if(re.test(this.content) || this.content.length == 0){
                wx.showToast({
                    title:"工作内容为空",
                    icon:"success",
                })
                return;
            }
            let state = await service.wxModifyWork({
                id:this.item.id,
                work:this.content
            })
            if(state == 1){
                this.$refs[this.item.id][0].modifyWork(this.content)
                wx.showToast({
                    title:"修改成功",
                    icon:"success",
                })
            }else{
                wx.showToast({
                    title:"修改失败",
                    icon:"fail",
                })
            }
            this.layer = !this.layer
        }
    },
    created:function(){
        this.role = wx.getStorageSync("name")
    },
    onShow:function(){
        this.role = wx.getStorageSync("name")
    },
    onLoad:function(options){
        this.orderNo = options.orderNo
        this.status = options.status
        this.maskHidden()
        this.steps_clear()
        this.steps_data(1)
    }
}
</script>
<style lang="scss" scoped>
    .page{
        padding-top:80rpx;
        font-size:28rpx;
    }
    .wt-mask-layer{
        background-color: rgba(0, 0, 0, 0.4);
        position: fixed;
        top:0;
        left:0;
        bottom:0;
        right:0;
        display:flex;
        align-items: center;
        padding:0 20rpx;
    }
    .wt-mask-content{
        width:100%;
        background-color: #fff;
        transform: translateY(0);
        transition: all 0.4s ease;
        padding:65rpx;
        .wt-mask-bottom{
            display:flex;
            justify-content: space-between;
            padding-top:60rpx;
        }
        .wt-mask-top{
            height:220rpx;
            position: relative;
            border:1rpx solid #B4B4B4;
            padding:20rpx;
            .wt-mask-txt{
                width:100%;
                height:200rpx;
            }
            .wt-mask-tip{
                width:100%;
                position: absolute;
                bottom:20rpx;
                color:#B4B4B4;
                display:flex;
                justify-content: space-between;
                right:20rpx;
                .wt-tip:nth-of-type(1){
                    margin-left:40rpx;
                }
            }
        }
    }
    button[plain]{
       color:#242725;
       border-color:#c8c7cc;
       width:268rpx;
       margin-left:-1rpx;
    }
    button.submit{
        width:268rpx;
        background: #F39E16;
        margin-right:-1rpx;
    }
    .wt-hidden{
        display:none;
    }
    
</style>


