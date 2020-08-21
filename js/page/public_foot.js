$(function () {
    getlinkList();
    function getlinkList () {
        var jsonParam = {
            startTime: '', // 起始时间
            endTime: '' // 结束时间
            // pageNo: '1', // 起始页， 不传默认10， 不能为“”
            // pageSize: '10', // 页大小， 不传默认10， 不能为“”
        };
        $.ajax({
            type: 'get',
            dataType: "jsonp",
            jsonp: "callback",//服务端用于接收
            async: false,
            contentType: 'application/json',
            url: roadPath + '/reg/sysLinks/getSysLinksInfoList',
            data: jsonParam,
            success: function (resultMsg) {
                if(resultMsg.retCode == 0) {
                    var html = "";
                    var dataList = resultMsg.data.list;
                    // 注意linkUrl格式，外部链接要带'http://'
                    $.each(dataList, function (i, item) {
                        //     // levelTypeText
                        html += '<div class="link-cord">' +
                            '<a href="' + item.linkUrl + '" target="_blank">' + item.name + '</a>' +
                            '</div>';
                    });
                    $("#linkurl").append(html);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('加载资源失败');
            }
        });
    }
    $('.yinsi').click(function () {
        var lay1 = layer.open({
            type: 1,
            skin: 'layui-layer-login', //加上边框
            title: '法律声明及隐私设置',
            area: ['560px', '530px'], //宽高
            scrollbar: false,
            content: $('#tipdiv'),
            fixed:false,
            top:10
        });
    })
})