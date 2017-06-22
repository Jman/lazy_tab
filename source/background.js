(function(){

    "use strict";

    var OPCForm = {

      extensions_id : chrome.runtime.id,

      defaultFORMData: {

        "firstname" : "John",
        "lastname"  : "Smith",
        "telephone" : "1-424-280-0000",
        "email"     : "john.smith@example.com",
        "username"  : "john.smith@example.com",
        "street"    : "Coldwater Canyon Dr",
        "city"      : "Beverly Hills",
        "country_id": "US",
        "region_id" : "California",
        "postcode"  : "90210",
        "password"  : "password",
        "confirm"   : "password",

        "shipping[firstname]"   : "Jane",
        "shipping[lastname]"    : "Smith",
        "shipping[telephone]"   : "1-424-280-0000",
        "shipping[email]"       : "jane.smith@example.com",
        "shipping[street][]"    : "Coldwater Canyon Dr",
        "shipping[city]"        : "Beverly Hills",
        "shipping[country_id]"  : "US",
        "shipping[region_id]"   : "California",
        "shipping[postcode]"    : "90210",

        "cc_owner"    : "Visa Test",
        "cc_number"   : "4111111111111111",
        "cc_type"     : "Visa",
        "cc_exp_month": "12",
        "cc_exp_year" : "2022",
        "cc_cid"      : "111"

      },

      users : [
        { }
      ],


      // Update Data for new format
      updateOldData(){
        if(localStorage.length !== 0 && !localStorage.users) {
          let localData = {};

          Object.keys(localStorage).forEach(key => {
            localData[key] = localStorage[key];
          } );

          localStorage.clear();
          localStorage.users = JSON.stringify([localData]);
        }
      },

      syncFORMData() {
        if(localStorage.length !== 0 && localStorage.users){
          Object.assign(this.users, JSON.parse(localStorage.users));
          this.users.forEach(user => {
            if(Object.keys(user).length === 0) {
              Object.assign(user, this.defaultFORMData);
            }
          })
        } else {
          Object.assign(this.users[0], this.defaultFORMData);
        }
      },

      clickHandler(tab){
          if(false) { // For selecting user
              chrome.browserAction.setPopup({
                  tabId: tab.id,
                  popup: 'popup.html'
              })
          } else {
              chrome.tabs.executeScript( tab.id, { file:"fillform.js" });
          }
      },

      prepareResponse(request, sender, sendResponse) {
          if (sender.id !== this.extensions_id ) { return; }
          if(request.getFormData) {
            if(request.index){
              sendResponse(this.users[request.index]);
            } else {
              sendResponse(this.users);
            }
          }
          if(request.setFormData) {
              this.syncFORMData();
              sendResponse(this.users);
          }
      },

      initialize(){
        this.syncFORMData();
        chrome.extension.onMessage.addListener( this.prepareResponse.bind(this) );
        chrome.browserAction.onClicked.addListener( this.clickHandler.bind(this) );

        chrome.runtime.onInstalled.addListener(details => {
          if(details.reason === "update"){
            this.updateOldData()
          }
        });
      }
    };

  OPCForm.initialize();

})();


