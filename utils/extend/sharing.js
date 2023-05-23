const App = getApp().globalData;
/**
 * 拼团扩展类
 */

module.exports = {
  /**
   * 获取拼团设置
   */
  getSetting(callback) {
    getApp().globalData._get('sharing.setting/getAll', {}, function (result) {
      callback(result.data.setting);
    });
  }

};