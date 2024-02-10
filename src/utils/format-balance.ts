export const formatBalance = (
    value: string | number,
    locales?: Intl.LocalesArgument,
    options?: Intl.NumberFormatOptions,
) =>
    Number(value).toLocaleString(
        locales ?? 'en-US',
        options ?? {
            style: 'currency',
            currency: 'USD',
        },
    );
