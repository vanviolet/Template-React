import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown.menu";
import { LANGUAGE_OPTIONS } from "@/constants/app";
import { Check, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";


export default function LangSwitcher() {
  const { t, i18n } = useTranslation();
  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('app_language', langCode);
  };
  return <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="outline"
        size="sm"
        className="h-8 gap-1.5 rounded-full text-xs font-medium border-border/80 bg-muted/30 hover:bg-muted cursor-pointer"
      >
        <Globe className="h-3.5 w-3.5 text-muted-foreground" />
        <span>{i18n.language.toUpperCase()}</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-48">
      <DropdownMenuLabel>{t('pengaturan.language')}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {LANGUAGE_OPTIONS.map((lang) => (
        <DropdownMenuItem
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          className="justify-between"
        >
          <span className="flex items-center gap-2">
            <span>{lang.flag}</span>
            <span>{lang.label}</span>
          </span>
          {i18n.language === lang.code && <Check className="h-3.5 w-3.5 text-primary" />}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
}