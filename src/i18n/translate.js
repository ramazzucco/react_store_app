import spanish from './es.json';
import english from './eng.json';

export let languageLibrary = spanish;
export let languageName = 'SPANISH';

export function setLanguage(language) {
    const languages = {
        SPANISH: spanish,
        ENGLISH: english,
    }
    languageLibrary = JSON.parse(JSON.stringify(languages[language]));
    languageName = language;
}

export function translate() {
    const simpleText = (text) => {
        const arrayKeys = text.split('.');

        if(languageLibrary[arrayKeys[0]] === undefined) {
            return `This text is not available in "${languageName.toLowerCase()}"`;
        }

        if(typeof languageLibrary[arrayKeys[0]] === 'string') {
            return languageLibrary[arrayKeys[0]];
        }

        return languageLibrary[arrayKeys[0]][arrayKeys[1]];
    }

    const textWithParams = (text, objectParams) => {
        const _text = simpleText(text);
        const params = Object.entries(objectParams);
        let textWithParams;
        for(let i=0 ;i<params.length; ++i){
            textWithParams = _text.replace(`%${params[i][0]}%`, params[i][1])
        }
        return textWithParams;
    }

    return {
        simpleText,
        textWithParams
    }
}