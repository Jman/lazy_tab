(function(){

    "use strict";

    var OPCForm = {

      extensions_id : chrome.runtime.id,

      defaultFORMData: require('./data/default.json'),

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
        localStorage.setItem('users', JSON.stringify(this.users));
      },

      clickHandler(tab){
          if(this.users.length > 1) {
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
            if(request.user !== undefined){
              sendResponse(this.users[request.user]);
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


