function setImgSize(wrapObj, newImg){
  var wrapWidth = wrapObj.width(),
    wrapHeight = wrapObj.height();
    console.log(wrapWidth);
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
$('.j-centerimg').each(function(){
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