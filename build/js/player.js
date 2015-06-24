// Wait for the DOM content to load
document.addEventListener('DOMContentLoaded', function(){
  var context = new Custom.di.CustomContext();
  var player = new MediaPlayer(context);
  player.startup();
  player.attachView(document.querySelector("#videoplayer"));
  player.setAutoPlay(true);
  player.attachSource("http://amssamples.streaming.mediaservices.windows.net/bc57e088-27ec-44e0-ac20-a85ccbcd50da/TearsOfSteel.ism/manifest", null,null);
});

function setupVideo(url) {
  player.startup();
  player.attachView(document.querySelector('#videoplayer'));
  player.setAutoPlay(true);
  player.attachSource(url);
}