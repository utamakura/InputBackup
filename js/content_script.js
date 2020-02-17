// 検索対象のElement
const SEARCH_ELEMENT = 'html';
// popup連携用
const SET_DATA_ELEMENT = 'data-for-inputbackup';

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  rewriteContentElement();
  sendResponse($(SEARCH_ELEMENT).html());
  return true;
});

function rewriteContentElement() {
  // popupに返した後だと値が取得できないことがあるので、input,textarea,selectは独自のdata属性で設定する
  $(SEARCH_ELEMENT).find("input[type!='button'][type!='submit'][type!='reset'], textarea, select").each(function() {
    let data = '';
    if ($(this).is('select')) {
      // select要素はvalueではなく表示テキストをセットする
      data = $(this).children("option[value='" + $(this).val() + "']").text();
    } else {
      data = $(this).val();
    }
    $(this).attr(SET_DATA_ELEMENT, data);
  });
}
