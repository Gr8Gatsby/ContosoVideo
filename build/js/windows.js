function setAppBarColors(brandColorHex, brandColorInactiveHex) {
   if (typeof Windows !== 'undefined') {
        var brandColor = hexStrToRGBA(brandColorHex);
        var brandColorInactive = hexStrToRGBA(brandColorInactiveHex); 

        var appTitleBar = Windows.UI.ViewManagement.ApplicationView.getForCurrentView().titleBar;

        //var brandColor = { r: 0x00, g: 0x3B, b: 0x53, a: 0x53 };
        //var brandColorInactive = { r: 0xE6, g: 0xE6, b: 0xE6, a: 0xFF };
        var black = { r: 0, g: 0, b: 0, a: 0xFF };
        var white = { r: 0xFF, g: 0xFF, b: 0xFF, a: 0xFF };

        appTitleBar.foregroundColor = white;
        appTitleBar.backgroundColor = brandColor;

        appTitleBar.buttonForegroundColor = white;
        appTitleBar.buttonBackgroundColor = brandColor;

        appTitleBar.buttonHoverForegroundColor = white;
        appTitleBar.buttonHoverBackgroundColor = brandColor;

        appTitleBar.buttonPressedForegroundColor = brandColor;
        appTitleBar.buttonPressedBackgroundColor = white;

        appTitleBar.inactiveBackgroundColor = brandColorInactive;
        appTitleBar.inactiveForegroundColor = brandColor;

        appTitleBar.buttonInactiveForegroundColor = brandColor;
        appTitleBar.buttonInactiveBackgroundColor = brandColorInactive;

        appTitleBar.buttonInactiveHoverForegroundColor = brandColor;
        appTitleBar.buttonInactiveHoverBackgroundColor = brandColorInactive;

        appTitleBar.buttonPressedForegroundColor = brandColor;
        appTitleBar.buttonPressedBackgroundColor = brandColorInactive;
    }
}

function hexStrToRGBA(hexStr){
  // RGBA color object
  var colorObject = { r: 255, g: 255, b: 255, a: 255 };
    
  // remove hash if it exists
  hexStr = hexStr.replace('#', '');
  
  if (hexStr.length === 6) {
    // No Alpha
    colorObject.r = parseInt(hexStr.slice(0, 2),16);
    colorObject.g = parseInt(hexStr.slice(2, 4),16);
    colorObject.b = parseInt(hexStr.slice(4, 6),16);
    colorObject.a = parseInt('0xFF',16);
  } else if (hexStr.length === 8) {
    // Alpha
    colorObject.r = parseInt(hexStr.slice(0, 2),16);
    colorObject.g = parseInt(hexStr.slice(2, 4),16);
    colorObject.b = parseInt(hexStr.slice(4, 6),16 );
    colorObject.a = parseInt(hexStr.slice(6, 8),16);
  } else if (hexStr.length === 3) {
    // Shorthand hex color
    var rVal = hexStr.slice(0, 1);
    var gVal = hexStr.slice(1, 2);
    var bVal = hexStr.slice(2, 3);
    colorObject.r = parseInt(rVal + rVal,16);
    colorObject.g = parseInt(gVal + gVal,16);
    colorObject.b = parseInt(bVal + bVal,16);
  } else {
    throw new Error('Invalid HexString length. Expected either 8, 6, or 3. The actual length was ' + hexStr.length);
  }
  return colorObject;
}