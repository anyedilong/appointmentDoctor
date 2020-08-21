$(function () {
    // 获取近3个月日期
    var getStartTime = '';
    var getEndTime = '';
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;//0-11表示1-12月
    var day = now.getDate();

    function getLast3Month() {
        // var now = new Date();
        // var year = now.getFullYear();
        // var month = now.getMonth() + 1;//0-11表示1-12月
        // var day = now.getDate();
        var dateObj = {};
        if (parseInt(month) < 10) {
            month = "0" + month;
        }
        if (parseInt(day) < 10) {
            day = "0" + day;
        }

        dateObj.now = year + '-' + month + '-' + day;

        if (parseInt(month) == 1) {//如果是1月份，则取上一年的10月份
            dateObj.last = (parseInt(year) - 1) + '-10-' + day;
            getStartTime = dateObj.last
            getEndTime = dateObj.now
            return dateObj;
        }
        if (parseInt(month) == 2) {//如果是2月份，则取上一年的11月份
            dateObj.last = (parseInt(year) - 1) + '-11-' + day;
            getStartTime = dateObj.last
            getEndTime = dateObj.now
            return dateObj;
        }
        if (parseInt(month) == 3) {//如果是3月份，则取上一年的12月份
            dateObj.last = (parseInt(year) - 1) + '-12-' + day;
            getStartTime = dateObj.last
            getEndTime = dateObj.now
            return dateObj;
        }

        var preSize = new Date(year, parseInt(month) - 3, 0).getDate();//开始时间所在月的总天数
        if (preSize < parseInt(day)) {
            // 开始时间所在月的总天数<本月总天数，比如当前是5月30日，在2月中没有30，则取下个月的第一天(3月1日)为开始时间
            var resultMonth = parseInt(month) - 2 < 10 ? ('0' + parseInt(month) - 2) : (parseInt(month) - 2);
            dateObj.last = year + '-' + resultMonth + '-01';
            getStartTime = dateObj.last;
            getEndTime = dateObj.now;
            return dateObj;
        }

        if (parseInt(month) <= 10) {
            dateObj.last = year + '-0' + (parseInt(month) - 3) + '-' + day;
            getStartTime = dateObj.last
            getEndTime = dateObj.now
            return dateObj;
        } else {
            dateObj.last = year + '-' + (parseInt(month) - 3) + '-' + day;
            getStartTime = dateObj.last
            getEndTime = dateObj.now
            return dateObj;
        }
    }
    getLast3Month(Date.now())

    var authToken = localStorage.getItem('authToken');
    var jsonParam = {
        authToken: authToken,
        status:'',
        ifevaluate:'',
        startTime:'',
        endTime:'',
        pageSize:'10',
        pageNo:'1'
    };
    var allcount = ''
    setTimeout(function(){
        page()
    }, 1000);
    function page(){
        layui.use(['laypage', 'layer'], function() {
            var laypage = layui.laypage
                , layer = layui.layer;
            //完整功能
            laypage.render({
                elem: 'getPage'
                , count: allcount //数据总数
                , limit: 10  //得到每页显示的条数
                , curr: 1  //得到当前页，以便向服务端请求对应页的数据。
                , layout: ['count', 'prev', 'page', 'next', 'limit', 'skip']
                , jump: function (obj) {
                    jsonParam.pageSize = obj.limit
                    jsonParam.pageNo = obj.curr
                    getAppoinmentList()
                }
            });
        })
    }

    // 时间范围下拉选
    layui.use(['element','form'], function(){
        var element = layui.element;
        var form = layui.form;
        var  layer = layui.layer;

        $('#xm').append(new Option(year-1+'年', 3));// 下拉菜单里添加元素
        $('#xm').append(new Option(year-2+'年', 4));// 下拉菜单里添加元素
        layui.form.render("select");
        form.on('select(college)', function (data) {
            var message = $('select[name="modules"] option:selected').val();
            if(message === "1"){
                jsonParam.startTime = getStartTime
                jsonParam.endTime = getEndTime
                getAppoinmentList();
                setTimeout(function(){
                    page()
                }, 100);
            }else if(message === "2"){
                jsonParam.startTime = year+'-1'+'-1'
                jsonParam.endTime =  year +'-'+month+'-'+day
                getAppoinmentList();
                setTimeout(function(){
                    page()
                }, 100);
            }else if(message === "3"){
                jsonParam.startTime = year-1+'-1'+'-1'
                jsonParam.endTime =  year-1 +'-12'+'-31'
                getAppoinmentList();
                setTimeout(function(){
                    page()
                }, 100);
            }else if(message === "4"){
                jsonParam.startTime = year-2+'-1'+'-1'
                jsonParam.endTime = year-2 +'-12'+'-31'
                getAppoinmentList();
                setTimeout(function(){
                    page()
                }, 100);
            }
        });
    });

    layui.use('element', function(){
        var element = layui.element;
        // var layid = location.hash.replace(/^#docDemoTabBrief=/, '');
        // element.tabChange('docDemoTabBrief', layid);
        var statusText = ''
        element.on('tab(docDemoTabBrief)', function(data){
            statusText = data.elem.context.innerHTML
            $("#xm").val('');
            layui.form.render();
            jsonParam.startTime = ''
            jsonParam.endTime = ''
            if(statusText === '全部预约'){
                jsonParam.status = ''
                jsonParam.ifevaluate = ''
            }else if(statusText === '未就诊'){
                jsonParam.status = '1'
                jsonParam.ifevaluate = ''
            }else if(statusText === '已就诊'){
                jsonParam.status = '2'
                jsonParam.ifevaluate = ''
            }else if(statusText === '已过期'){
                jsonParam.status = '3'
                jsonParam.ifevaluate = ''
            }else if(statusText === '已取消'){
                jsonParam.status = '4'
                jsonParam.ifevaluate = ''
            }else{
                jsonParam.status = '',
                    jsonParam.ifevaluate = '0'
            }
            // location.hash = 'docDemoTabBrief='+ this.getAttribute('lay-id');
            getAppoinmentList();
            setTimeout(function(){
                page()
            }, 100);
        });
    });

    layui.use('form', function(){
        var form = layui.form;
        //监听提交
        form.on('submit(formDemo)', function(data){
            layer.msg(JSON.stringify(data.field));
            return false;
        });
    });

    var flag = 0;
    var flags = 0;
    var flagt = 0;

    // 弹出框
    $("#getList").on("click",".pingjia",function(){
        var pjId = $(this).attr("ids")
        if(pjId == '暂无数据'){
            pjId = ''
        }
        var yyId = $(this).attr("idy")
        layui.use('layer', function(){
            var layer = layui.layer;
            layer.open({
                type: 2,
                title: '评价',
                area : ['500px' , '400px'],
                content: 'evalute.html'
                ,btn: ['确认','取消'],
                yes: function(index, layer){
                    // if (flag == 1) {
                    //     return
                    // }
                    // flag = 1;
                    var evaluationType = sessionStorage.getItem("rate")
                    var evaluationContent = sessionStorage.getItem("rate_c")
                    // 评价
                    var jsonParamRate = {
                        subscribeId : yyId,
                        id : pjId,
                        evaluationType: evaluationType,
                        evaluationContent: evaluationContent
                    };
                    $.ajax({
                        type: 'get',
                        dataType: "jsonp",
                        jsonp: "callback",//服务端用于接收
                        async: false,
                        contentType: 'application/json',
                        url: roadPath + '/reg/subscribe/docterEvaluate',
                        data: jsonParamRate,
                        success: function (resultMsg) {
                            if(resultMsg.retCode == 0) {
                                parent.layer.msg('评价成功');
                                parent.layer.close(index);//关闭弹出层
                                getAppoinmentList();
                            } else {
                                layer.alert('提示', {
                                    content: resultMsg.retMsg
                                });
                            }
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            alert('加载资源失败');
                        }
                    });
                }
            });
        });
    })
    $("#getList").on("click",".quxiao",function(){
        var yyId = $(this).attr("idy")
        layui.use('layer', function(){
            var layer = layui.layer;
            layer.open({
                type: 1
                ,title: '取消预约'
                // ,offset: type //具体配置参考：http://www.layui.com/doc/modules/layer.html#offset
                // ,id: 'layerDemo'+type //防止重复弹出
                // ,content: '<div style="padding: 30px 60px;">'+ text +'</div>'
                ,content: '<div style="padding: 30px 130px 30px 60px;">' +
                    '<img src="../img/img_layer_wenhao.png" alt="" class="wen_h fl"><ul class="wen_cont fl"><li class="font_e font_title">您是否确认取消当前预约？</li><li class="font_m c_grey">就诊前24小时能取消预约。</li></ul><div class="clear"></div></div>'
                ,btn: ['确认']
                ,btnAlign: 'c' //按钮居中
                ,shade: 0 //不显示遮罩
                ,yes: function(index){
                    // if (flags == 1) {
                    //     return
                    // }
                    // flags = 1;
                    var jsonParamTou = {
                        subId : yyId,
                        authToken: authToken
                    };
                    $.ajax({
                        type: 'get',
                        dataType: "jsonp",
                        jsonp: "callback",//服务端用于接收
                        async: false,
                        contentType: 'application/json',
                        url: roadPath + '/reg/arrangment/cancelSubscribe',
                        data: jsonParamTou,
                        success: function (resultMsg) {
                            if(resultMsg.retCode == 0) {
                                parent.layer.msg('取消预约成功');
                                parent.layer.close(index);//关闭弹出层
                                getAppoinmentList();
                                // parent.location.reload();//更新父级页面（提示：如果需要跳转到其它页面见下文）
                            } else {
                                layer.alert('提示', {
                                    content: resultMsg.retMsg
                                });
                            }
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            alert('加载资源失败');
                        }
                    });
                }
            });
        });
    })
    $("#getList").on("click",".tousu",function(){
        // console.log($(this).text())
        if($(this).text() == '已投诉'){
            layer.msg('您已提交投诉')
        }else if($(this).text() == '投诉'){
            var pjId = $(this).attr("ids")
            if(pjId == '暂无数据'){
                pjId = ''
            }
            var yyId = $(this).attr("idy")
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.open({
                    type: 1
                    ,title: '投诉'
                    // ,offset: type //具体配置参考：http://www.layui.com/doc/modules/layer.html#offset
                    // ,id: 'layerDemo'+type //防止重复弹出
                    // ,content: '<div style="padding: 30px 60px;">'+ text +'</div>'
                    ,content: '<div style="padding: 30px 40px;"><textarea name="tous" id="tousu_cont" cols="60" rows="10" placeholder="请输入您要投诉的内容" class="textarea_q"></textarea></div>'
                    ,btn: ['确认','取消']
                    ,btnAlign: 'c' //按钮居中
                    ,shade: 0 //不显示遮罩
                    ,yes: function(index){
                        // if (flagt == 1) {
                        //     return
                        // }
                        // flagt = 1;
                        // 投诉
                        var complaintContent = $(".textarea_q").val()
                        if(complaintContent === '请输入您要投诉的内容'){
                            complaintContent = ''
                        }
                        var jsonParamTou = {
                            subscribeId : yyId,
                            id : pjId,
                            complaintContent : complaintContent
                        };
                        $.ajax({
                            type: 'get',
                            dataType: "jsonp",
                            jsonp: "callback",//服务端用于接收
                            async: false,
                            contentType: 'application/json',
                            url: roadPath + '/reg/subscribe/docterEvaluate',
                            data: jsonParamTou,
                            success: function (resultMsg) {
                                if(resultMsg.retCode == 0) {
                                    parent.layer.msg('投诉成功');
                                    parent.layer.close(index);//关闭弹出层
                                    getAppoinmentList();
                                } else {
                                    layer.alert('提示', {
                                        content: resultMsg.retMsg
                                    });
                                }
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                alert('加载资源失败');
                            }
                        });
                    }
                });
            });
            // $("#tousu_cont").attr("value","请输入您要投诉的内容")
        }
    })
    getWeipingjia()
    function getWeipingjia() {
        var jsonParamP = {
            authToken: authToken
        };
        $.ajax({
            type: 'get',
            dataType: "jsonp",
            jsonp: "callback",//服务端用于接收
            async: false,
            contentType: 'application/json',
            url: roadPath + '/reg/subscribe/getEvaluateCount',
            data: jsonParamP,
            success: function (resultMsg) {
                if (resultMsg.retCode == 0) {
                    // console.log(resultMsg)
                    $(".evaNum").text(resultMsg.data)
                }
            }
        })
    }
    getAppoinmentList();
    function getAppoinmentList(){
       layui.use('layer', function() {
          var layer = layui.layer;
           var loading=layui.layer.load();
          $.ajax({
             type: 'get',
             dataType: "jsonp",
             jsonp: "callback",//服务端用于接收
             async: false,
             contentType: 'application/json',
             url: roadPath + '/reg/subscribe/getMySubscribeList',
             data: jsonParam,
             success: function (resultMsg) {
                layui.layer.close(loading);
                $(".showLoading").css("opacity", '1')
                if (resultMsg.retCode == 0) {
                   allcount = resultMsg.data.count
                   var html = "";
                   if (resultMsg.data.list !== undefined && resultMsg.data.list.length > 0) {
                      $("#getPage").show()
                      $.each(resultMsg.data.list, function (i, item) {
                         // console.log(item.COMPLAINT_CONTENT)
                         if (item.COMPLAINT_CONTENT == undefined || item.COMPLAINT_CONTENT == 'null') {
                            item.tou_title = '投诉'
                            item.tou_style = '#323231'
                         } else {
                            item.tou_title = '已投诉'
                            item.tou_style = '#999'
                         }
                         if (item.EVALUATION_TYPE !== undefined) {
                            item.STATUS = '5'
                         }
                         var ketarr = ['STATUS', 'CREATE_TIME', 'IMAGE_URL', 'YSNAME', 'PROFESSIONAL', 'HOSPITNAME', 'DEPTNAME', 'JZRNAME', 'VISIT_TIME', 'PJID', 'YYID'];
                         for (var p = 0; p < ketarr.length; p++) {
                            if (item[ketarr[p]] == undefined) {
                               item[ketarr[p]] = '暂无数据';
                            }
                         }
                         html += '<div class="yuyueCard" status="' + item.STATUS + '">' +
                            ' <div class="cont_head">发起预约时间：' + item.CREATE_TIME + '</div>' +
                            '<ul class="content_d">' +
                            '<li class="fl width_t" ids="' + item.YSID + '">' +
                            '<div class="docCard-pic">' +
                            '<img src="' + item.IMAGE_URL + '" alt="">' +
                            '</div>' +
                            '<div class="docCard-info">' +
                            '<div class="doc-name">' +
                            '<span>' + item.YSNAME + '</span>' +
                            '<span style="margin-left: 5px;">' + item.PROFESSIONAL + '</span>' +
                            '</div>' +
                            ' <div class="doc-hospital">' + item.HOSPITNAME + '</div>' +
                            '<div>' + item.DEPTNAME + '</div>' +
                            '</div>' +
                            '<div class="clear"></div>' +
                            '</li>' +
                            '<li class="fl width_s heig">' +
                            '<div class="pos_h">' + item.JZRNAME + '</div>' +
                            '</li>' +
                            '<li class="fl width_s heig">' +
                            '<div class="pos_h">' +
                            '<div>' + item.VISIT_TIME + '</div>' +
                            // '<div>'+ item.time +'</div>' +
                            '</div></li><li class="fl width_s heig">' +
                            // 未就诊
                            '<div class="pos_h posbtn_box weijiuzhen"><div>' +
                            '<span class="blue">未就诊</span>' +
                            '</div>' +
                            '<div class="q_grey quxiao to_hover" style="margin-bottom: 0;" ids="' + item.PJID + '" idy="' + item.YYID + '">取消</div>' +
                            '</div>' +
                            // 未评价
                            '<div class="pos_h posbtn_box weipingjia">' +
                            '<div>' +
                            '<span>已就诊</span>' +
                            '</div>' +
                            '<div> ' +
                            '<span class="pingjia to_hover" ids="' + item.PJID + '" idy="' + item.YYID + '">评价</span> ' +
                            '<span> | </span> ' +
                            '<span class="tousu to_hover" style="color:' + item.tou_style + '" ids="' + item.PJID + '"  idy="' + item.YYID + '">' + item.tou_title + '</span> ' +
                            '</div> ' +
                            '</div>' +
                            // 已评价
                            '<div class="pos_h posbtn_box yipingjia">' +
                            '<div>' +
                            '<span>已就诊</span>' +
                            '</div>' +
                            '<div>' +
                            '<span class="j_grey">已评价</span>' +
                            '<span> | </span>' +
                            '<span class="tousu to_hover" style="color:' + item.tou_style + '" ids="' + item.PJID + '"  idy="' + item.YYID + '">' + item.tou_title + '</span>' +
                            '</div>' +
                            '</div>' +
                            // 已过期、已取消
                            '<div class="pos_h posbtn_box qita"><div> ' +
                            '<span class="qita_c j_grey">已取消</span></div></div>' +
                            '</li><li class="clear"></li></ul></div>';
                      });
                      $("#getList").html(html);
                      // $(".evaNum").text($(".weipingjia").length)
                      $.each($(".yuyueCard"), function (i, item) {
                         var _this = $(this)
                         var status = $(this).attr("status");
                         if (status === '1') {
                            _this.find('.weijiuzhen').show()
                            _this.find('.weipingjia').hide()
                            _this.find('.qita').hide()
                            _this.find(".yipingjia").hide()
                         } else if (status === '2') {
                            _this.find('.weipingjia').show()
                            _this.find('.weijiuzhen').hide()
                            _this.find('.qita').hide()
                            _this.find(".yipingjia").hide()
                         } else if (status === '3') {
                            _this.find('.weijiuzhen').hide()
                            _this.find('.weipingjia').hide()
                            _this.find('.qita').show()
                            _this.find(".yipingjia").hide()
                            _this.find('.qita_c').text("已过期")
                         } else if (status === '4') {
                            _this.find('.weijiuzhen').hide()
                            _this.find('.weipingjia').hide()
                            _this.find('.qita').show()
                            _this.find(".yipingjia").hide()
                            _this.find('.qita_c').text("已取消")
                         } else if (status === '5') {
                            _this.find('.yipingjia').show()
                            _this.find('.weijiuzhen').hide()
                            _this.find('.weipingjia').hide()
                            _this.find('.qita').hide()
                         }
                      })
                   } else {
                      $("#getList").html('<div class="main_body font_m" style="text-align: center;margin-top: 20px;">暂无数据</div>');
                      $("#getPage").hide()
                   }
                }
             },
             error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('加载资源失败');
                layui.layer.closeAll()
                $(".showLoading").css("opacity", '1')
             }
          });
          var attr = $("#to_place").find("input").attr('value')
          if (attr == undefined || attr === '') {
             $("#to_place").find("input").attr('value', '请选择时间范围')
          }
       })
    }
    var authToken = localStorage.getItem('authToken');
    verifyLogin();
    function verifyLogin () {
        var jsonParam = {
            // 无参数，通过登录的tocken
            authToken: authToken
        };
        $.ajax({
            type: 'get',
            dataType: "jsonp",
            jsonp: "callback",//服务端用于接收
            async: false,
            contentType: 'application/json',
            url: roadPath +  '/reg/user/getUserInfo',
            data: jsonParam,
            success: function (resultMsg) {
                if (resultMsg.retCode == 0) {
                    $('#logined').show();
                    $('#noLogin').hide();
                    $('#personalRight').show();
                    var html='';
                    html+='<div>'+
                        '<img src="../img/moren_doctor.png" alt="">'+
                        '</div>'+
                        '<div class="mar_t font_e">'+resultMsg.data.username+'</div>'+
                        '<div style="margin-top: 20px;">'+
                        '<span class="hospital_tag cursorP" style="background: #FBC47D;" id="tuichu">退出</span>'+
                        '</div>';
                    $('#logined').html(html);
                    username = resultMsg.data.username;
                    $('#currentPhone').html(username);
                } else if (resultMsg.retCode == 1004) {
                    $('#noLogin').show();
                    denglu();
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
    }
    $('#logined').on('click','#tuichu',function () {
        var index = layer.confirm('确定退出？', {
            title: '提示',
            skin: 'layui-layer-login',
            btn: ['确定','取消'], //按钮
            fixed:false,
            top:10
        }, function(){
            localStorage.clear();
            layer.close(index);
            window.location.href = 'index.html';
        })
    });
    // $("#tousu_cont").blur(function(){
    //     if($(this).attr("value") === '请输入您要投诉的内容'){
    //         $(this).attr("value","");
    //     }
    // });
    //跳转医生主页详细
    $("#getList").on("click",".width_t",function(){
        var doctorId = $(this).attr("ids")
        localStorage.setItem("doctorId",doctorId);
        window.location.href = "appDoctor.html";
    })
    jQuery('[placeholder]').focus(function() {
        var input = jQuery(this);
        if (input.val() == input.attr('placeholder')) {
            input.val('');
            input.removeClass('placeholder');
        }
        input.css("color","#555");
    }).blur(function() {
        var input = jQuery(this);
        if (input.val() == '' || input.val() == input.attr('placeholder')) {
            input.addClass('placeholder');
            input.val(input.attr('placeholder'));
            input.css("color","#888");
        }
    }).blur().parents('form').submit(function() {
        jQuery(this).find('[placeholder]').each(function() {
            var input = jQuery(this);
            if (input.val() == input.attr('placeholder')) {
                input.val('');
            }
        })
    });
})