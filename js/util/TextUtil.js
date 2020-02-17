'use strict';

class TextUtil {
    // テキストダウンロード処理
    downloadText(value) {
        let a_el = document.createElement('a');
        a_el.href = 'data:text/plain,' + encodeURIComponent(value);
        a_el.download = this.createFilename();
        a_el.style.display = 'none';
        document.body.appendChild(a_el);
        a_el.click();
        document.body.removeChild(a_el);
        return this;
    }

    // トーストに完了メッセージ追加
    appendToast(value, delay) {
        let toast_el =
            '<div class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-delay="' + delay + '">' +
            '  <div class="toast-body">' + value + '</div>' +
            '</div>';
        $('.toast_columns').append(toast_el);
        $('.toast').toast('show')
        return this;
    }

    // コピー処理
    copyClipboard(value) {
        this.copyOverrideOnce(value);
        document.execCommand("copy");
        return this;
    }

    copyOverrideOnce(value) {
        document.addEventListener('copy', function(e) {
                e.clipboardData.setData('text/plain', value);
                e.preventDefault();
            },
            {once:true}
        );
    }

    // ファイル名生成
    createFilename() {
        let date = new Date();

        let yyyy = date.getFullYear();
        let mm = date.getMonth()+1;
        let dd = date.getDate();
        let hh = date.getHours();
        let ii = date.getMinutes();
        let ss = date.getSeconds();

        let filename = `inputbackup_${yyyy}${mm}${dd}_${hh}${ii}${ss}.txt`;
        return filename;
    }

}

