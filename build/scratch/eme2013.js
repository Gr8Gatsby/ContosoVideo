// Gets the mpd file and parses it

var data= {};

function getData(url) {
  if (url !== "") {
    var xhr = new XMLHttpRequest(); // Set up xhr request
    xhr.open("GET", url, true); // Open the request
    xhr.responseType = "text"; // Set the type of response expected
    xhr.send();

    //  Asynchronously wait for the data to return
    xhr.onreadystatechange = function () {
      if (xhr.readyState == xhr.DONE) {
        var tempoutput = xhr.response;
        var parser = new DOMParser(); //  Create a parser object

        // Create an xml document from the .mpd file for searching
        var xmlData = parser.parseFromString(tempoutput, "text/xml", 0);
        log("parsing mpd file");

        // Get and display the parameters of the .mpd file
        getFileType(xmlData);

        // Set up video object, buffers, etc
        setupVideo();

        // Initialize a few variables on reload
        clearVars();
      }
    }

    // Report errors if they happen during xhr
    xhr.addEventListener("error", function (e) {
      log("Error: " + e + " Could not load url.");
    }, false);
  }
}


function getFileType(data) {
  try {
    data = {};
    data.mediaFile = data.querySelectorAll("BaseURL")[0].textContent.toString();
    var rep = data.querySelectorAll("Representation");
    data.type = rep[0].getAttribute("mimeType");
    data.codecs = rep[0].getAttribute("codecs");
    data-width = rep[0].getAttribute("width");
    data.height = rep[0].getAttribute("height");
    data-bandwidth = rep[0].getAttribute("bandwidth");
    var ini = data.querySelectorAll("Initialization");
    data.initialization = ini[0].getAttribute("range");
    segments = data.querySelectorAll("SegmentURL");
    // Get the length of the video per the .mpd file
    //   since the video.duration will always say infinity
    var period = data.querySelectorAll("Period");
    var vidTempDuration = period[0].getAttribute("duration");
    data.vidDuration = parseDuration(vidTempDuration); // display length

    var segList = data.querySelectorAll("SegmentList");
    data.segmentLength = segList[0].getAttribute("duration");

  } catch (er) {
    log(er);
    return;
  }
 console.log(data);
}

function setupVideo() {

  //  Create the media source
  if (window.MediaSource) {
    mediaSource = new window.MediaSource();
   } else {
    log("mediasource or syntax not supported");
    return;
  }
  var url = URL.createObjectURL(mediaSource);
  videoElement.pause();
  videoElement.src = url;
  videoElement.width = data.width;
  videoElement.height = data.height;

  // Wait for event that tells us that our media source object is
  //   ready for a buffer to be added.
  mediaSource.addEventListener('sourceopen', function (e) {
    try {
      videoSource = mediaSource.addSourceBuffer('video/mp4');
      initVideo(initialization, file);
    } catch (e) {
      log('Exception calling addSourceBuffer for video', e);
      return;
    }
  },false);


  //  Load video's initialization segment
function initVideo(range, url) {
  var xhr = new XMLHttpRequest();
  if (range || url) { // make sure we've got incoming params

    // Set the desired range of bytes we want from the mp4 video file
    xhr.open('GET', url);
    xhr.setRequestHeader("Range", "bytes=" + range);
    segCheck = (timeToDownload(range) * .8).toFixed(3); // use .8 as fudge factor
    xhr.send();
    xhr.responseType = 'arraybuffer';
    try {
      xhr.addEventListener("readystatechange", function () {
         if (xhr.readyState == xhr.DONE) { // wait for video to load
          // Add response to buffer
          try {
            videoSource.appendBuffer(new Uint8Array(xhr.response));
            // Wait for the update complete event before continuing
            videoSource.addEventListener("update",updateFunct, false);

          } catch (e) {
            log('Exception while appending initialization content', e);
          }
        }
      }, false);
    } catch (e) {
      log(e);
    }
  } else {
    return // No value for range or url
  }
}

function updateFunct() {
  //  This is a one shot function, when init segment finishes loading,
  //    update the buffer flag, call getStarted, and then remove this event.
  bufferUpdated = true;
  getStarted(file); // Get video playback started
  //  Now that video has started, remove the event listener
  videoSource.removeEventListener("update", updateFunct);
}

function timeToDownload(range) {
  var vidDur = range.split("-");
  // Time = size * 8 / bitrate
  return (((vidDur[1] - vidDur[0]) * 8) / bandwidth)
}



//  Get video segments
function fileChecks() {
  // If we're ok on the buffer, then continue
  if (bufferUpdated == true) {
    if (index < segments.length) {
      // Loads next segment when time is close to the end of the last loaded segment
      if ((videoElement.currentTime - lastTime) >= segCheck) {
        playSegment(segments[index].getAttribute("mediaRange").toString(), file);
        lastTime = videoElement.currentTime;
        curIndex.textContent = index + 1; // Display current index
        index++;
      }
    } else {
      videoElement.removeEventListener("timeupdate", fileChecks, false);
    }
  }
}

//  Play segment plays a byte range (format nnnn-nnnnn) of a media file
function playSegment(range, url) {
  var xhr = new XMLHttpRequest();
  if (range || url) { // Make sure we've got incoming params
    xhr.open('GET', url);
    xhr.setRequestHeader("Range", "bytes=" + range);
    xhr.send();
    xhr.responseType = 'arraybuffer';
    try {
      xhr.addEventListener("readystatechange", function () {
        if (xhr.readyState == xhr.DONE) { //wait for video to load
          //  Calculate when to get next segment based on time of current one
            segCheck = (timeToDownload(range) * .8).toFixed(3); // Use .8 as fudge factor
            segLength.textContent = segCheck;
          // Add received content to the buffer
          try {
            videoSource.appendBuffer(new Uint8Array(xhr.response));
          } catch (e) {
            log('Exception while appending', e);
          }
        }
      }, false);
    } catch (e) {
      log(e);
      return // No value for range
    }
  }
}


