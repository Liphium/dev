import { ui, defaultLang } from "./translations";

export function getLangFromUrl(url: URL) {
	const [, lang] = url.pathname.split("/");
	if (lang in ui) return lang as keyof typeof ui;
	return defaultLang;
}

/// All urls should start with a /
export function getLocalUrl(lang: string, url: string): string {
	if (lang.includes("en")) {
		return url;
	}
	return `${lang}${url}`;
}

export function useTranslations(lang: keyof typeof ui) {
	return function t(key: keyof (typeof ui)[typeof defaultLang]) {
		return ui[lang][key] || ui[defaultLang][key];
	};
}
