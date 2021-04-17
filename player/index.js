

//appkey = iVGUTjsxvpLeuDCf
//sec = aHRmhWMLkdeMuILqORnYZocwMBpMEOdt
//https://interface.bilibili.com/v2/playurl?appkey=iVGUTjsxvpLeuDCf&cid=224524113&otype=json&qn=16&quality=16&type=&sign=a549b4a46cbb3b8d8b0d89f295220f15

//评论第几页
var commentpage = 1;
/*  通用函数  */
//跨域设置
$.ajaxSettings.xhr = function () {
    try {
        return new XMLHttpRequest({ mozSystem: true });
    } catch (e) { }
}; 
//打开视频
function openV() {
  const currentIndex = document.activeElement.tabIndex;
  window.location.href = './player/index.html?aid=' + aid[currentIndex] + '&bvid=' + bvid[currentIndex]
}
function playV(aid,bvid,page) {
  $('.video_normal').attr('src','https://player.bilibili.com/player.html?t=0.05&aid=' + aid + '&bvid=' + bvid + '&page=' + page + '&danmaku=0')
   
} 
function add0(m){return m<10?'0'+m:m }
function formattime(ts) {  
	var time = new Date(ts*1000);
	var y = time.getFullYear();
	var m = time.getMonth()+1;
	var d = time.getDate();
	var h = time.getHours();
	var mm = time.getMinutes();
	var s = time.getSeconds();
	return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
}


var username ="UP主";
var uid =0;
/*  获取信息  */ 

function appendComments(item,tabIndex)
{ 
	var content = item.content.message;   //评论内容
	var uname = item.member.uname; //用户名
	var avatar = item.member.avatar+'@40w_40h.jpg'; //头像 
	var ctime = formattime(item.ctime); //评论时间
 
	
	$('.items').append('<div class="itemcomment" tabIndex="'+tabIndex+'"><div class="commenthead"> <div class="left_img"> <div class="head"> <img src="'+avatar+'"alt=""></div></div><div class="user-info"><p>'+uname+'</p><span>'+ctime+'</span></div> </div> <div class="comment"> <p>'+content+'</p></div></div>')
}

//dict：方法（遍历时用于解析的列表：【标题，作者，配图，视频AV号，视频BV号】）（以item开头）
//each：遍历的位置（以result开头）
function getComments(page) { 

   if(page)
   {
	   
   }
   else{ 
     $('.items').empty() //清空列已有的列表
	 $('.items').append('正在加载…') //展示加载信息
	   commentpage = 1;
	   page = 1;
   }
  url = 'http://api.bilibili.com/x/v2/reply?jsonp=jsonp&pn='+page+'&type=1&sort=2&oid='+getQueryVar('aid'); //630102970
  //从网络获取信息
  $.getJSON(url,function(result) { 
	if(result.data.replies)
	{ 
		$('.items').empty();
		$.each(result.data.replies,function(r,item) { 
		  appendComments(item,r + ''); 
		}) 
	}
	else
	{
		alert("没有更多评论了！");
		return;
	}
   
    //对焦
	if(document.querySelectorAll('.itemcomment')[0])
	{ 
		document.querySelectorAll('.itemcomment')[0].focus()
	}
  }).fail(function(jqXHR, status, error){
  alert(error+",请求可能被拦截"); });
};

