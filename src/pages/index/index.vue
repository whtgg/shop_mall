<template>
  <div class="login">
    <div class="login-header">
      <img src="/static/images/logo.png" class="header_image" />
      <p class="header-title">用 区 块 链 真 实 溯 源</p>
    </div>
    <div class="content">
      <img class="usernameimage" src="/static/images/use.png" />
      <input
        class="usernameinput"
        @input="bindinputusename"
        @blur="usenamebindblur"
        placeholder-class="place-holder"
        type="number"
        placeholder="用户名"
        adjust-position="true"
      />
      <div class="line"></div>
      <img class="passwordimage" src="/static/images/lock.png" />
      <input
        class="passwordinput"
        @input="bindinput1"
        placeholder-class="place-holder"
        type="text"
        placeholder="密码"
        adjust-position="true"
        v-if="pwdType"
        v-model="eyetxt"
      />
      <input
        class="passwordinput"
        @input="bindinput2"
        placeholder-class="place-holder"
        type="password"
        placeholder="密码"
        adjust-position="true"
        v-model="eyetxt"
        v-else
      />
      <switch
        class="passwordshow"
        checked="switch1Checked"
        @change="switch1Change"
        style="zoom:.7;"
      />
      <div class="secline"></div>
      <img class="passwordimage" src="/static/images/user.png" />
      <picker @change="bindPickerChange" :value="0" :range="array">{{selectstrring}}</picker>
      <span class="jiantou">></span>
      <div class="secline"></div>
      <switch
        class="isloginimage"
        type="checkbox"
        checked="switch2Checked"
        @change="switch2Change"
        style="zoom:.7;"
      />
      <span class="isloginspan">记住登录状态</span>
      <button open-type="getUserInfo" @getuserinfo="getuserinfo">登录</button>
    </div>
  </div>
</template>

<script>
import Utils from "../../utils/utils.js";
import {baseUrlApi,baseUrlApiNot} from "../../utils/api.js";
export default {
  components: {},

  data() {
    return {
      title: "",
      switch1Checked: true,
      switch2Checked: true,
      array: [],
      dataarray: [],
      selectstrring: "选择角色",
      selectnumber: 0,
      pwdType: false, //此时文本框隐藏，显示密码框
      eyetxt: "",
      code: "",
      usename: "",
      avatarUrl: ""
    };
  },
  onLoad() {
    this.password=""
    this.usename=""
   
    let islogin = wx.getStorageSync("islogin");
    
    if (islogin) {
      wx.switchTab({
        url: "/pages/verb/main"
      });
    }
  },
  
  methods: {
    switch1Change(e) {
      
      if (e.target.value) {
        this.pwdType = false;
      } else {
        this.pwdType = true;
      }
    },
    switch2Change(e) {
      
      this.switch2Checked = e.target.value;
    },
    bindPickerChange(e) {
      
      this.selectstrring = this.array[e.target.value];
      this.selectnumber = e.target.value;
    },
    bindinputusename(e) {

      this.usename = e.target.value;
    },
    usenamebindblur(e) {
      var that = this;
      this.array = [];
      this.dataarray = [];
      this.selectstrring = "选择角色";
      this.selectnumber = 0;
      var url = 
        baseUrlApi + "/vtraceprocessrole/roleNames/byphone/" +
        e.mp.detail.value;
      wx.request({
        url: url,
        method: "GET",
        success(res) {
          let data = [];
          if(res.data.data.length==0){
            wx.showToast({
                title:"账号未绑定角色",
                duration:2000,
                icon:"none"
            })
            return;

          }
          that.dataarray = res.data.data;
          for (let i = 0; i < res.data.data.length; i++) {
            data.push(res.data.data[i].name);
          }
          that.array = data;
        }
      });
    },
    bindinput1(e) {
      this.eyetxt = e.target.value;
    },
    bindinput2(e) {
      this.eyetxt = e.target.value;
    },
    savetoken(){
      var url =
        baseUrlApi + "/vtraceprocessuser/savetoken";
      wx.request({
        url: url,
        method: "GET",
        header: {
          "Authorization": "Bearer " + wx.getStorageSync("access_token"),
        },
        success(res) {
          if(res.data.data){
             wx.switchTab({
                   url: "/pages/verb/main"
              });
           

          }else{
            wx.showToast({
                              title: res.data.msg,
                              icon: "none",
                              duration: 1600
                            });

          }
          
        }
      });

    },
    getuserinfo(e) {
      var timestamp = new Date().getTime();
      console.log("dsffdsfdsf===" +  this.usename);
      console.log("timestamp===" +  timestamp);
      if(this.usename.length==0){
        wx.showToast({
                        title: "请输入账号",
                        icon: "none",
                        duration: 600
                      });
                      return

      }
      if(this.eyetxt.length==0){
        wx.showToast({
                        title: "请输入密码",
                        icon: "none",
                        duration: 600
                      });
                      return

      }
      if(this.selectstrring=="选择角色"||this.selectstrring==undefined){
        wx.showToast({
                        title: "请选择角色",
                        icon: "none",
                        duration: 600
                      });
                      return

      }
      
      var a = Utils.encrypt(this.eyetxt, "thanks,vtrace123");
      var passwordStr = encodeURIComponent(a);
      let that = this;
      // 获取用户信息
      wx.getSetting({
        success(res) {
          if (res.authSetting["scope.userInfo"]) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success(res) {
                console.log(res);
                that.avatarUrl = res.userInfo.avatarUrl;
                wx.login({
                  success(res) {
                    if (res.code) {
                      console.log("res.code" + res.code);
                      
                      wx.showLoading({
            title: '玩命加载中',
        })
                      //发起网络请求
                      wx.request({
                        url:
                          baseUrlApiNot + "auth/oauth/token?grant_type=password&scope=server&password=" +
                          passwordStr +
                          "&username=" +
                          that.usename +
                          "&js_code=" +
                          res.code,
                        method: "POST",
                        data: {},
                        header: {
                          ClientType: "5", // 默认值
                          Authorization:
                            "Basic dnRyYWNld3hhcHA6dnRyYWNld3hhcHA=",
                          isToken: "false"
                        },

                        success(res) {
                          console.log(res.statusCode);
                          wx.hideLoading();
                          if (res.statusCode == 200) {
                            
                            wx.setStorageSync("username", that.usename);
                            wx.setStorageSync(
                              "access_token",
                              res.data.access_token
                            );
                            wx.setStorageSync("avatarUrl", that.avatarUrl);
                            wx.setStorageSync(
                              "roleId",
                              that.dataarray[that.selectnumber].id
                            );
                            wx.setStorageSync(
                              "name",
                              that.dataarray[that.selectnumber].name
                            );
                            if (that.switch2Checked) {
                              wx.setStorageSync("islogin", true);
                            } else {
                              wx.setStorageSync("islogin", false);
                            }
                            that.eyetxt="";

                            that.savetoken();

                      

                           
                          } else {
                            
                            wx.showToast({
                              title: res.data.msg,
                              icon: "none",
                              duration: 1600
                            });
                          }
                        },
                        


                      });
                      
                    } else {
                      wx.hideLoading();
                      wx.showToast({
                        title: "登录失败",
                        icon: "none",
                        duration: 1600
                      });
                    }
                  }
                });
              },
              fail(res) {
                wx.hideLoading();
                wx.showToast({
                  title: "获取用户信息失败",
                  icon: "none",
                  duration: 1600
                });
                return;
              }
            });
          } else {
            wx.hideLoading();
            wx.showToast({ title: "未授权", icon: "none", duration: 1600 });
            return;
          }
        }
      });
     
    }
  }
};
</script>

