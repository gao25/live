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
          // 绑定音频
          ulObj.find('.j-audiobtn').on(tap, function(){
            var playSrc = $(this).data('audio');
            if ($('#j-audioplay').data('audio') == playSrc) {
              if (audioplayer.paused) {
                audioplayer.play();
              } else {
                audioplayer.pause();
              }
            } else {
              $('#j-audioplay').data('audio', playSrc);
              if (!window.audioplayer) {
                window.audioplayer = new Audio();
                $('#j-audioplay').append(audioplayer);
              }
              audioplayer.src = playSrc;
              audioplayer.play();
              var durationObj = $(this).find('.text');
              setTimeout(function(){
                console.log(audioplayer.duration);
                durationObj.html(Math.floor(audioplayer.duration) + '&quot;');
              }, 500);
            }
          });
          // 显示互动栏
          ulObj.find('.j-downact').on(tap, function(){
            $(this).parent().find('.j-actlayer').toggle();
            $(this).parent().find('.j-actlayer').on(tap, function(){
              $(this).hide();
            });
          });
          // 绑定互动
          ulObj.find('.j-actzan').on(tap, function(){
            console.log('zan');
          });
          ulObj.find('.j-actping').on(tap, function(){
            openRemark();
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

// 关闭操作弹出
$('.fn-contain').on('touchmove', function(){
  $('.j-actlayer').hide();
});

// 处理评论错位问题
function openRemark(){
  $('#j-screen').addClass('j-hasremark');
  var scrollTop = $(window).scrollTop();
  $('#j-screen').css({
    'position': 'relative',
    'margin-top': -scrollTop,
    'overflow': 'hidden'
  });
  $(window).scrollTop(0);
  $('#j-screen').height($(window).height()-$('#j-remark').height()+scrollTop);
  setTimeout(function(){
    $('#j-remark').css('display', 'block');
  }, 100);
}
// 评论关闭
function closeRemark(){
  $('#j-screen').removeClass('j-hasremark');
  $('#j-remark input[name=content]').blur();
  $('#j-remark').css('display', 'none');
  var scrollTop = $('#j-screen').css('margin-top').replace('px', '') * -1;
  $('#j-screen').css({
    'position': 'static',
    'margin-top': 0
  });
  $('#j-screen').height('auto');
  $(window).scrollTop(scrollTop);
}
$('#j-screen').on(touchstart, function(){
  if ($(this).hasClass('j-hasremark')) {
    closeRemark();
  }
});
// 提交评论
$('#j-remarkform').submit(function(){
  var content = $.trim($(this).find('input[name=content]').val());
  if (content) {
    /*
    liveCmd.ajax(getInfoApi, {id: id}, function(state, res){
      if (state) {
        if (res['status'] == 0) {
          closeRemark();
        } else {
          liveCmd.alert(res['errMsg']);
        }
      } else {
        liveCmd.alert('网络请求失败，请检查网络连接状态！')
      }
    });
    */
  }
  return false;
});


