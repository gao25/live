// 图片居中
liveCmd.centerimg($('#j-news .imgwrap span, #j-news .imgwrap2 span'));
// 绝对单击
$('#j-livelist li').each(function(){
  var id = $(this).data('id');
  liveCmd.tap($(this), function(){
    location.href = 'now.html?id=' + id;
  });
});