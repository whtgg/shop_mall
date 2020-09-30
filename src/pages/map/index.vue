<template>
    <view>
        <map id="map" :longitude="longitude" :latitude="latitude" :markers="markers"  style="width: 100%; height:1200rpx;"></map>
    </view>
</template>
<script>
export default {
    data(){
        return {
            // 中心点纬度、经度
            latitude: "",
            longitude: "",
            // 标记点 当前位置
            markers: [], 
        }
    },
    onLoad: function (options) {
        // 获取当前位置
        var thisBlock = this;
        wx.getLocation({
            type: "wgs84",
            success: function(res) {
                thisBlock.latitude = res.latitude
                thisBlock.longitude = res.longitude
                thisBlock.markers = [{
                    id:0,
                    latitude: res.latitude,
                    longitude: res.longitude,
                    title:"当前位置",
                    label: {content:"上海"},
                    anchor:{}}]
            },
        })
  }
}
</script>

