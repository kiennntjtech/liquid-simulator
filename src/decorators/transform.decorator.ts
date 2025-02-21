import { Transform } from 'class-transformer';

const dateISOStringRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

export function TakeDatePathOnly() {
  return Transform(({ value }) => {
    if (typeof value === 'string' && dateISOStringRegex.test(value)) {
      return value.split('T')[0];
    }
    return value;
  });
}

export function Trim() {
  return Transform((params) => {
    if (typeof params.value === 'string') {
      return params.value.trim();
    }
    return params.value;
  });
}

export function ParseInt() {
  return Transform((params) => {
    if (typeof params.value === 'string') {
      return parseInt(params.value, 10);
    }
    return params.value;
  });
}

export function ParseFloat() {
  return Transform((params) => {
    if (typeof params.value === 'string') {
      return parseFloat(params.value);
    }
    return params.value;
  });
}

export function TransformDecimal(decimal: number = 2) {
  return Transform((params) => {
    if (typeof params.value === 'string' || typeof params.value === 'number') {
      return +(+params.value).toFixed(decimal);
    }
    return +params.value;
  });
}
