'use strict';

class LangUtil {
    static getLanguage() {
        let language =
            (window.navigator.languages && window.navigator.languages[0]) ||
            window.navigator.language ||
            window.navigator.userLanguage ||
            window.navigator.browserLanguage;
        return language;
    }
}
