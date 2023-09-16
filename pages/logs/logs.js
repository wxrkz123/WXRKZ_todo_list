var util = require('../../utils/util.js'); // 引入util.js文件
var wxCharts = require('../../utils/wxcharts.js'); // 引入wxcharts.js文件
var app = getApp(); // 获取小程序实例
var ringChart = null; // 环形图实例
var lognum=0; // 日志数量
var worknum=0; // 工作数量
var restnum=0; // 休息数量

Page({
  data: {
    logs: [], // 日志数组
    lognum:'', // 日志数量（空字符串）
    modalHidden: true, // modal是否隐藏
    toastHidden: true, // toast是否隐藏
  },

  onShow: function() {
    wx.setNavigationBarTitle({
      title: '任务记录' // 设置页面标题
    });
    var logs = this.getLogs(); // 获取日志数据

    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync(); // 获取系统信息
      windowWidth = res.windowWidth; // 获取窗口宽度
    } catch (e) {
      console.error('getSystemInfoSync failed!'); // 获取系统信息失败时输出错误信息
    }

    // 绘制环形图
    ringChart = new wxCharts({
      animation: true, // 是否开启动画
      canvasId: 'ringCanvas', // 画布的ID
      type: 'ring', // 图表类型为环形图
      extra: {
        ringWidth: 20, // 环形宽度
        pie: {
          offsetAngle: -45 // 偏移角度
        }
      },
      title: {      
        name: lognum/2, // 环形图标题，此处为日志数量的一半
        color: '#7cb5ec', // 标题颜色
        fontSize: 25 // 标题字体大小
      },
      subtitle: {
        name: '专注次数', // 子标题内容
        color: '#666666', // 子标题颜色
        fontSize: 12 // 子标题字体大小
      },
      series: [{
        name: 'work', // 工作类型名称
        data: worknum/2, // 工作数量的一半
        stroke: true, // 是否显示边框
        color: '#3596f1' // 图表颜色
      }, {
        name: 'rest', // 休息类型名称
        data: restnum/2, // 休息数量的一半
        stroke: false, // 是否显示边框
        color:'#0fc975' // 图表颜色
      }],
      disablePieStroke: true, // 禁止饼状图的边框
      width: windowWidth*0.96, // 图表宽度
      height:170, // 图表高度
      dataLabel: false, // 不显示数据标签
      legend: false, // 不显示图例
      background: '#f5f5f5', // 图表背景色
      padding: 0, // 图表内边距设置为0
    });
    ringChart.addEventListener('renderComplete', () => {
      console.log('绘图完成'); // 图表绘制完成时输出信息
    });
    setTimeout(() => {
      ringChart.stopAnimation(); // 延迟500毫秒后停止图表动画
    }, 500);
  },

  set: function() {
    // 假设我们需要设置日志数量
    this.setData({
      lognum: this.data.logs.length
    });
  },
  

  getLogs: function() {
    let logs = wx.getStorageSync('logs'); // 从缓存中获取日志数据
    worknum=0; // 工作数量重置为0
    restnum=0; // 休息数量重置为0
    lognum=0; // 日志数量重置为0
    logs.forEach(function(item, index, arry) {
      item.startTime = new Date(item.startTime).toLocaleString(); // 将日志中的开始时间转换为格式化的字符串
      lognum++; // 日志数量增加
      if (item.type == 'work') { // 如果日志类型为工作
        worknum++; // 工作数量增加
      }
      if (item.type == 'rest') { // 如果日志类型为休息
        restnum++; // 休息数量增加
      }
    });
    this.setData({
      logs: logs // 更新页面中的日志数据
    });
    // 更新环形图数据
  if(ringChart) {
    ringChart.updateData({
      title: {
        name: lognum/2 // 更新环形图标题
      },
      series: [{
        name: 'work',
        data: worknum/2 // 更新工作数量
      }, {
        name: 'rest',
        data: restnum/2 // 更新休息数量
      }]
    });
  }
},

onLoad: function() {
  // 在页面加载时获取日志数据
  this.getLogs();
},

  switchModal: function() {
    this.setData({
      modalHidden: !this.data.modalHidden // 切换modal的显示状态
    });
    lognum=0; // 日志数量重置为0
    worknum=0; // 工作数量重置为0
    restnum=0; // 休息数量重置为0
  },

  hideToast: function() {
    this.setData({
      toastHidden: true // 隐藏toast提示
    });
  },

  clearLog: function(e) {
    wx.setStorageSync('logs', []); // 清空日志缓存
    this.switchModal(); // 切换modal的显示状态
    this.setData({
      toastHidden: false // 显示toast提示
    });
    this.getLogs(); // 获取日志数据
    wx.vibrateShort(); // 手机短暂震动
  },


  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target);
      return {
        title: '管理时间，保持专注！让自律成为习惯！', // 分享标题
        path: '/pages/index/index', // 分享路径
        imageUrl: '/image/share.jpg' // 分享图像，如果不设置则默认为当前页面的截图
      };
    }
  },

  onShareTimeline: function (res) {
    return {
      title: '管理时间，保持专注，让自律成为习惯！', // 分享标题
      query: {
        // key: 'value' // 要携带的参数
      },
      imageUrl: '/image/about.png' // 分享图像
    };
  }
});
