<template>
    <div class="comp-navbar">
        <!-- 占位栏 -->
        <cover-view class="placeholder-bar" :style="{height: navBarHeight + 'px'}"> </cover-view>
        <!-- 导航栏主体 -->
        <cover-view class="navbar" :style="{height: navBarHeight + 'px',backgroundColor:navBackgroundColor}">
            <!-- 状态栏 -->
            <cover-view class="nav-statusbar" :style="{height: statusBarHeight + 'px'}"></cover-view>
            <!-- 标题栏 -->
            <cover-view class="nav-titlebar" :style="{height: titleBarHeight + 'px' }">
                <!-- home及后退键 -->
                <cover-view class="bar-options">
                    <cover-view v-if="backVisible" class="opt opt-back" @click="backClick()">
                        <cover-image class="back-image" :src="avatar" mode="scaleToFill"></cover-image>
                    </cover-view>
                </cover-view>
                 <cover-view class="work">{{work}}</cover-view>
                <!-- 标题 -->
                <cover-view class="bar-title" :style="[{color:titleColor}]">{{title}}</cover-view>
            </cover-view>
        </cover-view>
    </div>
</template>

<script>
export default {
    props: {
        // 导航栏背景色
        navBackgroundColor: {
            default: "#ffffff"
        },
        // 标题颜色
        titleColor: {
            default: "#000000"
        },
        //标题文字
        title: {
            required: false,
            default: "大世界"
        },
        // 是否显示后退按钮
        backVisible: {
            required: false,
            default: false
        },
        // home按钮的路径
        homePath: {
            required: false,
            default: ""
        }
    },
    data() {
        return {
            statusBarHeight: "", // 状态栏高度
            titleBarHeight: "", // 标题栏高度
            navBarHeight: "", // 导航栏总高度
            platform: "",
            model: "",
            brand: "",
            system: "",
            work:"种植",
            avatar:"",
            avatar1:"https://vtracer-prod.oss-cn-hangzhou.aliyuncs.com/vtrace-161/561337fad2e749879f896e3d6830d698.jpg?Expires=4730509851&OSSAccessKeyId=LTAI4Fw7gbJ1VDAmTUM2AYzn&Signature=Oq7DdT0mY3CWxDWnCQ01Dv7VmEA%3D",
        };
    },
    beforeMount() {
        const self = this;
        wx.getSystemInfo({
            success(system) {
                self.statusBarHeight = system.statusBarHeight
                self.platform = system.platform
                self.model = system.model
                self.brand = system.brand
                self.system = system.system
                let platformReg = /ios/i
                if (platformReg.test(system.platform)) {
                    self.titleBarHeight = 44
                } else {
                    self.titleBarHeight = 48
                }
                self.navBarHeight = self.statusBarHeight + self.titleBarHeight
            }
        });
    },
    created:function(){
        this.avatar = wx.getStorageSync("avatarUrl")
        this.work = wx.getStorageSync("name")
    },
    onShow:function(){
        this.work = wx.getStorageSync("name")
    },
    mounted() {
        if(this.avatar < 11){
            this.avatar = this.avatar1
        }
    },
    methods: {
        backClick() {
            if (getCurrentPages().length == 1) {
                wx.redirectTo({
                    url: this.homePath
                });
            } else {
                wx.navigateBack({
                    delta: 1
                });
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.comp-navbar {
    width: 100vw;
    .navbar {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        .nav-titlebar {
            // border: 1px solid green;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            .bar-options {
            // width: 87px;
            // height: 30px;
                width: 80rpx;
                height: 80rpx;
                display: flex;
                // border: 1px solid hsla(0, 0%, 100%, .25);
                border: 1px solid #ededed;
                box-sizing: border-box;
                align-items: center;
                justify-content: space-around;
                position: absolute;
                left: 10px;
                display: flex;
                align-items: center;
                background: hsla(0, 0%, 100%, 0.6);
                border-radius: 27px;
                padding-right: 5rpx;
                .back-image{
                    width:80rpx;
                    height:80rpx;
                }
            }
            .work{
                color:#fff;
                position: absolute;
                left:120rpx;
            }
            .bar-title {
                width: 45%;
                font-size: 15px;
                font-weight: bold;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                text-align: center;
            }
        }
    }
    .placeholder-bar{
        background-color: transparent;
        width: 100%;
    }
}
</style>