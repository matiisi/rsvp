import { useTranslation } from "react-i18next";

import {
  LanguageButton,
  LanguageSelectContainer,
} from "./styles/LanguageSelectStyles";

const languages = ["en", "fi", "bg"];

const LanguageSelect = () => {
  const { i18n } = useTranslation();

  const languageButtons = languages.map(lang => (
    <LanguageButton
      key={lang}
      role="link"
      image={`flag-${lang}.svg`}
      onClick={() => i18n.changeLanguage(lang)}
    />
  ));

  return <LanguageSelectContainer>{languageButtons}</LanguageSelectContainer>;
};

export default LanguageSelect;
