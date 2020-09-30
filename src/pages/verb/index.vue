<template>
  <div class="verb">
    <div class="verb-first">
      <div style="padding-right:50rpx;display:flex;flex-direction:row;">
        <span class="verb-title">批次/商品编号</span>
        <input @input="addreeedetailbindKey" v-model="addreeedetail" />
        <img src="/static/images/Shape.png" class="scan_image" @click="scanimage" />
      </div>
      <div class="first-tip">(商品编号仅用于扫描三级二维码)</div>
    </div>
    <div class="verb-second">
      <span class="verb-title">工作拍照</span>
      <img :src="imagepath" class="scan_image" @click="verbimage" />
    </div>
    <div class="verb-three">
      <span class="verb-header">*</span>
      <span class="verb-threetitle">工作说明</span>
      <div class="verb-content">
        <textarea
          @input="textareainput"
          v-model="desc"
          maxlength="50"
          class="textArea"
          placeholder="请简要输入工作说明，最多50字"
          placeholder-style="font-size:28rpx;color=#B4B4B4;"
        />
        <span class="wordwrap">{{number}}/{{maxNumber}}</span>
      </div>
    </div>
    <div class="verb-button">
      <span @click="cancelaction" class="cancel">取消</span>
      <button @click="sureaction" class="sure" :disabled="buttonisdisabled">确认 </button>
    </div>

    <v-tabbar :showlist="showlist"></v-tabbar>
  </div>
</template>

<script>
var QQMapWX = require("../../qqmap-wx-jssdk/qqmap-wx-jssdk.js");
import tabbar from "../../components/tabbar";
import {baseUrlApi} from "../../utils/api.js";

