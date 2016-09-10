var liveCmd = {};
// 弹出提示框
liveCmd['alert'] = function(msg){
  if ($('#j-livealert').length == 0) {
    var alertObj = $('<div id="j-livealert" style="position:fixed;left:0;right:0;top:50%;"><p style="margin:auto;width:7rem;padding:0.5rem;background-color:rgba(0,0,0,0.5);color:#fff;border-radius:0.2rem;"></p></div>');
    $('body').append(alertObj);
  } else {
    var alertObj = $('#j-livealert');
  }
  alertObj.find('p').html(msg)
  alertObj.css('display', 'block');
  alertObj.css('margin-top', - alertObj.height / 2);
  var alertTime = setTimeout(function(){
    alertObj.css('display', 'none');
  }, 2000);
  alertObj.find('p').on(tap, function(){
    alertObj.css('display', 'none');
    clearTimeout(alertTime);
  });
};
// 绝对单击
liveCmd['tap'] = function(obj, callback) {
  var _ready = true;
  obj.on(touchstart, function(){
    _ready = true;
  });
  obj.on(touchmove, function(){
    _ready = false;
  });
  obj.on(tap, function(){
    if (_ready) {
      callback();
    }
  });
};
// ajax请求
liveCmd['ajax'] = function(url, data, callback) {
  $.ajax({
    type: "post",
    dataType: "json",
    url: url,
    data: data,
    success: function(res){
      callback(true, res);
    },
    error: function(err){
      callback(false, err);
    }
  });
};
// 图片居中
liveCmd['centerimg'] = function(objs){
  function setImgSize(wrapObj, newImg){
    var wrapWidth = wrapObj.width(),
      wrapHeight = wrapObj.height();
    if (wrapWidth / wrapHeight >= newImg.width / newImg.height) {
      // 高度超出或持平
      var setImgHeight = wrapWidth * newImg.height / newImg.width,
        setTop = (setImgHeight - wrapHeight) / 2;
      $(newImg).width(wrapWidth).css('margin-top', -setTop);
    } else {
      // 宽度超出
      var setImgWidth = wrapHeight * newImg.width / newImg.height,
        setLeft = (setImgWidth - wrapWidth) / 2;
      $(newImg).height(wrapHeight).css('margin-left', -setLeft);
    }
    wrapObj.append(newImg);
  }
  objs.each(function(){
    var wrapObj = $(this),
      imgSrc = wrapObj.data('img');
    if (imgSrc) {
      var newImg = new Image();
      newImg.src = imgSrc;
      if (newImg.complete) {
        setImgSize(wrapObj, newImg);
      } else {
        newImg.onload = newImg.onerror = function(){
          setImgSize(wrapObj, newImg);
        };
      };
    }
  });
};







