'use strict';

;(() => {

	function createPages () {
		let index = 0;
		const pages = document.createDocumentFragment();
		for (let r = 0; r < ROWS_COUNT; r++) {
			for (let c = 0; c < COLUMNS_COUNT; c++) {
				const page = new ThumbPage(index, c, r);
				page.update();
				pages.appendChild(page);
				index++;
			}
		}
		d('set').appendChild(pages);
	};

	function ready (background) {
		back = background;
		slotsList = background.slotsList;
		COLUMNS_COUNT = background.settings.COLUMNS_COUNT;
		ROWS_COUNT = background.settings.ROWS_COUNT;
		setPagesSize();
		createPages();
		window.dispatchEvent(new Event('ready'));
	}

	function seti18nLabels () {
		$('#tabs span')[0].innerText = chrome.i18n.getMessage('fn_tabs');
		$('#bookmarks span')[0].innerText = chrome.i18n.getMessage('fn_bookmarks');
		$('#history span')[0].innerText = chrome.i18n.getMessage('fn_history');
		$('#topsites span')[0].innerText = chrome.i18n.getMessage('fn_top');
		$('#customize h3')[0].innerText = chrome.i18n.getMessage('theme_label');
		$('#customize h3')[1].innerText = chrome.i18n.getMessage('background_label');
	}

	window.on('load', () => {
		seti18nLabels();
		chrome.runtime.getBackgroundPage( (bg) => bg.load().then(ready) );
	});

})();
