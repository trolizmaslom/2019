/*валидация формы*/
function validate(form, options){
    var setings = {
        errorFunction:null,
        submitFunction:null,
        highlightFunction:null,
        unhighlightFunction:null
    };
    $.extend(setings, options);
    var $form = $(form);
    if ($form.length && $form.attr('novalidate') === undefined) {
        $form.on('submit', function(e) {
            e.preventDefault();
        });
        $form.validate({
            errorClass : 'errorText',
            focusCleanup : true,
            focusInvalid : false,
            invalidHandler: function(event, validator) {
                if(typeof(setings.errorFunction) === 'function'){
                    setings.errorFunction(form);
                }
            },
            errorPlacement: function(error, element) {
                error.appendTo( element.closest('.form_input'));
            },
            highlight: function(element, errorClass, validClass) {
                $(element).addClass('error');
                $(element).closest('.form_row').addClass('error').removeClass('valid');
                if( typeof(setings.highlightFunction) === 'function' ) {
                    setings.highlightFunction(form);
                }
            },
            unhighlight: function(element, errorClass, validClass) {
                $(element).removeClass('error');
                if($(element).closest('.form_row').is('.error')){
                    $(element).closest('.form_row').removeClass('error').addClass('valid');
                }
                if( typeof(setings.unhighlightFunction) === 'function' ) {
                    setings.unhighlightFunction(form);
                }
            },
            submitHandler: function(form) {
                if( typeof(setings.submitFunction) === 'function' ) {
                    setings.submitFunction(form);
                } else {
                    $form[0].submit();
                }
            }
        });
        $('[required]',$form).each(function(){
            $(this).rules( "add", {
                required: true,
                messages: {
                    required: "Вы пропустили"
                }
            });
        });
        if($('[type="email"]',$form).length) {
            $('[type="email"]',$form).rules( "add",
                {
                    messages: {
                        email: "Невалидный email"
                    }
                });
        }
        if($('.tel-mask[required]',$form).length){
            $('.tel-mask[required]',$form).rules("add",
                {
                    messages:{
                        required:"Введите номер мобильного телефона."
                    }
                });
        }
        $('[type="password"]',$form).each(function(){
            if($(this).is("#re_password") == true){
                $(this).rules("add", {
                    minlength:3,
                    equalTo:"#password",
                    messages:{
                        equalTo:"Неверный пароль.",
                        minlength:"Недостаточно символов."
                    }
                });
            }
        })
    }
}
/*Отправка формы с вызовом попапа*/
function validationCall(form){
    var thisForm = $(form);
    var formSur = thisForm.serialize();
    $.ajax({
        url : thisForm.attr('action'),
        data: formSur,
        method:'POST',
        success : function(data){
            if ( data.trim() == 'true') {
                thisForm.trigger("reset");
                popNext("#call_success", "call-popup");
            }
            else {
                thisForm.trigger('reset');
            }
        }
    });
}
/* Отправка формы с файлaми */
/* не использовать input[type="file"] в форме и не забыть дописать форме enctype="multipart/form-data" */
function validationCallDocuments(form){
    var thisForm = $(form);
    var formData = new FormData($(form)[0]);
    $.each(thisForm.find('input[type="file"]')[0].files, function(index, file){
        formData.append('file['+index+']', file);
    });
    $.ajax({
        url: thisForm.attr('action'),
        type: "POST",
        data: formData,
        contentType:false,
        processData:false,
        cache:false,
        success: function(response) {
            thisForm.trigger("reset");
            popNext("#call_success", "call-popup");
        }
    });

}

function popNext(popupId){
    $.fancybox.open({
        src:popupId,
        opts:{
            afterClose: function(){
                $('form').trigger("reset");
                clearTimeout(timer);
            }
        }
    });
    var timer = null;
    timer = setTimeout(function(){
        $('form').trigger("reset");
        $.fancybox.close(popupId);
    },2000);
}
/*маска на инпуте*/
function Maskedinput(){
    if($('.tel-mask')){
        $('.tel-mask').mask('+9 (999) 999-99-99 ');
    }
}

function animationBlock(item){

    $(window).scroll(function(){
        checkForAnimate();
    });

    function checkForAnimate(){
        var bottomCheck = $(window).height()+$(window).scrollTop();
        var windowTop = $(window).scrollTop()+($(window).height()/1.5);
        item.each(function(){
            if(windowTop>$(this).offset().top || bottomCheck > $('body').height()*0.98){

                var itemSect = $(this);
                var point = 0;
                itemSect.find('.animate-it').addClass('animated');

                var timer = setInterval(function(){
                    itemSect.find('.animate-delay').eq(point).addClass('animated');
                    point++;
                    if(itemSect.find('.animate-delay').length == point){
                        clearInterval(timer);
                    }
                },200);


            }
        });
    }
    checkForAnimate();
}
function goTo(){
    $('.header-menu a').click(function(e){
        e.preventDefault();
        var href = $(this).attr('href');
        var target = $(href).offset().top-65;
        $(scroller).animate({scrollTop:target},500);
    });
}
$(document).ready(function() {
    $('.footer_placeholder').height($('.footer').outerHeight());
    //animationBlock($('.section-animate'));
    validate('#call-popup .contact-form', {submitFunction:validationCall});
    Maskedinput();
});
$(window).resize(function() {
    $('.footer_placeholder').height($('.footer').outerHeight());
});
(function(window, document) {
    'use strict';
    if (!document.createElementNS || !document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect) return true;
    var isLocalStorage = 'localStorage' in window && window['localStorage'] !== null,
        request,
        data,
        insertIT = function() {
            document.body.insertAdjacentHTML('afterbegin', data);
        },
        insert = function() {
            if (document.body) insertIT();
            else document.addEventListener('DOMContentLoaded', insertIT);
        };
    if (isLocalStorage && localStorage.getItem('inlineSVGrev') == revision) {
        data = localStorage.getItem('inlineSVGdata');
        if (data) {
            insert();
            return true;
        }
    }
    try {
        request = new XMLHttpRequest();
        request.open('GET', file, true);
        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                data = request.responseText;
                insert();
                if (isLocalStorage) {
                    localStorage.setItem('inlineSVGdata', data);
                    localStorage.setItem('inlineSVGrev', revision);
                }

            }
        }
        request.send();
    } catch (e) {}
}(window, document));