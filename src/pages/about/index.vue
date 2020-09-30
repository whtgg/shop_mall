<template>
  <div class="about">
    <img src="/static/images/logo-2.png" class="header_image" />
    <!-- <p class="header-title"> 用 区 块 链 真 实 溯 源</p> -->
    <p class="phone">客服热线：189-9999-9999</p>
    <p class="email">客服邮箱：service@vonetracer.com</p>
    <p class="version">当前版本：{{version}}</p>
    <p @click="detail_about" class="version_explain">版本说明</p>
    <img src="/static/images/vlogo.png" class="buttom_image" />
    <p class="buttom">CopyRight @ 旺链 2019 - 2022</p>
  </div>
</template>
<script>
import {baseUrlApi} from "../../utils/api.js";
export default {
  data() {
    return {
      version:""
    };
  },
  onShow: function(option) {
    this.requestversion();
  },
  methods: {
    detail_about() {
      
      wx.navigateTo({
        url: "/pages/instructions/main"
      });
    },
    requestversion() {
       console.log("res.data");
       var that=this;
      wx.request({
        url: baseUrlApi + "/vtracecontent/version",
         method:"GET",
        success(res) {
          console.log(res.data.code)
          that.version=res.data.data;
        }
      });
    }
  }
};
</script>

<style>
.about {
  background: white;
}
.header_image {
  margin-left: 215rpx;
  margin-top: 162rpx;
  width: 320rpx;
  height: 110rpx;
}
.buttom_image {
  margin-left: 296rpx;
  margin-top: 204rpx;
  width: 160rpx;
  height: 49rpx;
}
.header-title {
  width: 100%;
  text-align: center;
  font-size: 28rpx;
  color: rgba(36, 39, 39, 1);
}
.phone {
  margin-top: 121rpx;
  width: 100%;
  text-align: center;
  font-size: 28rpx;
  color: rgba(36, 39, 39, 1);
}
.email,
.version {
  margin-top: 10rpx;
  width: 100%;
  text-align: center;
  font-size: 28rpx;
  color: rgba(36, 39, 39, 1);
}
.version_explain {
  margin-top: 129rpx;
  margin-left: 20rpx;
  width: 710rpx;
  height: 69rpx;
  background: rgba(243, 158, 22, 1);
  border-radius: 4rpx;
  text-align: center;
  padding-top: 19rpx;
  font-size: 36rpx;
  color: rgba(255, 255, 255, 1);
}
.buttom {
  margin-top: 10rpx;
  width: 100%;
  text-align: center;
  font-size: 24rpx;
  color: rgba(136, 136, 136, 1);
}
</style>