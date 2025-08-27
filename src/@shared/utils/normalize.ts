import slugify from 'slugify';

export const Normalize = {
  email: (email: string): string => {
    return email.trim().toLowerCase();
  },

  name: (name: string): string => {
    return slugify(name, {
      lower: true,
      replacement: '_',
      strict: true,
    });
  },

  captilizeFirstLetter: (value: string): string => {
    const lowerCasedValue = value.toLowerCase();

    return lowerCasedValue.charAt(0).toUpperCase() + lowerCasedValue.slice(1);
  },

  onlyNumbers: (value: string): string => {
    return value.replace(/\D/g, '');
  },
};