<style>
.login {
  background: white;
}
.login-header {
  height: 455rpx;
  background-color: #242725;
}
.header_image {
  margin: 109rpx 0rpx 0rpx 215rpx;
  height: 59rpx;
  width: 320rpx;
}
.header-title {
  width: 100%;
  text-align: center;
  font-size: 28rpx;
  color: white;
}
.content {
  position: relative;
  top: -142rpx;
  height: 690rpx;
  border-radius: 4rpx;
  border: 2rpx solid #00000017;
  background: #fff;
  width: 710rpx;
  left: 20rpx;
}
.usernameimage {
  float: left;
  width: 23rpx;
  height: 32rpx;
  margin-left: 66rpx;
  margin-top: 82rpx;
}
.passwordimage {
  float: left;
  width: 25rpx;
  height: 30rpx;
  margin-left: 65rpx;
  margin-top: 68rpx;
}
.usernameinput {
  float: left;
  height: 40rpx;
  margin-left: 20rpx;
  margin-top: 78rpx;
  font-size: 28rpx;
  color: #242725;
  width: 500rpx;
}
.passwordinput {
  float: left;
  height: 40rpx;
  margin-left: 20rpx;
  font-size: 28rpx;
  color: #242725;
  margin-top: 63rpx;
  width: 440rpx;
}
.place-holder {
  color: #888888;

  font-size: 14px;
}
.line {
  margin: 142rpx 65rpx 0rpx 65rpx;
  height: 1rpx;
  background-color: #cccccc;
  clear: both;

}
.secline {
  margin: 127rpx 65rpx 0rpx 65rpx;
  height: 2rpx;
  background-color: #cccccc;
}
.content picker {
  float: left;
  height: 40rpx;
  margin-left: 20rpx;
  font-size: 28rpx;
  color: rgba(136, 136, 136, 1);
  margin-top: 63rpx;
  width: 480rpx;
}
.jiantou {
  font-size: 32rpx;
  color: rgba(136, 136, 136, 1);
  float: left;
  margin-top: 56rpx;
}
.isloginimage {
  width: 28rpx;
  height: 28rpx;
  margin-left: 86rpx;
  margin-top: 48rpx;
  float: left;
}
.isloginspan {
  height: 40rpx;
  font-size: 28rpx;
  color: rgba(136, 136, 136, 1);
  line-height: 40rpx;
  padding-left: 20rpx;
  padding-top: 33rpx;
  float: left;
  padding-bottom: 45rpx;
}
.content button {
  width: 580rpx;
  height: 88rpx;
  background: rgba(243, 158, 22, 1);
  border-radius: 4rpx;
  margin-top: 45rpx;
  font-size: 36rpx;
  color: rgba(255, 255, 255, 1);
}
.passwordshow {
  float: left;
  color: #f39e16 !important;
  margin-top: 84rpx;
  height: 20rpx !important;
}
</style>