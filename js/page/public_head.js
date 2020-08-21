$(function () {
    var pageArr = ['index.html', 'appointment.html', '', '', ''];
    var pageObj = {
        0: ['index.html', '123.html', '', '', ''],
        1: ['appointment.html', 'appDoctor.html', 'appDepartment.html', 'appointmentDoctor.html', 'appHospital.html', 'appointmentConfirm.html'],
        2: ['changePhone.html', 'personContacts.html', 'myAppointment.html','changePassword.html','attendedDoctor.html'],
        3: ['healthScience.html', 'healthScienceDetails.html', 'healthScienceHospitalList.html'],
        4: ['appointmentGuide.html', 'appointmentGuideDetails.html']
    };
    $('.headinp-tab li').eq(0).addClass('inp-liact');
    $('.headinp-tab li').click(function () {
        $('.headinp-tab li').removeClass('inp-liact');
        $(this).addClass('inp-liact');
    })
    $(document).ready(function () {
        var urlArr = window.location.href.split('/');
        var urls = urlArr[urlArr.length - 1];
        var urlStr = '';
        for (var key in pageObj) {
            if (urls.indexOf('?') > -1) {
                urlStr = urls.substring(0, urls.indexOf('?'));
            } else {
                urlStr = urls;
            }
            if (pageObj[key].join(',').indexOf(urlStr) > -1) {
                $('.headTab-ul li').removeClass('tab-liact');
                $('.headTab-ul li').eq(key).addClass('tab-liact');
            }
        }
        var authToken = localStorage.getItem('authToken');
        getuserInfo();
        function getuserInfo () {
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
                        $('.weilogin').hide();
                        $('.yilogin').show();
                        $('.username').html(resultMsg.data.username)
                    } else if (resultMsg.retCode == 1003) {
                        $('.weilogin').show();
                        $('.yilogin').hide();
                        // if (urls.indexOf('?') > -1) {
                        //     urlStr = urls.substring(0, urls.indexOf('?'));
                        // } else {
                        //     urlStr = urls
                        // }
                        // if (pageObj[2].join(',').indexOf(urlStr) > -1) {
                        //     denglu();
                        // }
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
    })
    $('.headTab-ul li').click(function () {
        var index = $(this).index();
        $('.headTab-ul li').removeClass('tab-liact');
        $(this).addClass('tab-liact');
        window.location.href = pageObj[index][0];
    })
    $('#searchBtn').click(function () {
        var searchType = '';
        var searchVal = '';
        for (var i = 0; i < $('.headinp-tab li').length; i++) {
            if ($('.headinp-tab li').eq(i).hasClass('inp-liact')) {
                sessionStorage.setItem('searchType', $('.headinp-tab li').eq(i).attr('code'));
                searchType =  $('.headinp-tab li').eq(i).attr('code');
            }
        }
        searchVal =  $('#searchInp').val().replace(/\s/g, '');
        sessionStorage.setItem('searchVal', searchVal);
        window.location.href = 'appointment.html?searchType=' +
            searchType + '&searchVal=' + searchVal;
    });
    $('#dingdanBtn').click(function () {
        window.location.href = 'myAppointment.html'
    })
    var authToken = localStorage.getItem('authToken');
    $('#logout').click(function () {
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
            url: roadPath +  '/login/exit',
            data: jsonParam,
            success: function (resultMsg) {
                if (resultMsg.retCode == 0) {
                    localStorage.setItem('authToken', '');
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
})