<template>
<div class="tabbar__common">
    <div class="weui-flex">
        <div class="weui-flex__item">
            <div class="placeholder  tabbar__item" :class="{red:!indexshow}">
                <div class="init__index" v-show="indexshow">
                    <div @click="index">
                        <div><img src="/static/tabs/verb.png" alt=""></div>
                        <p class="noselected__indextext">过程记录</p>
                    </div>
                </div>
                <div class="init__index" v-show="!indexshow">
                    <div @click="indexselected">
                        <div><img src="/static/tabs/verb.png" alt=""></div>
                        <p class="indexselected__indextext">过程记录</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="weui-flex__item">
            <div class="placeholder tabbar__item" :class="{red:!classifyshow}">
                <div class="init__classify" v-show="classifyshow">
                    <div @click="classify">
                        <div><img src="/static/tabs/search.png" alt=""></div>
                        <p class="noselected__indextext">记录查看</p>
                    </div>
                </div>
                <div class="init__classify" v-show="!classifyshow">
                    <div @click="classifyselected">
                        <div><img src="/static/tabs/search.png" alt=""></div>
                        <p class="classifyselected__indextext">记录查看</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="weui-flex__item">
            <div class="placeholder tabbar__item" :class="{red:!cartshow}">
                <div class="init__cart" v-show="cartshow">
                    <div @click="cart">
                        <div><img src="/static/tabs/Shape.png" alt=""></div>
                        <p class="noselected__indextext">个人中心</p>
                        <p class="detail__num" v-if="cartProductNum >0">{{0}}</p>
                    </div>
                </div>
                <div class="init__cart" v-show="!cartshow">
                    <div @click="cartselected">
                        <div><img src="/static/tabs/Shape.png" alt=""></div>
                        <p class="cartselected__indextext">个人中心</p>
                        <p class="detail__num" v-if="cartProductNum >0">{{0}}</p>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
</div>  
</template>
<script>
export default {
    props:['showlist'],
    data(){
        return{
            indexshow: this.showlist.indexshow,
            classifyshow: this.showlist.classifyshow,
            cartshow: this.showlist.cartshow,
            mineshow: this.showlist.mineshow,
        }
    },
    
    
    methods:{
        index(){
            wx.switchTab({
                url: '/pages/verb/main'
            })
        },
        indexselected(){

        },
        classify(){
            wx.switchTab({
                url: '/pages/record/main'
            })
        },
        classifyselected(){
            
        },
        cart(){
            wx.switchTab({
                url: '/pages/user/main'
            })
        },
        cartselected(){

        },
        mine(){
            wx.switchTab({
                url: '/pages/about/main'
            })
        },
        mineselected(){

        }
    }
}
</script>
<style>
.tabbar__common{
    position: fixed;
    bottom: 0px;
    height: 50px;
    width: 100%;
    background: #fff;
    z-index: 10001;
}
.tabbar__item{
    height: 50px;
    padding-top: 13rpx;
    background-color: #242725;
}
.init__index,.init__mine,.init__cart{
    position: relative;
}
.init__classify{
    margin-left: 0px;
    position: relative;
}
.init__index img,.init__mine img{
    width: 15px;
    height: 15px;
    padding-left: 110rpx;
}
.init__classify img{
    width: 15px;
    height: 15px;
    padding-left: 110rpx;
}
.init__cart img{
    width: 15px;
    height: 15px;
    padding-left: 110rpx;
}
.init__index p,.init__classify p,.init__cart p,.init__mine p{
    margin: 11rpx 0rpx 0rpx 69rpx;
    font-size: 28rpx;
    position: absolute;
    top: 29rpx;

    
}
.noselected__indextext{
   color: #fff;
}
.indexselected__indextext,.classifyselected__indextext,.cartselected__indextext,.mineselected__indextext{
    color:#fff;
}
.detail__num{
    width:40rpx;
    height: 40rpx;
    border-radius: 50%;
    background: #DC4F4F;
    position: absolute !important;
    top:-8rpx !important;
    right: 2rpx !important;
    font-size: 18rpx;
    color:#fff;
    text-align: center
}
.red{
    background-color: #F39E16;
}
</style>