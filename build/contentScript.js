/*global chrome*/
let KENNEDY = { version: "0.0.0" };
// let recorder;
let recordAudio;
let mediaStream;

var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;

function clickBtn() {
  window.onbeforeunload = function () {
    return "you can not refresh the page";
  };

  const modal = document.createElement("dialog");
  modal.setAttribute(
    "style",
    `padding: 0px; height: 532px; width: 795px; border: none; top: 0px; border-radius: 2px; background-color: white; position: fixed; box-shadow: 0px 12px 48px rgb(29 5 64 / 32%); overflow: hidden;border-radius: 8px; `
  );
  modal.innerHTML = `<iframe id="popup-content"; style="height:100%; width: 100%"></iframe>
  <div style="height: 17px; width: 97%; position: absolute; left: 0; top: 0;" class="window-bar">
  </div>
  <div style="position:absolute; top:0px; right:5px; display: flex; align-items: center;">
    <div id="moveBtn" style="width: 15px; margin-right: 10px;">
      <svg id="i-move" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
        <path d="M3 16 L29 16 M16 3 L16 29 M12 7 L16 3 20 7 M12 25 L16 29 20 25 M25 12 L29 16 25 20 M7 12 L3 16 7 20" />
      </svg>
    </div>
    <div id="fullWindowBtn" style="width: 12px; margin-right: 10px;">
      <svg enable-background="new 0 0 32 32"  id="Слой_1" version="1.1" viewBox="0 0 32 32"  xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Fullscreen_1_"><path d="M31,18c-0.509,0-1,0.438-1,1v11H2V2h11c0.531,0,1-0.469,1-1c0-0.531-0.5-1-1-1H2C0.895,0,0,0.895,0,2v28   c0,1.105,0.895,2,2,2h28c1.105,0,2-0.895,2-2V18.985C32,18.431,31.594,18,31,18z" fill="#121313"/><path d="M31,0H21c-0.552,0-1,0.448-1,1c0,0.552,0.448,1,1,1h7.596L8.282,22.313c-0.388,0.388-0.388,1.017,0,1.405   c0.388,0.388,1.017,0.388,1.404,0L30,3.404V11c0,0.552,0.448,1,1,1s1-0.448,1-1V1v0C32,0.462,31.538,0,31,0z" fill="#121313"/></g><g/><g/><g/><g/><g/><g/>
      </svg>
    </div>
    <button id="closeBtn" style="font-size: 16px; border: none; border-radius: 20px; float: right; background: transparent;">x</button>
  </div>`;
  document.body.appendChild(modal);
  var dialog = document.querySelector("dialog");
  var fullscreen = false;
  dialog.showModal();
  const iframe = document.getElementById("popup-content");
  iframe.src = chrome.extension.getURL("index.html");
  iframe.frameBorder = 0;
  dialog.querySelector("button").addEventListener("click", () => {
    dialog.close();
  });

  const fullScreenBtn = document.getElementById("fullWindowBtn");
  fullScreenBtn.addEventListener("click", () => {
    if (fullscreen) {
      fullscreen = false;
      dialog.style.width = "795px";
      dialog.style.height = "532px";
    } else {
      dialog.style.top = 0;
      dialog.style.left = 0;
      dialog.style.width = "100%";
      dialog.style.height = "100%";
      dialog.style.padding = "unset";
      dialog.style.border = "unset";
      dialog.style.margin = "unset";
      dialog.style.maxWidth = "100%";
      dialog.style.maxHeight = "100%";

      fullscreen = true;
    }
  });

  let draggable = document.getElementById("moveBtn");

  var isMouseDown,
    initX,
    initY,
    height = dialog.offsetHeight,
    width = dialog.offsetWidth;

  document.addEventListener("mousemove", function (e) {
    if (isMouseDown) {
      var cx = e.clientX - 650 - initX,
        cy = e.clientY - initY;
      // if (cx < 0) {
      //   console.log("111???");
      //   console.log(e.clientX);
      //   console.log(initX);
      //   cx = 0;
      // }
      // if (cy < 0) {
      //   cy = 0;
      // }
      if (window.innerWidth - e.clientX + initX < width) {
        cx = window.innerWidth - width;
      }
      if (e.clientY > window.innerHeight - height + initY) {
        cy = window.innerHeight - height;
      }
      dialog.style.left = cx + "px";
      dialog.style.top = cy + "px";
    }
  });

  window.addEventListener("mousedown", function (e) {
    if (draggable.contains(e.target)) {
      draggable.addEventListener("mousedown", function (e) {
        console.log("dialog000>>>", dialog);
        isMouseDown = true;
        document.body.classList.add("no-select");
        initX = dialog.offsetLeft;
        initY = dialog.offsetTop;
      });
    } else {
      isMouseDown = false;
      document.body.classList.remove("no-select");
    }
  });
  document.querySelectorAll("a").forEach((ele) => {
    if (ele.className === 'adhour') {
      chrome.runtime.sendMessage(
        {
          type: "saveProviderNo",
          data: ele.getAttribute("onclick").match(/provider_no\=(\d+)&/)[1],
        },
        function (res) {
          console.log("save provider number response", res);
        }
      );
    }
  });

  chrome.runtime.sendMessage({
    type: "saveProviderName",
    data:
      document
        .querySelectorAll(".title.noprint")[0]
        .innerText.split("HELLO ")[1] || "",
  });
}

