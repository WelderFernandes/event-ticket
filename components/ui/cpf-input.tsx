"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CPFInputProps extends React.ComponentProps<"input"> {}

function CPFInput({ className, onChange, value, ...props }: CPFInputProps) {
  const [displayValue, setDisplayValue] = React.useState(
    (value as string) || ""
  );

  const formatCPF = (input: string) => {
    // Remove tudo que não é dígito
    const numbers = input.replace(/\D/g, "");

    // Limita a 11 dígitos
    const limited = numbers.slice(0, 11);

    // Aplica a máscara
    if (limited.length <= 3) {
      return limited;
    } else if (limited.length <= 6) {
      return `${limited.slice(0, 3)}.${limited.slice(3)}`;
    } else if (limited.length <= 9) {
      return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(
        6
      )}`;
    } else {
      return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(
        6,
        9
      )}-${limited.slice(9)}`;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setDisplayValue(formatted);

    // Cria um novo evento com o valor formatado
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: formatted,
      },
    };

    onChange?.(syntheticEvent);
  };

  // Sincroniza com o valor externo
  React.useEffect(() => {
    if (value !== displayValue) {
      setDisplayValue((value as string) || "");
    }
  }, [value, displayValue]);

  return (
    <Input
      {...props}
      value={displayValue}
      onChange={handleChange}
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
    />
  );
}

export { CPFInput };
