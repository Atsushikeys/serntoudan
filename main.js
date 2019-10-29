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
  //処理時間記録用
  var startTime = new Date();
  
  //ログ記録用行変数
  var logRow = 1;
  //ログデータ格納用シート
  var logSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("log");
  logSheet.getRange(logRow, 1).setValue("ログシート取得OK");
  logSheet.getRange(logRow, 2).setValue("");
  logRow += 1;
  // WebHookで受信した応答用Token
  var replyToken = JSON.parse(e.postData.contents).events[0].replyToken;
  logSheet.getRange(logRow, 1).setValue("WebHookで受信した応答用Token取得OK");
  logSheet.getRange(logRow, 2).setValue(replyToken);
  logRow += 1;
  
  // eventのtypeを取得
  var eventType = JSON.parse(e.postData.contents).events[0].type;
  logSheet.getRange(logRow, 1).setValue("eventType取得OK");
  logSheet.getRange(logRow, 2).setValue(eventType);
  logRow += 1;
  
  //followイベントなら、フォローしたユーザーの情報を抜き出してシートに保管
  if (eventType === "follow") {
    logSheet.getRange(logRow, 1).setValue("followイベント分岐OK");
    logSheet.getRange(logRow, 2).setValue("");
    logRow += 1;
    //ユーザーリストシートを取得
    var userListSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
      "userList"
    );
    //ユーザーリストシートの最終行を取得
    var lastRow = userListSheet.getLastRow();
    
    //ユーザーリストシートのマジックナンバーを回避
    var userIdColumn = 1;
    var userNameColumn = 2;
    var userPhotoColumn = 3;
    var userStatusMessageColumn = 4;
    
    // ユーザーIDを取得
    var userId = JSON.parse(e.postData.contents).events[0].source.userId;
    
    //ユーザーID重複チェック処理
    //ユーザーID一覧を格納した配列を作成
    var arrId2dim = userListSheet
    .getRange(2, userIdColumn, lastRow - 1)
    .getValues();
    
    var arrId = [];
    //2次元配列なので1次元化
    for (var i = 0; i < arrId2dim.length; i++) {
      arrId[i] = arrId2dim[i][0];
    }
    logSheet.getRange(logRow, 1).setValue("arrId.indexOf(userId)");
    logSheet.getRange(logRow, 2).setValue(arrId.indexOf(userId));
    logRow += 1;
    
    //既に存在しているならば、ログを吐いてreturn
    if (arrId.indexOf(userId) !== -1) {
      //処理終了時間
      var endTime = new Date();
      logSheet.getRange(logRow, 1).setValue("処理開始時刻");
      logSheet.getRange(logRow, 2).setValue(startTime);
      logRow += 1;
      
      logSheet
      .getRange(logRow, 1)
      .setValue("処理時間 " + (endTime - startTime) / 1000 + "秒");
      
      return;
    }
    
    //取得したユーザーIDをGetメソッドに投げて、各種プロフィールを取得
    var userProfile = JSON.parse(getUserInfo(userId));
    var userName = userProfile.displayName;
    var userPicture = userProfile.pictureUrl;
    var userStatusMessage = userProfile.statusMessage;
    
    userListSheet.getRange(lastRow + 1, userIdColumn).setValue(userId);
    userListSheet.getRange(lastRow + 1, userNameColumn).setValue(userName);
    userListSheet.getRange(lastRow + 1, userPhotoColumn).setValue(userPicture);
    userListSheet
    .getRange(lastRow + 1, userStatusMessageColumn)
    .setValue(userStatusMessage);
  }
  
  //処理終了時間
  var endTime = new Date();
  logSheet.getRange(logRow, 1).setValue("処理開始時刻");
  logSheet.getRange(logRow, 2).setValue(startTime);
  logRow += 1;
  
  logSheet
  .getRange(logRow, 1)
  .setValue("処理時間 " + (endTime - startTime) / 1000 + "秒");
  
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

//msgTextをsendToIDに送る関数
function msgSender(msgText, sendToID) {
  //投稿データを作成
  var postData = {
    to: sendToID,
    messages: [
      {
        type: "text",
        text: msgText
      }
    ]
  };
  
  var url = "https://api.line.me/v2/bot/message/push";
  var headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + ACCESS_TOKEN
  };
  
  var options = {
    method: "post",
    headers: headers,
    payload: JSON.stringify(postData)
  };
  var response = UrlFetchApp.fetch(url, options);
}