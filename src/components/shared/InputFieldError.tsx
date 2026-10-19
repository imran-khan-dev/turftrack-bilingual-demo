import { getInputFieldError, IInputErrorState } from "@/lib/getInputFieldError";
import { FieldDescription } from "../ui/field";
import { useTranslations } from "next-intl";
import { getValidationMessageMatch } from "@/i18n/validation-messages";

interface InputFieldErrorProps {
  field: string;
  state: IInputErrorState;
}

const InputFieldError = ({ field, state }: InputFieldErrorProps) => {
  const rawMessage = getInputFieldError(field, state);
  const t = useTranslations("validation");
  const match = rawMessage ? getValidationMessageMatch(rawMessage) : null;

  if (rawMessage) {
    return (
      <FieldDescription className="text-red-600">
        {match ? t(match.key as never, match.values as never) : rawMessage}
      </FieldDescription>
    );
  }

  return null;
};

export default InputFieldError;
