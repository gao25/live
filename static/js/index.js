// 获取模版
var livelistHtml = $('#j-livelist script').html(),
  livelistTpl = juicer(livelistHtml);
$('#j-livelist script').remove();

// 获取现场列表
var companyId = 0,
  liveListPage = 0,
  liveListLoad = true;
if (liveCmd['urlParams']['companyId'] && !isNaN(liveCmd['urlParams']['companyId'])) {
  companyId = liveCmd['urlParams']['companyId'];
}
function loadLiveList(){
  if (!liveListLoad) {
    return false;
  }
  liveListPage ++;
  liveListLoad = false;
  $('#j-loadmore span').html('正在加载数据...');
  liveCmd.ajax(getListApi, {companyId: companyId, page: liveListPage}, function(state, res){
    if (state) {
      if (res['status'] == 0) {
        var resData = res['data'];
        if (resData.length) {
          var ulObj = $('<ul></ul>');
          ulObj.html(livelistTpl.render(res));
          // 绝对单击
          ulObj.find('li').each(function(){
            var id = $(this).data('id');
            liveCmd.tap($(this), function(){
              location.href = 'now.html?id=' + id;
            });
          });
          // 插入列表
          $('#j-livelist').append(ulObj);
          // 图片居中
          liveCmd.centerimg(ulObj.find('.j-centerimg'));
        } else {
          $('#j-loadmore').remove();
        }
      } else {
        liveCmd.alert(res['errMsg'])
        liveListPage --;
      }
    } else {
      liveCmd.alert('网络请求失败，请检查网络连接状态！');
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

