//app.js
const defaultTime = {
  defaultWorkTime: 30,
  defaultRestTime: 5
}


App({
  onLaunch: function() {
    let workTime = wx.getStorageSync('workTime')
    let restTime = wx.getStorageSync('restTime')
    
    if (!workTime) {
      wx.setStorage({
        key: 'workTime',
        data: defaultTime.defaultWorkTime
      })
    }
    if (!restTime) {
      wx.setStorage({
        key: 'restTime',
        data: defaultTime.defaultRestTime
      })
    }
  },
  "lazyCodeLoading": "requiredComponents"
  // viblong: function(){

  //   var vibison = wx.getStorageSync('vibison')
  //   console.log(vibison)
  // }
})
