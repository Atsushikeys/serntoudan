//配信先ユーザー情報
var userListSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("userList");
var userListSheetLastRow = userListSheet.getLastRow();
var userIDList = userListSheet.getRange(2, 1, userListSheetLastRow - 1, 1).getValues();
var userNameList = userListSheet.getRange(2, 2, userListSheetLastRow - 1, 1).getValues();

//2次元配列を1次元化
var arrUserID = Array.prototype.concat.apply([], userIDList);
var arrUserName = Array.prototype.concat.apply([], userNameList);

//テスト送信時の開発者のユーザーIDのインデックス
var testSendngUserIDIndex = 11;

//週ごとのおすすめ銭湯の配信
function sendWeeklySpaSuggestionBroadcast() {
  // おすすめ銭湯を格納する
  var suggestedSpaInfo = pickSuggestOneSpa();

  // 各銭湯の情報を取得
  var spaURL = suggestedSpaInfo[1];
  var spaName = suggestedSpaInfo[2];
  var spaLocationWard = suggestedSpaInfo[3];
  var spaOpenHour = suggestedSpaInfo[4];
  var spaNonOpenDay = suggestedSpaInfo[5];
  var spaAddress = suggestedSpaInfo[8];
  var spaSuggestionPoint = suggestedSpaInfo[9];
  var spaLatestVisit = Utilities.formatDate(suggestedSpaInfo[11], "Asia/Tokyo", "yyyy年M月d日");

  // ユーザー数だけ配信
  for (var i = 0; i < arrUserID.length; i++) {

    // メッセージ本文を作成
    var text = "";
    text += "【今週のおすすめ銭湯】 \n\n";
    text += JSON.parse(getUserInfo(arrUserID[i])).displayName + " さん、こんにちは！ \n";
    text += "今週は" + spaLocationWard + "の「" + spaName + "」さんの紹介です！\n";
    text += "銭湯談メンバーおすすめポイントは\n";
    text += "「"+spaSuggestionPoint + "」\n";
    text += "です！\n\n";
    text += "「" + spaName + "」さんの営業時間は " + spaOpenHour + " で、定休日は " + spaNonOpenDay + " となっております。\n";
    text += "所在地：" + spaAddress + "\n";
    text += "Webサイト：" + spaURL + "\n";
    text += "\n";
    text +=
      "(本情報は" +
      spaLatestVisit +
      "時点で銭湯談メンバーが訪問した時のものであり、最新の情報とは異なる可能性があります。最新の正確な情報は、温泉のWebサイトまたは現地で直接ご確認ください。)";
    text += "";

    Logger.log(text);

    msgSender(text,arrUserID[i]);
  }
}

//毎週木曜日のラジオ配信前の配信
function notifyBeforeThursdayBroadcast() {
  for (var i = 0; i < arrUserID.length; i++) {
    var text = JSON.parse(getUserInfo(arrUserID[i])).displayName + " さん、こんにちは！ \n";
    text += "本日はぶちラヂヲの配信日です！\n";
    text += "古民家飲食店BUCHIに集まった、銭湯好き達のゆるーいトークを、是非お楽しみ下さい(　･∀･)ﾉ \n";

    // text += "本日はぶちラヂヲの配信日です！\n";
    // text += "今日は銭湯談はお休みですが、特別日程で「つんくんの部屋」をお届けします！\n";
    // text += "いつものにぎやかな雰囲気とはちょっと違う雰囲気をお楽しみ下さい！\n";
    // text += "もしかしたら特別ゲストも参加するかも！？！？\n";

    text += "https://www.showroom-live.com/89f723462133";

    msgSender(text, arrUserID[i]);
  }
}

// "銭湯リスト"シートの"訪問済み"かつ"オススメ銭湯で配信済みでない"銭湯の情報を取得する
function pickSuggestOneSpa() {
  // 銭湯リスト情報
  var spaListSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("銭湯リスト");
  var spaListSheetLastRow = spaListSheet.getLastRow();
  var spaListSheetLastColumn = spaListSheet.getLastColumn();

  // 銭湯ID列インデックス
  var spaIdColumnIndex = 0;
  // 訪問済み列インデックス
  var visitedCheckboxColumnIndex = 10;
  // 配信済み列インデックス
  var alreadyBroadcastColumnIndex = 12;

  // 銭湯リストの全シートを二次元配列で取得
  var arrSpaInfo = spaListSheet.getRange(2, 1, spaListSheetLastRow - 1, spaListSheetLastColumn).getValues();
  // 訪問済み銭湯リストを取得
  var arrVisited = arrSpaInfo.filter(function(item) {
    return item[visitedCheckboxColumnIndex] === true;
  });
  // 訪問済み銭湯リストの中から、未配信銭湯リストを取得
  var arrNotBroadcast = arrVisited.filter(function(item) {
    return item[alreadyBroadcastColumnIndex] === false;
  });

  // 未配信銭湯リストがない場合、銭湯リストの未配信チェックリストを全てfalseにして、もう一度訪問済み銭湯を取得
  if (arrNotBroadcast.length === 0) {
    arrSpaInfo.forEach(function(item) {
      //"noninfo"回避のためセルの値がtrueのみ編集
      if (item[alreadyBroadcastColumnIndex] === true) {
        item[alreadyBroadcastColumnIndex] = false;
      }
    });
    // スプレッドシートに反映
    spaListSheet.getRange(2, 1, spaListSheetLastRow - 1, spaListSheetLastColumn).setValues(arrSpaInfo);
    // 再度訪問済み銭湯リストを取得
    arrNotBroadcast = arrSpaInfo.filter(function(item) {
      return item[visitedCheckboxColumnIndex] === true;
    });
    // 訪問済み銭湯リストの中から、未配信銭湯リストを取得
    // 直上で全部falseにしてるので、この処理は多分いらない
    arrNotBroadcast = arrVisited.filter(function(item) {
      return item[alreadyBroadcastColumnIndex] === false;
    });
  }

  // "0~配列の長さ-1"の範囲の乱数を取得。配列のインデックスとするのでlength + 1はしなくてよい
  var broadcastIndex = Math.floor(Math.random() * arrNotBroadcast.length);

  // 配信する銭湯の情報を取得
  var broadcastSpa = arrNotBroadcast[broadcastIndex];

  // 配信した銭湯IDで銭湯リストを検索し、一致するものの配信済み列をtrueにする
  arrSpaInfo.forEach(function(item) {
    if (item[spaIdColumnIndex] === broadcastSpa[spaIdColumnIndex]) {
      item[alreadyBroadcastColumnIndex] = true;
    }
  });
  // スプレッドシートに反映
  spaListSheet.getRange(2, 1, spaListSheetLastRow - 1, spaListSheetLastColumn).setValues(arrSpaInfo);

  Logger.log(broadcastSpa[spaIdColumnIndex]);

  return broadcastSpa;
}

//msgTextをsendToIDに送るメソッド
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
