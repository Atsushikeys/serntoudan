//このファイル内の関数群は銭湯リストを取得する時のみ使用


//1~84の銭湯名を取得する
function get84Spas() {
  var spaListSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("銭湯リスト作成用");
  var arr = [];
  
  for (var i = 1; i < 85; i++) {
    try {
      spaListSheet.getRange(i + 1, 2).setValue(scrapeOneSpaName(i));
    } catch (ex) {
      spaListSheet.getRange(i + 1, 2).setValue(i + "行目は存在しないページ");
    }
  }
  Logger.log(arr);
}



//https://aichi1010.jp/page/detail/l/spaUrrNumber に含まれる銭湯名をスクレイピングする関数
function scrapeOneSpaName(spaUrlNumber){
  
  //Getリクエストを投げて、戻り値(Webサイト全体のHTML)を文字列に変換し、格納
  var res = UrlFetchApp.fetch("https://aichi1010.jp/page/detail/l/" + spaUrlNumber).getContentText();

  var startIndex = res.indexOf("<h1>",res.indexOf("<h1>") + 1);
  var endIndex = res.indexOf("<span>",startIndex);
  
  var spaName = res.substring(startIndex + 4,endIndex);

  return spaName
  
}