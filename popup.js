'use strict';

$(function() {

  // 多言語表示
  i18next.use(i18nextXHRBackend).init({
    backend: {
      loadPath: 'locales/{{lng}}/translation.json'
    },
    debug: false,
    fallbackLng: false,
    defaultLng: 'en',
    lng: LangUtil.getLanguage(),
  }, function (err, t) {
    jqueryI18next.init(i18next, $);
    $('[data-i18n]').localize();
  });

  // 結果取得イベント
  $(document).on('click', '#get', function() {
    // 表示結果の初期化
    $(RESULT_ELEMENT).empty();

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {}, function(result) {
        let error_el = '<div data-i18n="getErrorMsg">' + i18next.t('getErrorMsg') + '</div>';

        if (!result) {
          $(RESULT_ELEMENT).html(error_el);
          return false;
        }

        let popupUtil = new PopupUtil(result);
        let site_title = '';
        let result_el = '';

        try {
          popupUtil.convertPopupElement();
          site_title = popupUtil.findSiteTitle();
          result_el = popupUtil.createResultElement();
        } catch (e) {
          console.error(e);
        }

        if (result_el) {
          // 結果が生成された時、ボタン有効化
          popupUtil.enableButton();
        } else {
          // 結果が生成されなかった時、エラーメッセージ表示
          result_el = error_el;
        }

        popupUtil.refreshResultElement(site_title, result_el);
      });
    });
  });

  $(document).on('click', '#download_text', function() {
    $('.hide-during-processing').hide();

    let result_msg = document.getElementById('result').innerText;
    let toast_msg = i18next.t('saveTextSuccessMsg');

    // テキストダウンロード処理
    let textUtil = new TextUtil();
    textUtil.downloadText(result_msg).appendToast(toast_msg, 5000);

    $('.hide-during-processing').show();
  });

  $(document).on('click', '#copy_clipboard', function() {
    $('.hide-during-processing').hide();

    let result_msg = document.getElementById('result').innerText;
    let toast_msg = i18next.t('copyClipboardSuccessMsg');

    // クリップボードコピー処理
    let textUtil = new TextUtil();
    textUtil.copyClipboard(result_msg).appendToast(toast_msg, 5000);

    $('.hide-during-processing').show();
  });

  $(document).on('click', '.card', function() {
    if ($(this).is('.bg-light')) {
      $(this).removeClass('bg-light border-secondary');
    } else {
      $(this).addClass('bg-light border-secondary');
    }
  });

  $(document).on('click', '#select_all', function() {
    if ($(this).is('.selected')) {
      $(this).removeClass('selected');
      $('.card').removeClass('bg-light border-secondary');
    } else {
      $(this).addClass('selected');
      $('.card').addClass('bg-light border-secondary');
    }
  });

  $(document).on('click', '#delete_selected', function() {
    $('.card.bg-light').remove();
  });

  $(document).on('click', '#delete_unselected', function() {
    $('.card').not('.bg-light').remove();
  });

  $(document).on('hidden.bs.toast', '.toast', function () {
    // 使い終わった要素は削除する
    $(this).remove();
  });

  // ----------------------------------------
  // 初期処理
  // ----------------------------------------
  // 取得イベントを発火させる
  $('#get').click();
});
