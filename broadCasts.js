//配信先ユーザー情報
var userIDSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("userList");
var userIDSheetLastRow = userIDSheet.getLastRow();
var userIDList = userIDSheet.getRange(2, 1, userIDSheetLastRow - 1, 1).getValues();

//週ごとのおすすめ銭湯の配信
function sendWeeklySpaSuggestionBroadcast(){
  //2次元配列を1次元化
  var arrUserID = Array.prototype.concat.apply([],userIDList);
  
  // メッセージ本文を作成
  var text = "こんにちは！ \n ";
  text += " \n";
  text += "";
  
}


//毎週木曜日のラジオ配信前の配信
function notifyBeforeThursdayBroadcast() {
  
  
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