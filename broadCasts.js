//配信先ユーザー情報
var userListSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("userList");
var userListSheetLastRow = userListSheet.getLastRow();
var userIDList = userListSheet.getRange(2, 1, userListSheetLastRow - 1, 1).getValues();
var userNameList = userListSheet.getRange(2, 2, userListSheetLastRow - 1, 1).getValues();

//2次元配列を1次元化
var arrUserID = Array.prototype.concat.apply([],userIDList);
var arrUserName = Array.prototype.concat.apply([],userNameList);

//テスト送信時の開発者のユーザーIDのインデックス
var testSendngUserIDIndex = 11;

//週ごとのおすすめ銭湯の配信
function sendWeeklySpaSuggestionBroadcast(){
  
  // メッセージ本文を作成
  var text = JSON.parse(getUserInfo(arrUserID[i])).displayName +  " さん、こんにちは！ \n";
  text += " \n";
  text += "";

  msgSender(text,arrUserID[testSendngUserIDIndex]);

  
}


//毎週木曜日のラジオ配信前の配信
function notifyBeforeThursdayBroadcast() {

  for(var i = 0 ; i < arrUserID.length ; i++){
    var text = JSON.parse(getUserInfo(arrUserID[i])).displayName +  " さん、こんにちは！ \n";
    text += "本日はぶちラヂヲの配信日です！\n";
    text += "銭湯好き男子3人のゆるーいトークを、是非ご覧下さい(　･∀･)ﾉ \n";
    text += "https://www.showroom-live.com/89f723462133";
    
    msgSender(text,arrUserID[i]);
  }

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