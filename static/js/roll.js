// 移动端照片滑动组件
(function(sugarname){
  var roll = function(obj, callback, closeCallback) {
    if (typeof(obj) == 'object') {
      this.obj = obj;
    } else {
      this.obj = $('#'+obj);
    }
    this.ulObj = $('<ul></ul>');
    this.ulObj.css('position', 'absolute');
    this.obj.append(this.ulObj);
    if (callback) this.callback = callback;
    if (closeCallback) this.closeCallback = closeCallback;
    this.init();
  };
  roll.prototype = {
    init: function(){
      this.barLen = 0;
      this.barIndex = 0;
      this.swipe();
    },
    reset: function(){
      this.ulObj.html('');
      this.ulObj.css('left', 0);
      this.barLen = 0;
      this.barIndex = 0;
      if (this.callback) {
        this.callback(this.barIndex, this.barLen);
      }
    },
    appendimg: function(picArray){
      var _this = this;
      function setImgSize(newImg){
        if (_this.barWidth / _this.barHeight >= newImg.width / newImg.height) {
          // 高度超出或持平
          $(newImg).height(_this.barHeight).css({
            display: "block",
            margin: "auto"
          });
        } else {
          // 宽度超出
          var setImgHeight = _this.barWidth * newImg.height / newImg.width,
            setTop = (_this.barHeight - setImgHeight) / 2;
          $(newImg).width(_this.barWidth).css('margin-top', setTop);
        }
        _this.ulObj.append($('<li style="float:left;"></li>').width(_this.barWidth).append(newImg));
      }
      $.each(picArray, function(){
        var newImg = new Image();
          newImg.src = this;
        if (newImg.complete) {
          setImgSize(newImg);
        } else {
          newImg.onload = newImg.onerror = function(){
            setImgSize(newImg);
          };
        };
      });
    },
    show: function(picArray, index){
      this.reset();
      
      this.barWidth = this.obj.width();
      this.barHeight = this.obj.height();
      this.barLen = picArray.length;
      this.ulObj.width(this.barWidth * this.barLen);

      this.appendimg(picArray);

      if (index) {
        this.barIndex = index;
        this.ulObj.css('left', - this.barIndex * this.barWidth);
      }
      
      if (this.callback) {
        this.callback(this.barIndex, this.barLen);
      }
    },
    swipe: function(){
      var _this = this;
      _this.tapReady = true;
      new sugar['swipe'](_this.obj, {
        start: function(res){
          _this.tapReady = true;
        },
        move: function(res){
          if (res['swipeState'] == 'x') {
            _this.ulObj.css('left', - _this.barIndex * _this.barWidth + res['moveX']);
          }
          _this.tapReady = false;
        },
        end: function(res){
          if (res['swipeState'] == 'x') {
            if (res['moveX'] > 0) {
              _this.barIndex --;
            } else if (res['moveX'] < 0) {
              _this.barIndex ++;
            }

            if (_this.barIndex < 0) {
              _this.barIndex = 0;
            } else if (_this.barIndex >= _this.barLen) {
              _this.barIndex = _this.barLen - 1;
            }
            var toLeft = - _this.barIndex * _this.barWidth;

            _this.ulObj.animate({
              'left': toLeft
            }, 300, function(){
              res['finish']();
              if (_this.tapReady) {
                _this.closeCallback();
              }
            });

            if (_this.callback) {
              _this.callback(_this.barIndex, _this.barLen);
            }
          } else {
            res['finish']();
            if (_this.tapReady) {
               _this.closeCallback();
            }
          }
        }
      }, {
        swipeX: true
      });
    }
  };
  sugar[sugarname] = roll;
})('roll-1.0.0');