// var body = document.querySelector("body");
// var body = document.querySelector("div[class='block right']");
var body = document.getElementById("group");
var extension = `<a class="btnFlat" style="display: inline-flex;" href="javascript:;" id="extension_btn" >
<span style="background-color: #1121B4; height: 18px; padding: 2px 10px 0px 10px;">g</span>
<span style="background-color: #000F99;padding: 2px 10px 0px 10px; color: white;height: 18px;align-items: center;display: flex;">gojitech</span>
</a>`;
body.innerHTML = extension + body.innerHTML;

document.getElementById("extension_btn").addEventListener("click", clickBtn);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (
    request.message === "startRecordingFromContent" ||
    request.message === "startRecordingForDrug" ||
    request.message === "startRecordingForPatient"
  ) {
    console.log("start");
    startTranscription();
  } else if (
    request.message === "stopRecordingFromContent" ||
    request.message === "stopRecordingForDrug" ||
    request.message === "stopRecordingForPatient" ||
    request.message === "stopRecordingForNormal"
  ) {

    console.log("stop");
    console.log("message>>>>>>", request.message);
    recognizing = false;
    recognition.stop();

    if (recordAudio) {
      recordAudio.stopRecording(function () {
        recordAudio.getDataURL(function (audioDataURL) {
          if (request.message === "stopRecordingFromContent")
            chrome.runtime.sendMessage({
              type: "sendStream",
              data: audioDataURL,
              page: "listening",
            });
          if (request.message === "stopRecordingForDrug") {
            // let type =
            //   request.drugStatus === "true"
            //     ? "sendStream"
            //     : "sendStreamForDrug";
            chrome.runtime.sendMessage({
              type: "sendStream",
              data: audioDataURL,
              page: "prescription",
            });
          }

          if (request.message === "stopRecordingForPatient")
            chrome.runtime.sendMessage({
              type: "sendStream",
              data: audioDataURL,
              page: "readyForPatient",
              subPage: request.subPage,
            });
          if (request.message === "stopRecordingForNormal")
            chrome.runtime.sendMessage({
              type: "sendStream",
              data: audioDataURL,
              page: "normalCase",
              subPage: request.subPage,
            });
        });
      });
    }
    if (mediaStream) {
      //removes recording indicator on windows
      mediaStream.stop();
      if (mediaStream.getAudioTracks()) {
        // removes recording indicator on chrome
        mediaStream.getAudioTracks()[0].stop();
      }
    }
  } else if (request.message === "requestAllowMic") {
    console.log("requestAllowMic - call micPermission()");
    micPermission({ audio: true }, "Enabled Audio");
  } else if (request.message === "isPermission") {
    navigator.permissions.query({ name: "microphone" }).then(({ state }) => {
      console.log("isPermission - txxxx - resultPermission: " + state);
      chrome.runtime.sendMessage({ type: "resultPermission", data: state });
    });
  }
  return true;
});

function micPermission(param, msg) {
  console.log(param);
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia(param)
      .then(() => {
        console.log("micPermission " + msg);
      })
      .catch(() => {
        navigator.mediaDevices
          .getUserMedia(param)
          .then(() => console.log(msg))
          .catch(() => {
            navigator.mediaDevices
              .getUserMedia(param)
              .then(() => console.log(msg))
              .catch(() => {
                // console.log("micPermission - tx - resultPermission: denied");
                chrome.runtime.sendMessage({
                  type: "resultPermission",
                  data: "denied",
                });
              });
          });
      });
  }
}

if (!('webkitSpeechRecognition' in window)) {
} else {
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = function() {
    recognizing = true;
  };

  recognition.onresult = function(event) {
    var interim_transcript = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }

    chrome.runtime.sendMessage({
      type: "sendingTranscription",
      data: interim_transcript,
    });
  };

  recognition.onend = function() {

    recognizing = false;
    if (ignore_onend) {
      return;
    }
    if (!final_transcript) {
      return;
    }
  };

  recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
      ignore_onend = true;
    }
    if (event.error == 'audio-capture') {
      ignore_onend = true;
    }
    if (event.error == 'not-allowed') {
      if (event.timeStamp - start_timestamp < 100) {
      } else {
      }
      ignore_onend = true;
    }
  };

}

function startTranscription() {
  if (recognizing) {
    recognition.stop();
    return;
  }
  final_transcript = '';
  // recognition.lang = language.value;
  recognition.start();
  ignore_onend = false;
  navigator.getUserMedia(
    {
      audio: true,
    },
    function (stream) {
      mediaStream = stream;

      chrome.runtime.sendMessage({
        type: "sendingStream",
        data: stream,
      });

      recordAudio = RecordRTC(stream, {
        type: "audio",
        mimeType: "audio/webm",
        sampleRate: 44100,
        desiredSampRate: 16000,
        recorderType: StereoAudioRecorder,
        numberOfAudioChannels: 1,
        checkForInactiveTracks: false,
      });
      recordAudio.startRecording();
    },
    function (error) {
      console.error(JSON.stringify(error));
    }
  );

 
}
