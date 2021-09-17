function create_oauth2_url(clientID) {
  let nonce = encodeURIComponent(
    Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
  );
  let redirectUri = chrome.identity.getRedirectURL();

  console.log('redirect url>>>>>', redirectUri)

  // let redirectUri = "https://leeckfheeihpkpjhidbbblelfjindchf.chromiumapp.org/";

  let response_type = "id_token";
  let state = "Kennedy";
  let scope = "openid profile email";
  let prompt = "consent";
  let auth_url =
    "https://accounts.google.com/o/oauth2/v2/auth?client_id=" +
    clientID +
    "&redirect_uri=" +
    redirectUri +
    "&response_type=" +
    response_type +
    "&scope=" +
    scope +
    "&state=" +
    state +
    "&prompt=" +
    prompt +
    "&nonce=" +
    nonce;
  return auth_url;
}

const currentTab = [];
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "gmail_login") {
    //
    // starts OAUTH2 - this method usually for non-Google login
    // but can silently return Google token
    //
    chrome.identity.launchWebAuthFlow(
      {
        url: create_oauth2_url(request.clientID),
        interactive: true,
      },
      function (redirect_url) {
        if (redirect_url && redirect_url.indexOf("id_token=") > 0) {
          let id_token = redirect_url.substring(
            redirect_url.indexOf("id_token=") + 9
          );
          if (id_token && id_token.indexOf("&") > 0) {
            id_token = id_token.substring(0, id_token.indexOf("&"));
          }
          if (id_token) {
            console.log(id_token);
            sendResponse({ result: 1, data: id_token });
          }
        } else {
          // no redirect-url, so user gave up login
          // XXX - we return a blank token, so that system will create a test-user
          // TODO- remove this blank-token in the future (HACK!)
          sendResponse({
            result: 0,
            msg: "login failure, bad redirect-url",
            data: "",
          });
        }
      }
    );
    //
    // alternatively, ask silently for a Google token
    // if none, Google will popup a request
    // this method is more Google friendly
    //
    // chrome.identity.getAuthToken({ interactive: true }, function (id_token) {
    //   // Use the token.
    //   if (id_token) {
    //     console.log(id_token);
    //     sendResponse({ result: 1, data: id_token });
    //   } else {
    //     sendResponse({ result: 0, msg: "login failure, missing token" });
    //   }
    // });
    return true;
  } else if (request.type === "test_login") {
    console.log("222");

    //
    setTimeout(function () {
      sendResponse({ result: 1, msg: "create test user login", data: "" });
    }, 200);
    return true;
  } else if (request.type === "oscar_cookie") {
    chrome.cookies.getAll(
      {
        domain: "gateway-medical.kai-oscar.com",
      },
      function (cookie) {
        let temp = cookie
          .map((item) => item.name + "=" + item.value + ";")
          .toString()
          .replace(/,/g, "");
        console.log(temp);
        localStorage.setItem("cookie", temp);
      }
    );
    return true;
  } else if (request.type === "saveProviderNo") {
    chrome.storage.local.set({ providerNo: request.data }, function () {
      chrome.storage.local.get("providerNo", function (data) {
        localStorage.setItem("providerNo", data?.providerNo);
      });
    });
  } else if (request.type === "saveProviderName") {
    chrome.storage.local.set({ providerName: request.data }, function () {
      chrome.storage.local.get("providerName", function (data) {
        localStorage.setItem("providerName", data?.providerName);
      });
    });
  }
  return false;
});

chrome.storage.local.get("profile", function (data) {
  if (Object.entries(data).data === undefined) {
    chrome.browserAction.setPopup({ popup: "signin.html" });
  } else {
    chrome.browserAction.setPopup({ popup: "setting.html" });
  }
});
