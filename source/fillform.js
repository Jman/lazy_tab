/*jshint boss:true*/

(function(doc){

    "use strict";

    var elems = doc.querySelectorAll('input, select'),
        i = elems.length, elem,
        fillform = function(FORMData){
            while(elem = elems[--i]){
                if(FORMData[elem.name]){
                    elem.focus();
                    if(elem.tagName.toLowerCase() === 'input'){
                        elem.value = FORMData[elem.name];
                    } else if(elem.tagName.toLowerCase() === 'select') {
                        for(var j = 0, l = elem.length; j < l; j++ ){
                            if( elem.options[j].value.toLowerCase() === FORMData[elem.name].toLowerCase() ||
                                elem.options[j].title.toLowerCase() === FORMData[elem.name].toLowerCase() ||
                                elem.options[j].innerHTML.toLowerCase() === FORMData[elem.name].toLowerCase() ){
                                elem.selectedIndex = j;
                            }
                        }

                    }
                    elem.blur();
                }
            }
        };

    chrome.extension.sendMessage({ getFormData: true }, fillform);

})(document);
