import { SearchIcon } from "@sanity/icons";
import { Autocomplete, Card } from "@sanity/ui";
import React, { useCallback, useMemo } from "react";
import { set } from "sanity";

type Props = {
    elementProps: {
        id,
        onBlur,
        onFocus,
        placeholder,
        readOnly,
        ref,
        // value
    },
    onChange,
    schemaType,
    validation,
    value,
};

const languageCodes = ["aa", "ab", "ae", "af", "ak", "am", "an", "ar", "as", "av", "ay", "az", "ba", "be", "bg", "bi", "bm", "bn", "bo", "br", "bs", "ca", "ce", "ch", "co", "cr", "cs", "cu", "cv", "cy", "da", "de", "dv", "dz", "ee", "el", "en", "eo", "es", "et", "eu", "fa", "ff", "fi", "fj", "fo", "fr", "fy", "ga", "gd", "gl", "gn", "gu", "gv", "ha", "he", "hi", "ho", "hr", "ht", "hu", "hy", "hz", "ia", "id", "ie", "ig", "ii", "ik", "io", "is", "it", "iu", "ja", "jv", "ka", "kg", "ki", "kj", "kk", "kl", "km", "kn", "ko", "kr", "ks", "ku", "kv", "kw", "ky", "la", "lb", "lg", "li", "ln", "lo", "lt", "lu", "lv", "mg", "mh", "mi", "mk", "ml", "mn", "mr", "ms", "mt", "my", "na", "nb", "nd", "ne", "ng", "nl", "nn", "no", "nr", "nv", "ny", "oc", "oj", "om", "or", "os", "pa", "pi", "pl", "ps", "pt", "qu", "rm", "rn", "ro", "ru", "rw", "sa", "sc", "sd", "se", "sg", "si", "sk", "sl", "sm", "sn", "so", "sq", "sr", "ss", "st", "su", "sv", "sw", "ta", "te", "tg", "th", "ti", "tk", "tl", "tn", "to", "tr", "ts", "tt", "tw", "ty", "ug", "uk", "ur", "uz", "ve", "vi", "vo", "wa", "wo", "xh", "yi", "yo", "za", "zh", "zu"];

const getLanguageLbl = (code: string) => {
    const names = new Intl.DisplayNames(["en"], { type: 'language' });
    return names.of(code);
}

const getNativeLanguageLbl = (code: string) => {
    const names = new Intl.DisplayNames([code], { type: 'language' });
    return names.of(code);
}

export const LanguageSelector: React.FC<Props> = (props) => {

    const languageCodeNamesMap = useMemo(() => {
        return languageCodes.reduce((acc, code) => {
            let name = getLanguageLbl(code);
            if (name.length <= 2) {
                return acc;
            }
            const nativeName = getNativeLanguageLbl(code);
            if (nativeName !== name) {
                name = `${name} (${nativeName})`;
            }
            acc[code] = name;
            return acc;
        }, {});
    }, []);

    const onChange = useCallback((code: string) => {
        props.onChange(set(code));
    }, [props]);

    return (
        <Card>
            {props.value ? (
                <label>{languageCodeNamesMap[props.value]}</label>
            ) : (
                <Autocomplete
                    filterOption={(query, option) => {
                        const code = option.value;
                        const name = getLanguageLbl(code);
                        const nativeName = getNativeLanguageLbl(code);
                        if (name.toLowerCase().includes(query.toLowerCase()) || nativeName.toLowerCase().includes(query.toLowerCase())) {
                            return true;
                        } else {
                            return false;
                        }
                    }}
                    icon={SearchIcon}
                    id="autocomplete-example"
                    options={Object.keys(languageCodeNamesMap).map((code) => ({ value: code }))}
                    renderOption={(option) => <label>{languageCodeNamesMap[option.value]}</label>}
                    renderValue={(code) => languageCodeNamesMap[code]}
                    placeholder="Language"
                    onChange={onChange}
                />
            )}
        </Card>
    )
}
