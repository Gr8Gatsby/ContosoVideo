// Handle Cortana activation adding the event listener before DOM Content Loaded
// parse out the command type and call the respective game APIs
if (typeof Windows !== 'undefined') {
  console.log("Windows namespace is available");
  // Subscribe to the Windows Activation Event
  Windows.UI.WebUI.WebUIApplication.addEventListener("activated", function (args) {
    var activation = Windows.ApplicationModel.Activation;
    // Check to see if the app was activated by a voice command
    if (args.kind === activation.ActivationKind.voiceCommand) {

      var speechRecognitionResult = args.result;
      var textSpoken = speechRecognitionResult.text;

      // Determine the command type {play} defined in vcd
      if (speechRecognitionResult.rulePath[0] === "play") {
        // Determine the stream name specified
        if (textSpoken.includes('elephants') || textSpoken.includes('Elephants')) {
          // Movie selected is Elephants Dream
          setupVideo("http://amssamples.streaming.mediaservices.windows.net/b6822ec8-5c2b-4ae0-a851-fd46a78294e9/ElephantsDream.ism/manifest(filtername=FirstFilter)");
        }
        else if (textSpoken.includes('Steel') || textSpoken.includes('steel') ) {
          // Stream selected is Tears of Steel
          setupVideo("http://amssamples.streaming.mediaservices.windows.net/bc57e088-27ec-44e0-ac20-a85ccbcd50da/TearsOfSteel.ism/manifest");
        }
        else {
          // No stream specified by user
          console.log("No valid stream specified");
        }
      }
      else { 
        // No valid command specified
        console.log("No valid command specified");
      }
    }
  });
} else {
  console.log("Windows namespace is unavaiable");
}