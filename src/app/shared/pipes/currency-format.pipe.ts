import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat',
  standalone: true,
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number, symbol: string = '$'): string {
    if (value === undefined || value === null) {
      return '';
    }

    return `${symbol}${value.toFixed(2)}`;
  }
}
