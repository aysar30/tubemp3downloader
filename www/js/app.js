angular.module('ymp3d', ['ionic', 'ngCordova'])
.service('video', function() {
  video = this;
  video.videoInfo = [];
})
.run(function($ionicPlatform, $rootScope, $cordovaFile, video) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.backgroundColorByHexString("#d00000");
    }
    if(window.plugins.intent) {
      window.plugins.intent.getCordovaIntent(function (Intent) {
        video.videoInfo = Intent;    
        $rootScope.$broadcast('$videoShared');
        });
      window.plugins.intent.setNewIntentHandler(function (Intent) {
        video.videoInfo = Intent;    
        $rootScope.$broadcast('$videoShared');    
      });
    }
    function onLoad() {
        if(( /(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent) )) {
            document.addEventListener('deviceready', initApp, false);
        } else {
            initApp();
        }
    }
    
      var admobid = {};
      if( /(android)/i.test(navigator.userAgent) ) {
          admobid = { // for Android
              banner: 'ca-app-pub-2425632328211416/8695930682'
          };
      } else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
          admobid = { // for iOS
              banner: 'ca-app-pub-2425632328211416/8695930682'
          };
      } else {
          admobid = { // for Windows Phone
              banner: 'ca-app-pub-2425632328211416/8695930682'
          };
      }

      if(( /(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent) )) {
          document.addEventListener('deviceready', initApp, false);
      } else {
          initApp();
      }
      function initApp() {
          if (! AdMob ) { alert( 'Ads error' ); return; }

          AdMob.createBanner( {
              adId: admobid.banner,
              isTesting: false,
              overlap: false,
              offsetTopBar: false,
              position: AdMob.AD_POSITION.BOTTOM_CENTER,
              bgColor: '#f9f9f9'
          } );
      }
  });
})
.controller('appCtrl', function($rootScope, $scope, video, $ionicPlatform, $http, $timeout, $cordovaFileTransfer, $cordovaFileOpener2, $ionicPopup) {
  if (typeof window.analytics !== 'undefined'){
    window.analytics.startTrackerWithId('UA-64581793-5');
      window.analytics.trackView('Main page');
    }
  $scope.$on('$videoShared', function() {   
    $scope.apiResult = {}; 
    $scope.shared = true;
    $scope.downloading = false;  
    $scope.open = false;
    $scope.errorMessage = false; 
    $scope.downloadProgress = 0;    
    $ionicPlatform.ready(function() {
      $http.get('http://www.youtubeinmp3.com/fetch/?format=JSON&video=https://www.youtube.com/watch?v=' + video.videoInfo.clipItems[0].text.slice(17))
      .then(function(result) {
        if (result.data != '<meta http-equiv="refresh" content="0; url=http://www.youtubeinmp3.com/download/?video=https://www.youtube.com/watch?v='+video.videoInfo.clipItems[0].text.slice(17)+'&autostart=1"/>') {
          $scope.apiResult = result.data;
          $scope.downloading = true;
          $rootScope.filePath = cordova.file.externalRootDirectory + 'Music/' + result.data.title.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '') + '.mp3';
          $timeout(function(){
            $cordovaFileTransfer.download($scope.apiResult.link, $rootScope.filePath, true)
              .then(function(result) {
                $scope.downloading = false;
                $scope.open = true;
              }, function(err) {   
              $scope.downloading = false;       
                $scope.errorMessage = true;
              }, function (progress) {
              $timeout(function () {
                $scope.downloadProgress = (progress.loaded / progress.total) * 100;              
              })
            })
          }, 5000)
        } else {$scope.errorMessage = true;}
      })
    })
  });
  $scope.retry = function() {
    $rootScope.$broadcast('$videoShared');
  };
  $scope.openfile = function() {
    $cordovaFileOpener2.open(
      $rootScope.filePath,
      'audio/*'
    ).then(function() {
        
    }, function(err) {
        alert('Error opening file');
    });
  };
})