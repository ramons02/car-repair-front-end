import { Directive, HostListener, Input, inject, ElementRef, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appMask]',
  standalone: true,
})
export class InputMaskDirective implements OnInit {
  @Input('appMask') maskType: 'cpf' | 'telefone' | 'cep' | 'currency' = 'cpf';

  private ngControl = inject(NgControl, { optional: true, self: true });
  private el = inject(ElementRef<HTMLInputElement>);

  ngOnInit(): void {
    const current = this.el.nativeElement.value;
    if (current) this.aplicarMascara(current);
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    this.aplicarMascara((event.target as HTMLInputElement).value);
  }

  private aplicarMascara(value: string): void {
    const digits = value.replace(/\D/g, '');

    if (this.maskType === 'currency') {
      const display = digits ? this.currencyDisplay(digits) : '';
      this.el.nativeElement.value = display;
      if (this.ngControl?.control) {
        this.ngControl.control.setValue(display, { emitEvent: false });
      }
      return;
    }

    const formatted = this.formatar(digits);
    this.el.nativeElement.value = formatted;
    if (this.ngControl?.control) {
      this.ngControl.control.setValue(formatted, { emitEvent: false });
    }
  }

  private formatar(d: string): string {
    switch (this.maskType) {
      case 'cpf':      return this.cpf(d);
      case 'telefone': return this.telefone(d);
      case 'cep':      return this.cep(d);
      default:         return d;
    }
  }

  private currencyDisplay(d: string): string {
    if (!d) return '';
    d = d.slice(0, 13);
    const padded = d.padStart(3, '0');
    const cents = padded.slice(-2);
    const reais = padded.slice(0, -2).replace(/^0+/, '') || '0';
    const reaisFormatted = reais.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `R$ ${reaisFormatted},${cents}`;
  }

  private cpf(d: string): string {
    d = d.slice(0, 11);
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
    if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
    return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
  }

  private telefone(d: string): string {
    d = d.slice(0, 11);
    if (d.length === 0) return '';
    if (d.length <= 2) return `(${d}`;
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  }

  private cep(d: string): string {
    d = d.slice(0, 8);
    if (d.length <= 5) return d;
    return `${d.slice(0, 5)}-${d.slice(5)}`;
  }
}
