// var roadPath = 'http://192.168.1.81:8182'; // 田振
// var roadPath = 'http://192.168.1.248:8090'; // 248服务器
// var roadPath = 'http://192.168.1.81:8090'; // 田振
// var roadPath = 'http://192.168.1.81:8090'; // 田振
// var roadPath = 'http://192.168.1.248:8090'; // 248服务器
// var roadPath = 'http://192.168.1.51:8090'; // 李家峰
// var roadPath = 'http://192.168.1.238:8182';
// var roadPath = 'http://192.168.10.254:8011/appointment';
var roadPath = 'http://220.164.62.189:8093/appointment';
jQuery.support.cors = true;

var authToken = localStorage.getItem('authToken');

console.log(authToken)
if(!authToken){
   console.log(1111)
   singleLogin()
   function singleLogin(){
      $.ajax({
         type: 'get',
         dataType: "jsonp",
         jsonp: "callback",//服务端用于接收
         async: false,
         contentType: 'application/json',
         url: roadPath +  '/login/singleLogin',
         data: {
            clientIp: returnCitySN["cip"]
         },
         success: function (resultMsg) {
            if (resultMsg.retCode == 0) {
               if(resultMsg.data){
                  var authToken = encrypt('appointment' + ',' + resultMsg.data.username + ',' + resultMsg.data.token);
                  localStorage.setItem('authToken', authToken);
                  window.location.reload();
               }
            }
         },
         error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert('加载资源失败');
         }
      });
   }
   function encrypt(word){
      var key = CryptoJS.enc.Utf8.parse("BhZ+FDMne1+xfU7kIihiLHd-EtXwYiKE");
      var srcs = CryptoJS.enc.Utf8.parse(word);
      var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
      return encrypted.toString();
   }
}else{
   console.log(22222)
}

// 登录
$(function () {
    $('#loginBtn').click(function () {
        layui.use('layer', function(){
            var layer = layui.layer;
            layer.open({
                id: 'login',
                type: 2,
                title: '',
                closeBtn: 0,
                skin: 'layui-layer-login', //样式类名
                shadeClose: true,
                shade: 0.2,
                area: ['560px', '530px'],
                content: 'login.html?type=login', //iframe的url
                fixed:false,
                top:10
                // success:function (layero, index) {
                //     var iframe = window['layui-layer-iframe' + index];
                //     console.log(iframe);
                //     iframe.childFun('我是父布局传到子布局的值')
                // }
            });
        });
    })
    $('#registerBtn').click(function () {
        layui.use('layer', function () {
            var layer = layui.layer;
            layer.open({
                id: 'register',
                type: 2,
                title: '',
                closeBtn: 0,
                skin: 'layui-layer-login', //样式类名
                shadeClose: true,
                shade: 0.2,
                area: ['560px', '530px'],
                content: 'login.html?type=register', //iframe的url
                fixed:false,
                top:10
            });
        });
    });
    $('#logout').click(function () {
        layui.use('layer', function () {
            var index = layer.confirm('确定退出？', {
                title: '提示',
                skin: 'layui-layer-login',
                btn: ['确定','取消'], //按钮
                fixed:false,
                top:10
            }, function(){
               $.ajax({
                  type: 'get',
                  dataType: "jsonp",
                  jsonp: "callback",//服务端用于接收
                  async: false,
                  contentType: 'application/json',
                  url: roadPath + '/login/exit',
                  data: {
                     authToken: authToken,
                     clientIp: returnCitySN["cip"]
                  },
                  success: function (resultMsg) {
                     if(resultMsg.retCode == 0) {
                        localStorage.removeItem('authToken');
                        layer.close(index);
                        // 刷新父页面
                        parent.location.reload();
                     } else {
                        layer.alert('提示', {
                           content: resultMsg.retMsg
                        });
                     }
                  },
                  error: function (XMLHttpRequest, textStatus, errorThrown) {
                     console.log(XMLHttpRequest);
                     console.log(textStatus);
                     console.log(errorThrown);
                     alert('加载资源失败');
                  }
               });
            })
        });
    });
    // 个人中心-去登陆
    $('#goLogin').click(function () {
        denglu();
    });
});

function denglu () {
    layui.use('layer', function(){
        var layer = layui.layer;
        layer.open({
            id: 'other',
            type: 2,
            title: '',
            closeBtn: 0,
            skin: 'layui-layer-login', //样式类名
            shadeClose: true,
            shade: 0.2,
            area: ['560px', '530px'],
            content: 'login.html?type=login', //iframe的url
            fixed:false,
            top:10
        });
    });
}

// 地址栏取值
$(function () {
    function GetQueryString(name) {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }
})
// console.log(GetQueryString("参数名"));
