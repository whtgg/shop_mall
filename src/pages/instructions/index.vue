<template>
  <div class="instructions">
     <div class="all__content__instructions" v-for="(item,index) in list" :key="index">
       <span class="version">{{item.title}}</span><span class="time">{{item.createTime}}</span>
       <div class="content" v-html="item.content"> </div>


      </div>
  </div>
  
</template>

<script>
import {baseUrlApi} from "../../utils/api.js";
export default {
  

  data() {
    return {
     list: [
       
     ]
    };
  },
  onShow: function(option) {
    this.requestdetail();
  },
  methods: {
    requestdetail() {
      var that=this;
      wx.request({
        url: baseUrlApi + "/vtracecontent/version/page",
         method:"GET",
         data: {
          desc: "create_time",
    
         },
        success(res) {
          for(let i=0;i<res.data.data.records.length;i++){
            res.data.data.records[i].createTime=res.data.data.records[i].createTime.substr(0,10)
          }
          that.list=res.data.data.records;
        }
      });
    }
  },
  
  
};
</script>

<style>
.instructions {
  background:rgba(242,242,242,1);
}
.all__content__instructions{
  background:white;
  margin-bottom: 20rpx;
  padding: 40rpx 20rpx 0rpx 20rpx;

}
.version{
  font-size:32rpx;
  color:rgba(36,39,39,1);
}
.time{
  margin-left: 420rpx;
  margin-top: 50rpx;
  font-size:28rpx;
  color:rgba(36,39,39,1);
}
.content{
  margin: 20rpx;
  word-wrap: break-word;
  font-size:28rpx;
  color:rgba(102,102,102,1);
  
}
</style>