//获取url传值
function getQueryVar(variable) {
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

//加载视频信息
function getInfo() {
  var aid = getQueryVar('aid');
  $.getJSON('http://api.bilibili.com/x/web-interface/view?aid=' + aid, function(result) {
    var title = result.data.title
    var view = result.data.stat.view
    var danmaku = result.data.stat.danmaku
    var like = result.data.stat.like
    var coin = result.data.stat.coin
    var favorite = result.data.stat.favorite
    
    $('.items').empty();
    //标题、播放量、弹幕量
    $('.items').append("<div class='item' id='title' tabIndex='0'><a id='title'>" + title + "</a><br><div id='info'><div id='view'><img src='../img/inside_icon/play/view.svg'><a id='view'>" + view + "</a></div><div id='danmaku'><img src='../img/inside_icon/play/danmaku.svg'><a id='danmaku'>" + danmaku + "</a></div></div></div>")
    //点赞、投币、收藏
    $('.items').append("<div class='item' id='sanlian' tabIndex='1'><div id='like'><img src='../img/inside_icon/play/like.svg'><a id='like'>" + like + "</a></div><div id='coin'><img src='../img/inside_icon/play/coin.svg'><a id='coin'>" + coin + "</a></div><div id='favorite'><img src='../img/inside_icon/play/favorite.svg'><a id='favorite'>" + favorite + "</a></div></div>")
    //空项
    $('.items').append("<div class='item' id='desc' tabIndex='2'><p>"+result.data.desc+"</p></div> ")
	 
	uid = result.data.owner.mid;	
	username =  result.data.owner.name;	
	getIsLike(uid); 
    document.querySelectorAll('.item')[0].focus();
  });
}

//切换全屏（指通知栏是否显示）
function toggleFullScreen() {
  if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

/*  D-Pad  */
//设置按键函数
function handleKeydown(e) {
if (e.key != "EndCall") { 
	e.preventDefault();//清除默认行为（滚动屏幕等）
}  
  switch(e.key) {
    case 'ArrowUp':
      nav(-1);
      break;
    case 'ArrowDown':
      nav(1);
      break;
    case 'ArrowRight':
      tab(1);
      break;
    case 'ArrowLeft':
      tab(-1);
      break;
    case 'Enter':
      enter();
      break;
    case 'Backspace':
      window.history.back(1);
      break;
	case 'Q':
    case 'SoftLeft':
      //切换全屏
	  if( $('#softkey-left').text() === "全屏")
	  {
		  if($('#player').attr('class') == 'video_normal') {
        document.documentElement.requestFullscreen();
        $('#player').attr('class','video_fullscreen');
      }else{
        document.exitFullscreen();
        $('#player').attr('class','video_normal');
      }
	  }
      else if( $('#softkey-left').text() === "下一页")
	  {
		  commentpage+=1;
		  getComments(commentpage);
	  }
      break;
	case 'E':
    case 'SoftRight':
		SoftRight();
      break;
    case '2':
      navigator.volumeManager.requestUp();
      break;
	case '8':
      navigator.volumeManager.requestDown();
      break;
  }
}


function refreshLike()
{ 
  $.ajaxSettings.async = false; //临时设置为同步请求
  var data = localStorage.getItem('like'); //读取数据
  data = JSON.parse(data); //将字符串转换为JSON
  $.each(data,function(r,item){ //给每一个uid更新数据
    ajax = $.getJSON('http://api.bilibili.com/x/space/acc/info?mid=' + item.uid, function(result) {
      data[r].pic = result.data.face //头像
      data[r].nick = result.data.name //昵称
    })
    ajax = $.getJSON('http://api.bilibili.com/x/relation/stat?vmid=' + item.uid, function(result) { 
      data[r].sub = result.data.follower //粉丝数
    })
  }) 
  localStorage.setItem('like', JSON.stringify(data)) //将数组转换后存储数据
  $.ajaxSettings.async = true; //记得改回来

}


//关注用户
function LikeUser(uid)
{
	var result =localStorage.getItem('like') //从本地获取信息 
	  try {
		result = JSON.parse(result)
	  }catch(e){ 
		result = [];
	  } 
	  result.push({uid:uid}); 
	  localStorage.setItem('like', JSON.stringify(result)) //将数组转换后存储数据
	  refreshLike();
}
//取消关注用户
function UnLikeUser(uid)
{
	  var result =localStorage.getItem('like') //从本地获取信息 
	  try {
		result = JSON.parse(result)
	  }catch(e){ 
		result = [];
	  } 
	  
	  for(var i=0;i<result.length;i++)
	  {
		  if(result[i].uid === uid)
		  {
			  result.splice(i,1);
			  i--; 
		  }
	  } 
	  localStorage.setItem('like', JSON.stringify(result)) //将数组转换后存储数据
	  refreshLike();
}

function SoftRight()
{
	if($('#softkey-right').text()==='加载中')
	{
		return;
	}
	var islike = $('#softkey-right').text()==='取消关注';
	if(islike)
	{
		//取消关注
	 if(confirm('确定取消关注"'+username+'"吗？')) {
        UnLikeUser(uid);
		$('#softkey-right').text('关注');
      }
	}
	else{
		//关注
		if(confirm('确定关注"'+username+'"吗？')) {
			LikeUser(uid);
		$('#softkey-right').text('取消关注');
      }   
	}
}

//设置导航键函数
var tab_location = 0;//设置header位置
function nav(move) {
	if(tab_location===0)
	{
		const currentIndex = document.activeElement.tabIndex;
  var next = currentIndex + move;
  const items = document.querySelectorAll('.item');
    /* if(next>=items.length)
	{
		next = 0;
	}
	else if(next<0)
	{
		next = items.length-1;
	} */

  const targetElement = items[next];
  if(targetElement)
  {
	targetElement.focus();  
  }
  if(next == 0) {
    $('.items').scrollTop(0);
  }
  if(next ==2)
  {
	  $('#softkey-center').text('查看');
  }else{
	   $('#softkey-center').text('');
  }
	}
	else if(tab_location===1)
	{
		const currentIndex = document.activeElement.tabIndex;
  var next = currentIndex + move;
  
  const items = document.querySelectorAll('.itemcomment');
/*      if(next>=items.length)
	{
		next = 0;
	}
	else if(next<0)
	{
		next = items.length-1;
	}
	 */
  const targetElement = items[next];
  if(targetElement)
  {
	targetElement.focus();  
  }
  if(next == 0) {
    $('.items').scrollTop(0);
  }
	}
}

function tab(move) {
  const currentIndex = parseInt($('.focus').attr('tabIndex')); //获取目前带有focus的元素的tabIndex
  var next = currentIndex + move; //设置移动位置
  if(next>1)
  {
	  next = 0;
  }
  else if(next<0)
  {
	  next = 1;
  }
  const items = document.querySelectorAll('li'); //遍历所有的li元素
  const targetElement = items[next]; //将位置与遍历结果对应
  if(targetElement == undefined){ //如果没有可供选择的目标
    return; //中止函数
  }
  $('.focus').attr("class",""); //清除原有效果
  targetElement.className = "focus"; //设置新效果
  tab_location = next;
  if(tab_location == 0)
  {
	  $('#softkey-left').text('全屏');
  }
  else if(tab_location==1)
  {
	   $('#softkey-left').text('下一页');
  }
  load()
}

function load() {
  switch(tab_location) {
    case 0: //简介
      getInfo();
	  $('#softkey-center').text("")
      break;
    case 1: //评论
      getComments();
	  $('#softkey-center').text("查看")
      break;
  }
}

function softLeft() {
  switch(tab_location) {
    case 0: //简介
      break;
    case 1: //评论
      break;
  }
}

function enter() {   
/* try{
	document.domain="bilibili.com";
	var video=document.getElementById('player').contentWindow.document.getElementsByName("video")[0]; 
	alert(video)
  if(video.paused == true) {
    video.play();
  }else{
    video.pause();
  } 
}
catch(err)
{
	alert(err);
} */
  switch(tab_location) {
    case 0: //简介
	
	  var currentIndex = document.activeElement.tabIndex;
	  if(currentIndex==2)
	  { 
		  var items = document.querySelectorAll('.item');
		  alert($(items[currentIndex]).text());
	  }
      break;
    case 1: //评论
	  var currentIndex = document.activeElement.tabIndex; 
	  var items = document.querySelectorAll('.comment');
	  alert($(items[currentIndex]).text());
      break;
  }
}
//获取是否关注
function getIsLike(uid)
{
  var result =localStorage.getItem('like') //从本地获取信息 
  try {
    result = JSON.parse(result)
  }catch(e){ 
    localStorage.setItem('like',"[]")
	$('#softkey-right').text("关注");
	return;
  }
  var islike = 0;
  for(var i=0;i<result.length;i++)
  {
	  if(result[i].uid === uid)
	  {
		  islike = 1;
		  break;
	  }
  } 
  if(islike)
  { 
	$('#softkey-right').text("取消关注");
  }else{
	$('#softkey-right').text("关注");
  }
}

//设置触发器
document.activeElement.addEventListener('keydown', handleKeydown);

/*  刚开应用该干啥  */
//设置播放内容
playV(getQueryVar('aid'),getQueryVar('bvid'),'1');
getInfo();
getIsLike()
