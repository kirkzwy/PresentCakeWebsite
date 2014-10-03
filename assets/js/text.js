/**
 * @Copyright Copyright 2014, LangLee
 * @Descript: 注册
 * @Author	: cn.LangLee@hotmail.com
 * @Depend	: jquery-1.10.2.js(1.10.2 or later)
 * $Id: if.Com.Reg.js  2013-11-12 05:28:06Z LangLee $
 */

$(function(){
	
	var _regData = {};
	var emailError = null;
	var userError = null;
	var passError = null;
	var username_20	= '<span id="username_errtext" class="user-input-er-span"><b>需3-20个字符</b><i></i></span>';
	var username_30 = '<span id="username_errtext" class="user-input-er-span"><b>用户名已存在</b><i></i></span>';
	var username_40 = '<span id="username_errtext" class="user-input-er-span"><b>包含敏感词</b><i></i></span>';
	var username_50 = '<span id="username_errtext" class="user-input-er-span"><b>用户名不能为邮箱</b><i></i></span>';
	
	var password_10 = '<span id="password_errtext" class="user-input-er-span"><b>未填写密码</b><i></i></span>';
	var password_20	= '<span id="password_errtext" class="user-input-er-span"><b>需至少6位</b><i></i></span>';
	var password_30	= '<span id="password_errtext" class="user-input-er-span"><b>两次输入不符</b><i></i></span>';
	
	var email_10	= '<span id="email_errtext" class="user-input-er-span"><b>未填写邮箱</b><i></i></span>';
	var email_20	= '<span id="email_errtext" class="user-input-er-span"><b>邮箱格式无效</b><i></i></span>';
	var email_30	= '<span id="email_errtext" class="user-input-er-span"><b>邮箱已被注册</b><i></i></span>';
	
	var okText = '<span id="oktext" class="user-input-ri-span"></span>';
	
	// 存储默认数据
	var valDefault = [];
	$('input.user-input').each(function(i, ele){
		valDefault[i] = ele.value;
	});
	// 邮箱验证规则
	var reg_email = /^[a-z0-9.!\\#$%&\\'*+-/=?^_`{|}~]+@([0-9.]+|([^\s\'"<>]+\\.+[a-z]{2,6}))$/;
	
	
	
	$('#username').focus(function(){

		$(this).next("span").remove();
		$(this).removeClass('input-ri');
		$(this).removeClass('input-er');

	}).blur(function(){
		if( valDefault[0] == $(this).val() ){
			return;
		}
		var nameLen = $(this).val().length;
		if( nameLen < 3 || nameLen > 20 ){
			$(this).addClass('input-er');
			$(this).after(username_20);
		}else if( reg_email.test( $(this).val() ) ){
			$(this).addClass('input-er');
			$(this).after(username_50);
		}else{
			var regData = _regData;
			regData.name	= ($('#username').val() == valDefault[0]) ? '' : $('#username').val();
			regData.pwd		= ($('#password').val() == valDefault[1]) ? '' : $('#password').val();
			regData.email	= ($('#email').val() == valDefault[3]) ? '' : $('#email').val();
			regData._b		= IF.CLIENT.build;
			regData._s		= IF.ME.sid;
			$.ajax({
				type:	'post',
				url:	'_register.php',
				async : false,
				data:	regData,
				success: function(emsg){
					var res = eval('('+emsg+')');
					if( res[1]['checkRes'][0] == 30 ){
						$('#username').addClass('input-er');
						$('#username').after(username_30);
						userError = 30;
					}
					if( res[1]['checkRes'][0] == 40 ){
						$('#username').addClass('input-er');
						$('#username').after(username_40);
						userError = 40;
					}
					if( res[1]['checkRes'][0] == 0 ){
						$('#username').addClass('input-ri');
						$('#username').after(okText);
						userError = 0;
					}
				}
			});
		}
	});
	
	
	// 密码
	$('#password').focus(function(){
		$(this).next("span").remove();
		$(this).removeClass('input-ri');
		$(this).removeClass('input-er');
	}).blur(function(){
		if( valDefault[1] == $(this).val() ){
			return;
		}
		var pwd = $(this).val();
		if( $(this).attr('type') != 'password' || !pwd ){
			return;
		}else{
			$(this).next("span").remove();
			$(this).removeClass('input-ri');
			$(this).removeClass('input-er');
			var pwdLen = pwd.length;
			if( pwdLen < 6 ){
				$(this).addClass('input-er');
				$(this).after(password_20);
				passError = 20;
			}else{
				$(this).addClass('input-ri');
				$(this).after(okText);
				passError = 0;
			}
		}
		var pwd2 = $('#password2').val();
		if( pwd2 && pwd2 != valDefault[2] ){
			$('#password2').next("span").remove();
			$('#password2').removeClass('input-ri');
			$('#password2').removeClass('input-er');
			if( pwd2 != pwd ){
				$('#password2').addClass('input-er');
				$('#password2').after(password_30);
				passError = 30;
			}else{
				$('#password2').addClass('input-ri');
				$('#password2').after(okText);
				passError = 0;
			}
		}
	});
	
	// 确认密码
	$('#password2').focus(function(){
		$(this).next("span").remove();
		$(this).removeClass('input-ri');
		$(this).removeClass('input-er');
	}).blur(function(){
		var pwd2 = $(this).val();
		var pwd = $('#password').val();
		
		if( $(this).attr('type') != 'password' || valDefault[3] == $(this).val() ){
			return;
		}
		// 如果第一次密码是text类型时，清空确定密码，返回到第一次密码输入框
		if( $('#password').attr('type') == 'text' ||  pwd.length < 6  ){
			$('#password').focus();
			return;
		}
		$(this).next("span").remove();
		$(this).removeClass('input-ri');
		$(this).removeClass('input-er');
		if( pwd2 != pwd ){
			$(this).addClass('input-er');
			$(this).after(password_30);
			passError = 30;
		}else{
			$(this).addClass('input-ri');
			$(this).after(okText);
			passError = 0;
		}
		
	});
	
	// 邮箱
	$('#email').focus(function(){
		$(this).next("span").remove();
		$(this).removeClass('input-ri');
		$(this).removeClass('input-er');
	}).blur(function(){
		if( valDefault[3] == $(this).val() ){
			return;
		}
		if( !reg_email.test( $('#email').val() ) ){
			$(this).addClass('input-er');
			$(this).after(email_20);
		}else{
			var regData = _regData;
			regData.name	= ($('#username').val() == valDefault[0]) ? '' : $('#username').val();
			regData.pwd		= ($('#password').val() == valDefault[1]) ? '' : $('#password').val();
			regData.email	= ($('#email').val() == valDefault[3]) ? '' : $('#email').val();
			regData._b		= IF.CLIENT.build;
			regData._s		= IF.ME.sid;
			$.ajax({
				type:	'post',
				url:	'_register.php',
				async : false,
				data:	regData,
				success: function(emsg){
					var res = eval('('+emsg+')');
					if( res[1]['checkRes'][2] == 20 ){
						$('#email').addClass('input-er');
						$('#email').after(email_20);
						emailError = 20;
					}
					if( res[1]['checkRes'][2] == 30 ){
						$('#email').addClass('input-er');
						$('#email').after(email_30);
						emailError = 30;
					}
					if( res[1]['checkRes'][2] == 0 ){
						$('#email').addClass('input-ri');
						$('#email').after(okText);
						emailError = 0;
					}
				}
			});
		}
		
	});
	
	// 注册
	$("#regInputSubmit").click(function(){
		if ( !$('#eulaCheck' ).is(':checked') ) {
			errorTip('请接受 《版权声明》 和 《隐私保护》条款！', 2);
			return false;
		}
//		alert ('aaa');
		var newVal = [];

		$('input.user-input').each(function(i, ele){
			newVal[i] = ele.value;
		});

		if ( newVal[0] == valDefault[0] || newVal[1] == valDefault[1] || newVal[2] == valDefault[2] || newVal[3] == valDefault[3]){
			errorTip('请先完善注册信息！', 2);
			return false;
		}
		// 用户名
		if ( userError == 20 ) {
			errorTip('需3-20个字符！', 2);
			return false;
		};
		if ( userError == 30 ) {
			errorTip('用户名已存在！', 2);
			return false;
		};
		if ( userError == 40 ) {
			errorTip('包含敏感词！', 2);
			return false;
		}

		// 密码
		if ( passError == 10 ) {
			errorTip('未填写密码！', 2);
			return false;
		};
		if ( passError == 20 ) {
			errorTip('需至少6位！', 2);
			return false;
		};
		if ( passError == 30 ) {
			errorTip('两次输入不符！', 2);
			return false;
		};

		// 邮箱
		if ( emailError == 10 ) {
			errorTip('未填写邮箱！', 2);
			return false;
		};
		if ( emailError == 20 ) {
			errorTip('邮箱格式无效！', 2);
			return false;
		};
		if ( emailError == 30 ) {
			errorTip('邮箱已被注册！', 2);
			return false;
		};


		var regData = _regData;
		regData.name	= ($('#username').val() == valDefault[0]) ? '' : $('#username').val();
		regData.pwd		= ($('#password').val() == valDefault[1]) ? '' : $('#password').val();
		regData.email	= ($('#email').val() == valDefault[3]) ? '' : $('#email').val();
		regData.act		= 'reg';
		regData._b		= IF.CLIENT.build;
		regData._s		= IF.ME.sid;
		$.ajax({
			type:	'post',
			url:	'_register.php',
			async : false,
			data:	regData,
			success: function(message){
//				var data = eval('('+data+')');
				var data = $.parseJSON(message);
				if ( data[1]['act'] == 'reg' && data[1]['checkRes'] ){
					if(data[1]['checkRes'][0] == 20){
						errorTip('用户名不合法！', 3);
					}else if(data[1]['checkRes'][0] == 30){
						errorTip('用户名包含不允许注册的词语！', 3);
					}else if(data[1]['checkRes'][0] == 40){
						errorTip('用户名已经存在！', 3);
					}else if(data[1]['checkRes'][2] == 20){
						errorTip('Email 格式有误！', 3);
					}else if(data[1]['checkRes'][2] == 30){
						errorTip('该 Email 不允许注册！', 3);
					}else if(data[1]['checkRes'][2] == 40){
						errorTip('该 Email 已经被注册！', 3);
					}else if(data[1]['checkRes'][1] == 20){
						redirectTip('未知错误,刷新下再注册',3);
					}
				}else {
					var jsonurl = data[1]['ucCode'];
					if ( data[1].ucCode ){
						$('.footer').after(jsonurl);
					};
					redirectTip('恭喜你，注册成功!', true, './', 0);

				};
			}
		});
		return false;

	});
});