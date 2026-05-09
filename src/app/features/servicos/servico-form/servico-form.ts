import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../../core/services/api';
import { Servico } from '../../../models/servico.model';
import { OrdemServico } from '../../../models/ordem-servico.model';
import { Page } from '../../../models/page.model';
import { InputMaskDirective } from '../../../shared/directives/input-mask.directive';

@Component({
  selector: 'app-servico-form',
  imports: [CommonModule, FormsModule, InputMaskDirective],
  templateUrl: './servico-form.html',
  styleUrl: './servico-form.css',
})
export class ServicoForm implements OnInit {
  servico: Servico = {
    descricao: '', mecanico: '',
    dataHoraServico: '', dataHoraTermino: '',
    valor: 0,
  };

  valorDisplay = '';
  ordens: OrdemServico[] = [];

  editando = signal(false);
  loading = signal(false);
  salvando = signal(false);
  erro = signal('');

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.loading.set(true);
      this.editando.set(true);

      forkJoin({
        ordens: this.api.get<Page<OrdemServico>>('ordem-servicos'),
        servico: this.api.get<Servico>(`servicos/${id}`),
      }).subscribe({
        next: ({ ordens, servico }) => {
          this.ordens = ordens.content;
          this.servico = {
            ...servico,
            dataHoraServico: servico.dataHoraServico?.slice(0, 16) ?? '',
            dataHoraTermino: servico.dataHoraTermino?.slice(0, 16) ?? '',
          };
          this.valorDisplay = this.formatarValorDisplay(servico.valor);
          this.loading.set(false);
        },
        error: () => {
          this.erro.set('Erro ao carregar dados do serviço.');
          this.loading.set(false);
        },
      });
    } else {
      this.api.get<Page<OrdemServico>>('ordem-servicos').subscribe({
        next: data => { this.ordens = data.content; },
        error: () => { /* ordens são opcionais */ },
      });
    }
  }

  get terminoInvalido(): boolean {
    const inicio = this.servico.dataHoraServico;
    const termino = this.servico.dataHoraTermino;
    return !!(inicio && termino && termino < inicio);
  }

  private formatarValorDisplay(valor: number): string {
    if (!valor || valor <= 0) return '';
    const digits = Math.round(valor * 100).toString();
    const padded = digits.padStart(3, '0');
    const cents = padded.slice(-2);
    const reais = padded.slice(0, -2).replace(/^0+/, '') || '0';
    const reaisFormatted = reais.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `R$ ${reaisFormatted},${cents}`;
  }

  private parseValorDisplay(display: string): number {
    return parseFloat(display.replace('R$ ', '').replace(/\./g, '').replace(',', '.')) || 0;
  }

  salvar(): void {
    if (this.terminoInvalido) {
      this.erro.set('A data de término não pode ser anterior à data de início.');
      return;
    }

    this.erro.set('');
    this.salvando.set(true);

    const payload: Servico = {
      ...this.servico,
      valor: this.parseValorDisplay(this.valorDisplay),
      ordemServicoId: this.servico.ordemServicoId || undefined,
    };

    const request = this.editando()
      ? this.api.put<Servico>(`servicos/${this.servico.id}`, payload)
      : this.api.post<Servico>('servicos', payload);

    request.subscribe({
      next: () => this.router.navigate(['/servicos']),
      error: (err: { status: number }) => {
        if (err.status === 400) {
          this.erro.set('Dados inválidos. Verifique os campos obrigatórios.');
        } else {
          this.erro.set('Erro ao salvar serviço. Tente novamente.');
        }
        this.salvando.set(false);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/servicos']);
  }
}
