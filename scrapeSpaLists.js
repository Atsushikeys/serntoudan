//このファイル内の関数群は銭湯リストを取得する時のみ使用


//1~84の銭湯情報を取得する
function get84Spas() {
  var spaListSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("銭湯リスト作成用");
  
  for (var i = 1; i < 85; i++) {
    var spaSheetUrlValue = spaListSheet.getRange(i+1, 2).getValue();
    try {
      spaListSheet.getRange(i + 1, 15).setValue(scrapeOneSpa(spaSheetUrlValue));
    } catch (ex) {
      spaListSheet.getRange(i + 1, 15).setValue("nonInfo");
    }
  }
}



// https://aichi1010.jp/page/detail/l/spaUrlNumber に含まれる銭湯情報をスクレイピングする関数
// 2019/10/30 リファクタ案 => urlをforのカウンタから生成するのではなく、sheetのurlカラムを取ってくるようにすれば、順番が変わっても関係ない。
function scrapeOneSpa(spaUrl){
  
  //Getリクエストを投げて、戻り値(Webサイト全体のHTML)を文字列に変換し、格納
  var res = UrlFetchApp.fetch(spaUrl).getContentText();
  

  var searchFromTag = "<dt>住所</dt><dd>";
  var searchToTag = "</dd>";
  
  var startIndex = res.indexOf(searchFromTag);
  var endIndex = res.indexOf(searchToTag,startIndex);
  
  var spaInfo = res.substring(startIndex + searchFromTag.length,endIndex);
  
  return spaInfo
  
}