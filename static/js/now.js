var id = 0;
if (liveCmd['urlParams']['id'] && !isNaN(liveCmd['urlParams']['id'])) {
  id = liveCmd['urlParams']['id'];
}

// 显示直播
var liveinfoTpl = juicer($('#j-liveinfo script').html());
$('#j-liveinfo script').remove();
liveCmd.ajax(getInfoApi, {id: id}, function(state, res){
  if (state) {
    if (res['status'] == 0) {
      $('#j-liveinfo').html(liveinfoTpl.render(res));
      // 图片居中
      liveCmd.centerimg($('#j-liveinfo .player'));
    } else {
      liveCmd.alert(res['errMsg']);
    }
  } else {
    liveCmd.alert('网络请求失败，请检查网络连接状态！')
  }
});

// 获取报道列表
var newsListTpl = juicer($('#j-newslist script').html()),
  newsListPage = 0,
  newsListLoad = true;
$('#j-newslist script').remove();
function loadNewsList(){
  if (!newsListLoad) {
    return false;
  }
  newsListPage ++;
  newsListLoad = false;
  $('#j-loadmore').html('正在加载数据...');
  liveCmd.ajax(getByIdApi, {id: id, page: newsListPage}, function(state, res){
    if (state) {
      if (res['status'] == 0) {
        var resData = res['data'];
        if (resData.length) {
          var ulObj = $('<ul></ul>');
          ulObj.html(newsListTpl.render(res));
          // 插入列表
          $('#j-newslist').append(ulObj);
          // 插入图片
          ulObj.find('.j-pictures').each(function(){
            var _this = $(this),
              imgArray = $(this).data('pictures').split(',');
            if (imgArray.length > 1) {
              $(this).addClass('imgwrap2');
            } else {
              $(this).addClass('imgwrap');
            }
            $.each(imgArray, function(index){
              var spanImg = $('<span data-img="'+this+'"></span>');
              _this.append(spanImg);
              spanImg.on(tap, function(){
                liveCmd.viewimg(imgArray, index);
              });
            });
          });
          liveCmd.centerimg(ulObj.find('.j-pictures span'));
          // 显示互动栏
          ulObj.find('.j-downact').on(tap, function(){
            $(this).parent().find('.actlayer').toggle();
            $(this).parent().find('.actlayer').on(tap, function(){
              $(this).hide();
            });
          });
        } else {
          $('#j-loadmore').remove();
        }
      } else {
        liveCmd.alert(res['errMsg'])
        newsListPage --;
      }
    } else {
      liveCmd.alert('网络请求失败，请检查网络连接状态！');
      newsListPage --;
    }
    newsListLoad = true;
    $('#j-loadmore').html('点击加载更多');
  });
}

// 点击加载更多
$('#j-loadmore').on(tap, function(){
  loadNewsList();
});
loadNewsList();

// 关闭图片浏览
$('#j-fullview').on(touchmove, function(){
  return false;
});
$('#j-viewpic').on(tap, function(){
  return false;
});
$('#j-fullview').on(tap, function(){
  $('#j-fullview').css('display', 'none');
});





