import * as React from 'react';
import { NumericFormat, PatternFormat, NumericFormatProps } from 'react-number-format';
import { Input } from '@/components/ui/input';

export interface CurrencyInputProps
  extends Omit<NumericFormatProps, 'onChange' | 'value'> {
  value?: number | string;
  onValueChangeCustom?: (value: number | undefined) => void;
  error?: boolean;
  prefix?: string;
}

export function RupiahInput({
  value,
  onValueChangeCustom,
  error,
  prefix = 'Rp ',
  placeholder = '0',
  disabled,
  className,
  ...props
}: CurrencyInputProps) {
  return (
    <NumericFormat
      customInput={Input}
      value={value}
      prefix={prefix}
      thousandSeparator="."
      decimalSeparator=","
      allowNegative={false}
      placeholder={placeholder}
      disabled={disabled}
      error={error}
      className={className}
      onValueChange={(values) => {
        onValueChangeCustom?.(values.floatValue);
      }}
      {...props}
    />
  );
}

export interface PhoneInputProps {
  value?: string;
  onValueChangeCustom?: (value: string) => void;
  error?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function PhoneInput({
  value,
  onValueChangeCustom,
  error,
  placeholder = '0812-3456-7890',
  disabled,
  className,
}: PhoneInputProps) {
  return (
    <PatternFormat
      customInput={Input}
      format="####-####-#####"
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      error={error}
      className={className}
      onValueChange={(values) => {
        onValueChangeCustom?.(values.value);
      }}
    />
  );
}

export interface NikInputProps {
  value?: string;
  onValueChangeCustom?: (value: string) => void;
  error?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function NikInput({
  value,
  onValueChangeCustom,
  error,
  placeholder = '3171012345670001',
  disabled,
  className,
}: NikInputProps) {
  return (
    <PatternFormat
      customInput={Input}
      format="################"
      mask="_"
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      error={error}
      className={className}
      onValueChange={(values) => {
        onValueChangeCustom?.(values.value);
      }}
    />
  );
}