export default {
  components: {
    "v-tabbar": tabbar
  },

  onShow() {
    var a = wx.getStorageSync("username");
    console.log("username" + a);
    setTimeout(function() {
      wx.hideTabBar({});
    }, 10);
    
  },

  data() {
    return {
      showlist: {
        indexshow: false,
        classifyshow: true,
        cartshow: true
      },
      addreeedetail: "",
      address: "",
      addressstrring: "",
      maxNumber: 50,
      number: 0,
      imagepath: "/static/images/Group 4.png",
      latitude: "",
      longitude: "",
      desc: "",
      buttonisdisabled:false
    };
  },
  methods: {
    scanimage() {
      var that = this;
      wx.scanCode({
        onlyFromCamera: true,
        scanType: ["barCode", "qrCode"],
        success(res) {
          if(res.result.indexOf("pNo=") != -1) {
            that.addreeedetail = res.result.split("pNo=")[1]
          }else{
            that.addreeedetail = res.result
          }
        }
      });
    },
    verbimage() {
      var that = this;
      wx.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["camera"],
        success: res => {
          that.imagepath = res.tempFilePaths[0];
          console.log(that.imagepath);
        },
        fail: () => {
          wx.showToast({
            title: "拍照失败",
            icon: "warn",
            duration: 600
          });
        }
      });
    },
    addreeedetailbindKey: function(e) {
      // this.address = e.target.value;
      // this.addreeedetail = "";
    },
    textareainput: function(e) {
      //监听输入，实时改变已输入字数

      // let value = e.detail.value;//获取textarea的内容，
      // let len = value.length;//获取textarea的内容长度
      this.number = this.desc.length;
    },
    cancelaction() {
      var that = this;
      wx.showModal({
        content: "重置将删除当前已经输入的内容，确认要重置",
        success(res) {
          if (res.confirm) {
            console.log("用户点击确定");
            that.addreeedetail = "";
            that.desc = "";
            that.imagepath = "/static/images/Group.png";
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    },
    upImage(res){
      
      this.addressstrring = res.result.address;
            var that = this;  
              wx.uploadFile({
                url: baseUrlApi + "/vtraceprocessrecord",
                filePath: this.imagepath,
                name: "file",
                header: {
                  "Content-Type": "multipart/form-data",
                  Authorization: "Bearer " + wx.getStorageSync("access_token"),
                  ClientType: 5
                },
                formData: {
                  batchNo: this.addreeedetail,
                  roleId: wx.getStorageSync("roleId"),
                  work: this.desc,
                  address: this.addressstrring,
                  lng: this.longitude,
                  lat: this.latitude
                },
                success(res) {
                  console.log(res.data);
                  wx.hideLoading();
                  if (JSON.parse(res.data).code == 0) {
                   that.desc=""
                   that.imagepath = "/static/images/Group.png";
                    wx.switchTab({
                      url: "/pages/record/main"
                    });
                  } else {
                    
                    wx.showToast({
                      title: JSON.parse(res.data).msg,
                      icon: "none",
                      duration: 1800
                    });
                  }
                },
                fail() {
                  wx.hideLoading();
                  wx.showToast({ title: "接口请求失败", icon: "none", duration: 1200 });
                },
                
              });

    },
    heartReport(){
      console.log("setTimeout")
      this.buttonisdisabled=false;

    },
    sureaction() {
      this.buttonisdisabled=true;
      setTimeout(function () {
        
        that.heartReport();
      
    }, 3000);
      var that = this;
      var roleId = wx.getStorageSync("roleId");
      console.log("that.desc"+that.desc)
      if (that.desc.length == 0) {
        wx.showToast({ title: "请输入工作说明", icon: "none", duration: 600 });
        return;
      }
      wx.showLoading({
                title: "玩命加载中"
              });
      wx.getLocation({
        type: "gcj02",
        altitude: true,
        isHighAccuracy: "true",
        highAccuracyExpireTime: 3000,
        success(res) {
          that.latitude = res.latitude;
          that.longitude = res.longitude;
          console.log("that.latitude+" + that.latitude);
          console.log(that.longitude);
          var qqmapsdk = new QQMapWX({
            key: "MHFBZ-VNVK6-GIFSJ-MU23E-CYEIH-COF5K" // 必填
          });
          qqmapsdk.reverseGeocoder({
            location: {
              latitude: that.latitude,
              longitude: that.longitude
            },
            get_poi: 1,
            success: function(res) {
              
              that.upImage(res);
              
            },
            fail: function(error){
              wx.hideLoading();

          wx.showToast({ title: error, icon: "none", duration: 2000 });

          return;
        }
          });
        },
        fail() {
          wx.hideLoading();

          wx.showToast({ title: "获取位置失败", icon: "none", duration: 2000 });

          return;
        }
      });
    }
  }
};
</script>

<style>
.verb {
  background: white;
}
.first {
  width: 100%;
  height: 142rpx;
}
.verb-title {
  height: 40rpx;
font-size: 28rpx;
color: rgba(36, 39, 37, 1);
float: left;
margin-left: 46rpx;
margin-top: 42rpx;

}
.verb-header {
 height: 40rpx;
font-size: 28rpx;
color: red;
float: left;
margin-left: 30rpx;
margin-top: 42rpx;

}
.verb-threetitle {
  height: 40rpx;
font-size: 28rpx;
color: rgba(36, 39, 37, 1);
float: left;
margin-left: 6rpx;
margin-top: 42rpx;

}

.verb-first {
  padding-right:20rpx;
  display:flex;
  flex-direction: column;
}

.verb-first .verb-title {
  width:180rpx;
}

.verb-first .first-tip {
  padding-left:230rpx;
  height:40rpx;
  line-height:40rpx;
  color:rgba(180, 180, 180, 1);
  font-size:28rpx;
}

.verb-first input {
  height: 80rpx;
  border-radius: 4rpx;
  border: 2rpx solid rgba(204, 204, 204, 1);
  margin-left: 15rpx;
  margin-top: 22rpx;
  flex:1;
}
.verb-first img {
  width: 80rpx;
  height: 80rpx;
  margin-left: 24rpx;
  margin-top: 21rpx;
}
.verb-second {
  width: 100%;
  height: 435rpx;
}
.verb-second img {
  float: left;
width: 658rpx;
height: 375rpx;
border-radius: 4rpx;
margin: 0rpx 46rpx;
margin-top: 20rpx;

}
.verb-content {
  float: left;
width: 658rpx;
height: 183rpx;
border-radius: 4rpx;
border: 2rpx solid rgba(204, 204, 204, 1);
margin-left: 46rpx;
margin-top: 20rpx;

}
.textArea {
  margin-left: 20rpx;
  margin-top: 20rpx;

  height: 143rpx;
  width: 510rpx;
  font-size: 28rpx;
}

.wordwrap {
  position: relative;
  right: 20rpx;
  float: right;
  top: -30rpx;
  font-size: 28rpx;
  color: rgba(180, 180, 180, 1);
}
.cancel {
  float: left;
width: 268rpx;
height: 66rpx;
border-radius: 4rpx;
border: 2rpx solid rgba(36, 39, 37, 1);
margin-left: 80rpx;
margin-top: 60rpx;
font-size: 36rpx;
color: rgba(36, 39, 37, 1);
padding-top: 19rpx;
text-align: center;

}
.sure {
  float: left;
width: 268rpx;
height: 89rpx;
margin-left: 54rpx;
margin-top: 60rpx;
font-size: 36rpx;
color: rgba(255, 255, 255, 1);
text-align: center;
background: rgba(243, 158, 22, 1);

}
</style>