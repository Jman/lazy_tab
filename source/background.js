(function(){

    "use strict";

    var OPCForm = {

        extensions_id : chrome.runtime.id,

        defaultFORMData : {

            "login[username]"            : "john.smith@example.com",
            "login[password]"            : "password",

            "firstname"                  : "John",
            "lastname"                   : "Smith",
            "telephone"                  : "1-424-280-0000",
            "email"                      : "john.smith@example.com",
            "street[]"                   : "Coldwater Canyon Dr",
            "city"                       : "Beverly Hills",
            "country_id"                 : "US",
            "region_id"                  : "California",
            "postcode"                   : "90210",
            "password"                   : "password",
            "confirmation"               : "password",

            "billing[firstname]"         : "John",
            "billing[lastname]"          : "Smith",
            "billing[telephone]"         : "1-424-280-0000",
            "billing[email]"             : "john.smith@example.com",
            "billing[street][]"          : "Coldwater Canyon Dr",
            "billing[city]"              : "Beverly Hills",
            "billing[country_id]"        : "US",
            "billing[region_id]"         : "California",
            "billing[postcode]"          : "90210",
            "billing[password]"          : "password",
            "billing[customer_password]" : "password",
            "billing[confirmation]"      : "password",
            "billing[confirm_password]"  : "password",

            "shipping[firstname]"        : "Jane",
            "shipping[lastname]"         : "Smith",
            "shipping[telephone]"        : "1-424-280-0000",
            "shipping[email]"            : "jane.smith@example.com",
            "shipping[street][]"         : "Coldwater Canyon Dr",
            "shipping[city]"             : "Beverly Hills",
            "shipping[country_id]"       : "US",
            "shipping[region_id]"        : "California",
            "shipping[postcode]"         : "90210",
            "shipping[password]"         : "password",
            "shipping[confirmation]"     : "password",

            "payment[cc_owner]"          : "Visa Test",
            "payment[cc_number]"         : "4111 1111 1111 1111",
            "payment[cc_type]"           : "Visa",
            "payment[cc_exp_month]"      : "12",
            "payment[cc_exp_year]"       : "2022",
            "payment[cc_cid]"            : "111"
        },

        FORMData : {},

        syncFORMData : function() {
            var names = Object.keys(this.defaultFORMData),
                i = 0;
            for( i = names.length ; i-- ; ) {
                this.FORMData[names[i]] = this.defaultFORMData[names[i]];
            }
            if(localStorage.length !== 0){
                for( i = names.length; i--; ) {
                    if(localStorage[names[i]] !== undefined){
                        this.FORMData[names[i]] = localStorage[names[i]];
                    }
                }
            }
        },

        fillform : function bg_fillform(tab){
            chrome.tabs.executeScript( tab.id, { file:"fillform.js" });
        },

        prepareResponse : function bg_prepareResponse(request, sender, sendResponse) {
            if (sender.id !== this.extensions_id ) { return; }
            if(request.getFormData) {
                sendResponse(this.FORMData);
            }
            if(request.setFormData) {
                this.syncFORMData();
                sendResponse(this.FORMData);
            }
        },

        initialize : function bg_atachevents(){
            this.syncFORMData();
            chrome.extension.onMessage.addListener( this.prepareResponse.bind(this) );
            chrome.browserAction.onClicked.addListener( this.fillform.bind(this) );
        }
    };

    OPCForm.initialize();

})();


