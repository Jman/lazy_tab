/*jshint boss:true*/

(function(doc){

    "use strict";

    var processSelect = function(el, val){
            for(var i = 0, l = el.length; i < l; i++ ){
                if( el.options[i].value.toLowerCase() === val ||
                    el.options[i].title.toLowerCase() === val ||
                    el.options[i].innerHTML.toLowerCase() === val ){
                    el.selectedIndex = i;
                }
            }
        },
        processElement = function(elem, value){
            elem.focus();
            if(elem.tagName.toLowerCase() === 'input'){
                elem.value = value;
            } else if(elem.tagName.toLowerCase() === 'select') {
                processSelect(elem, value.toLowerCase());
            }
            elem.blur();
        },
        fillForm = function(FORMData){
            Object.keys(FORMData).forEach(function(name){
                [].slice.call(doc.querySelectorAll('[name*="'+ name +'"]')).forEach(function(elem){
                    processElement(elem, FORMData[name]);
                });
            });
            [].slice.call(doc.querySelectorAll('[name^="shipping"]')).forEach(function(elem){
                if(FORMData[elem.name]){
                    processElement(elem, FORMData[elem.name]);
                }
            });
        };

    chrome.extension.sendMessage({ getFormData: true }, fillForm);

})(document);
