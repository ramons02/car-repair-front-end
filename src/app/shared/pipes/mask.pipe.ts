import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'mask', standalone: true, pure: true })
export class MaskPipe implements PipeTransform {
  transform(value: string | undefined | null, tipo: 'cpf' | 'telefone' | 'cep'): string {
    if (!value) return '';
    const d = value.replace(/\D/g, '');
    switch (tipo) {
      case 'cpf':      return this.cpf(d);
      case 'telefone': return this.telefone(d);
      case 'cep':      return this.cep(d);
    }
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
