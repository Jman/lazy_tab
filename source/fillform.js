/*jshint boss:true*/

(function(doc){

    "use strict";

    let keyboardEvent = document.createEvent('UiEvent'),
        selectEvent = document.createEvent('UiEvent'),
        processSelect = function(el, val){
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
                elem.dispatchEvent(keyboardEvent);
            } else if(elem.tagName.toLowerCase() === 'select') {
                processSelect(elem, value.toLowerCase());
                elem.dispatchEvent(selectEvent);
            }
            elem.blur();
        },
        fillForm = function(FORMData){
          Object.keys(FORMData).forEach(function(name){
            [...doc.querySelectorAll('[name*="'+ name +'"]')].forEach(function(elem){
              processElement(elem, FORMData[name]);
            });
          });
          // M1 Shipping
          [...doc.querySelectorAll('[name^="shipping"]')].forEach(function(elem){
            if(FORMData[elem.name]){
              processElement(elem, FORMData[elem.name]);
            }
          });
          // M2 Shipping
          [...doc.getElementById('co-shipping-form')].forEach(function(elem){
            if(FORMData['shipping['+ elem.name +']']){
              processElement(elem, FORMData['shipping['+ elem.name +']']);
            }
          });
        };

    keyboardEvent.initEvent('keyup', true, true);
    selectEvent.initEvent('change', true, true);

    chrome.extension.sendMessage({ getFormData: true, user: 0 }, fillForm);

})(document);
