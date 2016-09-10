// 获取模版
var livelistHtml = $.trim($('#j-livelist script').html()),
  livelistTpl = juicer(livelistHtml);
$('#j-livelist script').remove();

// 获取现场列表
var liveListPage = 0,
  liveListLoad = true;
function loadLiveList(){
  if (!liveListLoad) {
    return false;
  }
  liveListPage ++;
  liveListLoad = false;
  $('#j-loadmore span').html('正在加载数据...');
  liveCmd.ajax('http://10.0.0.47:8080/live-web-reporter/live/getListByCompany.json', {companyid: 123, page: liveListPage}, function(state, res){
    if (state) {
      var ulObj = $('<ul></ul>');
      ulObj.html(livelistTpl.render(res));
      // 图片居中
      liveCmd.centerimg(ulObj.find('.j-centerimg'));
      // 绝对单击
      ulObj.find('li').each(function(){
        var id = $(this).data('id');
        liveCmd.tap($(this), function(){
          location.href = 'now.html?id=' + id;
        });
      });
      // 插入列表
      $('#j-livelist').append(ulObj);
    } else {
      liveCmd.alert('网络请求失败，请检查网络连接状态！')
      liveListPage --;
    }
    liveListLoad = true;
    $('#j-loadmore span').html('点击加载更多');
  });
}

// 点击加载更多
$('#j-loadmore span').on(tap, function(){
  loadLiveList();
});
loadLiveList();

