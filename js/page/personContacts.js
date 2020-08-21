$(function () {
    var authToken = localStorage.getItem('authToken');
    // 联系人列表
    getList();
    function getList () {
        var jsonParam = {
            authToken: authToken
            // 无参数，通过登录的tocken
        };
        $.ajax({
            type: 'get',
            dataType: "jsonp",
            jsonp: "callback",//服务端用于接收
            async: false,
            contentType: 'application/json',
            url: roadPath + '/temp/medperson/getPatientList',
            data: jsonParam,
            success: function (resultMsg) {
                if(resultMsg.retCode == 0) {
                    $("#lxrList").html('');
                    var html = "";
                    var dataList = resultMsg.data;
                    $.each(dataList, function (i, item) {
                        // levelTypeText
                        item.sfzh = item.sfzh.substring(0,5) + '*********' + item.sfzh.substring(15, item.length);
                        if(item.addressDetail){
                            if (item.addressDetail.length > 13) {
                                item.addressDetail = item.addressDetail.substring(0,13) + '...';
                            }
                        }
                        if (item.xb=='男') {
                            item.xbcls = 'lxr-imgm'
                            item.imgurl = '../img/img_sex_m.png'
                        } else {
                            item.xbcls = 'lxr-imgw'
                            item.imgurl = '../img/img_sex_w.png'
                        }
                        html += '<div class="layui-col-md5" status="' + item.patientSign + '">' +
                            '<div class="lxr-card">' +
                            '<div class="moren-lxr"><img src="../img/img_default.png" alt=""></div>' +
                            '<div class="card-btn">' +
                            '<img class="edit-btn" ids="' + item.id + '" src="../img/btn_edit.png" alt="">\n' +
                            '<img class="delete-btn" ids="' + item.id + '" src="../img/btn_delete.png" alt=""></div>' +
                            '<div class="lxr-box"><div class="lxr-row">' +
                            '<div class="lxr-img ' + item.xbcls + '">' +
                            '<img src="' + item.imgurl + '" alt="">' +
                            '</div>' +
                            '<div class="lxr-info">' +
                            '<div class="lxr-name">' + item.name + '</div>' +
                            '<div class="lxr-id">' + item.sfzh + '</div>' +
                            '</div>' +
                            '<div class="clear"></div>' +
                            '</div>' +
                            '<div class="lxr-row">' +
                            '<i class="iconfamily">&#xe63a;</i>' +
                            '<span>' + item.phone + '</span>' +
                            '</div>' +
                            '<div class="lxr-row">' +
                            '<i class="iconfamily">&#xe61e;</i>' ;
                            // '<span>山东省济南市高新区舜华路南...</span>' +
                            if(item.addressProvinceName){
                                html+='<span>' + item.addressProvinceName + item.addressCityName +
                                    item.addressRegionName + item.addressStreetName + '</span>' ;
                            }else{
                                html+='<span>暂无地址信息</span>' ;
                            }
                            html+='</div></div></div></div>';
                    });
                    $("#lxrList").append(html);
                    for (var i = 0; i < $('.layui-col-md5').length; i++) {
                        var status = $('.layui-col-md5').eq(i).attr('status');
                        if (status == '1') {
                            $('.layui-col-md5').eq(i).find('.moren-lxr').show();
                        } else {
                            $('.layui-col-md5').eq(i).find('.moren-lxr').hide();
                        }
                    }
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
    // 删除
    $('#lxrList').on('click', '.delete-btn', function () {
        var ids = $(this).attr('ids');
        var jsonParam = {
            id: ids
        };
        var layerOne = layer.confirm('确定删除该联系人?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                type: 'get',
                dataType: "jsonp",
                jsonp: "callback",//服务端用于接收
                async: false,
                contentType: 'application/json',
                url: roadPath + '/temp/medperson/deletePatientBaseInfo',
                data: jsonParam,
                success: function (resultMsg) {
                    if(resultMsg.retCode == 0) {
                        getList();
                        layer.close(layerOne);
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
    })
    layui.use(['layer', 'form'],  function(){
        // var layer = layui.layer;
        var form = layui.form;
        // 验证
        form.verify({
            tel: function(value, item){ //value：表单的值、item：表单的DOM对象
                if(!new RegExp("^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$").test(value)){
                    return '手机号格式不正确';
                }
            },
            idcard: function(value, item){ //value：表单的值、item：表单的DOM对象
                if(!new RegExp("^[1-9]\\d{5}(18|19|20)\\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$").test(value)){
                    return '身份证号格式不正确';
                }
            }
            //我们既支持上述函数式的方式，也支持下述数组的形式
            //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
            ,pass: [
                /^[\S]{6,12}$/
                ,'密码必须6到12位，且不能出现空格'
            ]
        });
        getShengSelect();
        // 联动下拉省市区街道
        form.on('select(addressProvince)', function(data){
            getshi(data.value, '');
        });
        form.on('select(addressCity)', function(data){
            getqu(data.value, '');
        });
        form.on('select(addressRegion)', function(data){
            getjiedao(data.value, '');
        });
        // 获取省下拉列表
        function getShengSelect () {
            var jsonParam = {
                id: 0 // 第一级 填 0
            };
            $.ajax({
                type: 'get',
                dataType: "jsonp",
                jsonp: "callback",//服务端用于接收
                async: false,
                contentType: 'application/json',
                url: roadPath + '/reg/area/getAreaListById',
                data: jsonParam,
                success: function (resultMsg) {
                    $("#addressProvince").empty();
                    $("#addressCity").empty();
                    $("#addressRegion").empty();
                    $("#addressStreet").empty();
                    if(resultMsg.retCode == 0) {
                        var dataList = resultMsg.data;
                        if (dataList.length > 0) {
                            $("#addressProvince").append('<option value="">搜索省</option>');
                            $("#addressCity").append('<option value="">搜索市</option>');
                            $("#addressRegion").append('<option value="">搜索区</option>');
                            $("#addressStreet").append('<option value="">搜索街道</option>');
                            $.each(dataList, function (i, item) {
                                $("#addressProvince").append('<option value="' + item.id + '">' + item.areaName + '</option>');
                            });
                        } else {
                            $("#addressProvince").append('<option value="">暂无数据</option>');
                        }
                    }
                    layui.form.render("select");
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest);
                    console.log(textStatus);
                    console.log(errorThrown);
                    alert('加载资源失败');
                }
            });
        }
        function getshi (data, data2) {
            $.ajax({
                type: 'get',
                dataType: "jsonp",
                jsonp: "callback",//服务端用于接收
                async: false,
                contentType: 'application/json',
                url: roadPath + '/reg/area/getAreaListById',
                data: {
                    id: data
                },
                success: function (resultMsg) {
                    $("#addressCity").empty();
                    $("#addressRegion").empty();
                    $("#addressStreet").empty();
                    if(resultMsg.retCode == 0) {
                        var dataList = resultMsg.data;
                        if (dataList.length > 0) {
                            $("#addressCity").append('<option value="">搜索市</option>');
                            $("#addressRegion").append('<option value="">搜索区</option>');
                            $("#addressStreet").append('<option value="">搜索街道</option>');
                            $.each(dataList, function (i, item) {
                                $("#addressCity").append('<option value="' + item.id + '">' + item.areaName + '</option>');
                            });
                        } else {
                            $("#addressCity").append('<option value="">暂无数据</option>');
                        }
                    }
                    $('#addressCity').val(data2);
                    layui.form.render("select");
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest);
                    console.log(textStatus);
                    console.log(errorThrown);
                    alert('加载资源失败');
                }
            });
        }
        function getqu (data, data2) {
            $.ajax({
                type: 'get',
                dataType: "jsonp",
                jsonp: "callback",//服务端用于接收
                async: false,
                contentType: 'application/json',
                url: roadPath + '/reg/area/getAreaListById',
                data: {
                    id: data
                },
                success: function (resultMsg) {
                    $("#addressRegion").empty();
                    $("#addressStreet").empty();
                    if(resultMsg.retCode == 0) {
                        var dataList = resultMsg.data;
                        if (dataList.length > 0) {
                            $("#addressRegion").append('<option value="">搜索区</option>');
                            $("#addressStreet").append('<option value="">搜索街道</option>');
                            $.each(dataList, function (i, item) {
                                $("#addressRegion").append('<option value="' + item.id + '">' + item.areaName + '</option>');
                            });
                        } else {
                            $("#addressRegion").append('<option value="">暂无数据</option>');
                        }
                    }
                    $('#addressRegion').val(data2);
                    layui.form.render("select");
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest);
                    console.log(textStatus);
                    console.log(errorThrown);
                    alert('加载资源失败');
                }
            });
        }
        function getjiedao (data, data2) {
            $.ajax({
                type: 'get',
                dataType: "jsonp",
                jsonp: "callback",//服务端用于接收
                async: false,
                contentType: 'application/json',
                url: roadPath + '/reg/area/getAreaListById',
                data: {
                    id: data
                },
                success: function (resultMsg) {
                    $("#addressStreet").empty();
                    if(resultMsg.retCode == 0) {
                        var dataList = resultMsg.data;
                        if (dataList.length > 0) {
                            $("#addressStreet").append('<option value="">搜索街道</option>');
                            $.each(dataList, function (i, item) {
                                $("#addressStreet").append('<option value="' + item.id + '">' + item.areaName + '</option>');
                            });
                        } else {
                            $("#addressStreet").append('<option value="">暂无数据</option>');
                        }
                    }
                    $('#addressStreet').val(data2);
                    layui.form.render("select");
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest);
                    console.log(textStatus);
                    console.log(errorThrown);
                    alert('加载资源失败');
                }
            });
        }
        //监听提交
        form.on('submit(addBtn)', function(data){
            if ($('#regcheck').hasClass('my-checked')) {
                data.field.patientSign = 1
            } else {
                data.field.patientSign = 0
            }
            // layer.msg(JSON.stringify(data.field));
            data.field.authToken = authToken;
            // 添加成功再执行下一步
            // $('.lxr-listPage').show();
            // $('.lxr-addPage').hide();
            $.ajax({
                type: 'get',
                dataType: "jsonp",
                jsonp: "callback",//服务端用于接收
                async: false,
                contentType: 'application/json',
                url: roadPath + '/temp/medperson/saveOrupdatePatientBaseInfo',
                data: data.field,
                success: function (resultMsg) {
                    if (resultMsg.retCode == 0) {
                        getList();
                        $('.lxr-listPage').show();
                        $('.lxr-addPage').hide();
                    }
                    layui.form.render("select");
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest);
                    console.log(textStatus);
                    console.log(errorThrown);
                    alert('加载资源失败');
                }
            });
        });
        function editFun (obj) {
            // 默认就诊人
            if (obj.patientSign == '1') {
                $('.my-checkbox').children('.checkdiv').eq(0).removeClass('my-checked');
                $('.my-checkbox').children('.checkdiv').eq(1).addClass('my-checked');
            } else {
                $('.my-checkbox').children('.checkdiv').eq(1).removeClass('my-checked');
                $('.my-checkbox').children('.checkdiv').eq(0).addClass('my-checked');
            }
            getshi(obj.addressProvince, obj.addressCity);
            //
            // layui.form.render('select');
            getqu(obj.addressCity, obj.addressRegion);
            getjiedao(obj.addressRegion, obj.addressStreet);
            form.val('addform',obj);
        }
        // 编辑
        $('#lxrList').on('click', '.edit-btn', function () {
            $('.lxr-addPage').find('.label_one').children('.label').html('编辑常用联系人');
            var ids = $(this).attr('ids');
            $('.lxr-listPage').hide();
            $('.lxr-addPage').show();
            var jsonParam = {
                'id': ids
            };
            $.ajax({
                type: 'get',
                dataType: "jsonp",
                jsonp: "callback",//服务端用于接收
                async: false,
                contentType: 'application/json',
                url: roadPath + '/temp/medperson/getPatientBaseInfo',
                data: jsonParam,
                success: function (resultMsg) {
                    if(resultMsg.retCode == 0) {
                        // $('.layui-input')
                        editFun(resultMsg.data);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest);
                    console.log(textStatus);
                    console.log(errorThrown);
                    alert('加载资源失败');
                }
            });
        });
        // 增加联系人
        $('#goAdd').click(function () {
            $('.my-checkbox').children('.checkdiv').eq(1).removeClass('my-checked');
            $('.my-checkbox').children('.checkdiv').eq(0).addClass('my-checked');
            $('.lxr-listPage').hide();
            $('.lxr-addPage').show();
            $('.lxr-addPage').find('.label_one').children('.label').html('新增常用联系人');
            $("#addform")[0].reset();
            layui.form.render();
        })
        $('#goBack').click(function () {
            $('.lxr-listPage').show();
            $('.lxr-addPage').hide();
        })
    });
    // checkbox
    $('.my-checkbox').click(function () {
        if ($(this).children('.checkdiv').eq(0).hasClass('my-checked')) {
            $(this).children('.checkdiv').eq(0).removeClass('my-checked');
            $(this).children('.checkdiv').eq(1).addClass('my-checked');
        } else {
            $(this).children('.checkdiv').eq(1).removeClass('my-checked');
            $(this).children('.checkdiv').eq(0).addClass('my-checked');
        }
    })
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
})