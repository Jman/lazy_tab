/*global chrome:false */
/*jshint eqeqeq:true, bitwise:true, strict:true, browser:true, unused:true */

(function(win, doc, undefined){

    "use strict";

    var form = doc.getElementById('form'),
        submit = doc.getElementById('submit'),
        reset = doc.getElementById('reset'),
        fields = [].filter.call( form, function(el){ return el.value !== undefined; }),
        onchange = function(){
            var hidden = [].slice.call(this.parentNode.querySelectorAll('[type="hidden"]')),
                value = this.value;
            hidden.forEach(function(el){ el.value = value; });
        },
        saveform = function(e){
            e.preventDefault();
            fields.forEach(function(el){
                if(el.value !== undefined){
                    localStorage[el.name] = el.value;
                }
            });
            chrome.extension.sendMessage({ setFormData: true });
        },
        resetform = function(e){
            e.preventDefault();
            localStorage.clear();
            chrome.extension.sendMessage({ setFormData: true }, fillform);
        },
        fillform = function(FORMData){
            fields.forEach(function(el){
                if(FORMData[el.name]){
                    el.value = FORMData[el.name];
                }
            });
        },
        initform = function(){

            submit.addEventListener('click', saveform, false);
            reset.addEventListener('click', resetform, false);
            fields.forEach(function(el){
                el.addEventListener('change', onchange, false);
            });

            chrome.extension.sendMessage({ getFormData: true }, fillform);
        };

    initform();

})(window, document);