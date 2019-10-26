//アクセス情報は外部に記載
var ACCESS_TOKEN = SpreadsheetApp.getActiveSpreadsheet()
  .getSheetByName("hidden")
  .getRange(1, 2)
  .getValue();
var TEST_ID = SpreadsheetApp.getActiveSpreadsheet()
  .getSheetByName("hidden")
  .getRange(2, 2)
  .getValue();

//postメソッドが投げられた時の応答
function doPost(e) {
  //ユーザー情報格納用シート
  var logSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("log");
  logSheet.getRange(1, 1).setValue("シート取得OK");
  // WebHookで受信した応答用Token
  var replyToken = JSON.parse(e.postData.contents).events[0].replyToken;
  logSheet.getRange(1, 1).setValue("WebHookで受信した応答用Token取得OK");
  logSheet.getRange(2, 1).setValue(replyToken);
  // eventのtypeを取得
  var eventType = JSON.parse(e.postData.contents).events[0].type;
  logSheet.getRange(1, 1).setValue("eventType取得OK");
  logSheet.getRange(2, 1).setValue(eventType);

  //followイベントなら、ユーザー情報を抜き出してシートに保管
  if (eventType === "follow") {
    logSheet.getRange(1, 1).setValue("followイベント分岐OK");
    //ユーザーリストシートを取得
    var userListSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
      "userList"
    );

    // ユーザーIDを取得
    var userId = JSON.parse(e.postData.contents).events[0].source.userId;

    //取得したユーザーIDをGetメソッドに投げて、各種プロフィールを取得
    var userProfile = JSON.parse(getUserInfo(userId));
    var userName = userProfile.displayName;
    var userPicture = userProfile.pictureUrl;
    var userStatusMessage = userProfile.statusMessage;

    var lastRow = userListSheet.getLastRow();

    userListSheet.getRange(lastRow + 1, 1).setValue(userId);
    userListSheet.getRange(lastRow + 1, 2).setValue(userName);
    userListSheet.getRange(lastRow + 1, 3).setValue(userPicture);
    userListSheet.getRange(lastRow + 1, 4).setValue(userStatusMessage);
  }
}

//ユーザー情報抜き出し
function getUserInfo(userId) {
  //ユーザーIDからプロフィール情報を抜き出すリクエストURL
  var getProfileUrl = "https://api.line.me/v2/bot/profile/" + userId;
  //ユーザー情報をGetするためのhttpリクエストを作成するためのヘッダとボディを作成
  var headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + ACCESS_TOKEN
  };
  var options = {
    method: "get",
    headers: headers
  };

  return UrlFetchApp.fetch(getProfileUrl, options);
}
