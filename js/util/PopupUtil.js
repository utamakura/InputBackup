'use strict';

// 結果表示用Element
const RESULT_ELEMENT = '#result';
// タイトル情報を探しにいく親階層の最大値
const MAX_SEARCH_PARENT_HIERARCHY = 3;
// ContentScripts連携用
const SET_DATA_ELEMENT = 'data-for-inputbackup';

class PopupUtil {
    constructor(popup_element) {
        this.popup_element = popup_element;
    }

    convertPopupElement() {
        this.removeReferenceErrorTag();
        this.setPopupElement();
    }

    // 参照エラーとなるタグの除去
    removeReferenceErrorTag() {
        this.popup_element = this.popup_element
            .replace(/<(no)?script(.|\s)*?<\/(no)?script>/gi, '')
            .replace(/<link(.|\s)*?>/gi, '')
            .replace(/<style(.|\s)*?<\/style>/gi, '')
            .replace(/<img(.|\s)*?>/gi, '')
            .replace(/ src="(.|\s)*?"/gi, '');
    }

    // Popup用Elementをセット
    setPopupElement() {
        $(RESULT_ELEMENT).html(this.popup_element);
    }

    // サイトタイトル取得
    findSiteTitle() {
        let site_title = $(RESULT_ELEMENT).find('title').text();
        return site_title;
    }

    // 結果Elementを生成
    createResultElement() {
        let result_el = '';

        $(RESULT_ELEMENT).find("input[type!='button'][type!='submit'][type!='reset'], textarea, select").each(function() {
            // 表示されていないものは対象外
            if ($(this).is(':hidden')) {
                return true;
            }

            let input_str = findInputStr(this);
            let heading = findHeading(this);

            result_el += formatResultMsg(input_str, heading);
        });

        return result_el;
    }

    // ボタン有効化
    enableButton() {
        $('#download_text').attr('aria-disabled', false).removeClass('disabled');
        $('#copy_clipboard').attr('aria-disabled', false).removeClass('disabled');
    }

    // 結果Elementのリフレッシュ
    refreshResultElement(site_title, result_el) {
        let select_all_el = '<a href="#" id="select_all" data-i18n="selectAllBtn" class="btn btn-sm btn-outline-secondary hide-during-processing">' + i18next.t('selectAllBtn') + '</a>';
        let delete_selected_el = '<a href="#" id="delete_selected" data-i18n="deleteSelectedBtn" class="btn btn-sm btn-outline-danger hide-during-processing">' + i18next.t('deleteSelectedBtn') + '</a>';
        let delete_unselected_el = '<a href="#" id="delete_unselected" data-i18n="deleteUnselectedBtn" class="btn btn-sm btn-outline-danger hide-during-processing">' + i18next.t('deleteUnselectedBtn') + '</a>';

        $(RESULT_ELEMENT)
            .empty()
            .append('<h5 class="border-bottom">' + site_title + '</h5><br />')
            .append('<div style="margin-bottom: 5px;">' + select_all_el + delete_selected_el + delete_unselected_el + '</div>')
            .append('<div class="card-columns">' + result_el + '</div>');
    }
}

// Elementから入力文字列を検索して返す
function findInputStr(obj) {
    let input_str = '';
    if ($(obj).is("input[type='checkbox'], input[type='radio']")) {
        input_str = $(obj).prop('checked');
    } else {
        input_str = $(obj).attr(SET_DATA_ELEMENT) ? $(obj).attr(SET_DATA_ELEMENT) : $(obj).val();
    }
    return input_str;
}

// Elementから見出し情報を検索して返す
function findHeading(obj) {
    let heading = '';

    // placeholderを取得する
    heading = $(obj).attr('placeholder');
    if (heading) return heading;

    // IDに紐づくLabelを探す
    let id = $(this).attr('id');
    heading = $("label[for='" + id + "']").text();
    if (heading) return heading;

    // titleを取得する
    heading = $(obj).attr('title');
    if (heading) return heading;

    // 同階層から前方検索する
    $(obj).prevAll().each(function() {
        if (this.innerText) {
            heading = this.innerText;
            return false;
        }
    });
    if (heading) return heading;

    // 親階層から前方検索する
    $(obj).parents().each(function(index) {
        // 見出しを探しにいく親階層の最大値を超えたら抜ける
        if (heading || index >= MAX_SEARCH_PARENT_HIERARCHY) {
            return false;
        }

        $(this).prevAll().each(function() {
            if (this.innerText) {
                heading = this.innerText;
                return false;
            }
        });
    });
    if (heading) return heading;

    // 同階層から後方検索する
    $(obj).nextAll().each(function() {
        if (this.innerText) {
            heading = this.innerText;
            return false;
        }
    });
    if (heading) return heading;

    // 親階層から後方検索する
    $(obj).parents().each(function(index) {
        // 親階層から探しにいく最大階層を超えたら抜ける
        if (heading || index >= MAX_SEARCH_PARENT_HIERARCHY) {
            return false;
        }

        $(this).nextAll().each(function() {
            if (this.innerText) {
                heading = this.innerText;
                return false;
            }
        });
    });
    if (heading) return heading;

    return null;
}

// 結果メッセージ作成
function formatResultMsg(input_str, heading) {
    let result_msg =
        '<div class="card mb-3"><div class="card-body">' +
        '  <h5 class="card-title border-bottom">『' + heading + '』</h5>' +
        '  <p class="card-text">' + String(input_str).replace(/\r?\n/g, '<br />') + '</p>' +
        '</div></div>';
    return result_msg;
}

